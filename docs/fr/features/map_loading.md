---
title: Chargement de la carte
---
# <span class="emoji"> :material-cloud-upload: </span> Chargement de la carte

## Vue d'ensemble

La fonctionnalité **Chargement de carte** est un composant central de MINE qui permet de charger, parser et rendre des données de carte intérieure depuis différentes sources. Qu'il s'agisse de stockage local, de serveurs distants ou du cloud, MINE offre un système flexible et performant prenant en charge plusieurs formats et scénarios de déploiement.

!!! abstract "Capacités clés"
    - 📁 **Chargement local** : depuis le stockage ou les assets de l'app
    - 🌐 **Chargement distant** : via API REST ou stockage cloud
    - 🔄 **Chargement progressif** : streaming incrémental pour les grandes cartes
    - 💾 **Cache intelligent** : mise en cache automatique pour l'offline
    - 🗺️ **Multi-format** : JSON, GeoJSON et formats personnalisés
    - 🏢 **Gestion multi-étages** : bâtiments complexes à plusieurs niveaux

---

## Format de fichier de carte

MINE utilise un JSON structuré pour décrire les cartes intérieures avec métadonnées et géométrie riches :

### Structure de base

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

### Spécification

<div class="grid" markdown>

=== "Informations du lieu"

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

=== "Définition d'étage"

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

=== "Définition de POI"

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

=== "Chemins de navigation"

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

!!! note "Version du format"
    Le format de carte est versionné pour garantir la compatibilité. Spécifiez toujours le champ `version`. Version actuelle : **1.0**

---

## Chargement local

Charger des cartes depuis le stockage local, les assets ou les fichiers de l'app :

### Depuis les assets

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
        loadMapFromAssets()
    }

    private fun loadMapFromAssets() {
        lifecycleScope.launch {
            try {
                showLoadingDialog()
                val map = mapLoader.loadFromAssets(
                    path = "maps/venue.json",
                    options = LoadOptions(
                        cacheEnabled = true,
                        validateSchema = true,
                        progressCallback = { progress -> updateLoadingProgress(progress) }
                    )
                )
                sceneView.setMap(map)
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

### Depuis le stockage interne

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
                options = LoadOptions(cacheEnabled = true, preloadModels = true)
            )
            sceneView.setMap(map)
        } catch (e: Exception) {
            Log.e("MapLoading", "Failed to load map", e)
            showError("Failed to load map: ${e.message}")
        }
    }
}
```

### Depuis le stockage externe

```kotlin
private fun loadMapFromExternalStorage() {
    if (!hasStoragePermission()) {
        requestStoragePermission()
        return
    }
    lifecycleScope.launch {
        try {
            val file = File(getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), "maps/custom_venue.json")
            val map = mapLoader.loadFromFile(file)
            sceneView.setMap(map)
        } catch (e: IOException) {
            showError("Failed to read map file")
        }
    }
}
```

!!! tip "Organisation des assets"
    Structure conseillée :
    ```
    assets/
      maps/
        venue_001.json
        models/
          floor_1.glb
          floor_2.glb
        images/
          floor_1.png
          floor_2.png
        icons/
          poi_markers.png
    ```

---

## Chargement distant

Charger des cartes depuis des serveurs, API REST ou stockage cloud :

### Via API REST

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
                    timeout = 30_000L,
                    cacheEnabled = true,
                    cacheExpiration = 24 * 60 * 60 * 1000L,
                    progressCallback = { progress -> updateProgress(progress) }
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

### Depuis AWS S3

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
                    headers = mapOf("x-amz-request-payer" to "requester")
                )
            )
            sceneView.setMap(map)
        } catch (e: Exception) {
            Log.e("MapLoading", "Failed to load from S3", e)
        }
    }
}
```

### Depuis Firebase Storage

```kotlin
private fun loadMapFromFirebase() {
    val storage = FirebaseStorage.getInstance()
    val mapRef = storage.reference.child("maps/venue_123.json")
    lifecycleScope.launch {
        try {
            val url = mapRef.downloadUrl.await()
            val map = mapLoader.loadFromUrl(url = url.toString(), options = LoadOptions(cacheEnabled = true))
            sceneView.setMap(map)
        } catch (e: Exception) {
            Log.e("MapLoading", "Failed to load from Firebase", e)
        }
    }
}
```

![Démonstration de chargement](https://github.com/user-attachments/assets/76e47113-955f-4e63-bb8b-76914be73f9a){ loading=lazy }

---

## Chargement progressif

Pour les grands lieux (multi-étages, modèles 3D détaillés), utilisez le chargement progressif :

```kotlin
private fun loadMapProgressively() {
    lifecycleScope.launch {
        try {
            val mapMetadata = mapLoader.loadMetadata("maps/large_venue.json")
            showVenueInfo(mapMetadata)
            val firstFloor = mapLoader.loadFloor(
                mapUrl = "maps/large_venue.json",
                floorId = mapMetadata.defaultFloorId
            )
            sceneView.setMap(firstFloor)
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
                    withContext(Dispatchers.Main) { sceneView.addFloor(floor) }
                } catch (e: Exception) {
                    Log.w("MapLoading", "Failed to load floor ${floorInfo.id}", e)
                }
            }
        }
    }
}
```

---

## Stratégie de cache

MINE fournit un cache intelligent pour la performance et l'offline :

### Configuration du cache

```kotlin
val cacheConfig = MapCacheConfig(
    maxSize = 500 * 1024 * 1024,
    expirationTime = 7 * 24 * 60 * 60 * 1000L,
    cacheLocation = CacheLocation.INTERNAL_STORAGE,
    strategy = CacheStrategy.LRU
)

mapLoader.configurCache(cacheConfig)
```

### Gestion manuelle du cache

```kotlin
mapLoader.clearCache(venueId = "venue_123")
mapLoader.clearAllCache()
val cacheInfo = mapLoader.getCacheInfo()
Log.d("Cache", "Size: ${cacheInfo.size}, Items: ${cacheInfo.itemCount}")

lifecycleScope.launch {
    mapLoader.preloadToCache(url = "https://api.example.com/venues/123/map")
}
```

### Mode hors ligne

```kotlin
val map = mapLoader.loadFromUrl(
    url = "https://api.example.com/venues/123/map",
    options = LoadOptions(
        offlineMode = true,
        fallbackToCache = true
    )
)
```

---

## Gestion multi-étages

Gérer efficacement les bâtiments à plusieurs niveaux :

### Chargement multi-étages

```kotlin
private suspend fun loadMultiFloorVenue() {
    val map = mapLoader.loadFromAssets("maps/multi_floor_venue.json")
    val floors = map.getFloors()
    floors.forEach { floor ->
        Log.d("Floor", "Level ${floor.level}: ${floor.name}")
        floor.model?.let { modelUrl -> sceneView.loadFloorModel(floor.id, modelUrl) }
    }
    sceneView.setActiveFloor(floors.first())
}
```

### Changement d'étage

```kotlin
sceneView.switchToFloor(
    floorId = "floor_2",
    animated = true,
    duration = 500L
)

sceneView.onFloorChanged = { floor ->
    updateUI(floor)
    loadFloorPOIs(floor)
}
```

---

## Gestion des erreurs

```kotlin
private fun handleMapLoadError(exception: Exception) {
    when (exception) {
        is MapLoadException.InvalidFormat -> showError("Invalid map format. Please check the map file.")
        is MapLoadException.NetworkError -> { showError("Network error. Please check your connection."); offerRetry() }
        is MapLoadException.FileNotFound -> showError("Map file not found.")
        is MapLoadException.ParseError -> { showError("Failed to parse map data: ${exception.message}"); Log.e("MapLoading", "Parse error", exception) }
        is MapLoadException.ModelLoadError -> { showError("Failed to load 3D models."); switchTo2DMode() }
        else -> { showError("Unexpected error: ${exception.message}"); Log.e("MapLoading", "Unexpected error", exception) }
    }
}
```

---

## Bonnes pratiques

!!! success "Pratiques recommandées"
    - Charger en asynchrone (coroutines) ; éviter le thread principal
    - Valider les données (schema) avant usage
    - Gérer les états de chargement (Idle/Loading/Success/Error)
    - Optimiser la taille des assets (Draco, LOD, textures adaptées)

!!! warning "Écueils courants"
    - Ne pas charger de grosses cartes sur le main thread
    - Ne pas ignorer les erreurs réseau ou d'expiration de cache
    - Toujours valider le format avant production
    - Utiliser le chargement progressif pour les grands lieux

---

## Optimisation des performances

### Chargement paresseux des POI

```kotlin
sceneView.onCameraZoomChanged = { zoomLevel ->
    if (zoomLevel > 0.7f) loadPOIsForCurrentView() else hidePOIs()
}

private fun loadPOIsForCurrentView() {
    val visibleBounds = sceneView.getVisibleBounds()
    val pois = currentMap.getPOIsInBounds(visibleBounds)
    sceneView.showPOIs(pois)
}
```

### Optimisation des modèles

```kotlin
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

## Dépannage

### Carte ne se charge pas

```kotlin
val exists = try {
    assets.open("maps/venue.json").close(); true
} catch (e: IOException) { false }
if (!exists) Log.e("MapLoading", "Map file not found in assets")
```

### Chargement lent

1. Activer le chargement progressif
2. Réduire la complexité des modèles
3. Compresser les textures
4. Utiliser le cache
5. Charger les POI à la demande

### Erreurs mémoire (OOM)

```kotlin
val loadOptions = LoadOptions(
    maxMemoryUsage = 200 * 1024 * 1024,
    enableTextureCompression = true,
    modelQuality = ModelQuality.MEDIUM
)
```

---

## Docs associées

- [Navigation](navigation.md)
- [Composants UI](ui_components.md)
- [Pathfinding](path_finding.md)
- [Référence API](../api_reference/module_overview.md)

## Prochaines étapes

1. **[Configurer la navigation](navigation.md)**
2. **[Personnaliser l'UI](ui_components.md)**
3. **[Implémenter le pathfinding](path_finding.md)**
