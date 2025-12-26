# <span class="emoji"> :material-help-rhombus: </span> Dépannage

Bienvenue dans le guide de dépannage du **MINE - Moteur de Navigation Intérieure**. Cette ressource complète vous aide à diagnostiquer et résoudre rapidement et efficacement les problèmes courants.

!!! tip "Résolution rapide"
    La plupart des problèmes peuvent être résolus en quelques minutes en utilisant les solutions ci-dessous. Si vous avez besoin d'aide supplémentaire, n'hésitez pas à [contacter notre équipe de support](contact_us.md).

---

## <span class="emoji"> :material-frequently-asked-questions: </span> Problèmes courants

### Navigation rapide

- [Problèmes de chargement de carte](#problemes-chargement-carte)
- [Problèmes de navigation](#problemes-navigation)
- [Problèmes de suivi de localisation](#problemes-suivi-localisation)
- [Problèmes de composants UI](#problemes-composants-ui)
- [Problèmes de performance](#problemes-performance)
- [Problèmes de permissions](#problemes-permissions)
- [Problèmes de build et d'intégration](#problemes-build-integration)
- [Plantages à l'exécution](#plantages-execution)

---

## <span class="emoji"> :material-map-marker-alert: </span> Problèmes de chargement de carte

### Fichier de carte introuvable

!!! bug "Message d'erreur"
    ```
    Error: Map file not found at path: maps/venue.json
    FileNotFoundException: maps/venue.json (No such file or directory)
    ```

**Cause** : Le fichier de carte n'existe pas à l'emplacement spécifié ou le chemin est incorrect.

**Solutions** :

=== "Vérifier l'emplacement du fichier"

    Vérifiez que le fichier de carte est dans le bon répertoire :
    
    ```kotlin
    // Assurez-vous que le fichier est dans le dossier assets
    // La structure du projet devrait ressembler à :
    // app/src/main/assets/maps/venue.json
    
    val mapData = JsonUtil.LoadJsonFromAsset(
        context = context,
        fileName = "maps/venue.json" // Chemin relatif au dossier assets
    )
    ```

=== "Vérifier le dossier Assets"

    Assurez-vous que le dossier `assets` est correctement configuré :
    
    ```groovy
    // build.gradle
    android {
        sourceSets {
            main {
                assets.srcDirs = ['src/main/assets']
            }
        }
    }
    ```

=== "Vérifier le nom de fichier"

    Vérifiez le nom et l'extension du fichier :
    
    ```kotlin
    // Erreurs courantes :
    // ❌ Incorrect : "map.json" (dossier manquant)
    // ❌ Incorrect : "/maps/venue.json" (barre oblique initiale)
    // ✅ Correct : "maps/venue.json"
    
    val mapPath = "maps/venue.json"
    val mapData = JsonUtil.LoadJsonFromAsset(context, mapPath)
    
    if (mapData == null) {
        Log.e("Map", "Échec du chargement de la carte depuis : $mapPath")
        // Vérifier si le fichier existe
        try {
            context.assets.open(mapPath).use { 
                Log.d("Map", "Le fichier existe mais l'analyse a échoué")
            }
        } catch (e: FileNotFoundException) {
            Log.e("Map", "Le fichier n'existe pas : $mapPath")
        }
    }
    ```

**Vérification** :

```kotlin
// Lister tous les fichiers dans assets pour vérifier
fun listAssetFiles(context: Context, path: String = "") {
    try {
        val files = context.assets.list(path) ?: emptyArray()
        files.forEach { file ->
            Log.d("Assets", "Trouvé : $path/$file")
        }
    } catch (e: Exception) {
        Log.e("Assets", "Erreur lors du listage des assets : ${e.message}")
    }
}
```

---

### Format JSON de carte invalide

!!! bug "Message d'erreur"
    ```
    JsonSyntaxException: Expected BEGIN_OBJECT but was STRING
    Error parsing map data
    ```

**Cause** : Le fichier JSON contient des erreurs de syntaxe ou une structure invalide.

**Solutions** :

=== "Valider le JSON"

    Utilisez un validateur JSON en ligne :
    
    1. Copiez votre contenu JSON
    2. Visitez [jsonlint.com](https://jsonlint.com)
    3. Collez et validez
    4. Corrigez toutes les erreurs signalées

=== "Vérifier les champs requis"

    Assurez-vous que tous les champs requis sont présents :
    
    ```json
    {
      "id": "venue-001",
      "name": "Mon lieu",
      "version": "1.0.0",
      "modelPath": "models/venue.glb",
      "floors": [
        {
          "id": "ground",
          "name": "Rez-de-chaussée",
          "level": 0,
          "defaultFloor": true
        }
      ]
    }
    ```

=== "Ajouter la gestion d'erreurs"

    Implémentez une gestion d'erreurs robuste :
    
    ```kotlin
    fun loadMapSafely(context: Context, fileName: String): MapBuild? {
        return try {
            val mapData = JsonUtil.LoadJsonFromAsset(context, fileName)
            
            // Valider les données chargées
            if (mapData?.floors.isNullOrEmpty()) {
                Log.e("Map", "La carte n'a pas d'étages définis")
                return null
            }
            
            if (mapData.modelPath.isEmpty()) {
                Log.e("Map", "La carte n'a pas de chemin de modèle")
                return null
            }
            
            mapData
        } catch (e: JsonSyntaxException) {
            Log.e("Map", "Erreur de syntaxe JSON : ${e.message}")
            null
        } catch (e: Exception) {
            Log.e("Map", "Erreur de chargement de carte : ${e.message}")
            null
        }
    }
    ```

---

### Modèle 3D ne se charge pas

!!! bug "Symptôme"
    Le JSON de la carte se charge avec succès mais le modèle 3D n'apparaît pas à l'écran.

**Solutions** :

=== "Vérifier le chemin du modèle"

    ```kotlin
    // Vérifier que le fichier de modèle existe
    val modelPath = mapData.modelPath // par ex., "models/venue.glb"
    
    try {
        context.assets.open(modelPath).use { stream ->
            val size = stream.available()
            Log.d("Model", "Fichier de modèle trouvé : $modelPath (${size} octets)")
        }
    } catch (e: FileNotFoundException) {
        Log.e("Model", "Fichier de modèle introuvable : $modelPath")
    }
    ```

=== "Vérifier le format du modèle"

    Assurez-vous que le modèle est dans le bon format :
    
    - ✅ Supporté : `.glb`, `.gltf`
    - ❌ Non supporté : `.obj`, `.fbx`, `.blend`
    
    Convertissez votre modèle si nécessaire avec Blender ou des outils en ligne.

=== "Vérifier la taille du modèle"

    ```kotlin
    // Les gros modèles peuvent prendre du temps à charger
    sceneView.setOnModelLoadListener(object : ModelLoadListener {
        override fun onLoadStart() {
            showLoadingIndicator()
        }
        
        override fun onLoadProgress(progress: Float) {
            updateLoadingProgress(progress)
        }
        
        override fun onLoadComplete() {
            hideLoadingIndicator()
        }
        
        override fun onLoadError(error: String) {
            Log.e("Model", "Erreur de chargement : $error")
            showErrorDialog(error)
        }
    })
    ```

---

## <span class="emoji"> :material-navigation-variant-outline: </span> Problèmes de navigation

### La navigation ne démarre pas

!!! bug "Symptôme"
    L'appel de `startNavigation()` n'initie pas la navigation ou n'affiche aucune erreur.

**Solutions** :

=== "Vérifier les permissions"

    ```kotlin
    // Assurez-vous que la permission de localisation est accordée
    if (ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) != PackageManager.PERMISSION_GRANTED
    ) {
        // Demander la permission
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
            LOCATION_PERMISSION_REQUEST
        )
        return
    }
    
    // Démarrer la navigation après l'octroi de la permission
    navigationManager.startNavigation(destination)
    ```

=== "Vérifier le calcul d'itinéraire"

    ```kotlin
    // Vérifier si l'itinéraire a été calculé avec succès
    val route = pathFinder.findPath(start, destination)
    
    if (route == null) {
        Log.e("Navigation", "Échec du calcul de l'itinéraire")
        showError("Impossible de trouver un itinéraire vers la destination")
        return
    }
    
    if (route.waypoints.isEmpty()) {
        Log.e("Navigation", "L'itinéraire n'a pas de points de passage")
        return
    }
    
    // Démarrer la navigation avec un itinéraire valide
    navigationManager.startNavigation(destination, route)
    ```

=== "Initialiser les composants"

    ```kotlin
    // Assurez-vous que tous les composants sont initialisés
    class NavigationActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        private lateinit var navigationManager: UserNavigationManager
        private lateinit var locationTracker: LocationTracker
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialiser dans le bon ordre
            sceneView = MineSceneView(this)
            setContentView(sceneView)
            
            // Charger la carte d'abord
            loadMap()
            
            // Initialiser le suivi de localisation
            locationTracker = LocationTracker(this)
            locationTracker.startTracking()
            
            // Initialiser la navigation en dernier
            navigationManager = UserNavigationManager(this, sceneView)
        }
    }
    ```

---

### Balises non détectées

!!! bug "Symptôme"
    Le suivi de localisation affiche une faible précision ou aucune mise à jour de position.

**Solutions** :

=== "Vérifier le Bluetooth"

    ```kotlin
    // Vérifier que le Bluetooth est activé
    val bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
    
    if (bluetoothAdapter == null) {
        showError("L'appareil ne supporte pas le Bluetooth")
        return
    }
    
    if (!bluetoothAdapter.isEnabled) {
        // Demander l'activation du Bluetooth
        val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
        startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT)
    }
    ```

=== "Vérifier la configuration des balises"

    ```json
    {
      "beacons": [
        {
          "id": "beacon-001",
          "uuid": "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
          "major": 1,
          "minor": 1,
          "location": {
            "x": 10.0,
            "y": 5.0,
            "z": 0.0
          },
          "floor": "ground"
        }
      ]
    }
    ```

=== "Vérifier la portée des balises"

    ```kotlin
    locationTracker.setBeaconConfig(BeaconConfig(
        scanInterval = 1000,
        rangingEnabled = true,
        minRSSI = -90, // Augmenter la portée
        supportedTypes = listOf(
            BeaconType.IBEACON,
            BeaconType.EDDYSTONE
        )
    ))
    
    // Surveiller la détection de balises
    locationTracker.setBeaconListener { beacons ->
        Log.d("Beacons", "Détecté ${beacons.size} balises")
        beacons.forEach { beacon ->
            Log.d("Beacon", "ID: ${beacon.id}, RSSI: ${beacon.rssi}")
        }
    }
    ```

=== "Tester le matériel des balises"

    Vérifier que les balises fonctionnent :
    
    1. Utiliser une app de scan de balises (par ex., "Beacon Scanner" sur Play Store)
    2. Vérifier si les balises apparaissent dans le scanner
    3. Vérifier que les valeurs UUID, major et minor correspondent à votre configuration
    4. Vérifier le niveau de batterie des balises
    5. S'assurer que les balises ont une ligne de vue dégagée

---

### Instructions de navigation incorrectes

!!! bug "Symptôme"
    Les instructions étape par étape apparaissent aux mauvais endroits ou avec des directions incorrectes.

**Solutions** :

=== "Calibrer la position"

    ```kotlin
    // Assurer une position de départ précise
    locationTracker.setMinAccuracy(5f) // mètres
    
    // Attendre une position précise avant de démarrer
    locationTracker.setLocationListener(object : LocationListener {
        override fun onLocationChanged(location: Location) {
            if (location.accuracy <= 5f) {
                // La position est suffisamment précise
                startNavigation(destination)
            } else {
                showMessage("Amélioration de la précision de position...")
            }
        }
    })
    ```

=== "Ajuster les déclencheurs d'instructions"

    ```kotlin
    // Configurer les distances d'instruction
    val instructionConfig = InstructionConfig(
        earlyWarningDistance = 50f, // Afficher "Tournez bientôt" à 50m
        turnAnnouncementDistance = 20f, // Afficher "Tournez maintenant" à 20m
        arrivalAnnouncementDistance = 10f, // Arrivée à 10m
        verbosity = InstructionVerbosity.DETAILED
    )
    
    instructionManager.setInstructionConfig(instructionConfig)
    ```

=== "Déboguer l'état de navigation"

    ```kotlin
    navigationManager.setNavigationListener(object : NavigationListener {
        override fun onPositionUpdated(location: Location) {
            Log.d("Nav", "Position : ${location.x}, ${location.y}, ${location.z}")
            Log.d("Nav", "Étage : ${location.floor}")
            Log.d("Nav", "Précision : ${location.accuracy}m")
        }
        
        override fun onInstructionChanged(instruction: NavigationInstruction) {
            Log.d("Nav", "Instruction : ${instruction.text}")
            Log.d("Nav", "Distance : ${instruction.distance}m")
            Log.d("Nav", "Type : ${instruction.type}")
        }
        
        override fun onRouteDeviation(distance: Float) {
            Log.w("Nav", "Hors itinéraire de ${distance}m")
        }
    })
    ```

---

## <span class="emoji"> :material-map-marker-question: </span> Problèmes de suivi de localisation

### Position imprécise

!!! bug "Symptôme"
    La position de l'utilisateur saute ou affiche un emplacement incorrect.

**Solutions** :

=== "Activer plusieurs fournisseurs"

    ```kotlin
    locationTracker.apply {
        // Utiliser plusieurs sources de positionnement
        addProvider(LocationProvider.WIFI, priority = 10)
        addProvider(LocationProvider.BLUETOOTH, priority = 8)
        addProvider(LocationProvider.SENSOR_FUSION, priority = 6)
        addProvider(LocationProvider.PDR, priority = 4)
        
        // Activer la fusion de capteurs pour le lissage
        setSensorFusionConfig(SensorFusionConfig(
            enableAccelerometer = true,
            enableGyroscope = true,
            enableMagnetometer = true,
            enableStepDetector = true
        ))
    }
    ```

=== "Implémenter un filtre de Kalman"

    ```kotlin
    // Appliquer un filtrage pour un suivi fluide
    class SmoothedLocationTracker(context: Context) : LocationTracker(context) {
        
        private val kalmanFilter = KalmanFilter()
        
        override fun processLocationUpdate(rawLocation: Location) {
            // Filtrer les données de localisation bruitées
            val smoothedLocation = kalmanFilter.filter(rawLocation)
            
            // Ne mettre à jour que si le changement est significatif
            if (isSignificantChange(smoothedLocation)) {
                notifyLocationUpdate(smoothedLocation)
            }
        }
        
        private fun isSignificantChange(location: Location): Boolean {
            val lastLocation = getLastLocation() ?: return true
            val distance = location.distanceTo(lastLocation)
            return distance > 0.5f // Seuil de 50cm
        }
    }
    ```

=== "Réduire la fréquence de mise à jour"

    ```kotlin
    // Éviter de surcharger le système
    locationTracker.apply {
        setUpdateInterval(1000) // Mise à jour toutes les 1 seconde
        setFastestInterval(500) // Mais pas plus rapide que 500ms
        setMinAccuracy(5f) // N'accepter que les positions avec une précision de 5m
    }
    ```

---

### Localisation ne se met pas à jour

!!! bug "Symptôme"
    Le marqueur de position reste figé ou ne bouge pas.

**Solutions** :

=== "Vérifier les permissions"

    ```kotlin
    // Vérifier toutes les permissions requises
    val requiredPermissions = arrayOf(
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION,
        Manifest.permission.BLUETOOTH,
        Manifest.permission.BLUETOOTH_ADMIN,
        Manifest.permission.ACCESS_WIFI_STATE
    )
    
    val missingPermissions = requiredPermissions.filter {
        ContextCompat.checkSelfPermission(this, it) != 
            PackageManager.PERMISSION_GRANTED
    }
    
    if (missingPermissions.isNotEmpty()) {
        ActivityCompat.requestPermissions(
            this,
            missingPermissions.toTypedArray(),
            PERMISSIONS_REQUEST_CODE
        )
    }
    ```

=== "Redémarrer le suivi de localisation"

    ```kotlin
    // Réinitialiser le suivi de localisation
    fun resetLocationTracking() {
        locationTracker.stopTracking()
        
        // Attendre un moment
        Handler(Looper.getMainLooper()).postDelayed({
            locationTracker.startTracking()
        }, 1000)
    }
    ```

=== "Vérifier l'état du fournisseur"

    ```kotlin
    // Surveiller la disponibilité du fournisseur
    locationTracker.setProviderListener(object : ProviderListener {
        override fun onProviderEnabled(provider: LocationProvider) {
            Log.d("Location", "Fournisseur activé : ${provider.name}")
        }
        
        override fun onProviderDisabled(provider: LocationProvider) {
            Log.w("Location", "Fournisseur désactivé : ${provider.name}")
            // Essayer des fournisseurs alternatifs
        }
        
        override fun onProviderError(provider: LocationProvider, error: String) {
            Log.e("Location", "Erreur fournisseur : ${provider.name} - $error")
        }
    })
    ```

---

## <span class="emoji"> :material-widgets: </span> Problèmes de composants UI

### Composants UI non visibles

!!! bug "Symptôme"
    Les composants UI comme la barre de recherche ou le panneau de navigation n'apparaissent pas.

**Solutions** :

=== "Vérifier l'attachement du composant"

    ```kotlin
    // S'assurer que les composants sont ajoutés à la vue de scène
    val searchBar = SearchBar(this)
    val navigationPanel = LiveNavigationPanel(this)
    
    sceneView.apply {
        addUIComponent(searchBar)
        addUIComponent(navigationPanel)
    }
    
    // Vérifier que les composants ont été ajoutés
    Log.d("UI", "Nombre de composants : ${sceneView.getUIComponentCount()}")
    ```

=== "Vérifier l'ordre Z"

    ```kotlin
    // S'assurer que les composants sont au premier plan
    searchBar.apply {
        bringToFront()
        elevation = 8.dp
    }
    ```

=== "Vérifier le cycle de vie"

    ```kotlin
    override fun onResume() {
        super.onResume()
        sceneView.onResume()
        // Restaurer la visibilité des composants UI
        searchBar.visibility = View.VISIBLE
    }
    ```

---

### Barre de recherche ne répond pas

!!! bug "Symptôme"
    Cliquer sur la barre de recherche n'affiche pas le clavier ou les suggestions.

**Solutions** :

=== "Vérifier les événements tactiles"

    ```kotlin
    searchBar.apply {
        // S'assurer que les événements tactiles sont activés
        isClickable = true
        isFocusable = true
        isFocusableInTouchMode = true
        
        // Demander le focus au clic
        setOnClickListener {
            requestFocus()
            showKeyboard()
        }
    }
    ```

=== "Vérifier le fournisseur de recherche"

    ```kotlin
    // Configurer la source de données de recherche
    searchBar.setSearchProvider { query ->
        if (query.length < 2) {
            return@setSearchProvider emptyList()
        }
        
        // Retourner les résultats de recherche
        poiManager.search(query).map { poi ->
            SearchResult(
                id = poi.id,
                title = poi.name,
                subtitle = poi.category,
                location = poi.location
            )
        }
    }
    ```

---

## <span class="emoji"> :material-speedometer-slow: </span> Problèmes de performance

### Faible fréquence d'images

!!! bug "Symptôme"
    L'application fonctionne lentement avec des saccades ou du lag.

**Solutions** :

=== "Réduire la qualité de rendu"

    ```kotlin
    // Optimiser pour la performance
    sceneView.displayConfig = DisplayConfig(
        renderQuality = DisplayConfig.RenderQuality.LOW,
        shadowsEnabled = false,
        ambientOcclusion = false,
        antiAliasing = false
    )
    
    // Limiter la fréquence d'images
    sceneView.maxFrameRate = 30
    ```

=== "Utiliser le mode 2D"

    ```kotlin
    // Basculer en 2D pour de meilleures performances
    sceneView.setRenderMode(RenderMode.MODE_2D)
    ```

=== "Optimiser le rendu d'itinéraire"

    ```kotlin
    // Simplifier la visualisation de l'itinéraire
    sceneView.routeRenderConfig = RouteRenderConfig(
        segmentCount = 20, // Réduire par rapport à la valeur par défaut
        smoothing = false,
        animationsEnabled = false
    )
    ```

---

### Utilisation mémoire élevée

!!! bug "Symptôme"
    L'application utilise une mémoire excessive ou plante avec OutOfMemoryError.

**Solutions** :

=== "Activer la gestion de la mémoire"

    ```kotlin
    override fun onLowMemory() {
        super.onLowMemory()
        sceneView.clearCache()
        sceneView.reduceTextureQuality()
    }
    
    override fun onTrimMemory(level: Int) {
        super.onTrimMemory(level)
        when (level) {
            ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW -> {
                sceneView.clearCache()
            }
        }
    }
    ```

=== "Gérer le cycle de vie correctement"

    ```kotlin
    override fun onDestroy() {
        // Nettoyer les ressources
        navigationManager.destroy()
        locationTracker.stopTracking()
        sceneView.onDestroy()
        super.onDestroy()
    }
    ```

---

## <span class="emoji"> :material-shield-lock: </span> Problèmes de permissions

### Permission refusée définitivement

!!! bug "Symptôme"
    L'utilisateur a refusé la permission et sélectionné "Ne plus demander".

**Solutions** :

=== "Afficher la boîte de dialogue des paramètres"

    ```kotlin
    fun showPermissionSettingsDialog() {
        AlertDialog.Builder(this)
            .setTitle("Permission de localisation requise")
            .setMessage(
                "La navigation nécessite la permission de localisation. " +
                "Veuillez l'activer dans les paramètres de l'application."
            )
            .setPositiveButton("Ouvrir les paramètres") { _, _ ->
                val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                intent.data = Uri.fromParts("package", packageName, null)
                startActivity(intent)
            }
            .setNegativeButton("Annuler", null)
            .show()
    }
    ```

---

## <span class="emoji"> :material-hammer-wrench: </span> Problèmes de build et d'intégration

### Échec de synchronisation Gradle

!!! bug "Message d'erreur"
    ```
    Failed to resolve: com.machinestalk:indoornavigationengine:0.4.0-alpha
    ```

**Solutions** :

=== "Vérifier le dépôt"

    ```kotlin
    // build.gradle (niveau projet)
    allprojects {
        repositories {
            google()
            mavenCentral()
            // Ajoutez votre dépôt ici
        }
    }
    ```

=== "Vérifier la version"

    ```kotlin
    // Utiliser le bon numéro de version
    dependencies {
        implementation("com.machinestalk:indoornavigationengine:0.4.0-alpha")
    }
    ```

---

### Erreur de compilation Java 17

!!! bug "Message d'erreur"
    ```
    Unsupported class file major version 61
    ```

**Solutions** :

```kotlin
// build.gradle (niveau module)
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = "17"
    }
}
```

---

## <span class="emoji"> :material-alert-octagon: </span> Plantages à l'exécution

### NullPointerException

!!! bug "Emplacements courants"
    - Données de carte non chargées avant utilisation
    - Composants non initialisés
    - Vérifications nulles manquantes

**Solutions** :

```kotlin
// Toujours vérifier null
val mapData = JsonUtil.LoadJsonFromAsset(context, "maps/venue.json")
if (mapData == null) {
    Log.e("Error", "Échec du chargement de la carte")
    return
}

sceneView.setMapData(mapData)
```

---

### OutOfMemoryError

!!! bug "Cause"
    Fuite mémoire ou utilisation excessive de ressources.

**Solutions** :

```kotlin
// Implémenter un nettoyage approprié
override fun onDestroy() {
    navigationManager.destroy()
    locationTracker.stopTracking()
    sceneView.onDestroy()
    super.onDestroy()
}
```

---

## <span class="emoji"> :material-chat-question: </span> Besoin d'aide ?

Si vous rencontrez toujours des problèmes après avoir essayé ces solutions :

<div class="grid cards" markdown>

-   :material-email:{ .lg .middle } **Contacter le support**

    ---

    Obtenez de l'aide de notre équipe de support technique

    [:octicons-arrow-right-24: Contactez-nous](contact_us.md)

-   :material-frequently-asked-questions:{ .lg .middle } **Consulter la FAQ**

    ---

    Parcourir les questions fréquemment posées

    [:octicons-arrow-right-24: Voir la FAQ](faq.md)

-   :material-book-open-variant:{ .lg .middle } **Documentation**

    ---

    Explorer la documentation complète

    [:octicons-arrow-right-24: Parcourir la doc](../getting_started/quick_start.md)

-   :material-bug:{ .lg .middle } **Signaler un bug**

    ---

    Soumettre un rapport de bug détaillé

    [:octicons-arrow-right-24: Signaler un problème](contact_us.md)

</div>

---

## <span class="emoji"> :material-lightbulb-on: </span> Conseils de débogage

### Activer la journalisation détaillée

```kotlin
// Activer la journalisation détaillée
if (BuildConfig.DEBUG) {
    MineLogger.setLogLevel(MineLogger.Level.VERBOSE)
    sceneView.showDebugOverlay = true
    sceneView.showFpsCounter = true
}
```

### Utiliser les filtres LogCat

```bash
# Filtrer par tag
adb logcat MINE:D *:S

# Filtrer par package
adb logcat | grep com.example.myapp
```

### Capturer les informations de débogage

```kotlin
fun captureDebugInfo(): String {
    return buildString {
        appendLine("=== Infos de débogage MINE ===")
        appendLine("Version : ${BuildConfig.VERSION_NAME}")
        appendLine("Appareil : ${Build.MODEL}")
        appendLine("Android : ${Build.VERSION.RELEASE}")
        appendLine("Mémoire : ${getAvailableMemory()}MB")
        appendLine("Fournisseurs de localisation : ${locationTracker.getActiveProviders()}")
        appendLine("Carte chargée : ${sceneView.isMapLoaded()}")
        appendLine("Navigation active : ${navigationManager.isNavigating()}")
    }
}
```

---

!!! success "Problème résolu ?"
    Si ces solutions vous ont aidé, envisagez de partager votre expérience ou de contribuer des conseils de dépannage supplémentaires !
