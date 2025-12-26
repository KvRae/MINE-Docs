# <span class="emoji"> :material-octagon-outline: </span> SceneView

## Vue d'ensemble

**SceneView** est une puissante bibliothèque de rendu 3D et AR pour les applications Android, Flutter et React Native. Construite sur **ARCore** et le **moteur Filament de Google**, elle fournit une base robuste pour créer des expériences 3D immersives et de réalité augmentée avec des capacités de rendu haute performance.

!!! info "Contexte d'intégration"
    Dans le Moteur de Navigation Intérieure MINE, SceneView sert de moteur de rendu principal pour afficher les cartes 3D, visualiser les chemins de navigation et fournir des expériences de guidage AR en temps réel.

---

## Support de plateforme

SceneView est disponible sur plusieurs plateformes avec des API cohérentes :

<div class="grid cards" markdown>

-   :material-android: **Android**

    ---

    Bibliothèque Android native avec support complet ARCore

    [:octicons-arrow-right-24: Dépôt Android](https://github.com/SceneView/sceneview-android)

-   :material-flutter: **Flutter**

    ---

    Plugin Flutter multi-plateforme pour iOS et Android

    [:octicons-arrow-right-24: Plugin Flutter](https://sceneview.github.io/)

-   :material-react: **React Native**

    ---

    Module React Native pour expériences AR mobiles

    [:octicons-arrow-right-24: Module RN](https://sceneview.github.io/)

</div>

---

## Fonctionnalités principales

### 🎨 Rendu avancé
- **Propulsé par Filament** : Exploite le moteur de rendu basé sur la physique de Google
- **Matériaux PBR** : Support des matériaux et éclairages basés sur la physique
- **Environnement HDR** : Éclairage basé sur images à plage dynamique élevée
- **Post-traitement** : Bloom, profondeur de champ et autres effets

### 🌍 Capacités AR
- **Intégration ARCore** : Support natif pour Google ARCore
- **Détection de plans** : Détection automatique des surfaces horizontales et verticales
- **Estimation de lumière** : Intégration de l'éclairage du monde réel
- **Ancres** : Placement persistant du contenu AR

### 📦 Support de modèles 3D
- **glTF/GLB** : Formats de modèles 3D standards de l'industrie
- **Animations** : Animations squelettiques et par images clés
- **Support LOD** : Optimisation du niveau de détail
- **Shaders personnalisés** : Personnalisation des shaders GLSL

### 🎮 Contrôles interactifs
- **Reconnaissance de gestes** : Gestes de panoramique, zoom, rotation et toucher
- **Contrôles caméra** : Modes orbite, première personne et suivi
- **Test de collision** : Ray-casting pour la sélection d'objets
- **Interactions personnalisées** : Système de gestes extensible

---

## Cas d'utilisation dans MINE

### 1. Visualisation de cartes 3D

SceneView rend des représentations 3D interactives d'environnements intérieurs, permettant aux utilisateurs de :

- Voir les plans de bâtiments sous plusieurs angles
- Interagir avec les plans d'étage en temps réel
- Zoomer et faire pivoter la carte intuitivement

```kotlin
// Exemple : Chargement d'une carte intérieure 3D
val sceneView = findViewById<SceneView>(R.id.sceneView)

sceneView.apply {
    // Charger le modèle du bâtiment
    loadModel("models/building.glb") { model ->
        // Positionner et mettre à l'échelle le modèle
        model.position = Position(0f, 0f, 0f)
        model.scale = Scale(1f)
        
        // Ajouter à la scène
        addChild(model)
    }
    
    // Configurer la caméra
    camera.setPosition(x = 0f, y = 5f, z = 10f)
    camera.lookAt(0f, 0f, 0f)
}
```

### 2. Rendu de chemin de navigation

Affiche les itinéraires de navigation en temps réel avec une clarté visuelle :

```kotlin
// Exemple : Rendu du chemin de navigation
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
    
    // Ajouter un indicateur animé
    val indicator = createPathIndicator()
    animateAlongPath(indicator, pathPoints)
}
```

### 3. Guidage AR

Fournit des superpositions de réalité augmentée pour une navigation améliorée :

```kotlin
// Exemple : Superposition de navigation AR
sceneView.apply {
    // Activer le mode AR
    arMode = true
    
    // Placer des flèches de navigation AR
    onTapAr { hitResult ->
        val anchor = hitResult.createAnchor()
        val arrowNode = createNavigationArrow()
        
        arrowNode.anchor = anchor
        addChild(arrowNode)
        
        // Animer la flèche
        animateArrow(arrowNode)
    }
}
```

### 4. Marqueurs de points d'intérêt (POI)

Afficher des marqueurs interactifs pour les lieux d'intérêt :

```kotlin
// Exemple : Ajout de marqueurs POI
fun addPOIMarker(location: Vector3, info: POIInfo) {
    val markerNode = Node().apply {
        position = location
        
        // Ajouter une icône 3D
        loadModel("models/poi_marker.glb") { model ->
            addChild(model)
        }
        
        // Ajouter une étiquette de texte
        val textNode = TextNode(
            text = info.name,
            fontSize = 0.2f,
            color = Color.WHITE
        )
        addChild(textNode)
        
        // Gérer les interactions
        onTap { 
            showPOIDetails(info)
        }
    }
    
    sceneView.addChild(markerNode)
}
```

---

## Composants clés

### SceneView

Le composant de vue principal qui héberge la scène 3D/AR :

```kotlin
<io.github.sceneview.SceneView
    android:id="@+id/sceneView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:arEnabled="true"
    app:antialiasingMode="fxaa"
    app:msaaSampleCount="4" />
```

### Hiérarchie de nœuds

SceneView utilise un graphe de scène basé sur des nœuds :

```kotlin
// Création d'une hiérarchie de nœuds
val rootNode = Node()

val buildingNode = ModelNode().apply {
    loadModel("building.glb")
}

val navigationNode = Node().apply {
    // Ajouter le chemin de navigation
}

rootNode.addChild(buildingNode)
rootNode.addChild(navigationNode)
sceneView.addChild(rootNode)
```

### Contrôle de la caméra

Positionnement et mouvement flexibles de la caméra :

```kotlin
// Configuration de la caméra
sceneView.cameraNode.apply {
    // Définir la position
    worldPosition = Position(x = 0f, y = 2f, z = 5f)
    
    // Regarder la cible
    lookAt(targetPosition = Position(0f, 0f, 0f))
    
    // Animer la caméra
    smooth(
        position = newPosition,
        rotation = newRotation,
        duration = 1.5f
    )
}
```

### Éclairage

Configurer l'éclairage de la scène pour une visualisation optimale :

```kotlin
// Configuration de l'éclairage
sceneView.apply {
    // Ajouter une lumière directionnelle (soleil)
    val sunLight = LightNode(
        type = LightType.DIRECTIONAL,
        intensity = 100000f,
        color = Color.WHITE
    )
    sunLight.worldRotation = Rotation(x = 45f, y = 0f, z = 0f)
    addChild(sunLight)
    
    // Définir l'environnement (image HDR)
    environment = HDREnvironment(
        asset = "environments/indoor.hdr",
        intensity = 30000f
    )
    
    // Configurer le skybox
    skybox = Skybox(environment = environment)
}
```

---

## Optimisation des performances

### Niveau de détail (LOD)

Optimiser les performances de rendu avec des modèles LOD :

```kotlin
val modelNode = ModelNode().apply {
    // Charger plusieurs niveaux LOD
    loadModelLOD(
        high = "models/building_high.glb",
        medium = "models/building_medium.glb",
        low = "models/building_low.glb"
    )
    
    // Configurer les distances LOD
    lodDistances = listOf(10f, 50f, 100f)
}
```

### Culling

Implémenter le culling de frustum pour les grandes scènes :

```kotlin
sceneView.apply {
    // Activer le culling de frustum
    isFrustumCullingEnabled = true
    
    // Définir la distance de culling
    farClipPlane = 100f
}
```

### Compression de texture

Utiliser des textures compressées pour de meilleures performances :

```kotlin
// Utiliser le format KTX2 avec compression Basis
val material = MaterialLoader.load(
    context = context,
    assetFileLocation = "materials/compressed.ktx2"
)
```

---

## Bonnes pratiques

!!! success "Pratiques recommandées"
    
    **1. Gestion de la mémoire**
    ```kotlin
    override fun onDestroy() {
        super.onDestroy()
        sceneView.destroy()
    }
    ```
    
    **2. Chargement asynchrone**
    ```kotlin
    // Charger les modèles de manière asynchrone
    lifecycleScope.launch {
        val model = sceneView.loadModelAsync("model.glb")
        sceneView.addChild(model)
    }
    ```
    
    **3. Gestion des erreurs**
    ```kotlin
    sceneView.loadModel("model.glb",
        onError = { exception ->
            Log.e("SceneView", "Échec du chargement du modèle", exception)
            showErrorToUser()
        }
    )
    ```

!!! warning "Pièges courants"
    
    - **Évitez** de charger de gros modèles sur le thread principal
    - **Toujours** détruire SceneView dans `onDestroy()`
    - **Vérifier** la disponibilité d'ARCore avant d'activer le mode AR
    - **Optimiser** les textures et modèles pour les appareils mobiles

---

## Ressources

### Liens officiels

- 🌐 [Site web SceneView](https://sceneview.github.io/)
- 💻 [Dépôt Android](https://github.com/SceneView/sceneview-android)
- 📚 [Référence API](https://github.com/SceneView/sceneview-android/wiki)
- 💬 [Discussions communautaires](https://github.com/SceneView/sceneview-android/discussions)

### Documentation MINE associée

- [Moteur Filament](filament.md) - Moteur de rendu sous-jacent
- [Aperçu du module](module_overview.md) - Aperçu de l'architecture MINE
- [Chargement de cartes 3D](../features/map_loading.md) - Guide d'intégration de cartes
- [Personnalisation du thème](../features/theme_customization.md) - Personnalisation visuelle

---

## Version et compatibilité

| Composant | Version minimale | Recommandée |
|-----------|------------------|-------------|
| Android SDK | API 24 (7.0) | API 33+ |
| ARCore | 1.20.0 | Dernière |
| Filament | 1.28.0 | Dernière |
| Kotlin | 1.8.0 | 1.9.0+ |

!!! note "Statut de la documentation"
    En décembre 2025, SceneView continue d'évoluer rapidement. Pour les dernières fonctionnalités et mises à jour, consultez le [dépôt GitHub officiel](https://github.com/SceneView/sceneview-android) et les [notes de version](https://github.com/SceneView/sceneview-android/releases).

---

## Intégration rapide

Pour intégrer SceneView dans votre implémentation MINE :

1. **Ajouter les dépendances**
   ```gradle
   dependencies {
       implementation 'io.github.sceneview:sceneview:2.0.0'
   }
   ```

2. **Ajouter au layout**
   ```xml
   <io.github.sceneview.SceneView
       android:id="@+id/sceneView"
       android:layout_width="match_parent"
       android:layout_height="match_parent" />
   ```

3. **Initialiser dans l'Activity**
   ```kotlin
   val sceneView = findViewById<SceneView>(R.id.sceneView)
   sceneView.loadModel("model.glb")
   ```

Pour des étapes d'intégration détaillées, consultez le [Guide de démarrage rapide](../getting_started/quick_start.md).
