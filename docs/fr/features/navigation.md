# <span class="emoji"> :material-navigation: </span> Navigation

## Vue d'ensemble

La fonctionnalité **Navigation** est au cœur de MINE : elle fournit un guidage pas-à-pas temps réel dans des environnements intérieurs complexes. À l'aide de technologies de positionnement avancées (balises Bluetooth, Wi-Fi RTT, fusion de capteurs), MINE délivre un suivi précis et des itinéraires intelligents.

!!! abstract "Fonctionnalités clés"
    - 📍 **Positionnement temps réel** : précision submétrique via plusieurs systèmes
    - 🧭 **Guidage pas-à-pas** : instructions visuelles et audio
    - 🔄 **Recalcul automatique** : recalcul intelligent en cas de déviation
    - 🚶 **Comptage de pas** : distance basée podomètre
    - 🏢 **Navigation multi-étages** : transitions d'étage fluides
    - ♿ **Accessibilité** : options de parcours accessibles

---

## Architecture de positionnement

<div class="grid cards" markdown>

-   :material-bluetooth: **Balises Bluetooth**

    ---

    Positionnement principal par trilatération BLE (1-3 m)

-   :material-wifi: **Wi-Fi RTT**

    ---

    RTT 802.11mc (1-2 m) sans balises

-   :material-motion-sensor: **Fusion de capteurs**

    ---

    IMU (accéléro, gyro, magnétomètre) pour le dead reckoning

-   :material-router-wireless: **Positionnement hybride**

    ---

    Combinaison multi-sources via filtrage de Kalman

</div>

---

## Technologies de positionnement

### Positionnement par balises Bluetooth

MINE utilise la **trilatération** à partir du RSSI de plusieurs balises BLE.

#### Principe

```
Distance = 10 ^ ((Measured Power - RSSI) / (10 * Path Loss Exponent))
```

!!! info "Trilatération"
    Trois distances définissent trois cercles : leur intersection est la position. Voir [Trilateration](https://en.wikipedia.org/wiki/Trilateration).

#### Configuration des balises

**1. JSON balises**

```json
{
  "beacons": [
    {
      "id": "beacon_001",
      "uuid": "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
      "major": 100,
      "minor": 1,
      "position": {"x": 10.5, "y": 20.3, "floor": 1},
      "measuredPower": -59,
      "pathLossExponent": 2.0
    }
  ],
  "config": {
    "scanInterval": 1000,
    "scanWindow": 500,
    "rssiThreshold": -100,
    "minBeacons": 3,
    "kalmanFilterEnabled": true
  }
}
```

**2. Bonnes pratiques de déploiement**

- ✅ Espacer de 8-12 m
- ✅ Au moins 3 balises visibles partout
- ✅ Hauteur 2-3 m, éviter métal/murs denses

**3. Chargement de la config**

```kotlin
val beaconConfig = BeaconConfigLoader.loadFromAssets(this, "beacons/venue_beacons.json")
val beaconSystem = BeaconPositioningSystem(
    context = this,
    config = beaconConfig,
    options = PositioningOptions(
        scanInterval = 1000L,
        rssiThreshold = -100,
        minBeaconsRequired = 3,
        useKalmanFilter = true,
        pathLossExponent = 2.0
    )
)
beaconSystem.startScanning()
beaconSystem.onPositionUpdate = { position -> updateUserLocation(position) }
```

**Calibration**

```kotlin
val calibrator = BeaconCalibrator(beaconSystem)
val calibrationPoints = listOf(
    CalibrationPoint(distance = 1.0, location = Location(10.0, 20.0)),
    CalibrationPoint(distance = 3.0, location = Location(13.0, 20.0))
)
val results = calibrator.calibrate(points = calibrationPoints, samplesPerPoint = 100)
results.forEach { (id, params) ->
    beaconSystem.updateBeaconParameters(id, params.measuredPower, params.pathLossExponent)
}
beaconSystem.saveConfiguration()
```

---

### Positionnement Wi-Fi RTT

```kotlin
if (!context.packageManager.hasSystemFeature(PackageManager.FEATURE_WIFI_RTT)) return
val accessPoints = getWiFiRTTAccessPoints()
if (accessPoints.size < 3) return
val request = RangingRequest.Builder().addAccessPoints(accessPoints).build()
rttManager.startRanging(request, context.mainExecutor, object : RangingResultCallback() {
    override fun onRangingResults(results: List<RangingResult>) {
        val distances = results.mapNotNull { r ->
            if (r.status == RangingResult.STATUS_SUCCESS)
                AccessPointDistance(r.macAddress, r.distanceMm / 1000.0, r.distanceStdDevMm / 1000.0)
            else null
        }
        val position = calculatePositionFromDistances(distances)
        updateUserLocation(position)
    }
})
```

---

### Fusion de capteurs (PDR)

```kotlin
class SensorFusionPositioning(private val context: Context) : SensorEventListener {
    private val sensorManager = context.getSystemService(SensorManager::class.java)
    private var currentPosition = Position(0.0, 0.0, 0.0)
    private var currentHeading = 0.0
    private val stepLength = 0.7
    fun startTracking() {
        sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.also {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)?.also {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)?.also {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)?.also {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
    }
    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_STEP_DETECTOR -> onStepDetected()
            Sensor.TYPE_MAGNETIC_FIELD -> updateHeading(event.values)
            Sensor.TYPE_ACCELEROMETER -> processAccelerometer(event.values)
        }
    }
    private fun onStepDetected() {
        val dx = stepLength * sin(Math.toRadians(currentHeading))
        val dy = stepLength * cos(Math.toRadians(currentHeading))
        currentPosition = Position(currentPosition.x + dx, currentPosition.y + dy, currentPosition.z)
        notifyPositionUpdate(currentPosition)
    }
    private fun updateHeading(magneticField: FloatArray) {
        currentHeading = calculateHeading(magneticField)
    }
    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {}
    fun stopTracking() { sensorManager.unregisterListener(this) }
}
```

---

## Implémentation de la navigation

### Initialiser

```kotlin
navigationManager = NavigationManager(
    context = this,
    config = NavigationConfig(
        positioningMode = PositioningMode.BLUETOOTH_BEACONS,
        enableVoiceGuidance = true,
        enableHapticFeedback = true,
        reroutingEnabled = true,
        offTrackThreshold = 5.0,
        instructionDistance = 10.0
    )
)
```

### Calculer et démarrer

```kotlin
val currentLocation = navigationManager.getCurrentLocation() ?: return
val destination = getSelectedDestination()
val routeRequest = RouteRequest(
    origin = currentLocation,
    destination = destination,
    preferences = RoutePreferences(
        avoidStairs = false,
        preferElevators = false,
        optimizeFor = OptimizationCriteria.SHORTEST
    )
)
val route = navigationManager.calculateRoute(routeRequest)
sceneView.displayRoute(route)
navigationManager.startNavigation(route)
```

### Suivi des événements

```kotlin
navigationManager.navigationEvents.collect { event ->
    when (event) {
        is NavigationEvent.InstructionUpdate -> {
            displayInstruction(event.instruction)
            if (event.playAudio) speakInstruction(event.instruction.text)
        }
        is NavigationEvent.OffRoute -> {
            showOffRouteWarning()
            if (navigationManager.config.reroutingEnabled) recalculateRoute()
        }
        is NavigationEvent.RouteProgress -> updateProgressUI(event.distanceRemaining, event.estimatedTimeRemaining)
        is NavigationEvent.FloorChange -> {
            showFloorChangeInstruction(event.fromFloor, event.toFloor, event.transitionType)
            sceneView.switchToFloor(event.toFloor)
        }
        is NavigationEvent.DestinationReached -> { showArrivalDialog(); stopNavigation() }
        is NavigationEvent.PositionAccuracyChanged -> updateAccuracyIndicator(event.accuracy)
    }
}
```

### Instructions pas-à-pas

```kotlin
binding.instructionText.text = instruction.text
binding.instructionIcon.setImageResource(getInstructionIcon(instruction.type))
binding.distanceText.text = when {
    instruction.distance < 10 -> "Dans ${instruction.distance.toInt()} m"
    instruction.distance < 100 -> "Dans ${(instruction.distance / 10).toInt() * 10} m"
    else -> "Dans ${(instruction.distance / 100).toInt() * 100} m"
}
sceneView.highlightNextTurn(instruction)
```

---

## Fonctionnalités avancées

### Recalcul automatique

```kotlin
val currentLocation = navigationManager.getCurrentLocation()!!
val remainingRoute = navigationManager.getRemainingRoute()
val newRoute = navigationManager.calculateRoute(
    RouteRequest(
        origin = currentLocation,
        destination = remainingRoute.destination,
        preferences = navigationManager.routePreferences
    )
)
navigationManager.updateRoute(newRoute)
sceneView.displayRoute(newRoute)
```

### Navigation multi-étages

```kotlin
when (event.transitionType) {
    TransitionType.ELEVATOR -> showElevatorInstructions(event.fromFloor, event.toFloor)
    TransitionType.STAIRS -> {
        val dir = if (event.toFloor > event.fromFloor) "up" else "down"
        speakInstruction("Take the stairs $dir to floor ${event.toFloor}")
    }
    TransitionType.ESCALATOR -> speakInstruction("Take the escalator to floor ${event.toFloor}")
}
waitForFloorChange(event.toFloor) { speakInstruction("Floor change detected. Continuing navigation.") }
```

### Suivi progressif

```kotlin
class StepTrackingNavigationManager : NavigationManager() {
    private var totalSteps = 0
    private var routeSteps = listOf<RouteStep>()
    fun startNavigationWithSteps(route: Route) {
        routeSteps = generateRouteSteps(route)
        totalSteps = routeSteps.size
        startNavigation(route)
    }
    fun getProgressPercentage(): Float =
        (getCurrentStep().toFloat() / totalSteps) * 100
}
```

### Guidage vocal

```kotlin
class VoiceGuidanceManager(private val context: Context) {
    private val tts = TextToSpeech(context) { status ->
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale.getDefault()
            tts.setSpeechRate(1.0f)
        }
    }
    fun speak(instruction: String, urgent: Boolean = false) {
        val queueMode = if (urgent) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD
        tts.speak(instruction, queueMode, null, UUID.randomUUID().toString())
    }
    fun shutdown() { tts.stop(); tts.shutdown() }
}
```

---

## Bonnes pratiques

!!! success "Pratiques recommandées"
    - Déploiement balises : ≥3 visibles, hauteur 2-3 m, calibration, batterie surveillée
    - UX : indiquer la précision, annoncer les virages en avance
    - Gestion erreurs : fallback en cas de perte de signal
    - Batterie : ajuster l'intervalle de scan selon l'état (ACTIF/PAUSE/IDLE)

!!! warning "Écueils courants"
    - Ne pas dépendre d'une seule source de positionnement
    - Ne pas oublier les permissions localisation/Bluetooth
    - Toujours prévoir un fallback et tester in situ

---

## Dépannage

### Position inaccurate

```kotlin
val visible = beaconSystem.getVisibleBeacons()
if (visible.size < 3) showWarning("Position accuracy may be reduced")
beaconSystem.setPathLossExponent(
    when (environmentType) {
        EnvironmentType.OPEN_SPACE -> 2.0
        EnvironmentType.OFFICE -> 2.5
        EnvironmentType.DENSE_OBSTACLES -> 3.0
        else -> 2.0
    }
)
navigationManager.enableKalmanFilter(processNoise = 0.1, measurementNoise = 1.0)
```

### Navigation ne démarre pas

```kotlin
val report = DiagnosticReport(
    hasLocationPermission = checkLocationPermission(),
    isBluetoothEnabled = checkBluetoothEnabled(),
    visibleBeacons = beaconSystem.getVisibleBeacons().size,
    isMapLoaded = sceneView.isMapLoaded(),
    isPositioningActive = navigationManager.isPositioningActive()
)
```

### Recalcule trop fréquent

```kotlin
navigationManager.config = navigationManager.config.copy(
    offTrackThreshold = 8.0,
    reroutingDelay = 5000L
)
beaconSystem.apply {
    setScanInterval(500L)
    setRSSISmoothing(true)
}
```

---

## Métriques de performance

| Métrique | Cible | Notes |
|----------|-------|-------|
| **Taux d'update position** | 1-2 Hz | Mises à jour par seconde |
| **Précision** | < 3 m | Avec ≥3 balises |
| **Calcul d'itinéraire** | < 500 ms | Lieu typique |
| **Recalcul** | < 300 ms | Hors trajectoire |
| **Batterie** | < 5%/h | Navigation active |
| **Mémoire** | < 100 MB | Carte incluse |

---

## Docs associées

- [Pathfinding](path_finding.md)
- [Chargement de carte](map_loading.md)
- [Composants UI](ui_components.md)
- [Référence API](../api_reference/module_overview.md)

## Prochaines étapes

1. **[Implémenter le pathfinding](path_finding.md)**
2. **[Ajouter l'UI](ui_components.md)**
3. **[Personnaliser les thèmes](theme_customization.md)**
