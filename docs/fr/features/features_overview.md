---
title: Aperçu des fonctionnalités
---

# <span class="emoji">:fontawesome-solid-list:</span> Aperçu des fonctionnalités

## Introduction

**MINE (MachInNav Engine)** est une solution complète de navigation intérieure conçue pour offrir des expériences de navigation puissantes, précises et simples dans des environnements complexes. Construite avec des technologies de pointe et optimisée pour la performance, MINE propose des fonctionnalités de niveau entreprise pour des usages allant des centres commerciaux aux aéroports, hôpitaux et campus.

!!! abstract "Qu'est-ce qui distingue MINE ?"
    MINE combine rendu 3D avancé, algorithmes de pathfinding intelligents, positionnement temps réel et composants UI intuitifs pour créer une expérience de navigation indoor fluide sur divers appareils et scénarios de déploiement.

---

## Fonctionnalités principales

<div class="grid cards" markdown>

-   :material-cube-outline: **Environnements 3D/2D dynamiques**

    ---

    Bascule fluide entre vues 3D immersives et vues 2D performantes selon préférences utilisateur et capacités des appareils.

    [:octicons-arrow-right-24: En savoir plus](map_loading.md)

-   :material-palette-outline: **Personnalisation du thème**

    ---

    Thèmes et branding entièrement personnalisables pour refléter votre identité visuelle.

    [:octicons-arrow-right-24: Personnaliser les thèmes](theme_customization.md)

-   :material-compass-outline: **Pathfinding avancé**

    ---

    Optimisation multi-critères tenant compte de l'accessibilité, de la distance, de la congestion et des préférences utilisateur.

    [:octicons-arrow-right-24: Explorer le pathfinding](path_finding.md)

-   :material-navigation-variant-outline: **Navigation temps réel**

    ---

    Guidage pas-à-pas avec indices visuels et audio, supportant balises Bluetooth, Wi-Fi et fusion de capteurs.

    [:octicons-arrow-right-24: Fonctionnalités de navigation](navigation.md)

-   :material-view-dashboard-outline: **UI riche**

    ---

    Composants UI préconstruits et personnalisables : recherche, sélection d'étage, marqueurs POI, aperçu d'itinéraire.

    [:octicons-arrow-right-24: Composants UI](ui_components.md)

-   :material-layers-outline: **Support multi-étages**

    ---

    Navigation intelligente entre plusieurs niveaux avec détection et transitions automatiques d'étage.

    [:octicons-arrow-right-24: Chargement de carte](map_loading.md)

</div>

---

## Approfondissement des fonctionnalités

### 🗺️ Environnement 3D/2D dynamique

MINE offre un système de visualisation flexible qui s'adapte aux besoins de votre application :

#### Capacités de la vue 3D

- **Visualisation immersive** : rendu 3D photoréaliste propulsé par Filament
- **Caméra interactive** : pan, zoom, rotation, inclinaison
- **Ombres temps réel** : éclairage dynamique pour plus de relief
- **Streaming de modèles** : chargement progressif des assets 3D

```kotlin
// Exemple : bascule entre modes 3D et 2D
val sceneView = MineSceneView(context)

// Activer la 3D
sceneView.setViewMode(ViewMode.MODE_3D)
sceneView.apply {
    enablePerspectiveCamera = true
    enableShadows = true
    ambientOcclusionEnabled = true
}

// Passer en 2D pour plus de performance
sceneView.setViewMode(ViewMode.MODE_2D)
sceneView.apply {
    enableOrthographicCamera = true
    cameraAngle = 90f // Vue top-down
}
```

#### Capacités de la vue 2D

- **Cartes vectorielles** : rendu net et scalable
- **Rendu efficient** : optimisé pour appareils modestes et batterie
- **Lisibilité** : textes et POI clairement visibles
- **Chargement rapide** : rendu instantané pour une UX réactive

!!! tip "Quand utiliser chaque mode"
    - **Mode 3D** : grands lieux complexes, effet "wow"
    - **Mode 2D** : plans simples, navigation rapide, appareils limités

---

### 🎨 Personnalisation du thème

Créez une expérience alignée à votre identité visuelle :

#### Options de personnalisation

<div class="grid" markdown>

=== "Couleurs & branding"

    ```kotlin
    MineTheme.apply {
        primaryColor = Color(0xFF1976D2)
        accentColor = Color(0xFF4CAF50)
        backgroundColor = Color(0xFFF5F5F5)
        pathColor = Color(0xFF2196F3)
        currentLocationColor = Color(0xFFFF5722)
    }
    ```

=== "Typographie"

    ```kotlin
    MineTheme.typography = Typography(
        headingFont = Typeface.create("Roboto", Typeface.BOLD),
        bodyFont = Typeface.create("Roboto", Typeface.NORMAL),
        headingSize = 18.sp,
        bodySize = 14.sp
    )
    ```

=== "Éléments UI"

    ```kotlin
    MineTheme.uiConfig = UIConfig(
        markerStyle = MarkerStyle.MODERN,
        buttonShape = ButtonShape.ROUNDED,
        cardElevation = 4.dp,
        borderRadius = 8.dp
    )
    ```

</div>

**Personnalisations possibles :**

- Couleurs primaires et d'accent
- Typographie et polices
- Jeux d'icônes et styles de marqueurs
- Styles de boutons et cartes
- Variantes sombre/clair
- Support de localisation

---

### 🧭 Pathfinding avancé

Le moteur calcule des itinéraires optimaux selon plusieurs critères :

#### Algorithmes

- **A*** : calcul de plus court chemin efficace
- **Dijkstra** : optimisation multi-destinations
- **Poids dynamiques** : ajustement selon congestion
- **Accessibilité** : parcours PMR, ascenseurs prioritaires

```kotlin
// Exemple : calcul d'un itinéraire accessible
val navigationManager = MineNavigationManager()

val routeRequest = RouteRequest(
    origin = currentLocation,
    destination = targetPOI,
    preferences = RoutePreferences(
        avoidStairs = true,
        preferElevators = true,
        considerWheelchairAccess = true,
        optimizeFor = OptimizationCriteria.ACCESSIBILITY
    )
)

navigationManager.calculateRoute(routeRequest) { result ->
    when (result) {
        is RouteResult.Success -> {
            displayRoute(result.route)
            startNavigation(result.route)
        }
        is RouteResult.Error -> {
            showError(result.message)
        }
    }
}
```

#### Optimisation multi-critères

| Critère | Description | Usage |
|---------|-------------|-------|
| **Distance la plus courte** | Minimiser la marche | Navigation rapide |
| **Route la plus rapide** | Intègre vitesse et congestion | Scénarios sensibles au temps |
| **Accessibilité** | Ascenseurs, rampes, couloirs larges | PMR, poussettes |
| **Scénique** | Passe par des POI intéressants | Tourisme |
| **Sortie d'urgence** | Évacuation la plus rapide | Sécurité |

---

### 🚶 Navigation temps réel

Offrez un guidage précis et instantané :

#### Technologies de positionnement

<div class="grid" markdown>

=== "Balises Bluetooth"

    - **Précision** : 1-3 m
    - **Déploiement** : balises requises
    - **Idéal** : retail, musées, aéroports
    
    ```kotlin
    val beaconPositioning = BeaconPositioningProvider(
        scanInterval = 1000L,
        rssiThreshold = -80
    )
    navigationManager.setPositioningProvider(beaconPositioning)
    ```

=== "Wi-Fi RTT"

    - **Précision** : 1-2 m
    - **Déploiement** : AP compatibles RTT
    - **Idéal** : bureaux, hôpitaux
    
    ```kotlin
    val wifiPositioning = WiFiRTTProvider(
        scanFrequency = 2000L,
        minAccessPoints = 3
    )
    navigationManager.setPositioningProvider(wifiPositioning)
    ```

=== "Fusion capteurs"

    - **Précision** : 2-5 m
    - **Déploiement** : aucun
    - **Idéal** : déploiement rapide, PDR
    
    ```kotlin
    val sensorFusion = SensorFusionProvider(
        useAccelerometer = true,
        useGyroscope = true,
        useMagnetometer = true
    )
    navigationManager.setPositioningProvider(sensorFusion)
    ```

</div>

#### Fonctionnalités de navigation

- **Instructions pas-à-pas** : voix et visuel
- **Distance restante** : mise à jour temps réel
- **Changement d'étage** : détection et guidage automatiques
- **Recalcul** : en cas de sortie d'itinéraire
- **ETA** : estimation d'arrivée

```kotlin
// Exemple : démarrer le guidage
navigationManager.startNavigation(route) { event ->
    when (event) {
        is NavigationEvent.InstructionUpdate -> {
            showInstruction(event.instruction)
            playVoiceGuidance(event.instruction)
        }
        is NavigationEvent.FloorChange -> {
            showFloorChangeAlert(event.fromFloor, event.toFloor)
        }
        is NavigationEvent.Rerouting -> {
            showReroutingIndicator()
        }
        is NavigationEvent.DestinationReached -> {
            showArrivalDialog()
        }
    }
}
```

---

### 🎯 Composants UI riches

Composants prêts pour la prod pour accélérer le dev :

#### Composants disponibles

**Recherche & découverte**

```kotlin
MineSearchBar(
    modifier = Modifier.fillMaxWidth(),
    onLocationSelected = { poi -> navigateTo(poi) },
    placeholder = "Rechercher des lieux...",
    showRecentSearches = true,
    showCategories = true
)
```

**Sélecteur d'étage**

```kotlin
MineFloorSelector(
    floors = buildingFloors,
    currentFloor = activeFloor,
    onFloorSelected = { floor -> sceneView.switchToFloor(floor) },
    orientation = Orientation.VERTICAL
)
```

**Carte d'aperçu d'itinéraire**

```kotlin
MineRouteCard(
    route = calculatedRoute,
    showDistance = true,
    showDuration = true,
    showAccessibilityInfo = true,
    onStartNavigation = { startNavigation(route) },
    onAlternativeRoute = { showAlternatives() }
)
```

#### Atouts des composants

- 🎨 Entièrement thémables
- 📱 Responsives tous écrans
- ♿ Conformes accessibilité (WCAG 2.1)
- 🌍 Multi-langue
- 🔄 Mises à jour temps réel

---

### 🏢 Support multi-étages

Navigation fluide à travers des bâtiments multi-niveaux :

#### Fonctionnalités

- **Détection automatique d'étage** : pression baro + balises
- **Visualisation des transitions** : escaliers, ascenseurs, escalators
- **Routage inter-étages** : calcul intelligent cross-floor
- **Gestion de plans** : support de centaines d'étages par site

```kotlin
val multiFloorRoute = RouteRequest(
    origin = Location(floor = 1, x = 10.0, y = 20.0),
    destination = Location(floor = 5, x = 50.0, y = 30.0),
    preferences = RoutePreferences(
        preferElevators = true,
        maxStairFlights = 2
    )
)

navigationManager.calculateRoute(multiFloorRoute) { result ->
    result.route.segments.forEach { segment ->
        if (segment is FloorTransitionSegment) {
            println("Use ${segment.transitionType} to floor ${segment.toFloor}")
        }
    }
}
```

---

## Performance & optimisation

- Rendu optimisé pour devices modestes (bascule 2D, qualité adaptative)
- Chargement progressif des assets pour réduire le temps de démarrage
- Mise en cache des routes et graphes pour accélérer le recalcul
- Profilage mémoire et CPU pour éviter les régressions de perf

## Sécurité & conformité

- Gestion des permissions (localisation, Bluetooth, Wi-Fi) avec parcours UX clair
- Conformité RGPD : collecte minimale, consentement, anonymisation des analytics
- Chiffrement des données sensibles en transit et au repos

## Intégration & extensibilité

- SDK Android avec API Kotlin/Java conviviales
- Composants UI plug-and-play ou personnalisables
- Hooks pour fournisseurs de positionnement custom et algorithmes de routage
- Thématisation avancée pour aligner la charte graphique

## Cas d'usage typiques

- Centres commerciaux : recherche de boutiques, offres contextuelles, guidage parking
- Aéroports : guidage portes d'embarquement, connexions, salons, sécurité
- Hôpitaux : parcours patients/visiteurs, accessibilité PMR, services critiques
- Campus & bureaux : salles de réunion, espaces partagés, sécurité
- Musées & événements : parcours thématiques, POI enrichis, analytics de visite

## Ressources complémentaires

- [:material-rocket-launch: Démarrage rapide](../getting_started/quick_start.md)
- [:material-cog-outline: Pathfinding](path_finding.md)
- [:material-navigation-variant: Navigation](navigation.md)
- [:material-palette-outline: Thèmes](theme_customization.md)
- [:material-view-dashboard-outline: UI Components](ui_components.md)
