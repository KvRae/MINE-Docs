# <span class="emoji"> :material-chat-question: </span> Frequently Asked Questions

Find quick answers to common questions about **MINE - Indoor Navigation Engine**. Can't find what you're looking for? [Contact our support team](contact_us.md).

!!! tip "Quick Search"
    Use `Ctrl+F` (or `Cmd+F` on Mac) to search for keywords on this page.

---

## <span class="emoji"> :material-compass: </span> Table of Contents

- [Getting Started](#getting-started)
- [Features & Capabilities](#features-capabilities)
- [Technical Questions](#technical-questions)
- [Licensing & Pricing](#licensing-pricing)
- [Platform Support](#platform-support)
- [Integration & Development](#integration-development)
- [Performance & Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Community & Support](#community-support)

---

## <span class="emoji"> :material-rocket-launch: </span> Getting Started

### How do I get started with MINE?

Getting started is easy! Follow these steps:

1. **Install the Library**: Add the dependency to your `build.gradle` file
   ```kotlin
   implementation("com.machinestalk:indoornavigationengine:0.4.0-alpha")
   ```

2. **Configure Your Project**: Set up Java 17 compatibility
   ```kotlin
   compileOptions {
       sourceCompatibility = JavaVersion.VERSION_17
       targetCompatibility = JavaVersion.VERSION_17
   }
   ```

3. **Follow the Quick Start Guide**: Our [Quick Start Guide](../getting_started/quick_start.md) provides a step-by-step tutorial on setting up your first navigation experience.

4. **Explore Examples**: Check out the [Usage Guide](../getting_started/usage.md) for comprehensive code examples.

**Estimated Time**: 10-15 minutes to have a working navigation app!

---

### What are the prerequisites for using MINE?

You'll need:

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| **Android Studio** | Arctic Fox | Latest Stable |
| **JDK** | 17 | 17+ |
| **Android SDK** | API 24 (Android 7.0) | API 34 (Android 14) |
| **Gradle** | 8.2 | Latest |
| **Kotlin** | 1.8.0 | Latest |

**Additional Requirements**:
- Basic knowledge of Android development
- Understanding of Kotlin or Java
- 3D map models in glTF/GLB format
- (Optional) Indoor positioning infrastructure (WiFi, Beacons)

---

### Do you provide sample projects or demos?

Yes! We provide:

- 📱 **Sample App**: Complete reference implementation showcasing all features
- 💻 **Code Snippets**: Ready-to-use code examples in our documentation
- 🎥 **Video Tutorials**: Step-by-step video guides (coming soon)
- 🗂️ **Sample Map Data**: Example JSON configurations and 3D models

Check our [GitHub repository](#) or [contact us](contact_us.md) for access to sample projects.

---

## <span class="emoji"> :material-feature-search: </span> Features & Capabilities

### What are the key features of MINE?

MINE offers a comprehensive set of features for indoor navigation:

<div class="grid cards" markdown>

-   :material-cube-outline:{ .lg .middle } **3D/2D Rendering**

    ---

    Hardware-accelerated rendering with seamless view switching

-   :material-map-marker-path:{ .lg .middle } **Path Finding**

    ---

    Advanced A* algorithm with multi-floor support

-   :material-navigation-variant:{ .lg .middle } **Real-time Navigation**

    ---

    Turn-by-turn directions with live position tracking

-   :material-widgets:{ .lg .middle } **UI Components**

    ---

    Pre-built, customizable components for navigation

-   :material-theme-light-dark:{ .lg .middle } **Theme Support**

    ---

    Dark/light mode with custom theme capabilities

-   :material-map-marker-radius:{ .lg .middle } **Location Tracking**

    ---

    Multi-provider positioning (WiFi, Bluetooth, sensors)

-   :material-routes:{ .lg .middle } **Accessible Routing**

    ---

    Wheelchair-accessible paths and alternative routes

-   :material-timer-sand:{ .lg .middle } **Offline Support**

    ---

    Work without internet connectivity (coming soon)

</div>

**Complete Feature List**: See our [Features Overview](../features/features_overview.md) for detailed information.

---

### Does MINE support multi-floor navigation?

**Yes!** Multi-floor navigation is fully supported:

- ✅ Automatic floor detection
- ✅ Elevator and stairway routing
- ✅ Seamless floor transitions
- ✅ Floor selector UI component
- ✅ Floor-aware path finding

**Example**:
```kotlin
// Navigate across floors
val route = pathFinder.findPath(
    start = Location(floor = "ground", x = 10f, y = 5f),
    end = Location(floor = "first", x = 25f, y = 15f)
)
// Route automatically includes floor change instructions
```

Learn more in our [Navigation Guide](../features/navigation.md).

---

### Can I customize the map appearance?

**Absolutely!** MINE offers extensive customization:

**Theme Customization**:
- Primary, secondary, and accent colors
- Path colors and widths
- POI marker styles
- Background colors
- Typography and fonts

**Visual Elements**:
- Custom icons for POIs
- Floor plan overlays
- Route visualization styles
- UI component styling

**Example**:
```kotlin
val customTheme = ThemeConfig(
    primaryColor = Color.parseColor("#FF5722"),
    pathColor = Color.parseColor("#4CAF50"),
    poiMarkerColor = Color.parseColor("#FFC107")
)
sceneView.setThemeConfig(customTheme)
```

See [Theme Customization](../features/theme_customization.md) for complete details.

---

### Does MINE support voice navigation?

**Coming Soon!** Voice navigation is planned for v0.5.0 (Q4 2024):

- 🔊 Text-to-speech turn-by-turn directions
- 🌐 Multi-language support (15+ languages)
- 🎚️ Adjustable voice settings
- 🔇 Optional silent mode

**Current Capabilities**:
- Visual turn-by-turn instructions
- Progress indicators
- Distance and time estimates
- Haptic feedback

Follow our [Release Notes](../release_notes/release_notes.md) for updates!

---

## <span class="emoji"> :material-code-braces: </span> Technical Questions

### What map formats does MINE support?

**3D Models**:
- ✅ glTF (.gltf)
- ✅ Binary glTF (.glb) - Recommended
- ❌ OBJ, FBX, BLEND (not supported)

**Map Configuration**:
- ✅ JSON for map structure and metadata
- ✅ Custom properties and extensions

**Best Practices**:
- Use `.glb` format for better performance
- Keep models under 50MB for optimal loading
- Optimize textures for mobile devices
- Use Draco compression when possible

---

### How accurate is the indoor positioning?

Accuracy depends on the positioning technology used:

| Technology | Typical Accuracy | Best Use Case |
|-----------|-----------------|---------------|
| **WiFi Fingerprinting** | 3-5 meters | Large venues |
| **Bluetooth Beacons** | 1-3 meters | Precise navigation |
| **Sensor Fusion** | 2-8 meters | Complementary |
| **PDR** | 5-15 meters | Movement tracking |
| **Combined** | 1-3 meters | Optimal setup |

**Improving Accuracy**:
- Deploy more beacons
- Use WiFi fingerprinting calibration
- Enable sensor fusion
- Regular maintenance of infrastructure

---

### Can I use my own positioning system?

**Yes!** MINE supports custom location providers:

```kotlin
class CustomLocationProvider : LocationProvider {
    
    override val name = "Custom Provider"
    
    override fun startTracking() {
        // Your positioning logic
    }
    
    override fun stopTracking() {
        // Cleanup
    }
    
    override fun getCurrentLocation(): Location {
        // Return current position
        return Location(x = x, y = y, floor = floorId)
    }
}

// Register your provider
locationTracker.addProvider(CustomLocationProvider(), priority = 10)
```

See [Location Tracking](../features/navigation.md#location-tracking) for details.

---

### What rendering engine does MINE use?

MINE uses **Google Filament** - a physically-based rendering engine:

**Benefits**:
- 🎨 High-quality 3D graphics
- ⚡ Hardware-accelerated performance
- 📱 Optimized for mobile devices
- 🔧 Industry-standard pipeline

**Performance**:
- 60 FPS on mid-range devices
- Efficient memory usage
- Battery-optimized rendering

**Learn More**: [Filament API Reference](../api_reference/filament.md)

---

### Does MINE work offline?

**Partial Support**:
- ✅ Currently: Pre-loaded maps work offline
- ✅ Currently: Navigation without internet
- ❌ Currently: No offline map downloads
- 🔄 Coming in v0.5.0: Full offline map packages

**Current Offline Capabilities**:
```kotlin
// Load map from assets (works offline)
val mapData = JsonUtil.LoadJsonFromAsset(context, "maps/venue.json")
sceneView.setMapData(mapData)

// Navigation works without internet
navigationManager.startNavigation(destination)
```

---

## <span class="emoji"> :material-currency-usd: </span> Licensing & Pricing

### Is MINE free to use?

**License Options**:

| License Type | Cost | Use Case |
|-------------|------|----------|
| **Development** | Free | Testing and development |
| **Commercial** | Paid | Production applications |
| **Enterprise** | Custom | Large-scale deployments |
| **Open Source** | Free* | Non-commercial projects |

*Free for approved open-source projects

**What's Included**:
- ✅ Full feature access
- ✅ Regular updates
- ✅ Documentation
- ✅ Bug fixes
- ✅ Community support

**Commercial License Includes**:
- ✅ Priority support
- ✅ Custom development
- ✅ SLA guarantees
- ✅ On-premise deployment options

**Get Started**: [Contact us](contact_us.md) for pricing information.

---

### Do you offer educational discounts?

**Yes!** We support education:

- 🎓 **Academic Licenses**: Free for universities and research
- 👨‍🎓 **Student Discounts**: Reduced pricing for student projects
- 🏫 **Educational Institutions**: Special pricing tiers

**Requirements**:
- Valid educational email address
- Proof of enrollment/employment
- Non-commercial use

**Apply**: [Contact us](contact_us.md) with your educational credentials.

---

### Can I evaluate MINE before purchasing?

**Absolutely!** We offer:

- ⏰ **30-Day Trial**: Full-featured evaluation
- 📊 **Proof of Concept**: Test with your data
- 🤝 **Technical Consultation**: Help with evaluation
- 💻 **Sample Projects**: Pre-built examples

**Trial Includes**:
- All features unlocked
- Technical support
- Documentation access
- Sample maps and data

**Start Trial**: [Contact us](contact_us.md) to request evaluation access.

---

## <span class="emoji"> :material-android: </span> Platform Support

### Which Android versions are supported?

| Android Version | API Level | Support Status |
|----------------|-----------|----------------|
| Android 14 | 34 | ✅ Fully Supported |
| Android 13 | 33 | ✅ Fully Supported |
| Android 12 | 31-32 | ✅ Fully Supported |
| Android 11 | 30 | ✅ Fully Supported |
| Android 10 | 29 | ✅ Fully Supported |
| Android 9 | 28 | ✅ Fully Supported |
| Android 8 | 26-27 | ✅ Supported |
| Android 7 | 24-25 | ✅ Minimum Required |
| Android 6 | 23 | ❌ Not Supported |

**Target SDK**: 34 (Android 14)  
**Minimum SDK**: 24 (Android 7.0)

---

### Does MINE support iOS?

**Not Currently**: MINE is Android-only at this time.

**Future Plans**:
- 🔄 iOS version under consideration
- 📱 Would use native iOS APIs
- 🎯 Planned for 2025 (tentative)

**Alternatives**:
- Consider Kotlin Multiplatform Mobile (KMM) in the future
- Contact us to express interest in iOS support

**Request Updates**: [Join our mailing list](contact_us.md) for iOS announcements.

---

### Are there any plans for Kotlin Multiplatform?

**Under Evaluation**: We're exploring Kotlin Multiplatform (KMP):

**Considerations**:
- 📊 Assessing community demand
- 🔧 Technical feasibility analysis
- 🗓️ No timeline confirmed yet

**Current Focus**:
- Improving Android experience
- Adding more features
- Performance optimization

**Share Your Interest**: If KMP support is important to you, [let us know](contact_us.md)!

---

### Does MINE support tablets?

**Yes!** MINE works great on tablets:

- ✅ Responsive UI components
- ✅ Optimized layouts for large screens
- ✅ Enhanced navigation experience
- ✅ Split-screen support
- ✅ Tested on 7"-12" tablets

**Tablet-Specific Features**:
- Larger map viewing area
- Side-by-side POI information
- Enhanced UI controls
- Better readability

---

## <span class="emoji"> :material-puzzle: </span> Integration & Development

### Can I integrate MINE with my existing app?

**Yes!** MINE is designed for easy integration:

**Integration Points**:
- 🎨 Custom UI/UX
- 🗺️ Existing maps
- 📍 Location services
- 📊 Analytics platforms
- 🔐 Authentication systems

**Flexible Architecture**:
```kotlin
// Use as Activity
class NavActivity : AppCompatActivity() {
    private lateinit var sceneView: MineSceneView
}

// Use as Fragment
class NavFragment : Fragment() {
    private var sceneView: MineSceneView? = null
}

// Use in Jetpack Compose
@Composable
fun MapScreen() {
    IndoorNavigationScene(mapBuild = mapData)
}
```

See [Usage Guide](../getting_started/usage.md) for integration patterns.

---

### How do I add custom Points of Interest (POIs)?

**Easy POI Management**:

```kotlin
// Add POI programmatically
val poi = PointOfInterest(
    id = "coffee-shop-01",
    name = "Starbucks",
    category = "Food & Drink",
    floor = "ground",
    position = floatArrayOf(15.5f, 8.2f, 0f),
    icon = R.drawable.ic_coffee,
    metadata = mapOf(
        "phone" to "+1-555-1234",
        "hours" to "7am-9pm"
    )
)

poiManager.addPOI(poi)

// Or load from JSON
{
  "pointsOfInterest": [
    {
      "id": "coffee-shop-01",
      "name": "Starbucks",
      "category": "Food & Drink",
      "floor": "ground",
      "position": { "x": 15.5, "y": 8.2, "z": 0 }
    }
  ]
}
```

---

### Can I use MINE with Jetpack Compose?

**Yes!** Full Compose support:

```kotlin
@Composable
fun NavigationScreen() {
    val context = LocalContext.current
    val mapData = remember {
        JsonUtil.LoadJsonFromAsset(context, "maps/venue.json")
    }
    
    Box(modifier = Modifier.fillMaxSize()) {
        mapData?.let {
            IndoorNavigationScene(
                mapBuild = it,
                modifier = Modifier.fillMaxSize()
            )
        }
        
        // Add Compose UI overlays
        FloatingActionButton(
            onClick = { /* Navigate */ },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp)
        ) {
            Icon(Icons.Default.Navigation, "Navigate")
        }
    }
}
```

See [Compose Integration](../getting_started/usage.md#jetpack-compose-integration) for more.

---

### Does MINE support K2 (Kotlin 2.0)?

**Yes!** MINE fully supports Kotlin 2.0:

- ✅ Compatible with K2 compiler
- ✅ Tested with Kotlin 2.0+
- ✅ Takes advantage of K2 improvements
- ✅ No migration issues

**Benefits**:
- Faster compilation times
- Better IDE performance
- Improved type inference
- Enhanced code analysis

If you encounter any K2-related issues, [please report them](contact_us.md).

---

## <span class="emoji"> :material-speedometer: </span> Performance & Optimization

### How does MINE perform on low-end devices?

**Adaptive Performance**:

MINE automatically adjusts quality based on device capabilities:

| Device Tier | Frame Rate | Quality | Memory |
|------------|-----------|---------|--------|
| **Flagship** | 60 FPS | High | 150MB |
| **Mid-range** | 60 FPS | Medium | 120MB |
| **Budget** | 30-45 FPS | Low | 90MB |

**Optimization Tips**:
```kotlin
// Detect and optimize for low-end devices
if (DeviceUtil.isLowEndDevice()) {
    sceneView.displayConfig = DisplayConfig(
        renderQuality = DisplayConfig.RenderQuality.LOW,
        shadowsEnabled = false
    )
    sceneView.setRenderMode(RenderMode.MODE_2D)
}
```

See [Performance Optimization](../getting_started/usage.md#performance-optimization).

---

### What's the app size impact?

**Library Size**:
- AAR Size: ~8MB
- With dependencies: ~15MB
- Native libraries (all ABIs): ~12MB

**Optimization**:
```kotlin
// Reduce APK size by filtering ABIs
android {
    defaultConfig {
        ndk {
            abiFilters += listOf("armeabi-v7a", "arm64-v8a")
        }
    }
}
```

**Result**: Can reduce by ~40% by targeting specific architectures.

---

### How much battery does navigation consume?

**Battery Usage** (1 hour continuous navigation):

| Scenario | Battery Drain | Notes |
|----------|--------------|-------|
| 3D Navigation | 8-10% | High quality |
| 2D Navigation | 5-7% | Optimized |
| Background Tracking | 3-5% | Minimal |

**Battery Optimization**:
- Use 2D mode when possible
- Reduce location update frequency when stationary
- Lower render quality on low battery
- Pause rendering when app in background

---

## <span class="emoji"> :material-help-circle: </span> Troubleshooting

### Where can I find troubleshooting help?

**Resources**:

1. **Troubleshooting Guide**: [View detailed solutions](troubleshooting.md)
2. **FAQ**: You're here! Check other questions
3. **API Documentation**: [Browse API reference](../api_reference/module_overview.md)
4. **Support Team**: [Contact us](contact_us.md)

**Common Issues**:
- Map not loading → Check file paths
- Navigation not starting → Verify permissions
- Poor positioning → Check beacon configuration
- Performance issues → Optimize settings

---

### How do I report a bug?

**Bug Reporting**:

1. **Check Existing Issues**: Search our [FAQ](#) and [Troubleshooting](troubleshooting.md)
2. **Gather Information**:
   - MINE version
   - Android version and device model
   - Steps to reproduce
   - Error logs
   - Screenshots/videos

3. **Submit Report**: [Contact support](contact_us.md) with details

**We Value Feedback**: Every bug report helps improve MINE!

---

### What logging should I enable for debugging?

**Debug Configuration**:

```kotlin
if (BuildConfig.DEBUG) {
    // Enable verbose logging
    MineLogger.setLogLevel(MineLogger.Level.VERBOSE)
    
    // Show debug overlays
    sceneView.showDebugOverlay = true
    sceneView.showFpsCounter = true
    
    // Enable wireframe mode
    sceneView.debugWireframe = false
    
    // Log navigation events
    navigationManager.enableDebugLogging = true
}

// Capture logs
adb logcat MINE:V *:S > mine_logs.txt
```

---

## <span class="emoji"> :material-account-group: </span> Community & Support

### Where can I get help?

**Support Channels**:

<div class="grid cards" markdown>

-   :material-email:{ .lg .middle } **Email Support**

    ---

    Direct support from our team

    [:octicons-arrow-right-24: Contact Us](contact_us.md)

-   :material-file-document:{ .lg .middle } **Documentation**

    ---

    Comprehensive guides and references

    [:octicons-arrow-right-24: Browse Docs](../getting_started/quick_start.md)

-   :material-chat-question:{ .lg .middle } **FAQ**

    ---

    Quick answers to common questions

    [:octicons-arrow-right-24: View FAQ](#)

-   :material-bug:{ .lg .middle } **Bug Reports**

    ---

    Report issues and track fixes

    [:octicons-arrow-right-24: Report Bug](contact_us.md)

</div>

---

### How can I contribute to MINE?

**Current Status**: Not accepting public contributions

**But You Can Help**:
- 📝 Report bugs and issues
- 💡 Suggest features
- 📖 Share feedback on documentation
- 🌟 Share your success stories

**Future Plans**: We may open source parts of MINE in the future.

---

### Do you have a developer community?

**Community Resources** (Coming Soon):

- 💬 Developer Forum
- 👥 Slack Channel
- 🐦 Twitter/X Updates
- 📺 YouTube Tutorials
- 📝 Developer Blog

**Stay Connected**: [Contact us](contact_us.md) to join our mailing list!

---

### What's the release schedule?

**Current Cycle**:
- Major releases: Quarterly
- Minor updates: Monthly
- Bug fixes: As needed
- Security patches: Immediate

**Upcoming Releases**:
- **v0.5.0** (Q4 2024): Offline maps, voice guidance
- **v0.6.0** (Q1 2025): AR navigation, analytics
- **v1.0.0** (Q1 2025): Production release

See [Release Notes](../release_notes/release_notes.md) for detailed roadmap.

---

## <span class="emoji"> :material-alert-circle: </span> Still Have Questions?

<div class="grid cards" markdown>

-   :material-email-fast:{ .lg .middle } **Contact Support**

    ---

    Get personalized help from our team

    [:octicons-arrow-right-24: Send Message](contact_us.md)

-   :material-book-open-variant:{ .lg .middle } **Browse Documentation**

    ---

    Explore comprehensive guides

    [:octicons-arrow-right-24: View Docs](../getting_started/quick_start.md)

-   :material-tools:{ .lg .middle } **Troubleshooting**

    ---

    Find solutions to common issues

    [:octicons-arrow-right-24: Get Help](troubleshooting.md)

</div>

---

!!! success "We're Here to Help!"
    Can't find your answer? Don't hesitate to [reach out](contact_us.md) - we're happy to help you succeed with MINE!
