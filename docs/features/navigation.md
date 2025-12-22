# <span class="emoji"> :material-navigation: </span> Navigation

## Overview

The **Navigation** feature is the core of the MINE Indoor Navigation Engine, providing real-time, turn-by-turn guidance for users navigating complex indoor environments. Using advanced positioning technologies including Bluetooth beacons, Wi-Fi RTT, and sensor fusion, MINE delivers accurate location tracking and intelligent route guidance.

!!! abstract "Key Features"
    - 📍 **Real-time Positioning**: Sub-meter accuracy with multiple positioning systems
    - 🧭 **Turn-by-Turn Guidance**: Visual and audio navigation instructions
    - 🔄 **Automatic Rerouting**: Smart path recalculation when users deviate
    - 🚶 **Step Tracking**: Pedometer-based distance calculation
    - 🏢 **Multi-Floor Navigation**: Seamless transitions between building levels
    - ♿ **Accessibility Support**: Accessible route options and guidance

---

## Navigation Architecture

<div class="grid cards" markdown>

-   :material-bluetooth: **Bluetooth Beacons**

    ---

    Primary positioning using BLE beacon trilateration for 1-3m accuracy

-   :material-wifi: **Wi-Fi RTT**

    ---

    IEEE 802.11mc Round-Trip-Time for 1-2m accuracy without beacons

-   :material-motion-sensor: **Sensor Fusion**

    ---

    IMU sensors (accelerometer, gyroscope, magnetometer) for dead reckoning

-   :material-router-wireless: **Hybrid Positioning**

    ---

    Combines multiple sources using Kalman filtering for optimal accuracy

</div>

---

## Positioning Technologies

### Bluetooth Beacon Positioning

MINE uses **trilateration** to calculate user position based on signal strength (RSSI) from multiple Bluetooth Low Energy (BLE) beacons.

#### How Trilateration Works

Trilateration determines position by measuring distances from three or more known reference points (beacons):

```
Distance = 10 ^ ((Measured Power - RSSI) / (10 * Path Loss Exponent))
```

![Trilateration Visualization](https://github.com/user-attachments/assets/cd83f011-8e9d-4475-bfb7-645283c5bd7d){loading=lazy}

!!! info "Trilateration Explained"
    When you know the distance to three beacons, each distance creates a circle around that beacon. The point where all three circles intersect is your location. Learn more about [Trilateration on Wikipedia](https://en.wikipedia.org/wiki/Trilateration).

#### Beacon Configuration

**1. Beacon JSON Format**

```json
{
  "beacons": [
    {
      "id": "beacon_001",
      "uuid": "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
      "major": 100,
      "minor": 1,
      "position": {
        "x": 10.5,
        "y": 20.3,
        "floor": 1
      },
      "measuredPower": -59,
      "pathLossExponent": 2.0,
      "metadata": {
        "name": "Entrance Beacon",
        "installDate": "2024-01-15",
        "batteryLevel": 85
      }
    },
    {
      "id": "beacon_002",
      "uuid": "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
      "major": 100,
      "minor": 2,
      "position": {
        "x": 50.0,
        "y": 20.3,
        "floor": 1
      },
      "measuredPower": -59,
      "pathLossExponent": 2.0,
      "metadata": {
        "name": "Center Beacon"
      }
    },
    {
      "id": "beacon_003",
      "uuid": "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
      "major": 100,
      "minor": 3,
      "position": {
        "x": 30.0,
        "y": 60.5,
        "floor": 1
      },
      "measuredPower": -59,
      "pathLossExponent": 2.0,
      "metadata": {
        "name": "Back Beacon"
      }
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

**2. Beacon Placement Guidelines**

!!! success "Best Practices for Beacon Deployment"
    
    **Coverage Requirements:**
    
    - ✅ Place beacons 8-12 meters apart for optimal coverage
    - ✅ Ensure at least 3 beacons are visible from any location
    - ✅ Mount beacons at 2-3 meters height for best signal propagation
    - ✅ Avoid placing beacons near metal objects or dense walls
    - ✅ Use more beacons in areas with many obstacles
    
    **Layout Pattern:**
    ```
    Recommended Triangle/Grid Pattern:
    
    B1 -------- B2 -------- B3
    |           |           |
    |     [Coverage Area]   |
    |           |           |
    B4 -------- B5 -------- B6
    ```

**3. Loading Beacon Configuration**

```kotlin
import com.machinestalk.indoornavigationengine.resources.BeaconConfigLoader
import com.machinestalk.indoornavigationengine.components.BeaconPositioningSystem

class NavigationActivity : AppCompatActivity() {
    
    private lateinit var beaconSystem: BeaconPositioningSystem
    private lateinit var navigationManager: NavigationManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_navigation)
        
        setupBeaconPositioning()
    }
    
    private fun setupBeaconPositioning() {
        // Load beacon configuration
        val beaconConfig = BeaconConfigLoader.loadFromAssets(
            context = this,
            path = "beacons/venue_beacons.json"
        )
        
        // Initialize beacon positioning system
        beaconSystem = BeaconPositioningSystem(
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
        
        // Start scanning for beacons
        beaconSystem.startScanning()
        
        // Listen for position updates
        beaconSystem.onPositionUpdate = { position ->
            updateUserLocation(position)
        }
    }
}
```

#### Beacon Calibration

```kotlin
// Calibrate beacon RSSI for environment
private suspend fun calibrateBeacons() {
    val calibrator = BeaconCalibrator(beaconSystem)
    
    // Collect samples at known distances
    val calibrationPoints = listOf(
        CalibrationPoint(distance = 1.0, location = Location(10.0, 20.0)),
        CalibrationPoint(distance = 3.0, location = Location(13.0, 20.0)),
        CalibrationPoint(distance = 5.0, location = Location(15.0, 20.0))
    )
    
    val results = calibrator.calibrate(
        points = calibrationPoints,
        samplesPerPoint = 100
    )
    
    // Update beacon parameters
    results.forEach { (beaconId, params) ->
        beaconSystem.updateBeaconParameters(
            beaconId = beaconId,
            measuredPower = params.measuredPower,
            pathLossExponent = params.pathLossExponent
        )
    }
    
    // Save calibrated config
    beaconSystem.saveConfiguration()
}
```

---

### Wi-Fi RTT Positioning

Wi-Fi Round-Trip-Time (IEEE 802.11mc) provides accurate indoor positioning without additional hardware:

```kotlin
import android.net.wifi.rtt.RangingRequest
import android.net.wifi.rtt.RangingResult
import android.net.wifi.rtt.WifiRttManager

class WiFiRTTPositioning(private val context: Context) {
    
    private val rttManager = context.getSystemService(WifiRttManager::class.java)
    
    fun startRTTPositioning() {
        // Check if RTT is supported
        if (!context.packageManager.hasSystemFeature(PackageManager.FEATURE_WIFI_RTT)) {
            Log.e("WiFiRTT", "WiFi RTT not supported on this device")
            return
        }
        
        lifecycleScope.launch {
            // Get RTT-capable access points
            val accessPoints = getWiFiRTTAccessPoints()
            
            if (accessPoints.size < 3) {
                Log.w("WiFiRTT", "Not enough RTT APs available")
                return@launch
            }
            
            // Create ranging request
            val request = RangingRequest.Builder()
                .addAccessPoints(accessPoints)
                .build()
            
            // Start ranging
            rttManager.startRanging(
                request,
                context.mainExecutor,
                object : RangingResultCallback() {
                    override fun onRangingResults(results: List<RangingResult>) {
                        processRangingResults(results)
                    }
                    
                    override fun onRangingFailure(code: Int) {
                        Log.e("WiFiRTT", "Ranging failed: $code")
                    }
                }
            )
        }
    }
    
    private fun processRangingResults(results: List<RangingResult>) {
        val distances = results.mapNotNull { result ->
            if (result.status == RangingResult.STATUS_SUCCESS) {
                AccessPointDistance(
                    macAddress = result.macAddress,
                    distanceMeters = result.distanceMm / 1000.0,
                    accuracy = result.distanceStdDevMm / 1000.0
                )
            } else null
        }
        
        // Calculate position using trilateration
        val position = calculatePositionFromDistances(distances)
        updateUserLocation(position)
    }
}
```

---

### Sensor Fusion (PDR)

Pedestrian Dead Reckoning (PDR) uses device sensors to track movement:

```kotlin
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager

class SensorFusionPositioning(private val context: Context) : SensorEventListener {
    
    private val sensorManager = context.getSystemService(SensorManager::class.java)
    private var currentPosition = Position(0.0, 0.0, 0.0)
    private var currentHeading = 0.0
    private var stepCount = 0
    private val stepLength = 0.7 // meters, can be calibrated
    
    fun startTracking() {
        // Register sensors
        sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        
        sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        
        sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        
        sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
    }
    
    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_STEP_DETECTOR -> {
                onStepDetected()
            }
            Sensor.TYPE_MAGNETIC_FIELD -> {
                updateHeading(event.values)
            }
            Sensor.TYPE_ACCELEROMETER -> {
                processAccelerometer(event.values)
            }
        }
    }
    
    private fun onStepDetected() {
        stepCount++
        
        // Update position based on heading and step length
        val dx = stepLength * sin(Math.toRadians(currentHeading))
        val dy = stepLength * cos(Math.toRadians(currentHeading))
        
        currentPosition = Position(
            x = currentPosition.x + dx,
            y = currentPosition.y + dy,
            z = currentPosition.z
        )
        
        notifyPositionUpdate(currentPosition)
    }
    
    private fun updateHeading(magneticField: FloatArray) {
        // Calculate device orientation
        // Combine with accelerometer for accurate heading
        currentHeading = calculateHeading(magneticField)
    }
    
    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {
        // Handle accuracy changes
    }
    
    fun stopTracking() {
        sensorManager.unregisterListener(this)
    }
}
```

---

## Navigation Implementation

### Initialize Navigation

```kotlin
import com.machinestalk.indoornavigationengine.components.NavigationManager
import com.machinestalk.indoornavigationengine.models.Route
import com.machinestalk.indoornavigationengine.models.NavigationConfig

class NavigationActivity : AppCompatActivity() {
    
    private lateinit var navigationManager: NavigationManager
    private lateinit var sceneView: MineSceneView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_navigation)
        
        sceneView = findViewById(R.id.scene_view)
        
        // Initialize navigation manager
        navigationManager = NavigationManager(
            context = this,
            config = NavigationConfig(
                positioningMode = PositioningMode.BLUETOOTH_BEACONS,
                enableVoiceGuidance = true,
                enableHapticFeedback = true,
                reroutingEnabled = true,
                offTrackThreshold = 5.0, // meters
                instructionDistance = 10.0 // meters before turn
            )
        )
        
        // Set up positioning
        setupPositioning()
        
        // Start navigation
        startNavigation()
    }
    
    private fun setupPositioning() {
        // Use beacon positioning
        val beaconSystem = BeaconPositioningSystem(this)
        beaconSystem.loadConfiguration("beacons/venue_beacons.json")
        
        navigationManager.setPositioningProvider(beaconSystem)
        
        // Add sensor fusion for improved accuracy
        val sensorFusion = SensorFusionPositioning(this)
        navigationManager.addSecondaryPositioningProvider(sensorFusion)
        
        // Listen for position updates
        navigationManager.onPositionUpdate = { position ->
            updateUserMarker(position)
            checkNavigationProgress(position)
        }
    }
}
```

### Calculate and Start Navigation

```kotlin
private fun startNavigation() {
    lifecycleScope.launch {
        try {
            // Get user's current location
            val currentLocation = navigationManager.getCurrentLocation()
            
            if (currentLocation == null) {
                showError("Unable to determine your location")
                return@launch
            }
            
            // Calculate route to destination
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
            
            // Display route on map
            sceneView.displayRoute(route)
            
            // Start turn-by-turn navigation
            navigationManager.startNavigation(route)
            
            // Listen for navigation events
            observeNavigationEvents()
            
        } catch (e: NavigationException) {
            handleNavigationError(e)
        }
    }
}

private fun observeNavigationEvents() {
    navigationManager.navigationEvents.collect { event ->
        when (event) {
            is NavigationEvent.InstructionUpdate -> {
                displayInstruction(event.instruction)
                
                if (event.playAudio) {
                    speakInstruction(event.instruction.text)
                }
            }
            
            is NavigationEvent.OffRoute -> {
                showOffRouteWarning()
                
                if (navigationManager.config.reroutingEnabled) {
                    recalculateRoute()
                }
            }
            
            is NavigationEvent.RouteProgress -> {
                updateProgressUI(
                    distanceRemaining = event.distanceRemaining,
                    timeRemaining = event.estimatedTimeRemaining
                )
            }
            
            is NavigationEvent.FloorChange -> {
                showFloorChangeInstruction(
                    fromFloor = event.fromFloor,
                    toFloor = event.toFloor,
                    transitionType = event.transitionType // stairs, elevator, escalator
                )
                
                // Switch map view to new floor
                sceneView.switchToFloor(event.toFloor)
            }
            
            is NavigationEvent.DestinationReached -> {
                showArrivalDialog()
                stopNavigation()
            }
            
            is NavigationEvent.PositionAccuracyChanged -> {
                updateAccuracyIndicator(event.accuracy)
            }
        }
    }
}
```

### Turn-by-Turn Instructions

```kotlin
data class NavigationInstruction(
    val type: InstructionType,
    val text: String,
    val distance: Double,
    val direction: Direction,
    val nextInstruction: NavigationInstruction? = null
)

enum class InstructionType {
    START,
    TURN_LEFT,
    TURN_RIGHT,
    CONTINUE_STRAIGHT,
    SLIGHT_LEFT,
    SLIGHT_RIGHT,
    SHARP_LEFT,
    SHARP_RIGHT,
    USE_STAIRS_UP,
    USE_STAIRS_DOWN,
    USE_ELEVATOR,
    USE_ESCALATOR,
    ARRIVE
}

private fun displayInstruction(instruction: NavigationInstruction) {
    // Update UI
    binding.instructionText.text = instruction.text
    binding.instructionIcon.setImageResource(
        getInstructionIcon(instruction.type)
    )
    
    // Show distance
    binding.distanceText.text = when {
        instruction.distance < 10 -> "In ${instruction.distance.toInt()} meters"
        instruction.distance < 100 -> "In ${(instruction.distance / 10).toInt() * 10} meters"
        else -> "In ${(instruction.distance / 100).toInt() * 100} meters"
    }
    
    // Highlight next turn on map
    sceneView.highlightNextTurn(instruction)
}

private fun speakInstruction(text: String) {
    textToSpeech.speak(
        text,
        TextToSpeech.QUEUE_FLUSH,
        null,
        "NAVIGATION_INSTRUCTION"
    )
}
```

### User Location Tracking

```kotlin
private fun updateUserMarker(position: Position) {
    // Update user marker on map
    sceneView.updateUserMarker(
        position = position,
        heading = position.heading,
        accuracy = position.accuracy
    )
    
    // Update camera to follow user
    if (binding.followUserButton.isChecked) {
        sceneView.animateCameraToPosition(
            position = position,
            duration = 300,
            smoothing = true
        )
    }
}

// User marker configuration
sceneView.configureUserMarker(
    markerStyle = UserMarkerStyle(
        icon = R.drawable.ic_user_location,
        size = 24.dp,
        showAccuracyCircle = true,
        accuracyCircleColor = Color(0x330000FF),
        showHeadingIndicator = true,
        headingIndicatorColor = Color(0xFF0000FF)
    )
)
```

---

## Advanced Features

### Automatic Rerouting

```kotlin
private suspend fun recalculateRoute() {
    try {
        showReroutingIndicator()
        
        val currentLocation = navigationManager.getCurrentLocation()!!
        val remainingRoute = navigationManager.getRemainingRoute()
        
        // Calculate new route to destination
        val newRoute = navigationManager.calculateRoute(
            RouteRequest(
                origin = currentLocation,
                destination = remainingRoute.destination,
                preferences = navigationManager.routePreferences
            )
        )
        
        // Update navigation with new route
        navigationManager.updateRoute(newRoute)
        sceneView.displayRoute(newRoute)
        
        hideReroutingIndicator()
        showToast("Route recalculated")
        
    } catch (e: Exception) {
        Log.e("Navigation", "Rerouting failed", e)
        showError("Unable to recalculate route")
    }
}
```

### Multi-Floor Navigation

```kotlin
private fun handleFloorTransition(event: NavigationEvent.FloorChange) {
    when (event.transitionType) {
        TransitionType.ELEVATOR -> {
            showElevatorInstructions(
                fromFloor = event.fromFloor,
                toFloor = event.toFloor
            )
        }
        
        TransitionType.STAIRS -> {
            val direction = if (event.toFloor > event.fromFloor) "up" else "down"
            speakInstruction("Take the stairs $direction to floor ${event.toFloor}")
        }
        
        TransitionType.ESCALATOR -> {
            speakInstruction("Take the escalator to floor ${event.toFloor}")
        }
    }
    
    // Wait for user to change floors
    waitForFloorChange(event.toFloor) {
        speakInstruction("Floor change detected. Continuing navigation.")
    }
}

private fun waitForFloorChange(targetFloor: Int, onFloorChanged: () -> Unit) {
    var floorDetected = false
    
    val floorChangeListener = object : FloorChangeListener {
        override fun onFloorDetected(floor: Int) {
            if (floor == targetFloor && !floorDetected) {
                floorDetected = true
                onFloorChanged()
                navigationManager.removeFloorChangeListener(this)
            }
        }
    }
    
    navigationManager.addFloorChangeListener(floorChangeListener)
}
```

### Step-by-Step Progress Tracking

```kotlin
class StepTrackingNavigationManager : NavigationManager() {
    
    private var totalSteps = 0
    private var routeSteps = listOf<RouteStep>()
    
    fun startNavigationWithSteps(route: Route) {
        // Break route into steps
        routeSteps = generateRouteSteps(route)
        totalSteps = routeSteps.size
        
        startNavigation(route)
    }
    
    private fun generateRouteSteps(route: Route): List<RouteStep> {
        val steps = mutableListOf<RouteStep>()
        
        route.segments.forEach { segment ->
            when (segment) {
                is StraightSegment -> {
                    steps.add(RouteStep(
                        instruction = "Continue straight for ${segment.distance}m",
                        distance = segment.distance,
                        type = StepType.CONTINUE
                    ))
                }
                is TurnSegment -> {
                    steps.add(RouteStep(
                        instruction = "Turn ${segment.direction} at ${segment.landmark}",
                        distance = 0.0,
                        type = StepType.TURN
                    ))
                }
                is FloorChangeSegment -> {
                    steps.add(RouteStep(
                        instruction = "Use ${segment.transitionMethod} to floor ${segment.toFloor}",
                        distance = 0.0,
                        type = StepType.FLOOR_CHANGE
                    ))
                }
            }
        }
        
        return steps
    }
    
    fun getCurrentStep(): Int {
        val currentPosition = getCurrentLocation() ?: return 0
        
        // Find which step user is on based on position
        return routeSteps.indexOfFirst { step ->
            step.isUserAtStep(currentPosition)
        }
    }
    
    fun getProgressPercentage(): Float {
        val currentStep = getCurrentStep()
        return (currentStep.toFloat() / totalSteps) * 100
    }
}
```

---

## Voice Guidance

### Text-to-Speech Integration

```kotlin
class VoiceGuidanceManager(private val context: Context) {
    
    private val tts = TextToSpeech(context) { status ->
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale.getDefault()
            tts.setSpeechRate(1.0f)
        }
    }
    
    fun speak(instruction: String, urgent: Boolean = false) {
        val queueMode = if (urgent) {
            TextToSpeech.QUEUE_FLUSH
        } else {
            TextToSpeech.QUEUE_ADD
        }
        
        tts.speak(instruction, queueMode, null, UUID.randomUUID().toString())
    }
    
    fun speakWithDistance(instruction: String, distance: Double) {
        val distanceText = formatDistance(distance)
        speak("In $distanceText, $instruction")
    }
    
    private fun formatDistance(meters: Double): String {
        return when {
            meters < 10 -> "${meters.toInt()} meters"
            meters < 100 -> "${(meters / 10).toInt() * 10} meters"
            meters < 1000 -> "${(meters / 100).toInt() * 100} meters"
            else -> "${(meters / 1000).roundToInt()} kilometers"
        }
    }
    
    fun shutdown() {
        tts.stop()
        tts.shutdown()
    }
}
```

---

## Best Practices

!!! success "Recommended Practices"
    
    **1. Beacon Deployment**
    ```
    ✅ Use at least 3 beacons for accurate positioning
    ✅ Mount beacons at consistent heights (2-3m)
    ✅ Test signal coverage before production deployment
    ✅ Calibrate beacons for your specific environment
    ✅ Monitor beacon battery levels regularly
    ```
    
    **2. User Experience**
    ```kotlin
    // Provide clear feedback about positioning accuracy
    when (accuracy) {
        Accuracy.HIGH -> showGreenIndicator()
        Accuracy.MEDIUM -> showYellowIndicator()
        Accuracy.LOW -> showRedIndicator()
    }
    
    // Give advance notice of turns
    val noticeDistance = calculateNoticeDistance(walkingSpeed)
    announceInstructionAt(noticeDistance)
    ```
    
    **3. Error Handling**
    ```kotlin
    // Always handle positioning failures gracefully
    navigationManager.onPositioningLost = {
        showWarning("GPS signal lost. Using last known location.")
        switchToDeadReckoning()
    }
    ```
    
    **4. Battery Optimization**
    ```kotlin
    // Adjust scanning based on navigation state
    when (navigationState) {
        NavigationState.ACTIVE -> {
            beaconSystem.setScanInterval(1000L) // Frequent
        }
        NavigationState.PAUSED -> {
            beaconSystem.setScanInterval(5000L) // Less frequent
        }
        NavigationState.IDLE -> {
            beaconSystem.stopScanning() // Save battery
        }
    }
    ```

!!! warning "Common Pitfalls"
    
    - **Don't** rely on beacon positioning alone in areas with interference
    - **Don't** forget to handle permission requests for location and Bluetooth
    - **Always** provide fallback positioning methods
    - **Always** test navigation in actual venue conditions
    - **Consider** implementing offline map support for poor connectivity

---

## Troubleshooting

### Inaccurate Positioning

**Problem**: User location jumps or is inaccurate

**Solutions**:

1. **Check Beacon Coverage**
```kotlin
// Verify beacon visibility
fun checkBeaconCoverage(location: Location): Int {
    val visibleBeacons = beaconSystem.getVisibleBeacons()
    
    if (visibleBeacons.size < 3) {
        Log.w("Positioning", "Insufficient beacons: ${visibleBeacons.size}")
        showWarning("Position accuracy may be reduced")
    }
    
    return visibleBeacons.size
}
```

2. **Calibrate Path Loss Exponent**
```kotlin
// Adjust for environment
beaconSystem.setPathLossExponent(
    when (environmentType) {
        EnvironmentType.OPEN_SPACE -> 2.0
        EnvironmentType.OFFICE -> 2.5
        EnvironmentType.DENSE_OBSTACLES -> 3.0
        else -> 2.0
    }
)
```

3. **Enable Kalman Filtering**
```kotlin
// Smooth position updates
navigationManager.enableKalmanFilter(
    processNoise = 0.1,
    measurementNoise = 1.0
)
```

### Navigation Not Starting

**Problem**: Navigation fails to start

**Diagnostic Steps**:

```kotlin
fun diagnoseNavigationIssues(): DiagnosticReport {
    val report = DiagnosticReport()
    
    // Check location permissions
    report.hasLocationPermission = checkLocationPermission()
    
    // Check Bluetooth
    report.isBluetoothEnabled = checkBluetoothEnabled()
    
    // Check beacon availability
    report.visibleBeacons = beaconSystem.getVisibleBeacons().size
    
    // Check map loaded
    report.isMapLoaded = sceneView.isMapLoaded()
    
    // Check positioning provider
    report.isPositioningActive = navigationManager.isPositioningActive()
    
    return report
}
```

### Navigation Frequently Rerouting

**Problem**: Navigation constantly recalculates route

**Solutions**:

```kotlin
// Increase off-track threshold
navigationManager.config = navigationManager.config.copy(
    offTrackThreshold = 8.0, // Increase from 5.0 to 8.0 meters
    reroutingDelay = 5000L // Wait 5 seconds before rerouting
)

// Improve positioning accuracy
beaconSystem.apply {
    setScanInterval(500L) // More frequent scanning
    setRSSISmoothing(true) // Smooth RSSI values
}
```

---

## Performance Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| **Position Update Rate** | 1-2 Hz | Updates per second |
| **Position Accuracy** | < 3 meters | With 3+ beacons |
| **Route Calculation** | < 500ms | For typical venue |
| **Rerouting Time** | < 300ms | When off-track |
| **Battery Drain** | < 5% per hour | During active navigation |
| **Memory Usage** | < 100 MB | Including map data |

---

## Related Documentation

- [Path Finding](./path_finding.md) - Route calculation algorithms
- [Map Loading](./map_loading.md) - Loading venue maps
- [UI Components](./ui_components.md) - Navigation UI widgets
- [API Reference](../api_reference/module_overview.md) - Complete API docs

---

## Next Steps

Now that you understand navigation implementation:

1. **[Implement Path Finding](./path_finding.md)** - Set up route calculation
2. **[Add UI Components](./ui_components.md)** - Build navigation interface
3. **[Customize Themes](./theme_customization.md)** - Brand your navigation experience

