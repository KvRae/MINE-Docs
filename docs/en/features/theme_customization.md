# <span class="emoji"> :octicons-paintbrush-16: </span> Theme Customization

## Overview

**Theme Customization** enables you to create a branded indoor navigation experience that seamlessly integrates with your application's design language. MINE supports comprehensive theming including colors, typography, UI components, icons, and layout styles, all while maintaining support for both Light and Dark modes.

!!! abstract "Customization Capabilities"
    - 🎨 **Complete Color Control**: Customize every visual element color
    - 🌓 **Light/Dark Mode**: Built-in support with automatic system theme detection
    - 🔤 **Typography Styling**: Custom fonts, sizes, and text styles
    - 🎯 **Component Theming**: Style markers, paths, POIs, and UI elements
    - 🖼️ **Icon Customization**: Replace default icons with custom assets
    - 📱 **Responsive Design**: Themes adapt to different screen sizes
    - 💾 **Theme Persistence**: Save and restore user theme preferences

---

## Default Theme Colors

MINE provides carefully crafted default themes optimized for readability and visual clarity:

### Color Palette

<div class="grid" markdown>

=== "Light Theme"

    | Component | Color | Hex | Preview |
    |-----------|-------|-----|---------|
    | **Ground** | Light Pink | `#FDE4E4` | <span style="display:inline-block;width:50px;height:20px;background:#FDE4E4;border:1px solid #ccc;"></span> |
    | **Pathways** | Light Pink | `#FDE4E4` | <span style="display:inline-block;width:50px;height:20px;background:#FDE4E4;border:1px solid #ccc;"></span> |
    | **Walls** | Gray | `#888383` | <span style="display:inline-block;width:50px;height:20px;background:#888383;border:1px solid #ccc;"></span> |
    | **POI** | Light Gray | `#B9B2B2` | <span style="display:inline-block;width:50px;height:20px;background:#B9B2B2;border:1px solid #ccc;"></span> |
    | **Selected POI** | Steel Blue | `#779CB7` | <span style="display:inline-block;width:50px;height:20px;background:#779CB7;border:1px solid #ccc;"></span> |
    | **Navigation Path** | Blue | `#2196F3` | <span style="display:inline-block;width:50px;height:20px;background:#2196F3;border:1px solid #ccc;"></span> |
    | **User Location** | Orange | `#FF5722` | <span style="display:inline-block;width:50px;height:20px;background:#FF5722;border:1px solid #ccc;"></span> |

=== "Dark Theme"

    | Component | Color | Hex | Preview |
    |-----------|-------|-----|---------|
    | **Ground** | Dark Gray | `#282828` | <span style="display:inline-block;width:50px;height:20px;background:#282828;border:1px solid #ccc;"></span> |
    | **Pathways** | Medium Gray | `#575757` | <span style="display:inline-block;width:50px;height:20px;background:#575757;border:1px solid #ccc;"></span> |
    | **Walls** | Dark Gray | `#282828` | <span style="display:inline-block;width:50px;height:20px;background:#282828;border:1px solid #ccc;"></span> |
    | **POI** | Charcoal | `#3F3F3F` | <span style="display:inline-block;width:50px;height:20px;background:#3F3F3F;border:1px solid #ccc;"></span> |
    | **Selected POI** | Forest Green | `#2D7C32` | <span style="display:inline-block;width:50px;height:20px;background:#2D7C32;border:1px solid #ccc;"></span> |
    | **Navigation Path** | Light Blue | `#64B5F6` | <span style="display:inline-block;width:50px;height:20px;background:#64B5F6;border:1px solid #ccc;"></span> |
    | **User Location** | Deep Orange | `#FF6E40` | <span style="display:inline-block;width:50px;height:20px;background:#FF6E40;border:1px solid #ccc;"></span> |

</div>

### Default Theme Demo

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/18a0fbef-ae91-4513-9903-81db8d1948a2" alt="default_theme" loading="lazy">
</p>

!!! tip "Using Default Theme"
    The default theme is automatically applied if no custom theme is specified. Simply initialize MINE without providing a `mapColorTheme` parameter.

---

## Basic Theme Implementation

### Using Default Theme

```kotlin
import com.machinestalk.indoornavigationengine.components.MineSceneView
import com.machinestalk.indoornavigationengine.models.MapColorTheme

class MainActivity : AppCompatActivity() {
    
    private lateinit var sceneView: MineSceneView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        sceneView = findViewById(R.id.scene_view)
        
        // Initialize with default theme (no theme parameter needed)
        sceneView.initialize(
            context = this,
            mapUrl = "maps/venue.json"
            // mapColorTheme is optional - defaults will be used
        )
    }
}
```

### Creating a Custom Theme

```kotlin
import android.graphics.Color
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable

@Composable
fun createCustomTheme(): MapColorTheme {
    val isDarkTheme = isSystemInDarkTheme()
    
    return if (isDarkTheme) {
        MapColorTheme(
            ground = Color.parseColor("#1A1A1A"),
            pathways = Color.parseColor("#404040"),
            walls = Color.parseColor("#2A2A2A"),
            poi = Color.parseColor("#505050"),
            selectedPoi = Color.parseColor("#4CAF50"),
            navigationPath = Color.parseColor("#64B5F6"),
            userLocation = Color.parseColor("#FF6E40"),
            obstacles = Color.parseColor("#E53935"),
            textPrimary = Color.parseColor("#FFFFFF"),
            textSecondary = Color.parseColor("#B0B0B0"),
            background = Color.parseColor("#121212"),
            surface = Color.parseColor("#1E1E1E")
        )
    } else {
        MapColorTheme(
            ground = Color.parseColor("#F5F5F5"),
            pathways = Color.parseColor("#E0E0E0"),
            walls = Color.parseColor("#9E9E9E"),
            poi = Color.parseColor("#BDBDBD"),
            selectedPoi = Color.parseColor("#2196F3"),
            navigationPath = Color.parseColor("#1976D2"),
            userLocation = Color.parseColor("#FF5722"),
            obstacles = Color.parseColor("#D32F2F"),
            textPrimary = Color.parseColor("#212121"),
            textSecondary = Color.parseColor("#757575"),
            background = Color.parseColor("#FFFFFF"),
            surface = Color.parseColor("#FAFAFA")
        )
    }
}

// Apply custom theme
sceneView.initialize(
    context = this,
    mapUrl = "maps/venue.json",
    mapColorTheme = createCustomTheme()
)
```

---

## Advanced Theme Customization

### Complete Theme Configuration

```kotlin
data class MapColorTheme(
    // Map Components
    val ground: Int,
    val pathways: Int,
    val walls: Int,
    val doors: Int = Color.parseColor("#8D6E63"),
    val windows: Int = Color.parseColor("#B0BEC5"),
    val obstacles: Int = Color.parseColor("#E53935"),
    
    // Points of Interest
    val poi: Int,
    val selectedPoi: Int,
    val poiBorder: Int = Color.WHITE,
    val poiText: Int = Color.BLACK,
    
    // Navigation
    val navigationPath: Int,
    val alternativePath: Int = Color.parseColor("#9E9E9E"),
    val pathOutline: Int = Color.WHITE,
    val userLocation: Int,
    val userLocationAccuracyCircle: Int = Color.parseColor("#4D2196F3"),
    val destinationMarker: Int = Color.parseColor("#F44336"),
    
    // UI Elements
    val textPrimary: Int,
    val textSecondary: Int,
    val background: Int,
    val surface: Int,
    val primaryAccent: Int = Color.parseColor("#2196F3"),
    val secondaryAccent: Int = Color.parseColor("#4CAF50"),
    val errorColor: Int = Color.parseColor("#F44336"),
    val warningColor: Int = Color.parseColor("#FF9800"),
    
    // Floor Transitions
    val elevator: Int = Color.parseColor("#9C27B0"),
    val stairs: Int = Color.parseColor("#FF9800"),
    val escalator: Int = Color.parseColor("#00BCD4"),
    val ramp: Int = Color.parseColor("#8BC34A"),
    
    // Additional
    val shadowColor: Int = Color.parseColor("#33000000"),
    val highlightColor: Int = Color.parseColor("#FFEB3B"),
    val disabledColor: Int = Color.parseColor("#BDBDBD")
)
```

### Brand-Specific Themes

```kotlin
object BrandThemes {
    
    // Corporate Blue Theme
    fun corporateBlue(isDark: Boolean = false): MapColorTheme {
        return if (isDark) {
            MapColorTheme(
                ground = Color.parseColor("#0D1B2A"),
                pathways = Color.parseColor("#1B263B"),
                walls = Color.parseColor("#0D1B2A"),
                poi = Color.parseColor("#415A77"),
                selectedPoi = Color.parseColor("#778DA9"),
                navigationPath = Color.parseColor("#64B5F6"),
                userLocation = Color.parseColor("#E0E1DD"),
                textPrimary = Color.parseColor("#E0E1DD"),
                textSecondary = Color.parseColor("#778DA9"),
                background = Color.parseColor("#0D1B2A"),
                surface = Color.parseColor("#1B263B")
            )
        } else {
            MapColorTheme(
                ground = Color.parseColor("#E0E1DD"),
                pathways = Color.parseColor("#778DA9"),
                walls = Color.parseColor("#415A77"),
                poi = Color.parseColor("#415A77"),
                selectedPoi = Color.parseColor("#1B263B"),
                navigationPath = Color.parseColor("#0D47A1"),
                userLocation = Color.parseColor("#1B263B"),
                textPrimary = Color.parseColor("#0D1B2A"),
                textSecondary = Color.parseColor("#415A77"),
                background = Color.parseColor("#FFFFFF"),
                surface = Color.parseColor("#F5F5F5")
            )
        }
    }
    
    // Modern Green Theme
    fun modernGreen(isDark: Boolean = false): MapColorTheme {
        return if (isDark) {
            MapColorTheme(
                ground = Color.parseColor("#1B1F1B"),
                pathways = Color.parseColor("#2D3A2D"),
                walls = Color.parseColor("#1B1F1B"),
                poi = Color.parseColor("#4A5F4A"),
                selectedPoi = Color.parseColor("#66BB6A"),
                navigationPath = Color.parseColor("#81C784"),
                userLocation = Color.parseColor("#AED581"),
                textPrimary = Color.parseColor("#E8F5E9"),
                textSecondary = Color.parseColor("#81C784"),
                background = Color.parseColor("#1B1F1B"),
                surface = Color.parseColor("#2D3A2D")
            )
        } else {
            MapColorTheme(
                ground = Color.parseColor("#F1F8E9"),
                pathways = Color.parseColor("#DCEDC8"),
                walls = Color.parseColor("#9E9D24"),
                poi = Color.parseColor("#689F38"),
                selectedPoi = Color.parseColor("#388E3C"),
                navigationPath = Color.parseColor("#4CAF50"),
                userLocation = Color.parseColor("#1B5E20"),
                textPrimary = Color.parseColor("#1B5E20"),
                textSecondary = Color.parseColor("#558B2F"),
                background = Color.parseColor("#FFFFFF"),
                surface = Color.parseColor("#F1F8E9")
            )
        }
    }
    
    // Healthcare Theme
    fun healthcare(isDark: Boolean = false): MapColorTheme {
        return if (isDark) {
            MapColorTheme(
                ground = Color.parseColor("#1A1A2E"),
                pathways = Color.parseColor("#16213E"),
                walls = Color.parseColor("#0F3460"),
                poi = Color.parseColor("#533483"),
                selectedPoi = Color.parseColor("#E94560"),
                navigationPath = Color.parseColor("#00ADB5"),
                userLocation = Color.parseColor("#EEEEEE"),
                textPrimary = Color.parseColor("#EEEEEE"),
                textSecondary = Color.parseColor("#00ADB5"),
                background = Color.parseColor("#1A1A2E"),
                surface = Color.parseColor("#16213E")
            )
        } else {
            MapColorTheme(
                ground = Color.parseColor("#F8F9FA"),
                pathways = Color.parseColor("#E9ECEF"),
                walls = Color.parseColor("#ADB5BD"),
                poi = Color.parseColor("#6C757D"),
                selectedPoi = Color.parseColor("#0D6EFD"),
                navigationPath = Color.parseColor("#0DCAF0"),
                userLocation = Color.parseColor("#DC3545"),
                textPrimary = Color.parseColor("#212529"),
                textSecondary = Color.parseColor("#6C757D"),
                background = Color.parseColor("#FFFFFF"),
                surface = Color.parseColor("#F8F9FA")
            )
        }
    }
    
    // Retail/Shopping Theme
    fun retail(isDark: Boolean = false): MapColorTheme {
        return if (isDark) {
            MapColorTheme(
                ground = Color.parseColor("#2C1810"),
                pathways = Color.parseColor("#3E2723"),
                walls = Color.parseColor("#4E342E"),
                poi = Color.parseColor("#6D4C41"),
                selectedPoi = Color.parseColor("#FF6F00"),
                navigationPath = Color.parseColor("#FFB74D"),
                userLocation = Color.parseColor("#FF8A65"),
                textPrimary = Color.parseColor("#FFF3E0"),
                textSecondary = Color.parseColor("#FFCC80"),
                background = Color.parseColor("#1C1C1C"),
                surface = Color.parseColor("#2C1810")
            )
        } else {
            MapColorTheme(
                ground = Color.parseColor("#FFF8E1"),
                pathways = Color.parseColor("#FFECB3"),
                walls = Color.parseColor("#F57C00"),
                poi = Color.parseColor("#EF6C00"),
                selectedPoi = Color.parseColor("#D84315"),
                navigationPath = Color.parseColor("#FF6F00"),
                userLocation = Color.parseColor("#BF360C"),
                textPrimary = Color.parseColor("#E65100"),
                textSecondary = Color.parseColor("#F57C00"),
                background = Color.parseColor("#FFFFFF"),
                surface = Color.parseColor("#FFF8E1")
            )
        }
    }
}

// Usage
sceneView.setTheme(BrandThemes.corporateBlue(isSystemInDarkTheme()))
```

### Custom Theme Demo

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/74e30214-c734-4712-97a4-ca1a560181f6" alt="custom_theme" loading="lazy">
</p>

!!! warning "Color Selection Guidelines"
    While MINE offers complete color customization, ensure your color choices maintain sufficient contrast for accessibility (WCAG 2.1 AA minimum). Test your theme in both light and dark modes.

---

## Typography Customization

Customize fonts, text sizes, and styles throughout the navigation interface:

```kotlin
data class MapTypography(
    // Font Families
    val headingFont: Typeface = Typeface.DEFAULT_BOLD,
    val bodyFont: Typeface = Typeface.DEFAULT,
    val monoFont: Typeface = Typeface.MONOSPACE,
    
    // Text Sizes (in SP)
    val headingLarge: Float = 24f,
    val headingMedium: Float = 20f,
    val headingSmall: Float = 18f,
    val bodyLarge: Float = 16f,
    val bodyMedium: Float = 14f,
    val bodySmall: Float = 12f,
    val caption: Float = 10f,
    
    // Text Styles
    val poiLabelSize: Float = 14f,
    val instructionTextSize: Float = 18f,
    val distanceTextSize: Float = 16f,
    val floorLabelSize: Float = 20f,
    
    // Text Properties
    val letterSpacing: Float = 0f,
    val lineHeight: Float = 1.5f
)

// Apply custom typography
val customTypography = MapTypography(
    headingFont = ResourcesCompat.getFont(context, R.font.roboto_bold)!!,
    bodyFont = ResourcesCompat.getFont(context, R.font.roboto_regular)!!,
    headingLarge = 28f,
    bodyMedium = 16f
)

sceneView.setTypography(customTypography)
```

---

## Component Styling

### POI Marker Customization

```kotlin
data class POIMarkerStyle(
    val shape: MarkerShape = MarkerShape.CIRCLE,
    val size: Float = 24f,
    val borderWidth: Float = 2f,
    val borderColor: Int = Color.WHITE,
    val shadowEnabled: Boolean = true,
    val shadowRadius: Float = 4f,
    val icon: Drawable? = null,
    val iconSize: Float = 16f,
    val labelEnabled: Boolean = true,
    val labelPosition: LabelPosition = LabelPosition.BOTTOM,
    val animationEnabled: Boolean = true
)

enum class MarkerShape {
    CIRCLE, SQUARE, ROUNDED_SQUARE, DIAMOND, PIN
}

enum class LabelPosition {
    TOP, BOTTOM, LEFT, RIGHT, CENTER
}

// Custom POI styling
val customPOIStyle = POIMarkerStyle(
    shape = MarkerShape.ROUNDED_SQUARE,
    size = 32f,
    borderWidth = 3f,
    borderColor = Color.parseColor("#2196F3"),
    shadowEnabled = true,
    icon = ContextCompat.getDrawable(context, R.drawable.ic_store),
    labelEnabled = true,
    labelPosition = LabelPosition.BOTTOM
)

sceneView.setPOIMarkerStyle(customPOIStyle)
```

### Navigation Path Styling

```kotlin
data class NavigationPathStyle(
    val width: Float = 4f,
    val color: Int = Color.parseColor("#2196F3"),
    val outlineWidth: Float = 2f,
    val outlineColor: Int = Color.WHITE,
    val dashPattern: FloatArray? = null, // null = solid line
    val animated: Boolean = true,
    val animationSpeed: Float = 1.0f,
    val gradientEnabled: Boolean = false,
    val gradientColors: IntArray? = null,
    val capStyle: Paint.Cap = Paint.Cap.ROUND,
    val joinStyle: Paint.Join = Paint.Join.ROUND
)

// Custom path styling
val customPathStyle = NavigationPathStyle(
    width = 6f,
    color = Color.parseColor("#4CAF50"),
    outlineWidth = 3f,
    outlineColor = Color.parseColor("#FFFFFF"),
    animated = true,
    animationSpeed = 1.5f,
    gradientEnabled = true,
    gradientColors = intArrayOf(
        Color.parseColor("#4CAF50"),
        Color.parseColor("#8BC34A")
    )
)

sceneView.setNavigationPathStyle(customPathStyle)
```

### User Location Marker

```kotlin
data class UserLocationStyle(
    val markerSize: Float = 20f,
    val markerColor: Int = Color.parseColor("#2196F3"),
    val pulseEnabled: Boolean = true,
    val pulseColor: Int = Color.parseColor("#4D2196F3"),
    val pulseRadius: Float = 40f,
    val headingIndicatorEnabled: Boolean = true,
    val headingIndicatorLength: Float = 30f,
    val headingIndicatorColor: Int = Color.parseColor("#2196F3"),
    val accuracyCircleEnabled: Boolean = true,
    val accuracyCircleColor: Int = Color.parseColor("#332196F3")
)

val customUserStyle = UserLocationStyle(
    markerSize = 24f,
    markerColor = Color.parseColor("#FF5722"),
    pulseEnabled = true,
    pulseColor = Color.parseColor("#4DFF5722"),
    headingIndicatorEnabled = true,
    accuracyCircleEnabled = true
)

sceneView.setUserLocationStyle(customUserStyle)
```

---

## Dynamic Theme Switching

Enable users to switch themes at runtime:

```kotlin
class ThemeManager(private val sceneView: MineSceneView) {
    
    private var currentTheme: ThemeMode = ThemeMode.SYSTEM
    
    enum class ThemeMode {
        LIGHT, DARK, SYSTEM
    }
    
    fun setTheme(mode: ThemeMode) {
        currentTheme = mode
        applyTheme()
    }
    
    private fun applyTheme() {
        val theme = when (currentTheme) {
            ThemeMode.LIGHT -> createLightTheme()
            ThemeMode.DARK -> createDarkTheme()
            ThemeMode.SYSTEM -> if (isSystemInDarkMode()) {
                createDarkTheme()
            } else {
                createLightTheme()
            }
        }
        
        sceneView.setTheme(theme, animated = true)
    }
    
    fun toggleTheme() {
        currentTheme = when (currentTheme) {
            ThemeMode.LIGHT -> ThemeMode.DARK
            ThemeMode.DARK -> ThemeMode.LIGHT
            ThemeMode.SYSTEM -> if (isSystemInDarkMode()) {
                ThemeMode.LIGHT
            } else {
                ThemeMode.DARK
            }
        }
        applyTheme()
    }
    
    private fun isSystemInDarkMode(): Boolean {
        return (context.resources.configuration.uiMode and 
                Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES
    }
}

// Usage
val themeManager = ThemeManager(sceneView)

// User taps theme toggle button
themeToggleButton.setOnClickListener {
    themeManager.toggleTheme()
}

// Or let user choose
themeDialog.show(options = listOf("Light", "Dark", "System")) { selection ->
    when (selection) {
        0 -> themeManager.setTheme(ThemeMode.LIGHT)
        1 -> themeManager.setTheme(ThemeMode.DARK)
        2 -> themeManager.setTheme(ThemeMode.SYSTEM)
    }
}
```

---

## Theme Persistence

Save and restore user theme preferences:

```kotlin
class ThemePreferences(context: Context) {
    
    private val prefs = context.getSharedPreferences("mine_theme", Context.MODE_PRIVATE)
    
    fun saveTheme(theme: MapColorTheme, name: String) {
        prefs.edit {
            putInt("${name}_ground", theme.ground)
            putInt("${name}_pathways", theme.pathways)
            putInt("${name}_walls", theme.walls)
            putInt("${name}_poi", theme.poi)
            putInt("${name}_selectedPoi", theme.selectedPoi)
            putInt("${name}_navigationPath", theme.navigationPath)
            putInt("${name}_userLocation", theme.userLocation)
            putInt("${name}_textPrimary", theme.textPrimary)
            putInt("${name}_textSecondary", theme.textSecondary)
            putInt("${name}_background", theme.background)
            putInt("${name}_surface", theme.surface)
        }
    }
    
    fun loadTheme(name: String): MapColorTheme? {
        if (!prefs.contains("${name}_ground")) {
            return null
        }
        
        return MapColorTheme(
            ground = prefs.getInt("${name}_ground", 0),
            pathways = prefs.getInt("${name}_pathways", 0),
            walls = prefs.getInt("${name}_walls", 0),
            poi = prefs.getInt("${name}_poi", 0),
            selectedPoi = prefs.getInt("${name}_selectedPoi", 0),
            navigationPath = prefs.getInt("${name}_navigationPath", 0),
            userLocation = prefs.getInt("${name}_userLocation", 0),
            textPrimary = prefs.getInt("${name}_textPrimary", 0),
            textSecondary = prefs.getInt("${name}_textSecondary", 0),
            background = prefs.getInt("${name}_background", 0),
            surface = prefs.getInt("${name}_surface", 0)
        )
    }
    
    fun saveThemeMode(mode: ThemeManager.ThemeMode) {
        prefs.edit {
            putString("theme_mode", mode.name)
        }
    }
    
    fun loadThemeMode(): ThemeManager.ThemeMode {
        val modeName = prefs.getString("theme_mode", ThemeManager.ThemeMode.SYSTEM.name)
        return ThemeManager.ThemeMode.valueOf(modeName!!)
    }
}

// Usage
val themePrefs = ThemePreferences(context)

// Save custom theme
themePrefs.saveTheme(customTheme, "my_brand_theme")
themePrefs.saveThemeMode(ThemeManager.ThemeMode.DARK)

// Load on app start
val savedTheme = themePrefs.loadTheme("my_brand_theme")
val savedMode = themePrefs.loadThemeMode()

if (savedTheme != null) {
    sceneView.setTheme(savedTheme)
}
```

---

## Best Practices

!!! success "Recommended Practices"
    
    **1. Maintain Accessibility**
    ```kotlin
    // ✅ Good: Ensure sufficient contrast
    fun validateContrast(foreground: Int, background: Int): Boolean {
        val contrastRatio = calculateContrastRatio(foreground, background)
        return contrastRatio >= 4.5 // WCAG AA standard
    }
    
    // Test your theme colors
    val isAccessible = validateContrast(
        foreground = theme.textPrimary,
        background = theme.background
    )
    ```
    
    **2. Test in Both Modes**
    ```kotlin
    // ✅ Good: Always test light and dark themes
    val lightTheme = createLightTheme()
    val darkTheme = createDarkTheme()
    
    // Verify all components are visible in both
    testThemeVisibility(lightTheme)
    testThemeVisibility(darkTheme)
    ```
    
    **3. Use Semantic Colors**
    ```kotlin
    // ✅ Good: Name colors by purpose, not appearance
    data class SemanticColors(
        val primary: Int,
        val onPrimary: Int,
        val success: Int,
        val error: Int,
        val warning: Int
    )
    
    // ❌ Bad: Color names without context
    val blue = Color.parseColor("#2196F3")
    val red = Color.parseColor("#F44336")
    ```
    
    **4. Smooth Transitions**
    ```kotlin
    // ✅ Good: Animate theme changes
    sceneView.setTheme(newTheme, animated = true, duration = 300)
    
    // ❌ Bad: Jarring instant changes
    sceneView.setTheme(newTheme) // No animation
    ```

!!! warning "Common Pitfalls"
    
    - **Don't** use colors with insufficient contrast (< 4.5:1 ratio)
    - **Don't** hardcode colors throughout your code
    - **Always** provide fallback for missing custom fonts
    - **Always** test themes on different screen sizes
    - **Consider** colorblind users when choosing color schemes
    - **Test** themes in actual venue lighting conditions

---

## Color Palette Tools

Use these tools to create professional color schemes:

| Tool | Purpose | Link |
|------|---------|------|
| **Coolors** | Generate color palettes | [coolors.co](https://coolors.co) |
| **Adobe Color** | Create color schemes | [color.adobe.com](https://color.adobe.com) |
| **Material Design** | Material color tool | [material.io/color](https://material.io/design/color) |
| **Contrast Checker** | WCAG compliance | [webaim.org/contrast](https://webaim.org/resources/contrastchecker/) |
| **Paletton** | Color scheme designer | [paletton.com](https://paletton.com) |

---

## Accessibility Guidelines

Ensure your custom themes are accessible to all users:

### WCAG 2.1 Compliance

```kotlin
object AccessibilityValidator {
    
    fun calculateContrastRatio(foreground: Int, background: Int): Double {
        val l1 = calculateRelativeLuminance(foreground)
        val l2 = calculateRelativeLuminance(background)
        
        val lighter = max(l1, l2)
        val darker = min(l1, l2)
        
        return (lighter + 0.05) / (darker + 0.05)
    }
    
    private fun calculateRelativeLuminance(color: Int): Double {
        val r = Color.red(color) / 255.0
        val g = Color.green(color) / 255.0
        val b = Color.blue(color) / 255.0
        
        fun adjust(c: Double): Double {
            return if (c <= 0.03928) {
                c / 12.92
            } else {
                pow((c + 0.055) / 1.055, 2.4)
            }
        }
        
        return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)
    }
    
    fun validateThemeAccessibility(theme: MapColorTheme): List<String> {
        val issues = mutableListOf<String>()
        
        // Check text contrast
        val textContrast = calculateContrastRatio(theme.textPrimary, theme.background)
        if (textContrast < 4.5) {
            issues.add("Text contrast too low: $textContrast (minimum 4.5)")
        }
        
        // Check POI visibility
        val poiContrast = calculateContrastRatio(theme.poi, theme.ground)
        if (poiContrast < 3.0) {
            issues.add("POI contrast too low: $poiContrast (minimum 3.0)")
        }
        
        // Check navigation path
        val pathContrast = calculateContrastRatio(theme.navigationPath, theme.ground)
        if (pathContrast < 3.0) {
            issues.add("Navigation path contrast too low: $pathContrast")
        }
        
        return issues
    }
}

// Validate your theme
val issues = AccessibilityValidator.validateThemeAccessibility(customTheme)
if (issues.isNotEmpty()) {
    Log.w("Theme", "Accessibility issues found:")
    issues.forEach { Log.w("Theme", "  - $it") }
}
```

---

## Troubleshooting

### Theme Not Applying

**Problem**: Custom theme colors not showing

**Solution**:
```kotlin
// Ensure theme is set BEFORE loading the map
sceneView.setTheme(customTheme)
sceneView.loadMap("maps/venue.json")

// Or reload the map after theme change
sceneView.setTheme(customTheme)
sceneView.reloadMap()
```

### Text Not Readable

**Problem**: Text is hard to read against background

**Solution**:
```kotlin
// Add text stroke for better visibility
data class TextStyle(
    val color: Int,
    val strokeColor: Int = Color.WHITE,
    val strokeWidth: Float = 2f
)

// Or use contrasting background
val textBackground = Color.parseColor("#CC000000") // Semi-transparent
```

### Colors Look Different on Different Devices

**Problem**: Colors appear inconsistent

**Solution**:
```kotlin
// Use color profiles and test on multiple devices
// Avoid pure blacks/whites for better display compatibility
val background = Color.parseColor("#121212") // Not pure black
val surface = Color.parseColor("#FAFAFA") // Not pure white
```

---

## Related Documentation

- [UI Components](ui_components.md) - Customize component appearance
- [Features Overview](features_overview.md) - All customization features
- [Map Loading](map_loading.md) - Map visualization options
- [API Reference](../api_reference/module_overview.md) - Complete theming API

---

## Next Steps

Now that you understand theme customization:

1. **[Explore UI Components](ui_components.md)** - Customize interactive elements
2. **[Review Design Guidelines](../support/faq.md)** - Best practices for theme design
3. **[Test Accessibility](../support/troubleshooting.md)** - Ensure inclusive design



