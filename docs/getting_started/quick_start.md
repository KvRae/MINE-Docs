# <span class="emoji"> :material-rocket-launch: </span> Quick Start

Build your first indoor navigation experience in minutes! This guide will walk you through creating a basic navigation app using **MINE - Indoor Navigation Engine**, from initialization to displaying an interactive 3D map.

!!! tip "Before You Begin"
    Make sure you've completed the [installation](installation.md) steps before proceeding with this guide.

---

## <span class="emoji"> :material-chart-timeline: </span> What You'll Build

By the end of this guide, you'll have a fully functional Android app that:

- ✅ Initializes the Indoor Navigation Engine
- ✅ Displays an interactive 3D indoor map
- ✅ Handles map lifecycle events
- ✅ Implements basic camera controls
- ✅ Loads custom map data

**Estimated Time**: 10-15 minutes

---

## <span class="emoji"> :material-numeric-1-circle: </span> Step 1: Set Up Your Activity

First, create an Activity that will host the navigation engine. We'll use `MineSceneView` as the main component for displaying maps.

=== "Kotlin"

    ```kotlin
    package com.example.myapp
    
    import android.os.Bundle
    import androidx.appcompat.app.AppCompatActivity
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    
    class NavigationActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialize the scene view
            sceneView = MineSceneView(this)
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

=== "Java"

    ```java
    package com.example.myapp;
    
    import android.os.Bundle;
    import androidx.appcompat.app.AppCompatActivity;
    import com.machinestalk.indoornavigationengine.ui.MineSceneView;
    
    public class NavigationActivity extends AppCompatActivity {
        
        private MineSceneView sceneView;
        
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            
            // Initialize the scene view
            sceneView = new MineSceneView(this);
            setContentView(sceneView);
        }
        
        @Override
        protected void onResume() {
            super.onResume();
            sceneView.onResume();
        }
        
        @Override
        protected void onPause() {
            super.onPause();
            sceneView.onPause();
        }
        
        @Override
        protected void onDestroy() {
            super.onDestroy();
            sceneView.onDestroy();
        }
    }
    ```

!!! info "Lifecycle Management"
    Properly managing the lifecycle of `MineSceneView` is crucial for optimal performance and preventing memory leaks. Always call `onResume()`, `onPause()`, and `onDestroy()` in the corresponding Activity lifecycle methods.

---

## <span class="emoji"> :material-numeric-2-circle: </span> Step 2: Load a Map

Now let's load an indoor map. The engine supports various map formats including glTF/GLB models.

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.MapData
    import com.machinestalk.indoornavigationengine.util.MapLoader
    
    class NavigationActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        private lateinit var mapLoader: MapLoader
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            sceneView = MineSceneView(this)
            setContentView(sceneView)
            
            // Initialize map loader
            mapLoader = MapLoader(sceneView)
            
            // Load map from assets
            loadMap()
        }
        
        private fun loadMap() {
            val mapPath = "maps/my_venue.glb" // Path to your map file in assets
            
            mapLoader.loadFromAssets(
                context = this,
                assetPath = mapPath,
                onSuccess = { mapData ->
                    // Map loaded successfully
                    setupCamera(mapData)
                    showToast("Map loaded successfully!")
                },
                onError = { error ->
                    // Handle error
                    showToast("Failed to load map: ${error.message}")
                }
            )
        }
        
        private fun setupCamera(mapData: MapData) {
            // Position camera to view the entire map
            sceneView.camera.apply {
                lookAt(
                    eye = floatArrayOf(0f, 10f, 10f),
                    center = floatArrayOf(0f, 0f, 0f),
                    up = floatArrayOf(0f, 1f, 0f)
                )
            }
        }
        
        private fun showToast(message: String) {
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }
    }
    ```

=== "Java"

    ```java
    import com.machinestalk.indoornavigationengine.models.MapData;
    import com.machinestalk.indoornavigationengine.util.MapLoader;
    import android.widget.Toast;
    
    public class NavigationActivity extends AppCompatActivity {
        
        private MineSceneView sceneView;
        private MapLoader mapLoader;
        
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            
            sceneView = new MineSceneView(this);
            setContentView(sceneView);
            
            // Initialize map loader
            mapLoader = new MapLoader(sceneView);
            
            // Load map from assets
            loadMap();
        }
        
        private void loadMap() {
            String mapPath = "maps/my_venue.glb"; // Path to your map file in assets
            
            mapLoader.loadFromAssets(
                this,
                mapPath,
                mapData -> {
                    // Map loaded successfully
                    setupCamera(mapData);
                    showToast("Map loaded successfully!");
                },
                error -> {
                    // Handle error
                    showToast("Failed to load map: " + error.getMessage());
                }
            );
        }
        
        private void setupCamera(MapData mapData) {
            // Position camera to view the entire map
            sceneView.getCamera().lookAt(
                new float[]{0f, 10f, 10f},  // eye
                new float[]{0f, 0f, 0f},    // center
                new float[]{0f, 1f, 0f}     // up
            );
        }
        
        private void showToast(String message) {
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
        }
    }
    ```

!!! success "Map Loading"
    The engine supports loading maps from multiple sources including assets, local storage, and remote URLs. See the [Map Loading Guide](../features/map_loading.md) for more details.

---

## <span class="emoji"> :material-numeric-3-circle: </span> Step 3: Add User Interaction

Enable users to interact with the map through touch gestures like pan, zoom, and rotate.

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.components.CameraController
    import com.machinestalk.indoornavigationengine.components.GestureHandler
    
    class NavigationActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        private lateinit var gestureHandler: GestureHandler
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            sceneView = MineSceneView(this)
            setContentView(sceneView)
            
            // Enable gesture controls
            setupGestureControls()
        }
        
        private fun setupGestureControls() {
            gestureHandler = GestureHandler(sceneView).apply {
                // Enable pan gesture
                isPanEnabled = true
                
                // Enable pinch to zoom
                isZoomEnabled = true
                
                // Enable rotation
                isRotationEnabled = true
                
                // Set zoom limits
                minZoom = 1.0f
                maxZoom = 10.0f
                
                // Add gesture listener
                setOnGestureListener(object : GestureHandler.OnGestureListener {
                    override fun onSingleTap(x: Float, y: Float) {
                        // Handle tap on map
                        handleMapTap(x, y)
                    }
                    
                    override fun onLongPress(x: Float, y: Float) {
                        // Handle long press
                        showContextMenu(x, y)
                    }
                })
            }
        }
        
        private fun handleMapTap(x: Float, y: Float) {
            // Perform hit testing to detect tapped objects
            sceneView.hitTest(x, y) { result ->
                result?.let {
                    // Display information about tapped location
                    showLocationInfo(it)
                }
            }
        }
    }
    ```

=== "Java"

    ```java
    import com.machinestalk.indoornavigationengine.components.GestureHandler;
    
    public class NavigationActivity extends AppCompatActivity {
        
        private MineSceneView sceneView;
        private GestureHandler gestureHandler;
        
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            
            sceneView = new MineSceneView(this);
            setContentView(sceneView);
            
            // Enable gesture controls
            setupGestureControls();
        }
        
        private void setupGestureControls() {
            gestureHandler = new GestureHandler(sceneView);
            
            // Enable pan gesture
            gestureHandler.setPanEnabled(true);
            
            // Enable pinch to zoom
            gestureHandler.setZoomEnabled(true);
            
            // Enable rotation
            gestureHandler.setRotationEnabled(true);
            
            // Set zoom limits
            gestureHandler.setMinZoom(1.0f);
            gestureHandler.setMaxZoom(10.0f);
            
            // Add gesture listener
            gestureHandler.setOnGestureListener(new GestureHandler.OnGestureListener() {
                @Override
                public void onSingleTap(float x, float y) {
                    // Handle tap on map
                    handleMapTap(x, y);
                }
                
                @Override
                public void onLongPress(float x, float y) {
                    // Handle long press
                    showContextMenu(x, y);
                }
            });
        }
        
        private void handleMapTap(float x, float y) {
            // Perform hit testing to detect tapped objects
            sceneView.hitTest(x, y, result -> {
                if (result != null) {
                    // Display information about tapped location
                    showLocationInfo(result);
                }
            });
        }
    }
    ```

---

## <span class="emoji"> :material-numeric-4-circle: </span> Step 4: Configure Map Display

Customize the appearance and behavior of your map display.

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.DisplayConfig
    
    private fun configureMapDisplay() {
        sceneView.apply {
            // Set background color
            setBackgroundColor(android.graphics.Color.WHITE)
            
            // Configure rendering quality
            displayConfig = DisplayConfig(
                antiAliasing = true,
                shadowsEnabled = true,
                ambientOcclusion = true,
                renderQuality = DisplayConfig.RenderQuality.HIGH
            )
            
            // Enable FPS counter for debugging
            showFpsCounter = BuildConfig.DEBUG
            
            // Set lighting conditions
            lighting.apply {
                ambientLightIntensity = 0.5f
                directionalLightIntensity = 0.8f
                directionalLightDirection = floatArrayOf(0f, -1f, 0.5f)
            }
        }
    }
    ```

=== "Java"

    ```java
    import com.machinestalk.indoornavigationengine.models.DisplayConfig;
    
    private void configureMapDisplay() {
        // Set background color
        sceneView.setBackgroundColor(android.graphics.Color.WHITE);
        
        // Configure rendering quality
        DisplayConfig config = new DisplayConfig.Builder()
            .setAntiAliasing(true)
            .setShadowsEnabled(true)
            .setAmbientOcclusion(true)
            .setRenderQuality(DisplayConfig.RenderQuality.HIGH)
            .build();
        sceneView.setDisplayConfig(config);
        
        // Enable FPS counter for debugging
        sceneView.setShowFpsCounter(BuildConfig.DEBUG);
        
        // Set lighting conditions
        sceneView.getLighting().setAmbientLightIntensity(0.5f);
        sceneView.getLighting().setDirectionalLightIntensity(0.8f);
        sceneView.getLighting().setDirectionalLightDirection(
            new float[]{0f, -1f, 0.5f}
        );
    }
    ```

---

## <span class="emoji"> :material-map-marker-path: </span> Complete Example

Here's a complete, production-ready example that combines all the steps:

=== "Kotlin"

    ```kotlin
    package com.example.myapp
    
    import android.graphics.Color
    import android.os.Bundle
    import android.widget.Toast
    import androidx.appcompat.app.AppCompatActivity
    import com.machinestalk.indoornavigationengine.components.GestureHandler
    import com.machinestalk.indoornavigationengine.models.DisplayConfig
    import com.machinestalk.indoornavigationengine.models.MapData
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import com.machinestalk.indoornavigationengine.util.MapLoader
    
    class NavigationActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        private lateinit var mapLoader: MapLoader
        private lateinit var gestureHandler: GestureHandler
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialize scene view
            sceneView = MineSceneView(this)
            setContentView(sceneView)
            
            // Configure display
            configureMapDisplay()
            
            // Setup interactions
            setupGestureControls()
            
            // Load map
            mapLoader = MapLoader(sceneView)
            loadMap()
        }
        
        private fun configureMapDisplay() {
            sceneView.apply {
                setBackgroundColor(Color.parseColor("#F5F5F5"))
                
                displayConfig = DisplayConfig(
                    antiAliasing = true,
                    shadowsEnabled = true,
                    ambientOcclusion = true,
                    renderQuality = DisplayConfig.RenderQuality.HIGH
                )
                
                showFpsCounter = BuildConfig.DEBUG
            }
        }
        
        private fun setupGestureControls() {
            gestureHandler = GestureHandler(sceneView).apply {
                isPanEnabled = true
                isZoomEnabled = true
                isRotationEnabled = true
                minZoom = 1.0f
                maxZoom = 10.0f
            }
        }
        
        private fun loadMap() {
            val mapPath = "maps/shopping_mall.glb"
            
            mapLoader.loadFromAssets(
                context = this,
                assetPath = mapPath,
                onSuccess = { mapData ->
                    setupCamera(mapData)
                    Toast.makeText(this, "Map loaded!", Toast.LENGTH_SHORT).show()
                },
                onError = { error ->
                    Toast.makeText(
                        this, 
                        "Error: ${error.message}", 
                        Toast.LENGTH_LONG
                    ).show()
                }
            )
        }
        
        private fun setupCamera(mapData: MapData) {
            sceneView.camera.lookAt(
                eye = floatArrayOf(0f, 15f, 15f),
                center = floatArrayOf(0f, 0f, 0f),
                up = floatArrayOf(0f, 1f, 0f)
            )
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
    <FrameLayout 
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        
        <com.machinestalk.indoornavigationengine.ui.MineSceneView
            android:id="@+id/sceneView"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />
        
        <!-- Optional: Add UI controls overlay -->
        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="bottom|center_horizontal"
            android:layout_marginBottom="16dp"
            android:orientation="horizontal"
            android:padding="8dp"
            android:background="@drawable/rounded_background">
            
            <Button
                android:id="@+id/btnZoomIn"
                android:layout_width="48dp"
                android:layout_height="48dp"
                android:text="+" />
            
            <Button
                android:id="@+id/btnZoomOut"
                android:layout_width="48dp"
                android:layout_height="48dp"
                android:text="-"
                android:layout_marginStart="8dp" />
                
        </LinearLayout>
        
    </FrameLayout>
    ```

---

## <span class="emoji"> :material-check-all: </span> Testing Your App

Build and run your app to see the navigation engine in action!

1. **Connect a device** or start an emulator
2. **Build the project**: `Build → Make Project`
3. **Run the app**: Click the Run button or press `Shift + F10`

!!! success "Congratulations! 🎉"
    You've successfully created your first indoor navigation app! The map should now be displayed with full gesture support.

---

## <span class="emoji"> :material-lightning-bolt: </span> Next Steps

Now that you have a basic navigation app running, explore these advanced features:

<div class="grid cards" markdown>

-   :material-code-braces:{ .lg .middle } **Advanced Usage**

    ---

    Learn advanced techniques and best practices

    [:octicons-arrow-right-24: Usage Guide](usage.md)

-   :material-navigation:{ .lg .middle } **Navigation & Routing**

    ---

    Implement turn-by-turn navigation and path finding

    [:octicons-arrow-right-24: Navigation Features](../features/navigation.md)

-   :material-palette:{ .lg .middle } **Customize Themes**

    ---

    Apply custom themes and styling to your maps

    [:octicons-arrow-right-24: Theme Customization](../features/theme_customization.md)

-   :material-widgets:{ .lg .middle } **UI Components**

    ---

    Add pre-built UI components for enhanced UX

    [:octicons-arrow-right-24: UI Components](../features/ui_components.md)

</div>

---

## <span class="emoji"> :material-help-circle: </span> Common Issues

??? question "Map not displaying?"
    **Check these items:**
    
    - Verify the map file exists in your `assets/maps/` folder
    - Ensure the file format is supported (GLB, GLTF)
    - Check logcat for error messages
    - Verify lifecycle methods are properly called

??? question "Touch gestures not working?"
    **Solution**: Make sure you're not consuming touch events in a parent view. Also verify that `GestureHandler` is properly initialized.

??? question "Performance issues?"
    **Try these optimizations:**
    
    - Reduce `RenderQuality` to `MEDIUM` or `LOW`
    - Disable shadows or ambient occlusion
    - Optimize your 3D model file size
    - Test on a physical device rather than emulator

For more troubleshooting help, visit our [Troubleshooting Guide](../support/troubleshooting.md).

---

## <span class="emoji"> :material-book-open-variant: </span> Additional Resources

- 📖 [Full API Reference](../api_reference/module_overview.md)
- 🎯 [Feature Overview](../features/features_overview.md)
- 💬 [FAQ](../support/faq.md)
- 📧 [Contact Support](../support/contact_us.md)

!!! tip "Join Our Community"
    Have questions or want to share your project? Connect with other developers using MINE!

