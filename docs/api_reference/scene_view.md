# <span class="emoji"> :material-octagon-outline: </span> SceneView

## Overview

**SceneView** is a powerful 3D and AR rendering library for Android, Flutter, and React Native applications. Built on top of **ARCore** and **Google's Filament Engine**, it provides a robust foundation for creating immersive 3D and augmented reality experiences with high-performance rendering capabilities.

!!! info "Integration Context"
    In the MINE Indoor Navigation Engine, SceneView serves as the primary rendering engine for displaying 3D maps, visualizing navigation paths, and providing real-time AR wayfinding experiences.

---

## Platform Support

SceneView is available across multiple platforms with consistent APIs:

<div class="grid cards" markdown>

-   :material-android: **Android**

    ---

    Native Android library with full ARCore support

    [:octicons-arrow-right-24: Android Repository](https://github.com/SceneView/sceneview-android)

-   :material-flutter: **Flutter**

    ---

    Cross-platform Flutter plugin for iOS and Android

    [:octicons-arrow-right-24: Flutter Plugin](https://sceneview.github.io/)

-   :material-react: **React Native**

    ---

    React Native module for mobile AR experiences

    [:octicons-arrow-right-24: RN Module](https://sceneview.github.io/)

</div>

---

## Core Features

### 🎨 Advanced Rendering
- **Filament-Powered**: Leverages Google's physically-based rendering engine
- **PBR Materials**: Support for physically-based materials and lighting
- **HDR Environment**: High dynamic range image-based lighting
- **Post-Processing**: Bloom, depth-of-field, and other effects

### 🌍 AR Capabilities
- **ARCore Integration**: Native support for Google ARCore
- **Plane Detection**: Automatic detection of horizontal and vertical surfaces
- **Light Estimation**: Real-world lighting integration
- **Anchors**: Persistent AR content placement

### 📦 3D Model Support
- **glTF/GLB**: Industry-standard 3D model formats
- **Animations**: Skeletal and keyframe animations
- **LOD Support**: Level-of-detail optimization
- **Custom Shaders**: GLSL shader customization

### 🎮 Interactive Controls
- **Gesture Recognition**: Pan, zoom, rotate, and tap gestures
- **Camera Controls**: Orbit, first-person, and follow modes
- **Hit Testing**: Ray-casting for object selection
- **Custom Interactions**: Extensible gesture system

---

## Use Cases in MINE

### 1. 3D Map Visualization

SceneView renders interactive 3D representations of indoor environments, allowing users to:

- View building layouts from multiple angles
- Interact with floor plans in real-time
- Zoom and rotate the map intuitively

```kotlin
// Example: Loading a 3D indoor map
val sceneView = findViewById<SceneView>(R.id.sceneView)

sceneView.apply {
    // Load the building model
    loadModel("models/building.glb") { model ->
        // Position and scale the model
        model.position = Position(0f, 0f, 0f)
        model.scale = Scale(1f)
        
        // Add to scene
        addChild(model)
    }
    
    // Configure camera
    camera.setPosition(x = 0f, y = 5f, z = 10f)
    camera.lookAt(0f, 0f, 0f)
}
```

### 2. Navigation Path Rendering

Displays real-time navigation routes with visual clarity:

```kotlin
// Example: Rendering navigation path
fun renderNavigationPath(pathPoints: List<Vector3>) {
    val pathMaterial = MaterialInstance(
        material = MaterialLoader.load(context, "materials/path.mat"),
        color = Color(0xFF4CAF50)
    )
    
    val pathLine = LineNode(
        points = pathPoints,
        thickness = 0.05f,
        material = pathMaterial
    )
    
    sceneView.addChild(pathLine)
    
    // Add animated indicator
    val indicator = createPathIndicator()
    animateAlongPath(indicator, pathPoints)
}
```

### 3. AR Wayfinding

Provides augmented reality overlays for enhanced navigation:

```kotlin
// Example: AR navigation overlay
sceneView.apply {
    // Enable AR mode
    arMode = true
    
    // Place AR navigation arrows
    onTapAr { hitResult ->
        val anchor = hitResult.createAnchor()
        val arrowNode = createNavigationArrow()
        
        arrowNode.anchor = anchor
        addChild(arrowNode)
        
        // Animate the arrow
        animateArrow(arrowNode)
    }
}
```

### 4. Point of Interest (POI) Markers

Display interactive markers for locations of interest:

```kotlin
// Example: Adding POI markers
fun addPOIMarker(location: Vector3, info: POIInfo) {
    val markerNode = Node().apply {
        position = location
        
        // Add 3D icon
        loadModel("models/poi_marker.glb") { model ->
            addChild(model)
        }
        
        // Add text label
        val textNode = TextNode(
            text = info.name,
            fontSize = 0.2f,
            color = Color.WHITE
        )
        addChild(textNode)
        
        // Handle interactions
        onTap { 
            showPOIDetails(info)
        }
    }
    
    sceneView.addChild(markerNode)
}
```

---

## Key Components

### SceneView

The main view component that hosts the 3D/AR scene:

```kotlin
<io.github.sceneview.SceneView
    android:id="@+id/sceneView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:arEnabled="true"
    app:antialiasingMode="fxaa"
    app:msaaSampleCount="4" />
```

### Node Hierarchy

SceneView uses a node-based scene graph:

```kotlin
// Creating a node hierarchy
val rootNode = Node()

val buildingNode = ModelNode().apply {
    loadModel("building.glb")
}

val navigationNode = Node().apply {
    // Add navigation path
}

rootNode.addChild(buildingNode)
rootNode.addChild(navigationNode)
sceneView.addChild(rootNode)
```

### Camera Control

Flexible camera positioning and movement:

```kotlin
// Camera configuration
sceneView.cameraNode.apply {
    // Set position
    worldPosition = Position(x = 0f, y = 2f, z = 5f)
    
    // Look at target
    lookAt(targetPosition = Position(0f, 0f, 0f))
    
    // Animate camera
    smooth(
        position = newPosition,
        rotation = newRotation,
        duration = 1.5f
    )
}
```

### Lighting

Configure scene lighting for optimal visualization:

```kotlin
// Setup lighting
sceneView.apply {
    // Add directional light (sun)
    val sunLight = LightNode(
        type = LightType.DIRECTIONAL,
        intensity = 100000f,
        color = Color.WHITE
    )
    sunLight.worldRotation = Rotation(x = 45f, y = 0f, z = 0f)
    addChild(sunLight)
    
    // Set environment (HDR image)
    environment = HDREnvironment(
        asset = "environments/indoor.hdr",
        intensity = 30000f
    )
    
    // Configure skybox
    skybox = Skybox(environment = environment)
}
```

---

## Performance Optimization

### Level of Detail (LOD)

Optimize rendering performance with LOD models:

```kotlin
val modelNode = ModelNode().apply {
    // Load multiple LOD levels
    loadModelLOD(
        high = "models/building_high.glb",
        medium = "models/building_medium.glb",
        low = "models/building_low.glb"
    )
    
    // Configure LOD distances
    lodDistances = listOf(10f, 50f, 100f)
}
```

### Culling

Implement frustum culling for large scenes:

```kotlin
sceneView.apply {
    // Enable frustum culling
    isFrustumCullingEnabled = true
    
    // Set culling distance
    farClipPlane = 100f
}
```

### Texture Compression

Use compressed textures for better performance:

```kotlin
// Use KTX2 format with Basis compression
val material = MaterialLoader.load(
    context = context,
    assetFileLocation = "materials/compressed.ktx2"
)
```

---

## Best Practices

!!! success "Recommended Practices"
    
    **1. Memory Management**
    ```kotlin
    override fun onDestroy() {
        super.onDestroy()
        sceneView.destroy()
    }
    ```
    
    **2. Async Loading**
    ```kotlin
    // Load models asynchronously
    lifecycleScope.launch {
        val model = sceneView.loadModelAsync("model.glb")
        sceneView.addChild(model)
    }
    ```
    
    **3. Error Handling**
    ```kotlin
    sceneView.loadModel("model.glb",
        onError = { exception ->
            Log.e("SceneView", "Failed to load model", exception)
            showErrorToUser()
        }
    )
    ```

!!! warning "Common Pitfalls"
    
    - **Avoid** loading large models on the main thread
    - **Always** destroy SceneView in `onDestroy()`
    - **Check** ARCore availability before enabling AR mode
    - **Optimize** textures and models for mobile devices

---

## Resources

### Official Links

- 🌐 [SceneView Website](https://sceneview.github.io/)
- 💻 [Android Repository](https://github.com/SceneView/sceneview-android)
- 📚 [API Reference](https://github.com/SceneView/sceneview-android/wiki)
- 💬 [Community Discussions](https://github.com/SceneView/sceneview-android/discussions)

### Related MINE Documentation

- [Filament Engine](./filament.md) - Underlying rendering engine
- [Module Overview](./module_overview.md) - MINE architecture overview
- [3D Map Loading](../features/map_loading.md) - Map integration guide
- [Theme Customization](../features/theme_customization.md) - Visual customization

---

## Version & Compatibility

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| Android SDK | API 24 (7.0) | API 33+ |
| ARCore | 1.20.0 | Latest |
| Filament | 1.28.0 | Latest |
| Kotlin | 1.8.0 | 1.9.0+ |

!!! note "Documentation Status"
    As of December 2025, SceneView continues to evolve rapidly. For the latest features and updates, check the [official GitHub repository](https://github.com/SceneView/sceneview-android) and [release notes](https://github.com/SceneView/sceneview-android/releases).

---

## Quick Start Integration

To integrate SceneView into your MINE implementation:

1. **Add Dependencies**
   ```gradle
   dependencies {
       implementation 'io.github.sceneview:sceneview:2.0.0'
   }
   ```

2. **Add to Layout**
   ```xml
   <io.github.sceneview.SceneView
       android:id="@+id/sceneView"
       android:layout_width="match_parent"
       android:layout_height="match_parent" />
   ```

3. **Initialize in Activity**
   ```kotlin
   val sceneView = findViewById<SceneView>(R.id.sceneView)
   sceneView.loadModel("model.glb")
   ```

For detailed integration steps, see the [Quick Start Guide](../getting_started/quick_start.md).
