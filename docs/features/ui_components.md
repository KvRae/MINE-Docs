# <span class="emoji"> :material-material-design: </span> UI Components

## Overview

The **MINE Indoor Navigation Engine** provides a comprehensive suite of pre-built, customizable UI components designed to accelerate development and deliver exceptional user experiences. Each component is carefully crafted to be intuitive, accessible, and seamlessly integrated with the navigation engine's core features.

!!! abstract "Key Features"
    - 🎨 **Pre-built Components**: Ready-to-use UI elements for common navigation scenarios
    - 🔧 **Fully Customizable**: Extensive styling and behavior customization options
    - 📱 **Responsive Design**: Adapts to different screen sizes and orientations
    - ♿ **Accessible**: WCAG 2.1 compliant with screen reader support
    - 🎭 **Theme Support**: Automatic light/dark mode with custom theme integration
    - 🚀 **Performance Optimized**: Efficient rendering and minimal overhead

---

## Component Architecture

The UI component hierarchy is organized for maximum flexibility and reusability:

<div style="text-align: center;">
  <figure style="width: 100%; margin: auto;">
``` mermaid
graph TB
    A[Map Scene Layout] --> B[Indoor Navigation Scene]
    A ---> D[UI Utils]
    D --> E[Top Search Bars]
    E --> F[SearchBarDropdown]
    E --> G[SearchBarLayout]
    D --> H[Navigation Bar]
    H --> I[Bottom Navigation Bar]
    D --> J[Bottom Sheets]
    J --> K[Map Info Bottom Sheet]
    J --> L[POI Bottom Sheet]
    J --> M[Saved Locations Bottom Sheet]
    D --> N[Floating Buttons]
    N --> O[Current Location Button]
    N --> P[Map Mode Switch Button]
    
```
<figcaption>UI Components Hierarchy</figcaption>
  </figure>
</div>

!!! tip "Component Organization"
    All UI components are built with Jetpack Compose, providing declarative syntax, state management, and seamless Material Design 3 integration.

---

## Map Scene Layout

[:octicons-link-external-24: API Reference](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-scene-layout.html)

The **Map Scene Layout** is the top-level container that orchestrates all navigation UI components. It combines the indoor navigation scene with search bars, bottom sheets, floating action buttons, and navigation controls to create a complete navigation interface.

### Features

- 🗺️ **Complete Layout**: All-in-one container for navigation UI
- 🎯 **Automatic Coordination**: Components automatically communicate and update
- 📐 **Responsive Layout**: Adapts to different screen sizes and orientations
- 🎨 **Theme Integration**: Respects app theme and customizations
- 🔄 **State Management**: Built-in state handling for all child components

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mapUrl` | String | Required | Path to map JSON file |
| `theme` | MapColorTheme | Default | Custom theme configuration |
| `showSearchBar` | Boolean | `true` | Show/hide search functionality |
| `showBottomSheet` | Boolean | `true` | Show/hide bottom sheet |
| `showFloatingButtons` | Boolean | `true` | Show/hide FAB controls |
| `enableNavigation` | Boolean | `true` | Enable navigation features |
| `onNavigationStart` | `() -> Unit` | `null` | Navigation start callback |
| `onNavigationComplete` | `() -> Unit` | `null` | Navigation complete callback |

### Basic Implementation

```kotlin
import androidx.compose.runtime.*
import com.machinestalk.indoornavigationengine.ui.MapSceneLayout
import com.machinestalk.indoornavigationengine.models.MapColorTheme

@Composable
fun NavigationScreen() {
    var selectedPOI by remember { mutableStateOf<POI?>(null) }
    var isNavigating by remember { mutableStateOf(false) }
    
    MapSceneLayout(
        mapUrl = "maps/shopping_mall.json",
        theme = MapColorTheme.default(),
        showSearchBar = true,
        showBottomSheet = true,
        showFloatingButtons = true,
        enableNavigation = true,
        onPOISelected = { poi ->
            selectedPOI = poi
        },
        onNavigationStart = {
            isNavigating = true
        },
        onNavigationComplete = {
            isNavigating = false
            showCompletionDialog()
        }
    )
}
```

### Advanced Customization

```kotlin
@Composable
fun CustomNavigationScreen() {
    val navController = rememberNavigationController()
    val mapState = rememberMapState()
    
    MapSceneLayout(
        mapUrl = "maps/venue.json",
        theme = createCustomTheme(),
        showSearchBar = true,
        showBottomSheet = true,
        showFloatingButtons = true,
        
        // Custom search configuration
        searchConfig = SearchConfig(
            placeholder = "Search locations...",
            showRecentSearches = true,
            maxRecentItems = 5,
            categories = listOf("Restaurants", "Shops", "Services")
        ),
        
        // Custom bottom sheet configuration
        bottomSheetConfig = BottomSheetConfig(
            peekHeight = 120.dp,
            expandable = true,
            dismissible = true
        ),
        
        // Custom FAB configuration
        fabConfig = FABConfig(
            position = FABPosition.BOTTOM_END,
            showCurrentLocation = true,
            showMapModeSwitch = true,
            customActions = listOf(
                FABAction(
                    icon = Icons.Default.Bookmark,
                    label = "Saved Locations",
                    onClick = { navController.navigate("saved") }
                )
            )
        ),
        
        // Event handlers
        onMapReady = { mapView ->
            // Map is loaded and ready
            mapView.animateCamera(CameraPosition.DEFAULT)
        },
        onPOISelected = { poi ->
            // Handle POI selection
            showPOIDetails(poi)
        },
        onRouteCalculated = { route ->
            // Route calculation complete
            displayRouteInfo(route)
        },
        onNavigationUpdate = { update ->
            // Navigation progress update
            updateNavigationUI(update)
        },
        onError = { error ->
            // Handle errors
            showErrorDialog(error)
        }
    )
}
```

### State Management

```kotlin
@Composable
fun StatefulNavigationScreen() {
    val mapSceneState = rememberMapSceneState(
        initialMapUrl = "maps/venue.json",
        initialFloor = 1
    )
    
    LaunchedEffect(mapSceneState.currentFloor) {
        // React to floor changes
        loadFloorPOIs(mapSceneState.currentFloor)
    }
    
    MapSceneLayout(
        state = mapSceneState,
        onStateChange = { newState ->
            // Handle state changes
            when (newState) {
                is MapSceneState.MapLoaded -> {
                    // Map successfully loaded
                }
                is MapSceneState.NavigationActive -> {
                    // Navigation started
                }
                is MapSceneState.Error -> {
                    // Error occurred
                }
            }
        }
    )
}
```

---

## Indoor Navigation Scene

[:octicons-link-external-24: API Reference](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-indoor-navigation-scene.html)

The **Indoor Navigation Scene** is the core 3D/2D rendering component that displays the indoor map, handles user interactions, and visualizes navigation paths. It leverages SceneView for high-performance rendering.

### Features

- 🗺️ **3D/2D Rendering**: Switch between 3D perspective and 2D top-down views
- 🎯 **Interactive Map**: Pan, zoom, rotate, and tap gestures
- 🚶 **Real-time Positioning**: Display user location with accuracy indicator
- 📍 **POI Visualization**: Render and interact with points of interest
- 🛤️ **Route Display**: Visualize navigation paths with animations
- 🏢 **Multi-floor Support**: Handle complex multi-level buildings

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mapData` | IndoorMap | Required | Parsed map data object |
| `viewMode` | ViewMode | `3D` | Initial view mode (3D/2D) |
| `enableGestures` | Boolean | `true` | Enable user interaction |
| `showUserLocation` | Boolean | `true` | Display user marker |
| `showPOIs` | Boolean | `true` | Show POI markers |
| `cameraPosition` | CameraPosition | Default | Initial camera position |
| `theme` | MapColorTheme | Default | Visual theme |

### Basic Usage

```kotlin
import com.machinestalk.indoornavigationengine.ui.IndoorNavigationScene
import com.machinestalk.indoornavigationengine.models.ViewMode

@Composable
fun MapViewer(mapData: IndoorMap) {
    var viewMode by remember { mutableStateOf(ViewMode.MODE_3D) }
    var selectedPOI by remember { mutableStateOf<POI?>(null) }
    
    IndoorNavigationScene(
        mapData = mapData,
        viewMode = viewMode,
        enableGestures = true,
        showUserLocation = true,
        showPOIs = true,
        
        // Camera configuration
        cameraPosition = CameraPosition(
            target = Vector3(0f, 0f, 0f),
            zoom = 1.0f,
            tilt = 45f,
            bearing = 0f
        ),
        
        // Event handlers
        onPOIClick = { poi ->
            selectedPOI = poi
            showPOIDetails(poi)
        },
        onMapClick = { position ->
            // Handle map tap
            Log.d("Map", "Clicked at: $position")
        },
        onCameraMove = { camera ->
            // Camera position changed
            updateCameraUI(camera)
        }
    )
}
```

### Advanced Scene Configuration

```kotlin
@Composable
fun AdvancedNavigationScene() {
    val sceneController = rememberSceneController()
    var currentFloor by remember { mutableStateOf(1) }
    var navigationRoute by remember { mutableStateOf<Route?>(null) }
    
    IndoorNavigationScene(
        mapData = loadedMap,
        viewMode = ViewMode.MODE_3D,
        
        // Scene configuration
        sceneConfig = SceneConfig(
            enableShadows = true,
            enableAmbientOcclusion = true,
            antialiasingMode = AntialiasingMode.FXAA,
            msaaSampleCount = 4,
            hdrEnabled = true,
            bloomEnabled = true
        ),
        
        // Rendering options
        renderingOptions = RenderingOptions(
            maxFPS = 60,
            lodEnabled = true,
            frustumCullingEnabled = true,
            occlusionCullingEnabled = true
        ),
        
        // User location configuration
        userLocationConfig = UserLocationConfig(
            markerSize = 24.dp,
            showAccuracyCircle = true,
            showHeadingIndicator = true,
            animateMovement = true,
            smoothingFactor = 0.7f
        ),
        
        // POI configuration
        poiConfig = POIConfig(
            defaultMarkerSize = 32.dp,
            clusteringEnabled = true,
            clusterRadius = 50.dp,
            showLabels = true,
            labelMinZoom = 0.5f
        ),
        
        // Navigation path configuration
        pathConfig = PathConfig(
            pathWidth = 4.dp,
            pathColor = Color.Blue,
            animatedPath = true,
            showDirectionArrows = true,
            arrowSpacing = 10f
        ),
        
        // Floor control
        currentFloor = currentFloor,
        onFloorChange = { floor ->
            currentFloor = floor
            sceneController.animateToFloor(floor)
        },
        
        // Navigation route
        route = navigationRoute,
        onRouteUpdate = { updatedRoute ->
            navigationRoute = updatedRoute
        }
    )
}
```

### Camera Control

```kotlin
@Composable
fun CameraControlledScene() {
    val sceneController = rememberSceneController()
    
    Column {
        IndoorNavigationScene(
            mapData = mapData,
            controller = sceneController
        )
        
        // Camera control buttons
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            // Zoom controls
            IconButton(onClick = { sceneController.zoomIn() }) {
                Icon(Icons.Default.ZoomIn, "Zoom In")
            }
            IconButton(onClick = { sceneController.zoomOut() }) {
                Icon(Icons.Default.ZoomOut, "Zoom Out")
            }
            
            // View mode toggle
            IconButton(onClick = { sceneController.toggleViewMode() }) {
                Icon(Icons.Default.ThreeDRotation, "Toggle 3D/2D")
            }
            
            // Reset camera
            IconButton(onClick = { sceneController.resetCamera() }) {
                Icon(Icons.Default.CenterFocusWeak, "Reset View")
            }
            
            // Focus on user
            IconButton(onClick = { sceneController.focusOnUser() }) {
                Icon(Icons.Default.MyLocation, "My Location")
            }
        }
    }
}

// Scene controller implementation
@Composable
fun rememberSceneController(): SceneController {
    return remember {
        SceneController()
    }
}

class SceneController {
    private var sceneView: SceneView? = null
    
    fun attachScene(view: SceneView) {
        sceneView = view
    }
    
    fun zoomIn() {
        sceneView?.animateZoom(delta = 0.2f, duration = 300)
    }
    
    fun zoomOut() {
        sceneView?.animateZoom(delta = -0.2f, duration = 300)
    }
    
    fun toggleViewMode() {
        sceneView?.toggleViewMode(animated = true)
    }
    
    fun resetCamera() {
        sceneView?.animateCameraToDefault(duration = 500)
    }
    
    fun focusOnUser() {
        sceneView?.animateCameraToUser(
            zoom = 1.5f,
            duration = 500
        )
    }
    
    fun animateToFloor(floor: Int) {
        sceneView?.animateToFloor(
            floor = floor,
            duration = 800
        )
    }
    
    fun animateToPOI(poi: POI) {
        sceneView?.animateCameraToPOI(
            poi = poi,
            zoom = 1.2f,
            duration = 600
        )
    }
}
```

### Performance Optimization

```kotlin
@Composable
fun OptimizedNavigationScene() {
    var viewMode by remember { mutableStateOf(ViewMode.MODE_3D) }
    
    // Use LazyColumn for POI list outside the scene
    val visiblePOIs = remember { mutableStateListOf<POI>() }
    
    DisposableEffect(Unit) {
        // Cleanup when leaving
        onDispose {
            // Release resources
        }
    }
    
    IndoorNavigationScene(
        mapData = mapData,
        viewMode = viewMode,
        
        // Performance optimizations
        performanceConfig = PerformanceConfig(
            // Use LOD (Level of Detail) for models
            lodEnabled = true,
            lodDistances = listOf(10f, 50f, 100f),
            
            // Limit rendering
            maxVisiblePOIs = 50,
            poiCullingEnabled = true,
            
            // Reduce quality on low-end devices
            adaptiveQuality = true,
            minFPS = 30,
            
            // Memory management
            textureCompression = true,
            maxMemoryUsage = 200 * 1024 * 1024 // 200 MB
        ),
        
        // Only render visible POIs
        visiblePOIs = visiblePOIs,
        onVisiblePOIsChange = { pois ->
            visiblePOIs.clear()
            visiblePOIs.addAll(pois)
        }
    )
}
```

---

## Bottom Navigation Bar (Floor Selector)

[:octicons-link-external-24: API Reference](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-bottom-navigation-bar.html)

The **Bottom Navigation Bar** serves as a floor selector, allowing users to switch between different floors of a building. It provides an intuitive interface for multi-level navigation.

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/282d63e2-2379-4400-bf54-bf3805554295" alt="Floor Selector" loading="lazy"/>
</p>

### Features

- 🏢 **Multi-floor Support**: Display and navigate between building floors
- 🎯 **Current Floor Indicator**: Highlight the active floor
- 📊 **Floor Information**: Show floor names and levels
- ⚡ **Quick Navigation**: One-tap floor switching
- 🎨 **Customizable**: Theme and style options

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `floors` | List<Floor> | Required | List of building floors |
| `currentFloor` | Int | `0` | Currently selected floor |
| `onFloorSelected` | `(Int) -> Unit` | Required | Floor selection callback |
| `orientation` | Orientation | `Horizontal` | Layout orientation |
| `showFloorNames` | Boolean | `true` | Display floor names |
| `animateTransitions` | Boolean | `true` | Animate floor changes |

### Basic Implementation

```kotlin
import com.machinestalk.indoornavigationengine.ui.BottomNavigationBar
import com.machinestalk.indoornavigationengine.models.Floor

@Composable
fun FloorNavigationExample() {
    var currentFloor by remember { mutableStateOf(0) }
    
    val floors = remember {
        listOf(
            Floor(id = "f0", level = 0, name = "Ground Floor"),
            Floor(id = "f1", level = 1, name = "First Floor"),
            Floor(id = "f2", level = 2, name = "Second Floor"),
            Floor(id = "f3", level = 3, name = "Third Floor")
        )
    }
    
    Scaffold(
        bottomBar = {
            BottomNavigationBar(
                floors = floors,
                currentFloor = currentFloor,
                onFloorSelected = { floorIndex ->
                    currentFloor = floorIndex
                    // Update map to show selected floor
                    sceneView.switchToFloor(floors[floorIndex])
                }
            )
        }
    ) { paddingValues ->
        // Map content
        IndoorNavigationScene(
            modifier = Modifier.padding(paddingValues),
            currentFloor = floors[currentFloor]
        )
    }
}
```

### Custom Styling

```kotlin
@Composable
fun StyledFloorSelector() {
    var currentFloor by remember { mutableStateOf(0) }
    
    BottomNavigationBar(
        floors = buildingFloors,
        currentFloor = currentFloor,
        onFloorSelected = { currentFloor = it },
        
        // Custom styling
        style = FloorSelectorStyle(
            backgroundColor = MaterialTheme.colorScheme.surface,
            selectedColor = MaterialTheme.colorScheme.primary,
            unselectedColor = MaterialTheme.colorScheme.onSurfaceVariant,
            indicatorColor = MaterialTheme.colorScheme.primary,
            elevation = 8.dp,
            cornerRadius = 16.dp,
            itemPadding = 12.dp,
            fontSize = 14.sp
        ),
        
        // Show additional info
        showFloorNames = true,
        showFloorCount = true,
        
        // Animation configuration
        animateTransitions = true,
        transitionDuration = 300
    )
}
```

### Vertical Floor Selector

```kotlin
@Composable
fun VerticalFloorSelector() {
    var currentFloor by remember { mutableStateOf(0) }
    
    Row {
        // Vertical floor selector on the side
        BottomNavigationBar(
            floors = buildingFloors,
            currentFloor = currentFloor,
            onFloorSelected = { currentFloor = it },
            orientation = Orientation.VERTICAL,
            modifier = Modifier
                .fillMaxHeight()
                .width(80.dp)
        )
        
        // Map takes remaining space
        IndoorNavigationScene(
            modifier = Modifier.weight(1f),
            currentFloor = buildingFloors[currentFloor]
        )
    }
}
```

### Advanced Floor Navigation

```kotlin
@Composable
fun AdvancedFloorNavigation() {
    var currentFloor by remember { mutableStateOf(0) }
    val floors = remember { loadFloors() }
    
    // Track floor history for back navigation
    val floorHistory = remember { mutableListOf(0) }
    
    BottomNavigationBar(
        floors = floors,
        currentFloor = currentFloor,
        onFloorSelected = { newFloor ->
            if (newFloor != currentFloor) {
                floorHistory.add(currentFloor)
                currentFloor = newFloor
                
                // Animate camera to new floor
                animateFloorTransition(
                    from = floors[floorHistory.last()],
                    to = floors[newFloor]
                )
            }
        },
        
        // Additional controls
        additionalActions = {
            // Floor info button
            IconButton(onClick = { showFloorInfo(floors[currentFloor]) }) {
                Icon(Icons.Default.Info, "Floor Info")
            }
            
            // Quick access to specific areas
            IconButton(onClick = { showQuickAccess() }) {
                Icon(Icons.Default.Bookmarks, "Quick Access")
            }
        },
        
        // Long press for floor details
        onFloorLongPress = { floor ->
            showFloorDetailsDialog(floor)
        }
    )
}
```


---

## Bottom Sheets

Bottom sheets provide contextual information and actions in a slide-up panel that doesn't obscure the map view.

### Map Scene Bottom Sheet

[:octicons-link-external-24: API Reference](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-scene-bottom-sheet.html)

Displays general map information and provides quick access to venue details and navigation controls.

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/24492e3e-8950-4959-ad7b-0536cfc27605" alt="Map Info Bottom Sheet" loading="lazy"/>
</p>

#### Features

- 📋 **Venue Information**: Building name, address, and details
- 🔍 **Quick Actions**: Search, navigate, and explore options
- 📊 **Map Statistics**: Floor count, POI count, area size
- 🎯 **Contextual Actions**: Based on current location and state

#### Implementation

```kotlin
import com.machinestalk.indoornavigationengine.ui.MapSceneBottomSheet

@Composable
fun MapInfoSheet() {
    var sheetState by remember { mutableStateOf(BottomSheetValue.Collapsed) }
    
    MapSceneBottomSheet(
        sheetState = rememberBottomSheetState(
            initialValue = BottomSheetValue.Collapsed
        ),
        peekHeight = 120.dp,
        
        // Venue information
        venueName = "Shopping Mall XYZ",
        venueAddress = "123 Main Street, City",
        venueDescription = "Premier shopping destination",
        
        // Statistics
        totalFloors = 4,
        totalPOIs = 156,
        totalArea = "50,000 sq ft",
        
        // Quick actions
        actions = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                ActionButton(
                    icon = Icons.Default.Search,
                    label = "Search",
                    onClick = { showSearch() }
                )
                ActionButton(
                    icon = Icons.Default.Directions,
                    label = "Navigate",
                    onClick = { startNavigation() }
                )
                ActionButton(
                    icon = Icons.Default.Info,
                    label = "About",
                    onClick = { showVenueInfo() }
                )
            }
        },
        
        // Content sections
        content = {
            LazyColumn {
                item {
                    // Recently searched
                    SectionHeader("Recent Searches")
                    RecentSearchesList()
                }
                item {
                    // Popular destinations
                    SectionHeader("Popular Destinations")
                    PopularPOIsList()
                }
                item {
                    // Announcements
                    SectionHeader("Announcements")
                    AnnouncementsList()
                }
            }
        }
    )
}
```

### Building Sheet

[:octicons-link-external-24: API Reference](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-scene-bottom-sheet.html)

Provides detailed information about the current building and floor, including POI categories and amenities.

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/37bca2d0-2bdd-4b69-a549-d7296f38ccfd" alt="Building Sheet" loading="lazy"/>
</p>

#### Features

- 🏢 **Building Details**: Name, description, hours of operation
- 📍 **Floor Information**: Current floor details and amenities
- 🗂️ **POI Categories**: Browse by category (restaurants, shops, etc.)
- 🚻 **Amenities**: Restrooms, elevators, exits, and services

#### Implementation

```kotlin
@Composable
fun BuildingDetailsSheet(building: Building, currentFloor: Floor) {
    BuildingSheet(
        building = building,
        currentFloor = currentFloor,
        
        // Building information
        content = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                // Building header
                Text(
                    text = building.name,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Operating hours
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Schedule, "Hours")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Open: ${building.openingHours}")
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Floor information
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    elevation = CardDefaults.cardElevation(4.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Current Floor: ${currentFloor.name}",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = "Level ${currentFloor.level}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // POI Categories
                Text(
                    text = "Categories",
                    style = MaterialTheme.typography.titleLarge
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(building.categories) { category ->
                        CategoryChip(
                            category = category,
                            onClick = { browseCategory(category) }
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Amenities
                Text(
                    text = "Amenities",
                    style = MaterialTheme.typography.titleLarge
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AmenityChip(
                        icon = Icons.Default.Wc,
                        label = "Restrooms",
                        count = currentFloor.restroomCount
                    )
                    AmenityChip(
                        icon = Icons.Default.Elevator,
                        label = "Elevators",
                        count = currentFloor.elevatorCount
                    )
                    AmenityChip(
                        icon = Icons.Default.ExitToApp,
                        label = "Exits",
                        count = currentFloor.exitCount
                    )
                    AmenityChip(
                        icon = Icons.Default.Accessible,
                        label = "Accessible",
                        enabled = currentFloor.isAccessible
                    )
                }
            }
        }
    )
}
```

### POI Details Sheet

[:octicons-link-external-24: API Reference](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-poi-details-sheet-content.html)

Displays detailed information about a selected point of interest with navigation options.

#### Features

- 📍 **POI Details**: Name, description, category, and location
- 📞 **Contact Information**: Phone, email, and website
- ⏰ **Opening Hours**: Operating hours and current status
- 🧭 **Navigation**: Start navigation to POI
- ⭐ **Actions**: Save, share, and report

#### Implementation

```kotlin
@Composable
fun POIDetailsSheet(poi: POI) {
    var isSaved by remember { mutableStateOf(poi.isSaved) }
    
    POISheet(
        poi = poi,
        onDismiss = { /* Handle dismiss */ },
        
        content = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                // POI Image
                if (poi.imageUrl != null) {
                    AsyncImage(
                        model = poi.imageUrl,
                        contentDescription = poi.name,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .clip(RoundedCornerShape(12.dp)),
                        contentScale = ContentScale.Crop
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                }
                
                // POI Name and Category
                Text(
                    text = poi.name,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = getCategoryIcon(poi.category),
                        contentDescription = poi.category,
                        modifier = Modifier.size(20.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = poi.category,
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Description
                if (poi.description != null) {
                    Text(
                        text = poi.description,
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                }
                
                // Operating Hours
                if (poi.openingHours != null) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = if (poi.isCurrentlyOpen) {
                                MaterialTheme.colorScheme.primaryContainer
                            } else {
                                MaterialTheme.colorScheme.errorContainer
                            }
                        )
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Schedule, "Hours")
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = if (poi.isCurrentlyOpen) "Open Now" else "Closed",
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = poi.openingHours,
                                    style = MaterialTheme.typography.bodySmall
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }
                
                // Contact Information
                if (poi.phone != null || poi.email != null || poi.website != null) {
                    Text(
                        text = "Contact",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    poi.phone?.let { phone ->
                        ContactRow(
                            icon = Icons.Default.Phone,
                            label = "Phone",
                            value = phone,
                            onClick = { dialPhone(phone) }
                        )
                    }
                    
                    poi.email?.let { email ->
                        ContactRow(
                            icon = Icons.Default.Email,
                            label = "Email",
                            value = email,
                            onClick = { sendEmail(email) }
                        )
                    }
                    
                    poi.website?.let { website ->
                        ContactRow(
                            icon = Icons.Default.Language,
                            label = "Website",
                            value = website,
                            onClick = { openWebsite(website) }
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                }
                
                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Navigate button
                    Button(
                        onClick = { navigateToPOI(poi) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Directions, "Navigate")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Navigate")
                    }
                    
                    // Save button
                    OutlinedButton(
                        onClick = {
                            isSaved = !isSaved
                            toggleSavePOI(poi)
                        }
                    ) {
                        Icon(
                            imageVector = if (isSaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                            contentDescription = if (isSaved) "Saved" else "Save"
                        )
                    }
                    
                    // Share button
                    OutlinedButton(onClick = { sharePOI(poi) }) {
                        Icon(Icons.Default.Share, "Share")
                    }
                }
            }
        }
    )
}

@Composable
fun ContactRow(
    icon: ImageVector,
    label: String,
    value: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            modifier = Modifier.size(24.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = value,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}
```

### Saved Locations Sheet

[:octicons-link-external-24: API Reference](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-saved-loc-sheet-content.html)

Manages user's saved locations and favorite POIs for quick access.

#### Features

- 📚 **Saved POIs**: View all bookmarked locations
- 🗂️ **Categories**: Organize saved locations
- 🔍 **Search**: Find saved locations quickly
- ✏️ **Edit**: Rename and organize saved items
- 🧭 **Quick Navigate**: One-tap navigation to saved locations

#### Implementation

```kotlin
@Composable
fun SavedLocationsSheet() {
    var savedLocations by remember { mutableStateOf(loadSavedLocations()) }
    var searchQuery by remember { mutableStateOf("") }
    
    SavedLocationsSheet(
        locations = savedLocations,
        onLocationSelected = { location ->
            navigateToLocation(location)
        },
        
        content = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Saved Locations",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${savedLocations.size} saved",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Search bar
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Search saved locations...") },
                    leadingIcon = {
                        Icon(Icons.Default.Search, "Search")
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Close, "Clear")
                            }
                        }
                    },
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Saved locations list
                if (savedLocations.isEmpty()) {
                    EmptyState(
                        icon = Icons.Default.BookmarkBorder,
                        title = "No saved locations",
                        description = "Tap the bookmark icon on any POI to save it here"
                    )
                } else {
                    val filteredLocations = savedLocations.filter {
                        it.name.contains(searchQuery, ignoreCase = true)
                    }
                    
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(filteredLocations) { location ->
                            SavedLocationCard(
                                location = location,
                                onClick = {
                                    navigateToLocation(location)
                                },
                                onRemove = {
                                    savedLocations = savedLocations - location
                                    removeSavedLocation(location)
                                },
                                onEdit = {
                                    showEditDialog(location)
                                }
                            )
                        }
                    }
                }
            }
        }
    )
}

@Composable
fun SavedLocationCard(
    location: SavedLocation,
    onClick: () -> Unit,
    onRemove: () -> Unit,
    onEdit: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Location icon
            Icon(
                imageVector = getCategoryIcon(location.category),
                contentDescription = location.category,
                modifier = Modifier.size(40.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            // Location details
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = location.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Floor ${location.floor}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (location.notes != null) {
                    Text(
                        text = location.notes,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
            
            // Action buttons
            IconButton(onClick = onEdit) {
                Icon(Icons.Default.Edit, "Edit")
            }
            IconButton(onClick = onRemove) {
                Icon(Icons.Default.Delete, "Remove")
            }
        }
    }
}
```

## <span class="emoji"> :material-page-layout-header: </span> Search Bar Layout [:octicons-arrow-up-right-24:](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-search-bar-layout.html)
The 3D/2D Map switcher button allows users to switch between 3D and 2D views of the map, providing a different perspective of the indoor environment.
In the demo below, you can see the 3D/2D Map switcher button in action:


<br>
<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/cfc06d87-c2e9-4183-b1e8-ca2ab43a0e18" alt="3D/2D Map switcher button"/>
</p>

Here is a code snippet that shows how to use the 3D/2D Map switcher button:

```kotlin
// Code snippet for 3D/2D Map switcher button
```

## <span class="emoji"> :material-page-layout-header: </span> Search Bar with Dropdown [:octicons-arrow-up-right-24:](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-top-search-bar.html)
The search bar with dropdown allows users to search for specific locations or points of interest (POI) within the indoor environment, providing a quick and easy way to find their desired destination.
In the demo below, you can see the search bar with a dropdown in action:

<br>

<p align="center">
    <img src=https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/7cb8dd28-372b-4899-8946-c4f1e5ec3590" alt="3D/2D Map switcher button"/>
</p>

Here is a code snippet that shows how to use the search bar layout:

```kotlin
// Code snippet for 3D/2D Map switcher button
```

## <span class="emoji"> :material-page-layout-sidebar-right: </span> Current Location Button [:octicons-arrow-up-right-24:](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-localisation-button.html)
The current location button allows users to view their current location within the indoor environment, providing real-time information on their position.
In the demo below, you can see the current location button in action:

Here is a code snippet that shows how to use the current location button:

```kotlin
// Code snippet for Current Location Button
```

## <span class="emoji"> :material-page-layout-sidebar-right: </span> Map Mode Switch Button [:octicons-arrow-up-right-24:](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-mode-switch-button.html)

The map mode switch button allows users to switch between different map modes such as 3D and 2D views, providing a different perspective of the indoor environment.
In the demo below, you can see the map mode switch button in action:


Here is a code snippet that shows how to use the map mode switch button:

```kotlin
// Code snippet for Map Mode Switch Button*
```

Each of these UI components plays a crucial role in enhancing the user's navigation experience within the indoor environment,
providing intuitive and easy-to-use features that make it easy to navigate and explore the space.

