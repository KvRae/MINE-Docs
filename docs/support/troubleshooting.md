# <span class="emoji"> :material-help-rhombus: </span> Troubleshooting

Welcome to the **MINE - Indoor Navigation Engine** troubleshooting guide. This comprehensive resource helps you diagnose and resolve common issues quickly and efficiently.

!!! tip "Quick Resolution"
    Most issues can be resolved in minutes using the solutions below. If you need additional help, don't hesitate to [contact our support team](contact_us.md).

---

## <span class="emoji"> :material-frequently-asked-questions: </span> Common Issues

### Quick Navigation

- [Map Loading Issues](#map-loading-issues)
- [Navigation Problems](#navigation-problems)
- [Location Tracking Issues](#location-tracking-issues)
- [UI Component Issues](#ui-component-issues)
- [Performance Problems](#performance-problems)
- [Permission Issues](#permission-issues)
- [Build & Integration Issues](#build-integration-issues)
- [Runtime Crashes](#runtime-crashes)

---

## <span class="emoji"> :material-map-marker-alert: </span> Map Loading Issues

### Map File Not Found

!!! bug "Error Message"
    ```
    Error: Map file not found at path: maps/venue.json
    FileNotFoundException: maps/venue.json (No such file or directory)
    ```

**Cause**: The map file doesn't exist in the specified location or the path is incorrect.

**Solutions**:

=== "Check File Location"

    Verify the map file is in the correct directory:
    
    ```kotlin
    // Make sure the file is in assets folder
    // Project structure should look like:
    // app/src/main/assets/maps/venue.json
    
    val mapData = JsonUtil.LoadJsonFromAsset(
        context = context,
        fileName = "maps/venue.json" // Path relative to assets folder
    )
    ```

=== "Verify Assets Folder"

    Ensure the `assets` folder is properly configured:
    
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

=== "Check File Name"

    Verify file name and extension:
    
    ```kotlin
    // Common mistakes:
    // ❌ Wrong: "map.json" (missing folder)
    // ❌ Wrong: "/maps/venue.json" (leading slash)
    // ✅ Correct: "maps/venue.json"
    
    val mapPath = "maps/venue.json"
    val mapData = JsonUtil.LoadJsonFromAsset(context, mapPath)
    
    if (mapData == null) {
        Log.e("Map", "Failed to load map from: $mapPath")
        // Check if file exists
        try {
            context.assets.open(mapPath).use { 
                Log.d("Map", "File exists but failed to parse")
            }
        } catch (e: FileNotFoundException) {
            Log.e("Map", "File does not exist: $mapPath")
        }
    }
    ```

**Verification**:

```kotlin
// List all files in assets to verify
fun listAssetFiles(context: Context, path: String = "") {
    try {
        val files = context.assets.list(path) ?: emptyArray()
        files.forEach { file ->
            Log.d("Assets", "Found: $path/$file")
        }
    } catch (e: Exception) {
        Log.e("Assets", "Error listing assets: ${e.message}")
    }
}
```

---

### Invalid Map JSON Format

!!! bug "Error Message"
    ```
    JsonSyntaxException: Expected BEGIN_OBJECT but was STRING
    Error parsing map data
    ```

**Cause**: The JSON file contains syntax errors or invalid structure.

**Solutions**:

=== "Validate JSON"

    Use an online JSON validator:
    
    1. Copy your JSON content
    2. Visit [jsonlint.com](https://jsonlint.com)
    3. Paste and validate
    4. Fix any reported errors

=== "Check Required Fields"

    Ensure all required fields are present:
    
    ```json
    {
      "id": "venue-001",
      "name": "My Venue",
      "version": "1.0.0",
      "modelPath": "models/venue.glb",
      "floors": [
        {
          "id": "ground",
          "name": "Ground Floor",
          "level": 0,
          "defaultFloor": true
        }
      ]
    }
    ```

=== "Add Error Handling"

    Implement robust error handling:
    
    ```kotlin
    fun loadMapSafely(context: Context, fileName: String): MapBuild? {
        return try {
            val mapData = JsonUtil.LoadJsonFromAsset(context, fileName)
            
            // Validate loaded data
            if (mapData?.floors.isNullOrEmpty()) {
                Log.e("Map", "Map has no floors defined")
                return null
            }
            
            if (mapData.modelPath.isEmpty()) {
                Log.e("Map", "Map has no model path")
                return null
            }
            
            mapData
        } catch (e: JsonSyntaxException) {
            Log.e("Map", "JSON syntax error: ${e.message}")
            null
        } catch (e: Exception) {
            Log.e("Map", "Error loading map: ${e.message}")
            null
        }
    }
    ```

---

### 3D Model Not Loading

!!! bug "Symptom"
    Map JSON loads successfully but the 3D model doesn't appear on screen.

**Solutions**:

=== "Check Model Path"

    ```kotlin
    // Verify model file exists
    val modelPath = mapData.modelPath // e.g., "models/venue.glb"
    
    try {
        context.assets.open(modelPath).use { stream ->
            val size = stream.available()
            Log.d("Model", "Model file found: $modelPath (${size} bytes)")
        }
    } catch (e: FileNotFoundException) {
        Log.e("Model", "Model file not found: $modelPath")
    }
    ```

=== "Verify Model Format"

    Ensure the model is in the correct format:
    
    - ✅ Supported: `.glb`, `.gltf`
    - ❌ Not supported: `.obj`, `.fbx`, `.blend`
    
    Convert your model if needed using Blender or online tools.

=== "Check Model Size"

    ```kotlin
    // Large models may take time to load
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
            Log.e("Model", "Load error: $error")
            showErrorDialog(error)
        }
    })
    ```

---

## <span class="emoji"> :material-navigation-variant-outline: </span> Navigation Problems

### Navigation Not Starting

!!! bug "Symptom"
    Calling `startNavigation()` doesn't initiate navigation or shows no error.

**Solutions**:

=== "Check Permissions"

    ```kotlin
    // Ensure location permission is granted
    if (ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) != PackageManager.PERMISSION_GRANTED
    ) {
        // Request permission
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
            LOCATION_PERMISSION_REQUEST
        )
        return
    }
    
    // Start navigation after permission granted
    navigationManager.startNavigation(destination)
    ```

=== "Verify Route Calculation"

    ```kotlin
    // Check if route was calculated successfully
    val route = pathFinder.findPath(start, destination)
    
    if (route == null) {
        Log.e("Navigation", "Failed to calculate route")
        showError("Cannot find route to destination")
        return
    }
    
    if (route.waypoints.isEmpty()) {
        Log.e("Navigation", "Route has no waypoints")
        return
    }
    
    // Start navigation with valid route
    navigationManager.startNavigation(destination, route)
    ```

=== "Initialize Components"

    ```kotlin
    // Ensure all components are initialized
    class NavigationActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        private lateinit var navigationManager: UserNavigationManager
        private lateinit var locationTracker: LocationTracker
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialize in correct order
            sceneView = MineSceneView(this)
            setContentView(sceneView)
            
            // Load map first
            loadMap()
            
            // Initialize location tracking
            locationTracker = LocationTracker(this)
            locationTracker.startTracking()
            
            // Initialize navigation last
            navigationManager = UserNavigationManager(this, sceneView)
        }
    }
    ```

---

### Beacons Not Detected

!!! bug "Symptom"
    Location tracking shows low accuracy or no position updates.

**Solutions**:

=== "Check Bluetooth"

    ```kotlin
    // Verify Bluetooth is enabled
    val bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
    
    if (bluetoothAdapter == null) {
        showError("Device doesn't support Bluetooth")
        return
    }
    
    if (!bluetoothAdapter.isEnabled) {
        // Request to enable Bluetooth
        val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
        startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT)
    }
    ```

=== "Verify Beacon Configuration"

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

=== "Check Beacon Range"

    ```kotlin
    locationTracker.setBeaconConfig(BeaconConfig(
        scanInterval = 1000,
        rangingEnabled = true,
        minRSSI = -90, // Increase range
        supportedTypes = listOf(
            BeaconType.IBEACON,
            BeaconType.EDDYSTONE
        )
    ))
    
    // Monitor beacon detection
    locationTracker.setBeaconListener { beacons ->
        Log.d("Beacons", "Detected ${beacons.size} beacons")
        beacons.forEach { beacon ->
            Log.d("Beacon", "ID: ${beacon.id}, RSSI: ${beacon.rssi}")
        }
    }
    ```

=== "Test Beacon Hardware"

    Verify beacons are working:
    
    1. Use a beacon scanner app (e.g., "Beacon Scanner" on Play Store)
    2. Check if beacons appear in the scanner
    3. Verify UUID, major, and minor values match your configuration
    4. Check battery level of beacons
    5. Ensure beacons have clear line of sight

---

### Incorrect Navigation Instructions

!!! bug "Symptom"
    Turn-by-turn instructions appear at wrong locations or with incorrect directions.

**Solutions**:

=== "Calibrate Position"

    ```kotlin
    // Ensure accurate starting position
    locationTracker.setMinAccuracy(5f) // meters
    
    // Wait for accurate position before starting
    locationTracker.setLocationListener(object : LocationListener {
        override fun onLocationChanged(location: Location) {
            if (location.accuracy <= 5f) {
                // Position is accurate enough
                startNavigation(destination)
            } else {
                showMessage("Improving position accuracy...")
            }
        }
    })
    ```

=== "Adjust Instruction Triggers"

    ```kotlin
    // Configure instruction distances
    val instructionConfig = InstructionConfig(
        earlyWarningDistance = 50f, // Show "Turn ahead" at 50m
        turnAnnouncementDistance = 20f, // Show "Turn now" at 20m
        arrivalAnnouncementDistance = 10f, // Arrival at 10m
        verbosity = InstructionVerbosity.DETAILED
    )
    
    instructionManager.setInstructionConfig(instructionConfig)
    ```

=== "Debug Navigation State"

    ```kotlin
    navigationManager.setNavigationListener(object : NavigationListener {
        override fun onPositionUpdated(location: Location) {
            Log.d("Nav", "Position: ${location.x}, ${location.y}, ${location.z}")
            Log.d("Nav", "Floor: ${location.floor}")
            Log.d("Nav", "Accuracy: ${location.accuracy}m")
        }
        
        override fun onInstructionChanged(instruction: NavigationInstruction) {
            Log.d("Nav", "Instruction: ${instruction.text}")
            Log.d("Nav", "Distance: ${instruction.distance}m")
            Log.d("Nav", "Type: ${instruction.type}")
        }
        
        override fun onRouteDeviation(distance: Float) {
            Log.w("Nav", "Off route by ${distance}m")
        }
    })
    ```

---

## <span class="emoji"> :material-map-marker-question: </span> Location Tracking Issues

### Inaccurate Position

!!! bug "Symptom"
    User position jumps around or shows incorrect location.

**Solutions**:

=== "Enable Multiple Providers"

    ```kotlin
    locationTracker.apply {
        // Use multiple positioning sources
        addProvider(LocationProvider.WIFI, priority = 10)
        addProvider(LocationProvider.BLUETOOTH, priority = 8)
        addProvider(LocationProvider.SENSOR_FUSION, priority = 6)
        addProvider(LocationProvider.PDR, priority = 4)
        
        // Enable sensor fusion for smoothing
        setSensorFusionConfig(SensorFusionConfig(
            enableAccelerometer = true,
            enableGyroscope = true,
            enableMagnetometer = true,
            enableStepDetector = true
        ))
    }
    ```

=== "Implement Kalman Filter"

    ```kotlin
    // Apply filtering for smooth tracking
    class SmoothedLocationTracker(context: Context) : LocationTracker(context) {
        
        private val kalmanFilter = KalmanFilter()
        
        override fun processLocationUpdate(rawLocation: Location) {
            // Filter noisy location data
            val smoothedLocation = kalmanFilter.filter(rawLocation)
            
            // Only update if change is significant
            if (isSignificantChange(smoothedLocation)) {
                notifyLocationUpdate(smoothedLocation)
            }
        }
        
        private fun isSignificantChange(location: Location): Boolean {
            val lastLocation = getLastLocation() ?: return true
            val distance = location.distanceTo(lastLocation)
            return distance > 0.5f // 50cm threshold
        }
    }
    ```

=== "Reduce Update Frequency"

    ```kotlin
    // Avoid overwhelming the system
    locationTracker.apply {
        setUpdateInterval(1000) // Update every 1 second
        setFastestInterval(500) // But not faster than 500ms
        setMinAccuracy(5f) // Only accept positions within 5m accuracy
    }
    ```

---

### Location Not Updating

!!! bug "Symptom"
    Position marker stays frozen or doesn't move.

**Solutions**:

=== "Check Permissions"

    ```kotlin
    // Verify all required permissions
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

=== "Restart Location Tracking"

    ```kotlin
    // Reset location tracking
    fun resetLocationTracking() {
        locationTracker.stopTracking()
        
        // Wait a moment
        Handler(Looper.getMainLooper()).postDelayed({
            locationTracker.startTracking()
        }, 1000)
    }
    ```

=== "Check Provider Status"

    ```kotlin
    // Monitor provider availability
    locationTracker.setProviderListener(object : ProviderListener {
        override fun onProviderEnabled(provider: LocationProvider) {
            Log.d("Location", "Provider enabled: ${provider.name}")
        }
        
        override fun onProviderDisabled(provider: LocationProvider) {
            Log.w("Location", "Provider disabled: ${provider.name}")
            // Try alternative providers
        }
        
        override fun onProviderError(provider: LocationProvider, error: String) {
            Log.e("Location", "Provider error: ${provider.name} - $error")
        }
    })
    ```

---

## <span class="emoji"> :material-widgets: </span> UI Component Issues

### UI Components Not Visible

!!! bug "Symptom"
    UI components like search bar or navigation panel don't appear.

**Solutions**:

=== "Verify Component Attachment"

    ```kotlin
    // Ensure components are added to scene view
    val searchBar = SearchBar(this)
    val navigationPanel = LiveNavigationPanel(this)
    
    sceneView.apply {
        addUIComponent(searchBar)
        addUIComponent(navigationPanel)
    }
    
    // Verify components were added
    Log.d("UI", "Component count: ${sceneView.getUIComponentCount()}")
    ```

=== "Check Z-Order"

    ```kotlin
    // Ensure components are on top
    searchBar.apply {
        bringToFront()
        elevation = 8.dp
    }
    ```

=== "Verify Lifecycle"

    ```kotlin
    override fun onResume() {
        super.onResume()
        sceneView.onResume()
        // Restore UI component visibility
        searchBar.visibility = View.VISIBLE
    }
    ```

---

### Search Bar Not Responding

!!! bug "Symptom"
    Clicking search bar doesn't show keyboard or suggestions.

**Solutions**:

=== "Check Touch Events"

    ```kotlin
    searchBar.apply {
        // Ensure touch events are enabled
        isClickable = true
        isFocusable = true
        isFocusableInTouchMode = true
        
        // Request focus on click
        setOnClickListener {
            requestFocus()
            showKeyboard()
        }
    }
    ```

=== "Verify Search Provider"

    ```kotlin
    // Set up search data source
    searchBar.setSearchProvider { query ->
        if (query.length < 2) {
            return@setSearchProvider emptyList()
        }
        
        // Return search results
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

## <span class="emoji"> :material-speedometer-slow: </span> Performance Problems

### Low Frame Rate

!!! bug "Symptom"
    App runs slowly with stuttering or lag.

**Solutions**:

=== "Reduce Render Quality"

    ```kotlin
    // Optimize for performance
    sceneView.displayConfig = DisplayConfig(
        renderQuality = DisplayConfig.RenderQuality.LOW,
        shadowsEnabled = false,
        ambientOcclusion = false,
        antiAliasing = false
    )
    
    // Limit frame rate
    sceneView.maxFrameRate = 30
    ```

=== "Use 2D Mode"

    ```kotlin
    // Switch to 2D for better performance
    sceneView.setRenderMode(RenderMode.MODE_2D)
    ```

=== "Optimize Route Rendering"

    ```kotlin
    // Simplify route visualization
    sceneView.routeRenderConfig = RouteRenderConfig(
        segmentCount = 20, // Reduce from default
        smoothing = false,
        animationsEnabled = false
    )
    ```

---

### High Memory Usage

!!! bug "Symptom"
    App uses excessive memory or crashes with OutOfMemoryError.

**Solutions**:

=== "Enable Memory Management"

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

=== "Manage Lifecycle Properly"

    ```kotlin
    override fun onDestroy() {
        // Clean up resources
        navigationManager.destroy()
        locationTracker.stopTracking()
        sceneView.onDestroy()
        super.onDestroy()
    }
    ```

---

## <span class="emoji"> :material-shield-lock: </span> Permission Issues

### Permission Denied Permanently

!!! bug "Symptom"
    User denied permission and selected "Don't ask again".

**Solutions**:

=== "Show Settings Dialog"

    ```kotlin
    fun showPermissionSettingsDialog() {
        AlertDialog.Builder(this)
            .setTitle("Location Permission Required")
            .setMessage(
                "Navigation requires location permission. " +
                "Please enable it in app settings."
            )
            .setPositiveButton("Open Settings") { _, _ ->
                val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                intent.data = Uri.fromParts("package", packageName, null)
                startActivity(intent)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    ```

---

## <span class="emoji"> :material-hammer-wrench: </span> Build & Integration Issues

### Gradle Sync Failed

!!! bug "Error Message"
    ```
    Failed to resolve: com.machinestalk:indoornavigationengine:0.4.0-alpha
    ```

**Solutions**:

=== "Check Repository"

    ```kotlin
    // build.gradle (project level)
    allprojects {
        repositories {
            google()
            mavenCentral()
            // Add your repository here
        }
    }
    ```

=== "Verify Version"

    ```kotlin
    // Use correct version number
    dependencies {
        implementation("com.machinestalk:indoornavigationengine:0.4.0-alpha")
    }
    ```

---

### Java 17 Compilation Error

!!! bug "Error Message"
    ```
    Unsupported class file major version 61
    ```

**Solutions**:

```kotlin
// build.gradle (module level)
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

## <span class="emoji"> :material-alert-octagon: </span> Runtime Crashes

### NullPointerException

!!! bug "Common Locations"
    - Map data not loaded before use
    - Components not initialized
    - Missing null checks

**Solutions**:

```kotlin
// Always check for null
val mapData = JsonUtil.LoadJsonFromAsset(context, "maps/venue.json")
if (mapData == null) {
    Log.e("Error", "Failed to load map")
    return
}

sceneView.setMapData(mapData)
```

---

### OutOfMemoryError

!!! bug "Cause"
    Memory leak or excessive resource usage.

**Solutions**:

```kotlin
// Implement proper cleanup
override fun onDestroy() {
    navigationManager.destroy()
    locationTracker.stopTracking()
    sceneView.onDestroy()
    super.onDestroy()
}
```

---

## <span class="emoji"> :material-chat-question: </span> Still Need Help?

If you're still experiencing issues after trying these solutions:

<div class="grid cards" markdown>

-   :material-email:{ .lg .middle } **Contact Support**

    ---

    Get help from our technical support team

    [:octicons-arrow-right-24: Contact Us](contact_us.md)

-   :material-frequently-asked-questions:{ .lg .middle } **Check FAQ**

    ---

    Browse frequently asked questions

    [:octicons-arrow-right-24: View FAQ](faq.md)

-   :material-book-open-variant:{ .lg .middle } **Documentation**

    ---

    Explore comprehensive documentation

    [:octicons-arrow-right-24: Browse Docs](../getting_started/quick_start.md)

-   :material-bug:{ .lg .middle } **Report Bug**

    ---

    Submit a detailed bug report

    [:octicons-arrow-right-24: Report Issue](contact_us.md)

</div>

---

## <span class="emoji"> :material-lightbulb-on: </span> Debug Tips

### Enable Verbose Logging

```kotlin
// Enable detailed logging
if (BuildConfig.DEBUG) {
    MineLogger.setLogLevel(MineLogger.Level.VERBOSE)
    sceneView.showDebugOverlay = true
    sceneView.showFpsCounter = true
}
```

### Use LogCat Filters

```bash
# Filter by tag
adb logcat MINE:D *:S

# Filter by package
adb logcat | grep com.example.myapp
```

### Capture Debug Info

```kotlin
fun captureDebugInfo(): String {
    return buildString {
        appendLine("=== MINE Debug Info ===")
        appendLine("Version: ${BuildConfig.VERSION_NAME}")
        appendLine("Device: ${Build.MODEL}")
        appendLine("Android: ${Build.VERSION.RELEASE}")
        appendLine("Memory: ${getAvailableMemory()}MB")
        appendLine("Location providers: ${locationTracker.getActiveProviders()}")
        appendLine("Map loaded: ${sceneView.isMapLoaded()}")
        appendLine("Navigation active: ${navigationManager.isNavigating()}")
    }
}
```

---

!!! success "Problem Solved?"
    If these solutions helped, consider sharing your experience or contributing additional troubleshooting tips!

