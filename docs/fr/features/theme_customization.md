# <span class="emoji"> :octicons-paintbrush-16: </span> Personnalisation du thème

## Vue d'ensemble

La **personnalisation de thème** vous permet de créer une expérience de navigation intérieure conforme à votre identité visuelle. MINE prend en charge la personnalisation complète des couleurs, de la typographie, des composants UI, des icônes et des styles de mise en page, avec support des modes clair/sombre.

!!! abstract "Capacités de personnalisation"
    - 🎨 **Contrôle total des couleurs** : personnalisez chaque élément visuel
    - 🌓 **Mode clair/sombre** : détection auto du thème système
    - 🔤 **Typographie** : polices, tailles et styles sur-mesure
    - 🎯 **Thématisation des composants** : marqueurs, chemins, POI, UI
    - 🖼️ **Icônes custom** : remplacez les icônes par vos assets
    - 📱 **Responsive** : thèmes adaptatifs selon les écrans
    - 💾 **Persistance** : sauvegarde/restauration des préférences

---

## Couleurs par défaut

Palette par défaut optimisée pour la lisibilité :

<div class="grid" markdown>

=== "Thème clair"

    | Composant | Couleur | Hex | Aperçu |
    |-----------|---------|-----|--------|
    | **Sol** | Rose clair | `#FDE4E4` | <span style="display:inline-block;width:50px;height:20px;background:#FDE4E4;border:1px solid #ccc;"></span> |
    | **Chemins** | Rose clair | `#FDE4E4` | <span style="display:inline-block;width:50px;height:20px;background:#FDE4E4;border:1px solid #ccc;"></span> |
    | **Murs** | Gris | `#888383` | <span style="display:inline-block;width:50px;height:20px;background:#888383;border:1px solid #ccc;"></span> |
    | **POI** | Gris clair | `#B9B2B2` | <span style="display:inline-block;width:50px;height:20px;background:#B9B2B2;border:1px solid #ccc;"></span> |
    | **POI sélectionné** | Bleu acier | `#779CB7` | <span style="display:inline-block;width:50px;height:20px;background:#779CB7;border:1px solid #ccc;"></span> |
    | **Chemin de nav** | Bleu | `#2196F3` | <span style="display:inline-block;width:50px;height:20px;background:#2196F3;border:1px solid #ccc;"></span> |
    | **Position utilisateur** | Orange | `#FF5722` | <span style="display:inline-block;width:50px;height:20px;background:#FF5722;border:1px solid #ccc;"></span> |

=== "Thème sombre"

    | Composant | Couleur | Hex | Aperçu |
    |-----------|---------|-----|--------|
    | **Sol** | Gris foncé | `#282828` | <span style="display:inline-block;width:50px;height:20px;background:#282828;border:1px solid #ccc;"></span> |
    | **Chemins** | Gris moyen | `#575757` | <span style="display:inline-block;width:50px;height:20px;background:#575757;border:1px solid #ccc;"></span> |
    | **Murs** | Gris foncé | `#282828` | <span style="display:inline-block;width:50px;height:20px;background:#282828;border:1px solid #ccc;"></span> |
    | **POI** | Charbon | `#3F3F3F` | <span style="display:inline-block;width:50px;height:20px;background:#3F3F3F;border:1px solid #ccc;"></span> |
    | **POI sélectionné** | Vert forêt | `#2D7C32` | <span style="display:inline-block;width:50px;height:20px;background:#2D7C32;border:1px solid #ccc;"></span> |
    | **Chemin de nav** | Bleu clair | `#64B5F6` | <span style="display:inline-block;width:50px;height:20px;background:#64B5F6;border:1px solid #ccc;"></span> |
    | **Position utilisateur** | Orange vif | `#FF6E40` | <span style="display:inline-block;width:50px;height:20px;background:#FF6E40;border:1px solid #ccc;"></span> |

</div>

!!! tip "Utilisation du thème par défaut"
    Le thème par défaut est appliqué si aucun `mapColorTheme` n'est fourni.

---

## Implémentation de base

### Thème par défaut

```kotlin
sceneView.initialize(
    context = this,
    mapUrl = "maps/venue.json"
    // mapColorTheme optionnel
)
```

### Créer un thème personnalisé

```kotlin
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
```

---

## Personnalisation avancée

### Configuration complète

```kotlin
data class MapColorTheme(
    val ground: Int,
    val pathways: Int,
    val walls: Int,
    val doors: Int = Color.parseColor("#8D6E63"),
    val windows: Int = Color.parseColor("#B0BEC5"),
    val obstacles: Int = Color.parseColor("#E53935"),
    val poi: Int,
    val selectedPoi: Int,
    val poiBorder: Int = Color.WHITE,
    val poiText: Int = Color.BLACK,
    val navigationPath: Int,
    val alternativePath: Int = Color.parseColor("#9E9E9E"),
    val pathOutline: Int = Color.WHITE,
    val userLocation: Int,
    val userLocationAccuracyCircle: Int = Color.parseColor("#4D2196F3"),
    val destinationMarker: Int = Color.parseColor("#F44336"),
    val textPrimary: Int,
    val textSecondary: Int,
    val background: Int,
    val surface: Int,
    val primaryAccent: Int = Color.parseColor("#2196F3"),
    val secondaryAccent: Int = Color.parseColor("#4CAF50"),
    val errorColor: Int = Color.parseColor("#F44336"),
    val warningColor: Int = Color.parseColor("#FF9800"),
    val elevator: Int = Color.parseColor("#9C27B0"),
    val stairs: Int = Color.parseColor("#FF9800"),
    val escalator: Int = Color.parseColor("#00BCD4"),
    val ramp: Int = Color.parseColor("#8BC34A"),
    val shadowColor: Int = Color.parseColor("#33000000"),
    val highlightColor: Int = Color.parseColor("#FFEB3B"),
    val disabledColor: Int = Color.parseColor("#BDBDBD")
)
```

### Thèmes de marque

```kotlin
object BrandThemes {
    fun corporateBlue(isDark: Boolean = false): MapColorTheme { /* variantes clair/sombre */ }
    fun modernGreen(isDark: Boolean = false): MapColorTheme { /* variantes clair/sombre */ }
    fun healthcare(isDark: Boolean = false): MapColorTheme { /* variantes clair/sombre */ }
    fun retail(isDark: Boolean = false): MapColorTheme { /* variantes clair/sombre */ }
}

sceneView.setTheme(BrandThemes.corporateBlue(isSystemInDarkTheme()))
```

!!! warning "Contraste"
    Assurez un contraste suffisant (WCAG 2.1 AA) et testez en clair/sombre.

---

## Typographie

```kotlin
data class MapTypography(
    val headingFont: Typeface = Typeface.DEFAULT_BOLD,
    val bodyFont: Typeface = Typeface.DEFAULT,
    val monoFont: Typeface = Typeface.MONOSPACE,
    val headingLarge: Float = 24f,
    val headingMedium: Float = 20f,
    val headingSmall: Float = 18f,
    val bodyLarge: Float = 16f,
    val bodyMedium: Float = 14f,
    val bodySmall: Float = 12f,
    val caption: Float = 10f,
    val poiLabelSize: Float = 14f,
    val instructionTextSize: Float = 18f,
    val distanceTextSize: Float = 16f,
    val floorLabelSize: Float = 20f,
    val letterSpacing: Float = 0f,
    val lineHeight: Float = 1.5f
)

val customTypography = MapTypography(
    headingFont = ResourcesCompat.getFont(context, R.font.roboto_bold)!!,
    bodyFont = ResourcesCompat.getFont(context, R.font.roboto_regular)!!,
    headingLarge = 28f,
    bodyMedium = 16f
)

sceneView.setTypography(customTypography)
```

---

## Style des composants

### Marqueurs POI

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
```

### Chemin de navigation

```kotlin
data class NavigationPathStyle(
    val width: Float = 4f,
    val color: Int = Color.parseColor("#2196F3"),
    val outlineWidth: Float = 2f,
    val outlineColor: Int = Color.WHITE,
    val dashPattern: FloatArray? = null,
    val animated: Boolean = true,
    val animationSpeed: Float = 1.0f,
    val gradientEnabled: Boolean = false,
    val gradientColors: IntArray? = null,
    val capStyle: Paint.Cap = Paint.Cap.ROUND,
    val joinStyle: Paint.Join = Paint.Join.ROUND
)
```

### Position utilisateur

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
```

---

## Bascule dynamique des thèmes

```kotlin
class ThemeManager(private val sceneView: MineSceneView) {
    private var currentTheme: ThemeMode = ThemeMode.SYSTEM
    enum class ThemeMode { LIGHT, DARK, SYSTEM }
    fun setTheme(mode: ThemeMode) { currentTheme = mode; applyTheme() }
    fun toggleTheme() { currentTheme = when (currentTheme) { ThemeMode.LIGHT -> ThemeMode.DARK; ThemeMode.DARK -> ThemeMode.LIGHT; ThemeMode.SYSTEM -> if (isSystemInDarkMode()) ThemeMode.LIGHT else ThemeMode.DARK }; applyTheme() }
    private fun applyTheme() { /* applique createLightTheme/createDarkTheme ou système */ }
}
```

---

## Persistance du thème

```kotlin
class ThemePreferences(context: Context) {
    private val prefs = context.getSharedPreferences("mine_theme", Context.MODE_PRIVATE)
    fun saveTheme(theme: MapColorTheme, name: String) { /* stocker les couleurs */ }
    fun loadTheme(name: String): MapColorTheme? { /* charger si présent */ }
    fun saveThemeMode(mode: ThemeManager.ThemeMode) { prefs.edit { putString("theme_mode", mode.name) } }
    fun loadThemeMode(): ThemeManager.ThemeMode = ThemeManager.ThemeMode.valueOf(prefs.getString("theme_mode", ThemeManager.ThemeMode.SYSTEM.name)!!)
}
```

---

## Bonnes pratiques

!!! success "Recommandé"
    - Assurer le contraste (≥ 4.5:1), tester clair/sombre
    - Nomer les couleurs par rôle (primary, error...) plutôt que par teinte
    - Animer les changements de thème (ex: 300 ms)

!!! warning "À éviter"
    - Contraste insuffisant
    - Couleurs en dur partout (préférer la config thème)
    - Oublier les polices de repli
    - Ne pas tester sur différentes tailles d'écran

---

## Outils palette

| Outil | Usage | Lien |
|-------|-------|------|
| **Coolors** | Générer des palettes | [coolors.co](https://coolors.co) |
| **Adobe Color** | Créer des schémas | [color.adobe.com](https://color.adobe.com) |
| **Material Design** | Outil Material | [material.io/color](https://material.io/design/color) |
| **Contrast Checker** | Contraste WCAG | [webaim.org/contrast](https://webaim.org/resources/contrastchecker/) |
| **Paletton** | Designer de palettes | [paletton.com](https://paletton.com) |

---

## Accessibilité

```kotlin
object AccessibilityValidator {
    fun calculateContrastRatio(foreground: Int, background: Int): Double { /* luminance et ratio */ }
    fun validateThemeAccessibility(theme: MapColorTheme): List<String> { /* vérif texte, POI, chemin */ }
}
```

---

## Dépannage

- **Thème non appliqué** : définir le thème avant le chargement de carte ou recharger après changement
- **Texte illisible** : ajouter un contour (stroke) ou fond contrasté
- **Couleurs incohérentes selon appareil** : éviter noirs/blancs purs, tester plusieurs devices

---

## Docs associées

- [Composants UI](ui_components.md)
- [Aperçu des fonctionnalités](features_overview.md)
- [Chargement de carte](map_loading.md)
- [Référence API](../api_reference/module_overview.md)

## Prochaines étapes

1. **[Personnaliser les composants](ui_components.md)**
2. **[Revoir les guidelines design](../support/faq.md)**
3. **[Tester l'accessibilité](../support/troubleshooting.md)**
