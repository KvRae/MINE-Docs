
# <span class="emoji"> :material-cube-scan: </span> Usage Guide

Master the **MINE - Indoor Navigation Engine** with comprehensive usage examples, best practices, and advanced implementation patterns. This guide covers everything from basic setup to advanced customization.

!!! info "Prerequisites"
    Before diving into this guide, make sure you've completed:
    
    - ✅ [Installation](installation.md) - Library setup and configuration
    - ✅ [Quick Start](quick_start.md) - Basic implementation

---

## <span class="emoji"> :material-view-dashboard: </span> Overview

The Indoor Navigation Engine provides multiple approaches for integration:

<div class="grid cards" markdown>

-   :material-android:{ .lg .middle } **Traditional Views**

    ---

    Use XML layouts and Activities/Fragments for traditional Android development

-   :material-language-kotlin:{ .lg .middle } **Jetpack Compose**

    ---

    Modern declarative UI with Compose integration

-   :material-code-braces:{ .lg .middle } **Programmatic**

    ---

    Full programmatic control for dynamic use cases

</div>

Choose the approach that best fits your project architecture.

---

## <span class="emoji"> :material-file-document: </span> Working with Map Data

### Loading Map Configuration

The engine uses JSON configuration files to define map structure, floors, and metadata. Place your configuration file in the `assets` folder.

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    import com.machinestalk.indoornavigationengine.models.MapBuild
    import android.content.Context
    
    class MapDataManager(private val context: Context) {
        
        fun loadMapConfiguration(fileName: String): MapBuild? {
            return try {
                JsonUtil.LoadJsonFromAsset(context, fileName)
            } catch (e: Exception) {
                Log.e("MapDataManager", "Failed to load map: ${e.message}")
                null
            }
        }
        
        // Load with validation
        fun loadMapConfigurationSafe(fileName: String): Result<MapBuild> {
            return runCatching {
                val mapData = JsonUtil.LoadJsonFromAsset(context, fileName)
                    ?: throw IllegalStateException("Map data is null")
                
                // Validate map data
                require(mapData.floors.isNotEmpty()) { "Map must have at least one floor" }
                require(mapData.modelPath.isNotEmpty()) { "Model path cannot be empty" }
                
                mapData
            }
        }
    }
    ```

=== "Java"

    ```java
    import com.machinestalk.indoornavigationengine.util.JsonUtil;
    import com.machinestalk.indoornavigationengine.models.MapBuild;
    import android.content.Context;
    import android.util.Log;
    
    public class MapDataManager {
        
        private Context context;
        
        public MapDataManager(Context context) {
            this.context = context;
        }
        
        public MapBuild loadMapConfiguration(String fileName) {
            try {
                return JsonUtil.LoadJsonFromAsset(context, fileName);
            } catch (Exception e) {
                Log.e("MapDataManager", "Failed to load map: " + e.getMessage());
                return null;
            }
        }
        
        public boolean validateMapData(MapBuild mapData) {
            if (mapData == null) return false;
            if (mapData.getFloors().isEmpty()) return false;
            if (mapData.getModelPath().isEmpty()) return false;
            return true;
        }
    }
    ```

### Map Configuration Structure

Here's an example of a well-structured map configuration JSON:

```json
{
  "id": "shopping-mall-001",
  "name": "Grand Shopping Mall",
  "version": "1.0.0",
  "modelPath": "models/mall_floor_plan.glb",
  "floors": [
    {
      "id": "ground",
      "name": "Ground Floor",
      "level": 0,
      "defaultFloor": true,
      "bounds": {
        "minX": -50.0,
        "maxX": 50.0,
        "minY": -30.0,
        "maxY": 30.0
      }
    },
    {
      "id": "first",
      "name": "First Floor",
      "level": 1,
      "defaultFloor": false,
      "bounds": {
        "minX": -50.0,
        "maxX": 50.0,
        "minY": -30.0,
        "maxY": 30.0
      }
    }
  ],
  "pointsOfInterest": [
    {
      "id": "poi-001",
      "name": "Main Entrance",
      "floorId": "ground",
      "position": { "x": 0.0, "y": 0.0, "z": 0.0 },
      "category": "entrance"
    }
  ],
  "metadata": {
    "timezone": "UTC+3",
    "locale": "en_US"
  }
}
```

---

## <span class="emoji"> :material-android: </span> Traditional Android Views

### Using in Activities

=== "Kotlin"

    ```kotlin
    import android.os.Bundle
    import androidx.appcompat.app.AppCompatActivity
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    
    class MapActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialize scene view
            sceneView = MineSceneView(this).apply {
                // Load map data
                val mapData = JsonUtil.LoadJsonFromAsset(this@MapActivity, "maps/venue.json")
                mapData?.let { setMapData(it) }
            }
            
            setContentView(sceneView)
        }
        
        override fun onResume() {
            super.onResume()
            sceneView.onResume()
        }
        
        override fun onPause() {
            super.onPause()
            sceneView.onPause()
        }
        
        override fun onDestroy() {
            super.onDestroy()
            sceneView.onDestroy()
        }
    }
    ```

=== "XML Layout"

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <androidx.constraintlayout.widget.ConstraintLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        
        <com.machinestalk.indoornavigationengine.ui.MineSceneView
            android:id="@+id/sceneView"
            android:layout_width="0dp"
            android:layout_height="0dp"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintEnd_toEndOf="parent" />
        
        <!-- Floor selector -->
        <com.google.android.material.chip.ChipGroup
            android:id="@+id/floorSelector"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_margin="16dp"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:singleSelection="true" />
            
    </androidx.constraintlayout.widget.ConstraintLayout>
    ```

### Using in Fragments

=== "Kotlin"

    ```kotlin
    import android.os.Bundle
    import android.view.LayoutInflater
    import android.view.View
    import android.view.ViewGroup
    import androidx.fragment.app.Fragment
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    
    class MapFragment : Fragment() {
        
        private var sceneView: MineSceneView? = null
        
        override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
        ): View {
            sceneView = MineSceneView(requireContext()).apply {
                // Load map configuration
                val mapData = JsonUtil.LoadJsonFromAsset(
                    requireContext(), 
                    "maps/museum.json"
                )
                mapData?.let { setMapData(it) }
            }
            return sceneView!!
        }
        
        override fun onResume() {
            super.onResume()
            sceneView?.onResume()
        }
        
        override fun onPause() {
            super.onPause()
            sceneView?.onPause()
        }
        
        override fun onDestroyView() {
            super.onDestroyView()
            sceneView?.onDestroy()
            sceneView = null
        }
        
        companion object {
            fun newInstance() = MapFragment()
        }
    }
    ```

=== "Java"

    ```java
    import android.os.Bundle;
    import android.view.LayoutInflater;
    import android.view.View;
    import android.view.ViewGroup;
    import androidx.fragment.app.Fragment;
    import com.machinestalk.indoornavigationengine.ui.MineSceneView;
    import com.machinestalk.indoornavigationengine.util.JsonUtil;
    
    public class MapFragment extends Fragment {
        
        private MineSceneView sceneView;
        
        @Override
        public View onCreateView(LayoutInflater inflater, 
                                ViewGroup container,
                                Bundle savedInstanceState) {
            sceneView = new MineSceneView(requireContext());
            
            // Load map configuration
            MapBuild mapData = JsonUtil.LoadJsonFromAsset(
                requireContext(), 
                "maps/museum.json"
            );
            
            if (mapData != null) {
                sceneView.setMapData(mapData);
            }
            
            return sceneView;
        }
        
        @Override
        public void onResume() {
            super.onResume();
            if (sceneView != null) {
                sceneView.onResume();
            }
        }
        
        @Override
        public void onPause() {
            super.onPause();
            if (sceneView != null) {
                sceneView.onPause();
            }
        }
        
        @Override
        public void onDestroyView() {
            super.onDestroyView();
            if (sceneView != null) {
                sceneView.onDestroy();
                sceneView = null;
            }
        }
    }
    ```

---

## <span class="emoji"> :material-language-kotlin: </span> Jetpack Compose Integration

### Basic Compose Implementation

=== "Kotlin"

    ```kotlin
    import androidx.compose.runtime.*
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.platform.LocalContext
    import androidx.compose.ui.viewinterop.AndroidView
    import com.machinestalk.indoornavigationengine.ui.IndoorNavigationScene
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    
    @Composable
    fun MapScreen(
        mapConfigFile: String = "maps/venue.json",
        modifier: Modifier = Modifier
    ) {
        val context = LocalContext.current
        val mapData = remember {
            JsonUtil.LoadJsonFromAsset(context, mapConfigFile)
        }
        
        mapData?.let {
            IndoorNavigationScene(
                mapBuild = it,
                modifier = modifier
            )
        } ?: run {
            // Show error state
            ErrorLoadingMap()
        }
    }
    
    @Composable
    fun ErrorLoadingMap() {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text("Failed to load map", style = MaterialTheme.typography.h6)
        }
    }
    ```

### Advanced Compose with State Management

=== "Kotlin"

    ```kotlin
    import androidx.compose.foundation.layout.*
    import androidx.compose.material3.*
    import androidx.compose.runtime.*
    import androidx.compose.ui.Alignment
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.platform.LocalContext
    import androidx.compose.ui.unit.dp
    import androidx.lifecycle.ViewModel
    import androidx.lifecycle.viewmodel.compose.viewModel
    import com.machinestalk.indoornavigationengine.ui.IndoorNavigationScene
    import com.machinestalk.indoornavigationengine.models.MapBuild
    import com.machinestalk.indoornavigationengine.models.CameraConfig
    import com.machinestalk.indoornavigationengine.models.ThemeConfig
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    
    // ViewModel for map state
    class MapViewModel : ViewModel() {
        var currentFloor by mutableStateOf(0)
            private set
        
        var selectedPOI by mutableStateOf<String?>(null)
            private set
        
        fun selectFloor(floor: Int) {
            currentFloor = floor
        }
        
        fun selectPOI(poiId: String?) {
            selectedPOI = poiId
        }
    }
    
    @Composable
    fun AdvancedMapScreen(
        mapConfigFile: String = "maps/venue.json",
        viewModel: MapViewModel = viewModel()
    ) {
        val context = LocalContext.current
        
        // Load map data
        val mapData = remember {
            JsonUtil.LoadJsonFromAsset(context, mapConfigFile)
        }
        
        // Custom camera configuration
        val cameraConfig = remember {
            CameraConfig(
                initialPosition = floatArrayOf(0f, 15f, 15f),
                lookAt = floatArrayOf(0f, 0f, 0f),
                fov = 45f,
                near = 0.1f,
                far = 1000f
            )
        }
        
        // Custom theme
        val themeConfig = remember {
            ThemeConfig(
                primaryColor = 0xFF2196F3.toInt(),
                accentColor = 0xFFFF5722.toInt(),
                backgroundColor = 0xFFFFFFFF.toInt(),
                pathColor = 0xFF4CAF50.toInt()
            )
        }
        
        Box(modifier = Modifier.fillMaxSize()) {
            mapData?.let { data ->
                IndoorNavigationScene(
                    mapBuild = data,
                    cameraConfig = cameraConfig,
                    themeConfig = themeConfig,
                    currentFloor = viewModel.currentFloor,
                    onFloorChanged = { floor -> viewModel.selectFloor(floor) },
                    onPOISelected = { poiId -> viewModel.selectPOI(poiId) },
                    modifier = Modifier.fillMaxSize()
                )
                
                // Floor selector overlay
                FloorSelector(
                    floors = data.floors,
                    currentFloor = viewModel.currentFloor,
                    onFloorSelected = { viewModel.selectFloor(it) },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(16.dp)
                )
                
                // POI information card
                viewModel.selectedPOI?.let { poiId ->
                    POIInfoCard(
                        poiId = poiId,
                        onDismiss = { viewModel.selectPOI(null) },
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(16.dp)
                    )
                }
            }
        }
    }
    
    @Composable
    fun FloorSelector(
        floors: List<Floor>,
        currentFloor: Int,
        onFloorSelected: (Int) -> Unit,
        modifier: Modifier = Modifier
    ) {
        Card(
            modifier = modifier,
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(8.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                floors.forEachIndexed { index, floor ->
                    FilterChip(
                        selected = currentFloor == index,
                        onClick = { onFloorSelected(index) },
                        label = { Text(floor.name) }
                    )
                }
            }
        }
    }
    
    @Composable
    fun POIInfoCard(
        poiId: String,
        onDismiss: () -> Unit,
        modifier: Modifier = Modifier
    ) {
        Card(
            modifier = modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "Location Details",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "ID: $poiId",
                    style = MaterialTheme.typography.bodyMedium
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Close")
                    }
                    Button(
                        onClick = { /* Navigate to this POI */ },
                        modifier = Modifier.padding(start = 8.dp)
                    ) {
                        Text("Navigate Here")
                    }
                }
            }
        }
    }
    ```

---

## <span class="emoji"> :material-cog: </span> Advanced Configuration

### Custom Camera Setup

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.CameraConfig
    import com.machinestalk.indoornavigationengine.components.CameraController
    
    fun setupCustomCamera(sceneView: MineSceneView) {
        val cameraConfig = CameraConfig(
            // Initial camera position (x, y, z)
            initialPosition = floatArrayOf(10f, 20f, 30f),
            
            // Point camera is looking at
            lookAt = floatArrayOf(0f, 0f, 0f),
            
            // Field of view in degrees
            fov = 60f,
            
            // Near clipping plane
            near = 0.1f,
            
            // Far clipping plane
            far = 500f
        )
        
        sceneView.setCameraConfig(cameraConfig)
        
        // Advanced camera controller
        val cameraController = CameraController(sceneView).apply {
            // Set movement speed
            movementSpeed = 5.0f
            
            // Set rotation sensitivity
            rotationSensitivity = 0.5f
            
            // Enable smooth animations
            enableSmoothTransitions = true
            transitionDuration = 300 // milliseconds
        }
    }
    
    // Animate camera to specific location
    fun animateCameraToLocation(
        cameraController: CameraController,
        target: FloatArray
    ) {
        cameraController.animateTo(
            position = target,
            duration = 1000,
            onComplete = {
                Log.d("Camera", "Animation complete")
            }
        )
    }
    ```

### Custom Theme Configuration

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.ThemeConfig
    import android.graphics.Color
    
    fun createCustomTheme(): ThemeConfig {
        return ThemeConfig(
            // Primary brand color
            primaryColor = Color.parseColor("#2196F3"),
            
            // Accent color for highlights
            accentColor = Color.parseColor("#FF5722"),
            
            // Background color
            backgroundColor = Color.parseColor("#FAFAFA"),
            
            // Path/route color
            pathColor = Color.parseColor("#4CAF50"),
            
            // Path width in pixels
            pathWidth = 8f,
            
            // POI marker colors
            poiMarkerColor = Color.parseColor("#FFC107"),
            poiMarkerSize = 24f,
            
            // Text colors
            textPrimaryColor = Color.parseColor("#212121"),
            textSecondaryColor = Color.parseColor("#757575"),
            
            // Floor colors (different color per floor)
            floorColors = listOf(
                Color.parseColor("#E3F2FD"),
                Color.parseColor("#FFF3E0"),
                Color.parseColor("#F3E5F5")
            )
        )
    }
    
    // Apply theme to scene
    fun applyTheme(sceneView: MineSceneView, theme: ThemeConfig) {
        sceneView.setThemeConfig(theme)
    }
    ```

### Floor Management

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.Floor
    import com.machinestalk.indoornavigationengine.components.FloorManager
    
    class FloorNavigationManager(private val sceneView: MineSceneView) {
        
        private val floorManager = FloorManager(sceneView)
        
        fun switchToFloor(floorIndex: Int, animated: Boolean = true) {
            if (animated) {
                floorManager.switchToFloorAnimated(
                    floorIndex = floorIndex,
                    duration = 500,
                    onComplete = {
                        Log.d("Floor", "Switched to floor $floorIndex")
                    }
                )
            } else {
                floorManager.switchToFloor(floorIndex)
            }
        }
        
        fun getCurrentFloor(): Floor? {
            return floorManager.currentFloor
        }
        
        fun getFloorByLevel(level: Int): Floor? {
            return floorManager.getFloorByLevel(level)
        }
        
        fun getAllFloors(): List<Floor> {
            return floorManager.getAllFloors()
        }
        
        // Floor change listener
        fun setupFloorListener() {
            floorManager.setOnFloorChangedListener { oldFloor, newFloor ->
                Log.d("Floor", "Changed from ${oldFloor?.name} to ${newFloor?.name}")
            }
        }
    }
    ```

---

## <span class="emoji"> :material-navigation: </span> Navigation and Routing

### Path Finding

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.components.PathFinder
    import com.machinestalk.indoornavigationengine.models.Location
    import com.machinestalk.indoornavigationengine.models.Route
    
    class NavigationManager(private val sceneView: MineSceneView) {
        
        private val pathFinder = PathFinder(sceneView)
        
        fun findRoute(
            from: Location,
            to: Location,
            accessible: Boolean = false
        ): Route? {
            return pathFinder.findPath(
                start = from,
                end = to,
                accessibleOnly = accessible,
                onRouteCalculated = { route ->
                    // Display route on map
                    displayRoute(route)
                }
            )
        }
        
        fun displayRoute(route: Route) {
            sceneView.clearRoute() // Clear existing route
            sceneView.drawRoute(
                route = route,
                color = Color.BLUE,
                width = 8f,
                animated = true
            )
            
            // Add waypoint markers
            route.waypoints.forEach { waypoint ->
                sceneView.addMarker(
                    position = waypoint.position,
                    icon = R.drawable.ic_waypoint
                )
            }
        }
        
        fun startNavigation(route: Route) {
            sceneView.startNavigation(route) { step ->
                // Handle navigation step
                showNavigationInstruction(step)
            }
        }
        
        fun stopNavigation() {
            sceneView.stopNavigation()
            sceneView.clearRoute()
        }
    }
    ```

### Turn-by-Turn Instructions

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.NavigationStep
    
    fun showNavigationInstruction(step: NavigationStep) {
        val instruction = when (step.action) {
            NavigationStep.Action.TURN_LEFT -> "Turn left"
            NavigationStep.Action.TURN_RIGHT -> "Turn right"
            NavigationStep.Action.GO_STRAIGHT -> "Continue straight"
            NavigationStep.Action.ARRIVE -> "You have arrived"
            NavigationStep.Action.CHANGE_FLOOR -> {
                "Go to ${step.targetFloorName}"
            }
        }
        
        // Display in UI
        showNotification(
            title = instruction,
            message = step.description,
            distance = "${step.distanceToNext}m"
        )
    }
    ```

---

## <span class="emoji"> :material-map-marker: </span> Points of Interest (POI)

### Managing POIs

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.PointOfInterest
    import com.machinestalk.indoornavigationengine.components.POIManager
    
    class POIController(private val sceneView: MineSceneView) {
        
        private val poiManager = POIManager(sceneView)
        
        fun addPOI(
            id: String,
            name: String,
            position: FloatArray,
            floorId: String,
            category: String,
            iconRes: Int
        ) {
            val poi = PointOfInterest(
                id = id,
                name = name,
                position = position,
                floorId = floorId,
                category = category,
                metadata = mapOf(
                    "icon" to iconRes.toString()
                )
            )
            
            poiManager.addPOI(poi)
        }
        
        fun findNearbyPOIs(
            location: FloatArray,
            radius: Float,
            category: String? = null
        ): List<PointOfInterest> {
            return poiManager.findNearby(
                position = location,
                radius = radius,
                filterCategory = category
            )
        }
        
        fun highlightPOI(poiId: String) {
            poiManager.highlightPOI(
                poiId = poiId,
                color = Color.YELLOW,
                duration = 2000 // milliseconds
            )
        }
        
        fun setupPOIClickListener() {
            poiManager.setOnPOIClickListener { poi ->
                // Handle POI click
                showPOIDetails(poi)
            }
        }
    }
    ```

---

## <span class="emoji"> :material-speedometer: </span> Performance Optimization

### Best Practices

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.DisplayConfig
    
    fun optimizePerformance(sceneView: MineSceneView) {
        sceneView.apply {
            // Use appropriate render quality
            displayConfig = DisplayConfig(
                renderQuality = when {
                    isHighEndDevice() -> DisplayConfig.RenderQuality.HIGH
                    isMidRangeDevice() -> DisplayConfig.RenderQuality.MEDIUM
                    else -> DisplayConfig.RenderQuality.LOW
                },
                
                // Disable expensive features on low-end devices
                shadowsEnabled = isHighEndDevice(),
                ambientOcclusion = isHighEndDevice(),
                antiAliasing = !isLowEndDevice()
            )
            
            // Limit frame rate if needed
            maxFrameRate = 60
            
            // Enable culling
            enableFrustumCulling = true
            
            // LOD (Level of Detail) settings
            enableLOD = true
            lodDistances = floatArrayOf(10f, 25f, 50f)
        }
    }
    
    fun isHighEndDevice(): Boolean {
        val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        return activityManager.memoryClass >= 512
    }
    ```

### Memory Management

=== "Kotlin"

    ```kotlin
    class MemoryEfficientMapActivity : AppCompatActivity() {
        
        private var sceneView: MineSceneView? = null
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            sceneView = MineSceneView(this)
            setContentView(sceneView)
        }
        
        override fun onLowMemory() {
            super.onLowMemory()
            // Release non-essential resources
            sceneView?.apply {
                clearCache()
                reduceTextureQuality()
            }
        }
        
        override fun onTrimMemory(level: Int) {
            super.onTrimMemory(level)
            when (level) {
                ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW -> {
                    sceneView?.clearCache()
                }
                ComponentCallbacks2.TRIM_MEMORY_UI_HIDDEN -> {
                    sceneView?.onPause()
                }
            }
        }
        
        override fun onDestroy() {
            // Properly clean up
            sceneView?.onDestroy()
            sceneView = null
            super.onDestroy()
        }
    }
    ```

---

## <span class="emoji"> :material-bug: </span> Debugging and Logging

### Enable Debug Mode

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.util.MineLogger
    
    fun setupDebugging(sceneView: MineSceneView) {
        if (BuildConfig.DEBUG) {
            // Enable verbose logging
            MineLogger.setLogLevel(MineLogger.Level.VERBOSE)
            
            // Show FPS counter
            sceneView.showFpsCounter = true
            
            // Show debug overlay
            sceneView.showDebugOverlay = true
            
            // Enable wireframe mode
            sceneView.debugWireframe = false // Set true to see wireframes
            
            // Log render statistics
            sceneView.setOnRenderStatsListener { stats ->
                Log.d("Render", "FPS: ${stats.fps}, " +
                               "Draw calls: ${stats.drawCalls}, " +
                               "Triangles: ${stats.triangles}")
            }
        }
    }
    ```

---

## <span class="emoji"> :material-check-circle: </span> Complete Usage Example

Here's a comprehensive example bringing everything together:

=== "Kotlin (Complete)"

    ```kotlin
    package com.example.indoornavapp
    
    import android.os.Bundle
    import android.widget.Toast
    import androidx.appcompat.app.AppCompatActivity
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    import com.machinestalk.indoornavigationengine.models.*
    import com.machinestalk.indoornavigationengine.components.*
    
    class FullFeaturedMapActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        private lateinit var navigationManager: NavigationManager
        private lateinit var poiController: POIController
        private lateinit var floorManager: FloorNavigationManager
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialize scene
            setupScene()
            
            // Load map data
            loadMapData()
            
            // Setup components
            setupComponents()
            
            // Configure interactions
            setupInteractions()
        }
        
        private fun setupScene() {
            sceneView = MineSceneView(this).apply {
                // Configure display
                displayConfig = DisplayConfig(
                    renderQuality = DisplayConfig.RenderQuality.HIGH,
                    antiAliasing = true,
                    shadowsEnabled = true
                )
                
                // Set custom theme
                setThemeConfig(createCustomTheme())
                
                // Configure camera
                setCameraConfig(CameraConfig(
                    initialPosition = floatArrayOf(0f, 20f, 20f),
                    lookAt = floatArrayOf(0f, 0f, 0f),
                    fov = 55f
                ))
            }
            
            setContentView(sceneView)
        }
        
        private fun loadMapData() {
            val mapData = JsonUtil.LoadJsonFromAsset(this, "maps/venue.json")
            
            mapData?.let {
                sceneView.setMapData(it)
                Toast.makeText(this, "Map loaded successfully", Toast.LENGTH_SHORT).show()
            } ?: run {
                Toast.makeText(this, "Failed to load map", Toast.LENGTH_LONG).show()
            }
        }
        
        private fun setupComponents() {
            navigationManager = NavigationManager(sceneView)
            poiController = POIController(sceneView)
            floorManager = FloorNavigationManager(sceneView)
            
            // Setup POI click handling
            poiController.setupPOIClickListener()
            
            // Setup floor change listener
            floorManager.setupFloorListener()
        }
        
        private fun setupInteractions() {
            val gestureHandler = GestureHandler(sceneView).apply {
                isPanEnabled = true
                isZoomEnabled = true
                isRotationEnabled = true
                
                setOnGestureListener(object : GestureHandler.OnGestureListener {
                    override fun onSingleTap(x: Float, y: Float) {
                        handleMapTap(x, y)
                    }
                })
            }
        }
        
        private fun handleMapTap(x: Float, y: Float) {
            sceneView.hitTest(x, y) { result ->
                result?.let {
                    // User tapped on a location
                    showLocationOptions(it)
                }
            }
        }
        
        private fun createCustomTheme() = ThemeConfig(
            primaryColor = getColor(R.color.primary),
            accentColor = getColor(R.color.accent),
            pathColor = getColor(R.color.path),
            backgroundColor = getColor(R.color.background)
        )
        
        override fun onResume() {
            super.onResume()
            sceneView.onResume()
        }
        
        override fun onPause() {
            super.onPause()
            sceneView.onPause()
        }
        
        override fun onDestroy() {
            super.onDestroy()
            sceneView.onDestroy()
        }
    }
    ```

---

## <span class="emoji"> :material-arrow-right-circle: </span> Next Steps

<div class="grid cards" markdown>

-   :material-map-marker-path:{ .lg .middle } **Navigation Features**

    ---

    Implement advanced routing and turn-by-turn navigation

    [:octicons-arrow-right-24: Learn More](../features/navigation.md)

-   :material-palette:{ .lg .middle } **Theme Customization**

    ---

    Create beautiful custom themes for your maps

    [:octicons-arrow-right-24: Customize](../features/theme_customization.md)

-   :material-widgets:{ .lg .middle } **UI Components**

    ---

    Add pre-built UI components to enhance user experience

    [:octicons-arrow-right-24: Explore Components](../features/ui_components.md)

-   :material-api:{ .lg .middle } **API Reference**

    ---

    Deep dive into the complete API documentation

    [:octicons-arrow-right-24: API Docs](../api_reference/module_overview.md)

</div>

---

## <span class="emoji"> :material-frequently-asked-questions: </span> Common Questions

??? question "How do I handle multiple maps in one app?"
    Create separate `MineSceneView` instances for each map, or reuse a single instance and call `setMapData()` with different configurations when switching maps.

??? question "Can I use this library with other 3D rendering libraries?"
    The Indoor Navigation Engine uses Filament for rendering. While you can use other libraries in your app, the map rendering is handled exclusively by the engine.

??? question "How do I optimize for battery life?"
    Reduce render quality, disable shadows and ambient occlusion, lower the frame rate, and pause rendering when the app is in the background.

??? question "Can I load maps from a remote server?"
    Yes! Use `mapLoader.loadFromUrl()` to fetch map data from a remote endpoint. Make sure to handle network errors and implement appropriate caching.

---

## <span class="emoji"> :material-book-open: </span> Additional Resources

- 📖 [API Reference](../api_reference/module_overview.md) - Complete API documentation
- 🎯 [Features Overview](../features/features_overview.md) - All available features
- 🐛 [Troubleshooting](../support/troubleshooting.md) - Common issues and solutions
- 💬 [FAQ](../support/faq.md) - Frequently asked questions
- 📧 [Support](../support/contact_us.md) - Get help from our team

!!! success "You're All Set!"
    You now have comprehensive knowledge of how to use the Indoor Navigation Engine. Start building amazing indoor navigation experiences!



