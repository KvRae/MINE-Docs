# <span class="emoji"> :material-cloud-upload: </span> Map Loading

## Overview

The **Map Loading** feature is a core component of the MINE Indoor Navigation Engine that enables applications to load, parse, and render indoor map data from various sources. Whether you're loading maps from local storage, remote servers, or cloud services, MINE provides a flexible and efficient map loading system that supports multiple formats and deployment scenarios.

!!! abstract "Key Capabilities"
    - 📁 **Local Map Loading**: Load maps from device storage or app assets
    - 🌐 **Remote Map Loading**: Fetch maps from REST APIs or cloud storage
    - 🔄 **Progressive Loading**: Stream large maps incrementally for optimal performance
    - 💾 **Intelligent Caching**: Automatic map caching for offline availability
    - 🗺️ **Multi-Format Support**: JSON, GeoJSON, and custom formats
    - 🏢 **Multi-Floor Management**: Handle complex multi-level buildings

---

## Map File Format

MINE uses a structured JSON format to define indoor maps with rich metadata and geometry:

### Basic Structure

```json
{
  "version": "1.0",
  "venue": {
    "id": "venue_001",
    "name": "Shopping Mall XYZ",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "floors": [
    {
      "id": "floor_1",
      "level": 1,
      "name": "Ground Floor",
      "height": 3.5,
      "model": {
        "url": "models/floor_1.glb",
        "format": "glb"
      },
      "floorPlan": {
        "url": "images/floor_1.png",
        "bounds": {
          "minX": 0,
          "minY": 0,
          "maxX": 200,
          "maxY": 150
        }
      },
      "pois": [
        {
          "id": "poi_001",
          "name": "Main Entrance",
          "category": "entrance",
          "position": {
            "x": 10.5,
            "y": 20.3,
            "z": 0.0
          },
          "metadata": {
            "description": "Main entrance from parking lot",
            "icon": "entrance"
          }
        }
      ],
      "paths": [
        {
          "id": "path_001",
          "nodes": [
            {"x": 10.5, "y": 20.3},
            {"x": 15.0, "y": 25.0},
            {"x": 20.5, "y": 30.2}
          ],
          "width": 2.0,
          "accessible": true
        }
      ],
      "obstacles": [
        {
          "type": "wall",
          "geometry": {
            "points": [
              {"x": 0, "y": 0},
              {"x": 100, "y": 0},
              {"x": 100, "y": 2},
              {"x": 0, "y": 2}
            ]
          }
        }
      ]
    }
  ],
  "connections": [
    {
      "type": "elevator",
      "fromFloor": "floor_1",
      "toFloor": "floor_2",
      "position": {"x": 50, "y": 50}
    }
  ]
}
```

### Format Specification

<div class="grid" markdown>

=== "Venue Information"

    ```json
    {
      "venue": {
        "id": "unique_venue_id",
        "name": "Venue Name",
        "location": {
          "latitude": 40.7128,
          "longitude": -74.0060
        },
        "timezone": "America/New_York",
        "metadata": {
          "address": "123 Main St",
          "city": "New York",
          "country": "USA"
        }
      }
    }
    ```

=== "Floor Definition"

    ```json
    {
      "floor": {
        "id": "floor_1",
        "level": 1,
        "name": "Ground Floor",
        "height": 3.5,
        "model": {
          "url": "path/to/model.glb",
          "format": "glb",
          "scale": 1.0
        },
        "floorPlan": {
          "url": "path/to/floorplan.png",
          "bounds": {
            "minX": 0, "minY": 0,
            "maxX": 200, "maxY": 150
          }
        }
      }
    }
    ```

=== "POI Definition"

    ```json
    {
      "poi": {
        "id": "poi_001",
        "name": "Store Name",
        "category": "retail",
        "subcategory": "clothing",
        "position": {
          "x": 10.5,
          "y": 20.3,
          "z": 0.0
        },
        "metadata": {
          "description": "Description",
          "icon": "store",
          "phone": "+1234567890",
          "website": "https://example.com"
        },
        "searchable": true
      }
    }
    ```

=== "Navigation Paths"

    ```json
    {
      "path": {
        "id": "path_001",
        "nodes": [
          {"x": 10, "y": 20},
          {"x": 15, "y": 25}
        ],
        "width": 2.0,
        "accessible": true,
        "bidirectional": true,
        "properties": {
          "surface": "smooth",
          "indoor": true
        }
      }
    }
    ```

</div>

!!! note "Format Version"
    The map format is versioned to ensure compatibility. Always specify the `version` field in your map files. Current version: **1.0**

---

## Local Map Loading

Load maps from local storage, app assets, or device files:

### From Assets Directory

```kotlin
import com.machinestalk.indoornavigationengine.resources.MapLoader
import com.machinestalk.indoornavigationengine.models.IndoorMap

class MapActivity : AppCompatActivity() {
    
    private lateinit var mapLoader: MapLoader
    private lateinit var sceneView: MineSceneView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)
        
        sceneView = findViewById(R.id.scene_view)
        mapLoader = MapLoader(this)
        
        // Load map from assets
        loadMapFromAssets()
    }
    
    private fun loadMapFromAssets() {
        lifecycleScope.launch {
            try {
                // Show loading indicator
                showLoadingDialog()
                
                // Load map from assets/maps/venue.json
                val map = mapLoader.loadFromAssets(
                    path = "maps/venue.json",
                    options = LoadOptions(
                        cacheEnabled = true,
                        validateSchema = true,
                        progressCallback = { progress ->
                            updateLoadingProgress(progress)
                        }
                    )
                )
                
                // Apply map to scene
                sceneView.setMap(map)
                
                // Configure initial view
                sceneView.apply {
                    focusOnFloor(map.getFloor(1))
                    enableUserLocation()
                }
                
                hideLoadingDialog()
                showMapLoadedMessage()
                
            } catch (e: MapLoadException) {
                handleMapLoadError(e)
            }
        }
    }
}
```

### From Internal Storage

```kotlin
private fun loadMapFromInternalStorage() {
    lifecycleScope.launch {
        try {
            val file = File(filesDir, "downloaded_maps/venue_123.json")
            
            if (!file.exists()) {
                showError("Map file not found")
                return@launch
            }
            
            val map = mapLoader.loadFromFile(
                file = file,
                options = LoadOptions(
                    cacheEnabled = true,
                    preloadModels = true
                )
            )
            
            sceneView.setMap(map)
            
        } catch (e: Exception) {
            Log.e("MapLoading", "Failed to load map", e)
            showError("Failed to load map: ${e.message}")
        }
    }
}
```

### From External Storage

```kotlin
private fun loadMapFromExternalStorage() {
    // Check permissions
    if (!hasStoragePermission()) {
        requestStoragePermission()
        return
    }
    
    lifecycleScope.launch {
        try {
            val file = File(
                getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS),
                "maps/custom_venue.json"
            )
            
            val map = mapLoader.loadFromFile(file)
            sceneView.setMap(map)
            
        } catch (e: IOException) {
            showError("Failed to read map file")
        }
    }
}
```

!!! tip "Asset Organization"
    Organize your map assets in the following structure:
    ```
    assets/
      maps/
        venue_001.json          # Map definition
        models/
          floor_1.glb          # 3D models
          floor_2.glb
        images/
          floor_1.png          # 2D floor plans
          floor_2.png
        icons/
          poi_markers.png      # POI icons
    ```

---

## Remote Map Loading

Load maps from remote servers, REST APIs, or cloud storage:

### From REST API

```kotlin
private fun loadMapFromAPI() {
    lifecycleScope.launch {
        try {
            showLoadingDialog()
            
            val map = mapLoader.loadFromUrl(
                url = "https://api.example.com/venues/123/map",
                options = LoadOptions(
                    headers = mapOf(
                        "Authorization" to "Bearer $authToken",
                        "Accept" to "application/json"
                    ),
                    timeout = 30_000L, // 30 seconds
                    cacheEnabled = true,
                    cacheExpiration = 24 * 60 * 60 * 1000L, // 24 hours
                    progressCallback = { progress ->
                        updateProgress(progress)
                    }
                )
            )
            
            sceneView.setMap(map)
            hideLoadingDialog()
            
        } catch (e: NetworkException) {
            handleNetworkError(e)
        } catch (e: MapLoadException) {
            handleMapLoadError(e)
        }
    }
}
```

### From Cloud Storage (AWS S3)

```kotlin
private fun loadMapFromS3() {
    lifecycleScope.launch {
        try {
            val s3Url = "https://my-bucket.s3.amazonaws.com/maps/venue_123.json"
            
            val map = mapLoader.loadFromUrl(
                url = s3Url,
                options = LoadOptions(
                    cacheEnabled = true,
                    offlineMode = false,
                    headers = mapOf(
                        "x-amz-request-payer" to "requester"
                    )
                )
            )
            
            sceneView.setMap(map)
            
        } catch (e: Exception) {
            Log.e("MapLoading", "Failed to load from S3", e)
        }
    }
}
```

### From Firebase Storage

```kotlin
private fun loadMapFromFirebase() {
    val storage = FirebaseStorage.getInstance()
    val mapRef = storage.reference.child("maps/venue_123.json")
    
    lifecycleScope.launch {
        try {
            // Get download URL
            val url = mapRef.downloadUrl.await()
            
            // Load map
            val map = mapLoader.loadFromUrl(
                url = url.toString(),
                options = LoadOptions(cacheEnabled = true)
            )
            
            sceneView.setMap(map)
            
        } catch (e: Exception) {
            Log.e("MapLoading", "Failed to load from Firebase", e)
        }
    }
}
```

![Map Loading Demo](https://github.com/user-attachments/assets/76e47113-955f-4e63-bb8b-76914be73f9a){ loading=lazy }

---

## Progressive Loading

For large venues with multiple floors and detailed 3D models, use progressive loading to improve initial load times:

```kotlin
private fun loadMapProgressively() {
    lifecycleScope.launch {
        try {
            // Load map metadata first
            val mapMetadata = mapLoader.loadMetadata("maps/large_venue.json")
            
            // Display basic information immediately
            showVenueInfo(mapMetadata)
            
            // Load first floor
            val firstFloor = mapLoader.loadFloor(
                mapUrl = "maps/large_venue.json",
                floorId = mapMetadata.defaultFloorId
            )
            
            sceneView.setMap(firstFloor)
            
            // Load remaining floors in background
            loadRemainingFloorsInBackground(mapMetadata)
            
        } catch (e: Exception) {
            handleError(e)
        }
    }
}

private fun loadRemainingFloorsInBackground(metadata: MapMetadata) {
    lifecycleScope.launch(Dispatchers.IO) {
        metadata.floors.forEach { floorInfo ->
            if (floorInfo.id != metadata.defaultFloorId) {
                try {
                    val floor = mapLoader.loadFloor(
                        mapUrl = "maps/large_venue.json",
                        floorId = floorInfo.id
                    )
                    
                    withContext(Dispatchers.Main) {
                        sceneView.addFloor(floor)
                    }
                    
                } catch (e: Exception) {
                    Log.w("MapLoading", "Failed to load floor ${floorInfo.id}", e)
                }
            }
        }
    }
}
```

---

## Caching Strategy

MINE provides intelligent caching to improve performance and enable offline functionality:

### Cache Configuration

```kotlin
// Configure map cache
val cacheConfig = MapCacheConfig(
    maxSize = 500 * 1024 * 1024, // 500 MB
    expirationTime = 7 * 24 * 60 * 60 * 1000L, // 7 days
    cacheLocation = CacheLocation.INTERNAL_STORAGE,
    strategy = CacheStrategy.LRU // Least Recently Used
)

mapLoader.configurCache(cacheConfig)
```

### Manual Cache Management

```kotlin
// Clear cache for specific venue
mapLoader.clearCache(venueId = "venue_123")

// Clear all cached maps
mapLoader.clearAllCache()

// Check cache status
val cacheInfo = mapLoader.getCacheInfo()
Log.d("Cache", "Size: ${cacheInfo.size}, Items: ${cacheInfo.itemCount}")

// Preload map to cache
lifecycleScope.launch {
    mapLoader.preloadToCache(
        url = "https://api.example.com/venues/123/map"
    )
}
```

### Offline Mode

```kotlin
// Enable offline mode
val map = mapLoader.loadFromUrl(
    url = "https://api.example.com/venues/123/map",
    options = LoadOptions(
        offlineMode = true, // Only load from cache
        fallbackToCache = true // Use cached version if available
    )
)
```

---

## Multi-Floor Management

Handle complex multi-level buildings efficiently:

### Loading Multiple Floors

```kotlin
private suspend fun loadMultiFloorVenue() {
    val map = mapLoader.loadFromAssets("maps/multi_floor_venue.json")
    
    // Get all floors
    val floors = map.getFloors()
    
    floors.forEach { floor ->
        Log.d("Floor", "Level ${floor.level}: ${floor.name}")
        
        // Load floor-specific resources
        floor.model?.let { modelUrl ->
            sceneView.loadFloorModel(floor.id, modelUrl)
        }
    }
    
    // Set initial floor
    sceneView.setActiveFloor(floors.first())
}
```

### Floor Switching

```kotlin
// Switch between floors
sceneView.switchToFloor(
    floorId = "floor_2",
    animated = true,
    duration = 500L
)

// Listen for floor changes
sceneView.onFloorChanged = { floor ->
    updateUI(floor)
    loadFloorPOIs(floor)
}
```

---

## Error Handling

Implement robust error handling for map loading operations:

```kotlin
private fun handleMapLoadError(exception: Exception) {
    when (exception) {
        is MapLoadException.InvalidFormat -> {
            showError("Invalid map format. Please check the map file.")
        }
        is MapLoadException.NetworkError -> {
            showError("Network error. Please check your connection.")
            offerRetry()
        }
        is MapLoadException.FileNotFound -> {
            showError("Map file not found.")
        }
        is MapLoadException.ParseError -> {
            showError("Failed to parse map data: ${exception.message}")
            Log.e("MapLoading", "Parse error", exception)
        }
        is MapLoadException.ModelLoadError -> {
            showError("Failed to load 3D models.")
            // Optionally fall back to 2D mode
            switchTo2DMode()
        }
        else -> {
            showError("Unexpected error: ${exception.message}")
            Log.e("MapLoading", "Unexpected error", exception)
        }
    }
}

private fun offerRetry() {
    AlertDialog.Builder(this)
        .setTitle("Load Failed")
        .setMessage("Would you like to retry loading the map?")
        .setPositiveButton("Retry") { _, _ ->
            loadMapFromAPI()
        }
        .setNegativeButton("Use Cached Map") { _, _ ->
            loadFromCache()
        }
        .show()
}
```

---

## Best Practices

!!! success "Recommended Practices"
    
    **1. Always Load Asynchronously**
    ```kotlin
    // ✅ Good: Load on background thread
    lifecycleScope.launch {
        val map = mapLoader.loadFromAssets("map.json")
        sceneView.setMap(map)
    }
    
    // ❌ Bad: Loading on main thread
    val map = mapLoader.loadFromAssetsSync("map.json") // Blocks UI
    ```
    
    **2. Validate Map Data**
    ```kotlin
    val map = mapLoader.loadFromAssets(
        path = "map.json",
        options = LoadOptions(
            validateSchema = true, // Enable validation
            strictMode = true // Fail on warnings
        )
    )
    ```
    
    **3. Handle Loading States**
    ```kotlin
    sealed class MapLoadState {
        object Idle : MapLoadState()
        data class Loading(val progress: Float) : MapLoadState()
        data class Success(val map: IndoorMap) : MapLoadState()
        data class Error(val exception: Exception) : MapLoadState()
    }
    ```
    
    **4. Optimize Asset Size**
    - Compress 3D models (use Draco compression for glTF)
    - Use appropriate texture resolutions
    - Consider using LOD (Level of Detail) models
    - Compress floor plan images

!!! warning "Common Pitfalls"
    
    - **Don't** load large maps on the main thread
    - **Don't** forget to handle network errors
    - **Don't** ignore cache expiration
    - **Always** validate map format before production
    - **Always** implement proper error handling
    - **Consider** progressive loading for large venues

---

## Performance Optimization

### Lazy Loading POIs

```kotlin
// Load POIs on demand when user zooms in
sceneView.onCameraZoomChanged = { zoomLevel ->
    if (zoomLevel > 0.7f) {
        loadPOIsForCurrentView()
    } else {
        hidePOIs()
    }
}

private fun loadPOIsForCurrentView() {
    val visibleBounds = sceneView.getVisibleBounds()
    val pois = currentMap.getPOIsInBounds(visibleBounds)
    sceneView.showPOIs(pois)
}
```

### Model Optimization

```kotlin
// Use LOD (Level of Detail) for 3D models
val modelOptions = ModelLoadOptions(
    enableLOD = true,
    lodLevels = listOf(
        LODLevel(distance = 0f, model = "high_detail.glb"),
        LODLevel(distance = 50f, model = "medium_detail.glb"),
        LODLevel(distance = 100f, model = "low_detail.glb")
    )
)

mapLoader.loadWithOptions("map.json", modelOptions)
```

---

## Troubleshooting

### Map Not Loading

**Problem**: Map fails to load from assets

**Solution**:
```kotlin
// Check if file exists
val exists = try {
    assets.open("maps/venue.json").close()
    true
} catch (e: IOException) {
    false
}

if (!exists) {
    Log.e("MapLoading", "Map file not found in assets")
}
```

### Slow Loading Performance

**Problem**: Map takes too long to load

**Solutions**:
1. Enable progressive loading
2. Reduce model complexity
3. Compress textures
4. Use caching
5. Implement lazy loading for POIs

### Out of Memory Errors

**Problem**: App crashes with OOM when loading large maps

**Solutions**:
```kotlin
// Configure memory limits
val loadOptions = LoadOptions(
    maxMemoryUsage = 200 * 1024 * 1024, // 200 MB
    enableTextureCompression = true,
    modelQuality = ModelQuality.MEDIUM
)
```

---

## Related Documentation

- [Navigation Features](navigation.md) - Using maps for navigation
- [UI Components](ui_components.md) - Map interaction components
- [Path Finding](path_finding.md) - Route calculation on maps
- [API Reference](../api_reference/module_overview.md) - Detailed API docs

---

## Next Steps

Now that you understand map loading, explore:

1. **[Configure Navigation](navigation.md)** - Set up turn-by-turn navigation
2. **[Customize UI](ui_components.md)** - Add interactive map components
3. **[Implement Pathfinding](path_finding.md)** - Calculate routes on your map


