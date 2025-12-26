# <span class="emoji"> :material-material-design: </span> Composants UI

## Vue d'ensemble

Le **moteur de navigation intérieure MINE** fournit une suite complète de composants UI préconstruits et personnalisables, conçus pour accélérer le développement et offrir une expérience utilisateur exceptionnelle. Chaque composant est soigneusement conçu pour être intuitif, accessible et intégré aux fonctionnalités principales du moteur.

!!! abstract "Fonctionnalités clés"
    - 🎨 **Composants préconstruits** : éléments UI prêts à l'emploi
    - 🔧 **Entièrement personnalisables** : nombreuses options de style et comportement
    - 📱 **Design responsive** : adaptation aux tailles et orientations d'écran
    - ♿ **Accessibles** : conformes WCAG 2.1 avec support lecteur d'écran
    - 🎭 **Support thèmes** : mode clair/sombre automatique avec thèmes custom
    - 🚀 **Optimisés** : rendu efficace et overhead minimal

---

## Architecture des composants

Hiérarchie organisée pour flexibilité et réutilisation maximales :

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
<figcaption>Hiérarchie des composants UI</figcaption>
  </figure>
</div>

!!! tip "Organisation des composants"
    Tous les composants sont construits avec Jetpack Compose (syntaxe déclarative, gestion d'état, intégration Material Design 3).

---

## Map Scene Layout

[:octicons-link-external-24: Référence API](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-scene-layout.html)

Le **Map Scene Layout** est le conteneur de niveau supérieur qui orchestre tous les composants UI. Il combine scène de navigation, barres de recherche, bottom sheets, boutons flottants et contrôles pour créer une interface complète.

### Fonctionnalités

- 🗺️ **Layout complet** : conteneur tout-en-un
- 🎯 **Coordination auto** : communication et mise à jour entre composants
- 📐 **Layout responsive** : adaptation écrans/orientations
- 🎨 **Intégration thème** : respect du thème de l'app
- 🔄 **Gestion d'état** : état intégré pour tous les enfants

### Propriétés

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `mapUrl` | String | Requis | Chemin du JSON de carte |
| `theme` | MapColorTheme | Default | Config thème personnalisé |
| `showSearchBar` | Boolean | `true` | Afficher/masquer recherche |
| `showBottomSheet` | Boolean | `true` | Afficher/masquer bottom sheet |
| `showFloatingButtons` | Boolean | `true` | Afficher/masquer FAB |
| `enableNavigation` | Boolean | `true` | Activer navigation |
| `onNavigationStart` | `() -> Unit` | `null` | Callback démarrage nav |
| `onNavigationComplete` | `() -> Unit` | `null` | Callback fin nav |

### Implémentation de base

```kotlin
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
        onPOISelected = { poi -> selectedPOI = poi },
        onNavigationStart = { isNavigating = true },
        onNavigationComplete = { isNavigating = false; showCompletionDialog() }
    )
}
```

### Personnalisation avancée

```kotlin
@Composable
fun CustomNavigationScreen() {
    MapSceneLayout(
        mapUrl = "maps/venue.json",
        theme = createCustomTheme(),
        searchConfig = SearchConfig(
            placeholder = "Rechercher des lieux...",
            showRecentSearches = true,
            maxRecentItems = 5,
            categories = listOf("Restaurants", "Boutiques", "Services")
        ),
        bottomSheetConfig = BottomSheetConfig(
            peekHeight = 120.dp,
            expandable = true,
            dismissible = true
        ),
        fabConfig = FABConfig(
            position = FABPosition.BOTTOM_END,
            showCurrentLocation = true,
            showMapModeSwitch = true
        ),
        onMapReady = { mapView -> mapView.animateCamera(CameraPosition.DEFAULT) },
        onPOISelected = { poi -> showPOIDetails(poi) },
        onRouteCalculated = { route -> displayRouteInfo(route) },
        onNavigationUpdate = { update -> updateNavigationUI(update) },
        onError = { error -> showErrorDialog(error) }
    )
}
```

---

## Indoor Navigation Scene

[:octicons-link-external-24: Référence API](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-indoor-navigation-scene.html)

Le **Indoor Navigation Scene** est le composant de rendu 3D/2D principal qui affiche la carte, gère les interactions et visualise les chemins de navigation.

### Fonctionnalités

- 🗺️ **Rendu 3D/2D** : bascule entre perspective 3D et vue 2D
- 🎯 **Carte interactive** : pan, zoom, rotation, tap
- 🚶 **Positionnement temps réel** : marqueur utilisateur + précision
- 📍 **Visualisation POI** : rendu et interaction
- 🛤️ **Affichage itinéraire** : chemins animés
- 🏢 **Multi-étages** : gestion de bâtiments complexes

### Utilisation de base

```kotlin
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
        cameraPosition = CameraPosition(target = Vector3(0f, 0f, 0f), zoom = 1.0f, tilt = 45f, bearing = 0f),
        onPOIClick = { poi -> selectedPOI = poi; showPOIDetails(poi) },
        onMapClick = { position -> Log.d("Map", "Clicked at: $position") },
        onCameraMove = { camera -> updateCameraUI(camera) }
    )
}
```

---

## Bottom Navigation Bar (Sélecteur d'étages)

[:octicons-link-external-24: Référence API](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-bottom-navigation-bar.html)

La **Bottom Navigation Bar** sert de sélecteur d'étages pour basculer entre les niveaux d'un bâtiment.

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/282d63e2-2379-4400-bf54-bf3805554295" alt="Floor Selector" loading="lazy"/>
</p>

### Fonctionnalités

- 🏢 **Support multi-étages** : affichage et navigation entre étages
- 🎯 **Indicateur d'étage actif** : highlight de l'étage actuel
- 📊 **Infos étages** : noms et niveaux
- ⚡ **Navigation rapide** : changement d'étage en un tap
- 🎨 **Personnalisable** : options de thème et style

### Implémentation de base

```kotlin
@Composable
fun FloorNavigationExample() {
    var currentFloor by remember { mutableStateOf(0) }
    val floors = remember {
        listOf(
            Floor(id = "f0", level = 0, name = "Rez-de-chaussée"),
            Floor(id = "f1", level = 1, name = "Premier étage"),
            Floor(id = "f2", level = 2, name = "Deuxième étage"),
            Floor(id = "f3", level = 3, name = "Troisième étage")
        )
    }
    
    Scaffold(
        bottomBar = {
            BottomNavigationBar(
                floors = floors,
                currentFloor = currentFloor,
                onFloorSelected = { floorIndex ->
                    currentFloor = floorIndex
                    sceneView.switchToFloor(floors[floorIndex])
                }
            )
        }
    ) { paddingValues ->
        IndoorNavigationScene(
            modifier = Modifier.padding(paddingValues),
            currentFloor = floors[currentFloor]
        )
    }
}
```

---

## Bottom Sheets

Les bottom sheets fournissent informations contextuelles et actions dans un panneau coulissant sans masquer la carte.

### Map Scene Bottom Sheet

Affiche les infos générales de la carte et donne accès rapide aux détails du lieu et contrôles de navigation.

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/24492e3e-8950-4959-ad7b-0536cfc27605" alt="Map Info Bottom Sheet" loading="lazy"/>
</p>

#### Fonctionnalités

- 📋 **Infos du lieu** : nom, adresse, détails du bâtiment
- 🔍 **Actions rapides** : rechercher, naviguer, explorer
- 📊 **Statistiques** : nombre d'étages, de POI, surface
- 🎯 **Actions contextuelles** : selon position et état

### Building Sheet

Fournit infos détaillées sur le bâtiment et l'étage actuels, catégories de POI et commodités.

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/37bca2d0-2bdd-4b69-a549-d7296f38ccfd" alt="Building Sheet" loading="lazy"/>
</p>

#### Fonctionnalités

- 🏢 **Détails du bâtiment** : nom, description, horaires
- 📍 **Infos étage** : détails étage actuel + commodités
- 🗂️ **Catégories POI** : navigation par catégorie (restaurants, boutiques...)
- 🚻 **Commodités** : toilettes, ascenseurs, sorties, services

### POI Details Sheet

Affiche les infos détaillées d'un point d'intérêt sélectionné avec options de navigation.

#### Fonctionnalités

- 📍 **Détails POI** : nom, description, catégorie, emplacement
- 📞 **Contact** : téléphone, email, site web
- ⏰ **Horaires** : heures d'ouverture et statut actuel
- 🧭 **Navigation** : démarrer la navigation vers le POI
- ⭐ **Actions** : sauvegarder, partager, signaler

### Saved Locations Sheet

Gère les lieux sauvegardés et POI favoris pour accès rapide.

#### Fonctionnalités

- 📚 **POI sauvegardés** : voir tous les lieux bookmarkés
- 🗂️ **Catégories** : organiser les lieux
- 🔍 **Recherche** : trouver rapidement
- ✏️ **Édition** : renommer et organiser
- 🧭 **Navigation rapide** : navigation en un tap

---

## Barre de recherche

[:octicons-link-external-24: Référence API](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-search-bar-layout.html)

Le bouton de bascule 3D/2D permet de basculer entre vues 3D et 2D de la carte.

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/cfc06d87-c2e9-4183-b1e8-ca2ab43a0e18" alt="3D/2D Map switcher button"/>
</p>

---

## Barre de recherche avec dropdown

[:octicons-link-external-24: Référence API](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-top-search-bar.html)

La barre de recherche avec dropdown permet de chercher des lieux ou POI spécifiques.

<p align="center">
    <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/7cb8dd28-372b-4899-8946-c4f1e5ec3590" alt="Search bar"/>
</p>

---

## Bouton de localisation actuelle

[:octicons-link-external-24: Référence API](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-localisation-button.html)

Permet d'afficher la position actuelle de l'utilisateur avec infos temps réel.

---

## Bouton de changement de mode

[:octicons-link-external-24: Référence API](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-mode-switch-button.html)

Permet de basculer entre différents modes de carte (3D/2D).

---

Chacun de ces composants UI joue un rôle crucial dans l'amélioration de l'expérience de navigation, offrant des fonctionnalités intuitives et faciles à utiliser.

