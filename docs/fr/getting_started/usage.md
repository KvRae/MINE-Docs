# <span class="emoji"> :material-cube-scan: </span> Guide d'utilisation

Maîtrisez le **MINE - Moteur de Navigation Intérieure** avec des exemples d'utilisation complets, des bonnes pratiques et des modèles d'implémentation avancés. Ce guide couvre tout, de la configuration de base à la personnalisation avancée.

!!! info "Prérequis"
    Avant de plonger dans ce guide, assurez-vous d'avoir complété :
    
    - ✅ [Installation](installation.md) - Configuration et installation de la bibliothèque
    - ✅ [Démarrage rapide](quick_start.md) - Implémentation de base

---

## <span class="emoji"> :material-view-dashboard: </span> Vue d'ensemble

Le Moteur de Navigation Intérieure propose plusieurs approches d'intégration :

<div class="grid cards" markdown>

-   :material-android:{ .lg .middle } **Vues traditionnelles**

    ---

    Utilisez des layouts XML et des Activities/Fragments pour le développement Android traditionnel

-   :material-language-kotlin:{ .lg .middle } **Jetpack Compose**

    ---

    UI déclarative moderne avec intégration Compose

-   :material-code-braces:{ .lg .middle } **Programmatique**

    ---

    Contrôle programmatique complet pour les cas d'utilisation dynamiques

</div>

Choisissez l'approche qui correspond le mieux à l'architecture de votre projet.

---

## <span class="emoji"> :material-file-document: </span> Travailler avec les données de carte

### Chargement de la configuration de carte

Le moteur utilise des fichiers de configuration JSON pour définir la structure de la carte, les étages et les métadonnées. Placez votre fichier de configuration dans le dossier `assets`.

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    import com.machinestalk.indoornavigationengine.models.MapBuild
    import android.content.Context
    
    class MapDataManager(private val context: Context) {
        
        fun loadMapConfiguration(fileName: String): MapBuild? {
            return try {
                JsonUtil.LoadJsonFromAsset(context, fileName)
            } catch (e: Exception) {
                Log.e("MapDataManager", "Échec du chargement de la carte : ${e.message}")
                null
            }
        }
        
        // Charger avec validation
        fun loadMapConfigurationSafe(fileName: String): Result<MapBuild> {
            return runCatching {
                val mapData = JsonUtil.LoadJsonFromAsset(context, fileName)
                    ?: throw IllegalStateException("Les données de carte sont nulles")
                
                // Valider les données de carte
                require(mapData.floors.isNotEmpty()) { "La carte doit avoir au moins un étage" }
                require(mapData.modelPath.isNotEmpty()) { "Le chemin du modèle ne peut pas être vide" }
                
                mapData
            }
        }
    }
    ```

=== "Java"

    ```java
    import com.machinestalk.indoornavigationengine.util.JsonUtil;
    import com.machinestalk.indoornavigationengine.models.MapBuild;
    import android.content.Context;
    import android.util.Log;
    
    public class MapDataManager {
        
        private Context context;
        
        public MapDataManager(Context context) {
            this.context = context;
        }
        
        public MapBuild loadMapConfiguration(String fileName) {
            try {
                return JsonUtil.LoadJsonFromAsset(context, fileName);
            } catch (Exception e) {
                Log.e("MapDataManager", "Échec du chargement de la carte : " + e.getMessage());
                return null;
            }
        }
        
        public boolean validateMapData(MapBuild mapData) {
            if (mapData == null) return false;
            if (mapData.getFloors().isEmpty()) return false;
            if (mapData.getModelPath().isEmpty()) return false;
            return true;
        }
    }
    ```

### Structure de configuration de carte

Voici un exemple de configuration de carte bien structurée en JSON :

```json
{
  "id": "shopping-mall-001",
  "name": "Grand centre commercial",
  "version": "1.0.0",
  "modelPath": "models/mall_floor_plan.glb",
  "floors": [
    {
      "id": "ground",
      "name": "Rez-de-chaussée",
      "level": 0,
      "defaultFloor": true,
      "bounds": {
        "minX": -50.0,
        "maxX": 50.0,
        "minY": -30.0,
        "maxY": 30.0
      }
    },
    {
      "id": "first",
      "name": "Premier étage",
      "level": 1,
      "defaultFloor": false,
      "bounds": {
        "minX": -50.0,
        "maxX": 50.0,
        "minY": -30.0,
        "maxY": 30.0
      }
    }
  ],
  "pointsOfInterest": [
    {
      "id": "poi-001",
      "name": "Entrée principale",
      "floorId": "ground",
      "position": { "x": 0.0, "y": 0.0, "z": 0.0 },
      "category": "entrance"
    }
  ],
  "metadata": {
    "timezone": "UTC+3",
    "locale": "fr_FR"
  }
}
```

---

## <span class="emoji"> :material-android: </span> Vues Android traditionnelles

### Utilisation dans les Activities

=== "Kotlin"

    ```kotlin
    import android.os.Bundle
    import androidx.appcompat.app.AppCompatActivity
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    
    class MapActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialiser la vue de scène
            sceneView = MineSceneView(this).apply {
                // Charger les données de carte
                val mapData = JsonUtil.LoadJsonFromAsset(this@MapActivity, "maps/venue.json")
                mapData?.let { setMapData(it) }
            }
            
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

=== "Layout XML"

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <androidx.constraintlayout.widget.ConstraintLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        
        <com.machinestalk.indoornavigationengine.ui.MineSceneView
            android:id="@+id/sceneView"
            android:layout_width="0dp"
            android:layout_height="0dp"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintEnd_toEndOf="parent" />
        
        <!-- Sélecteur d'étage -->
        <com.google.android.material.chip.ChipGroup
            android:id="@+id/floorSelector"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_margin="16dp"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:singleSelection="true" />
            
    </androidx.constraintlayout.widget.ConstraintLayout>
    ```

### Utilisation dans les Fragments

=== "Kotlin"

    ```kotlin
    import android.os.Bundle
    import android.view.LayoutInflater
    import android.view.View
    import android.view.ViewGroup
    import androidx.fragment.app.Fragment
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    
    class MapFragment : Fragment() {
        
        private var sceneView: MineSceneView? = null
        
        override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
        ): View {
            sceneView = MineSceneView(requireContext()).apply {
                // Charger la configuration de carte
                val mapData = JsonUtil.LoadJsonFromAsset(
                    requireContext(), 
                    "maps/museum.json"
                )
                mapData?.let { setMapData(it) }
            }
            return sceneView!!
        }
        
        override fun onResume() {
            super.onResume()
            sceneView?.onResume()
        }
        
        override fun onPause() {
            super.onPause()
            sceneView?.onPause()
        }
        
        override fun onDestroyView() {
            super.onDestroyView()
            sceneView?.onDestroy()
            sceneView = null
        }
        
        companion object {
            fun newInstance() = MapFragment()
        }
    }
    ```

=== "Java"

    ```java
    import android.os.Bundle;
    import android.view.LayoutInflater;
    import android.view.View;
    import android.view.ViewGroup;
    import androidx.fragment.app.Fragment;
    import com.machinestalk.indoornavigationengine.ui.MineSceneView;
    import com.machinestalk.indoornavigationengine.util.JsonUtil;
    
    public class MapFragment extends Fragment {
        
        private MineSceneView sceneView;
        
        @Override
        public View onCreateView(LayoutInflater inflater, 
                                ViewGroup container,
                                Bundle savedInstanceState) {
            sceneView = new MineSceneView(requireContext());
            
            // Charger la configuration de carte
            MapBuild mapData = JsonUtil.LoadJsonFromAsset(
                requireContext(), 
                "maps/museum.json"
            );
            
            if (mapData != null) {
                sceneView.setMapData(mapData);
            }
            
            return sceneView;
        }
        
        @Override
        public void onResume() {
            super.onResume();
            if (sceneView != null) {
                sceneView.onResume();
            }
        }
        
        @Override
        public void onPause() {
            super.onPause();
            if (sceneView != null) {
                sceneView.onPause();
            }
        }
        
        @Override
        public void onDestroyView() {
            super.onDestroyView();
            if (sceneView != null) {
                sceneView.onDestroy();
                sceneView = null;
            }
        }
    }
    ```

---

## <span class="emoji"> :material-language-kotlin: </span> Intégration Jetpack Compose

### Implémentation Compose de base

=== "Kotlin"

    ```kotlin
    import androidx.compose.runtime.*
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.platform.LocalContext
    import androidx.compose.ui.viewinterop.AndroidView
    import com.machinestalk.indoornavigationengine.ui.IndoorNavigationScene
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    
    @Composable
    fun MapScreen(
        mapConfigFile: String = "maps/venue.json",
        modifier: Modifier = Modifier
    ) {
        val context = LocalContext.current
        val mapData = remember {
            JsonUtil.LoadJsonFromAsset(context, mapConfigFile)
        }
        
        mapData?.let {
            IndoorNavigationScene(
                mapBuild = it,
                modifier = modifier
            )
        } ?: run {
            // Afficher l'état d'erreur
            ErrorLoadingMap()
        }
    }
    
    @Composable
    fun ErrorLoadingMap() {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text("Échec du chargement de la carte", style = MaterialTheme.typography.h6)
        }
    }
    ```

### Compose avancé avec gestion d'état

=== "Kotlin"

    ```kotlin
    import androidx.compose.foundation.layout.*
    import androidx.compose.material3.*
    import androidx.compose.runtime.*
    import androidx.compose.ui.Alignment
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.platform.LocalContext
    import androidx.compose.ui.unit.dp
    import androidx.lifecycle.ViewModel
    import androidx.lifecycle.viewmodel.compose.viewModel
    import com.machinestalk.indoornavigationengine.ui.IndoorNavigationScene
    import com.machinestalk.indoornavigationengine.models.MapBuild
    import com.machinestalk.indoornavigationengine.models.CameraConfig
    import com.machinestalk.indoornavigationengine.models.ThemeConfig
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    
    // ViewModel pour l'état de la carte
    class MapViewModel : ViewModel() {
        var currentFloor by mutableStateOf(0)
            private set
        
        var selectedPOI by mutableStateOf<String?>(null)
            private set
        
        fun selectFloor(floor: Int) {
            currentFloor = floor
        }
        
        fun selectPOI(poiId: String?) {
            selectedPOI = poiId
        }
    }
    
    @Composable
    fun AdvancedMapScreen(
        mapConfigFile: String = "maps/venue.json",
        viewModel: MapViewModel = viewModel()
    ) {
        val context = LocalContext.current
        
        // Charger les données de carte
        val mapData = remember {
            JsonUtil.LoadJsonFromAsset(context, mapConfigFile)
        }
        
        // Configuration caméra personnalisée
        val cameraConfig = remember {
            CameraConfig(
                initialPosition = floatArrayOf(0f, 15f, 15f),
                lookAt = floatArrayOf(0f, 0f, 0f),
                fov = 45f,
                near = 0.1f,
                far = 1000f
            )
        }
        
        // Thème personnalisé
        val themeConfig = remember {
            ThemeConfig(
                primaryColor = 0xFF2196F3.toInt(),
                accentColor = 0xFFFF5722.toInt(),
                backgroundColor = 0xFFFFFFFF.toInt(),
                pathColor = 0xFF4CAF50.toInt()
            )
        }
        
        Box(modifier = Modifier.fillMaxSize()) {
            mapData?.let { data ->
                IndoorNavigationScene(
                    mapBuild = data,
                    cameraConfig = cameraConfig,
                    themeConfig = themeConfig,
                    currentFloor = viewModel.currentFloor,
                    onFloorChanged = { floor -> viewModel.selectFloor(floor) },
                    onPOISelected = { poiId -> viewModel.selectPOI(poiId) },
                    modifier = Modifier.fillMaxSize()
                )
                
                // Superposition du sélecteur d'étage
                FloorSelector(
                    floors = data.floors,
                    currentFloor = viewModel.currentFloor,
                    onFloorSelected = { viewModel.selectFloor(it) },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(16.dp)
                )
                
                // Carte d'information POI
                viewModel.selectedPOI?.let { poiId ->
                    POIInfoCard(
                        poiId = poiId,
                        onDismiss = { viewModel.selectPOI(null) },
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(16.dp)
                    )
                }
            }
        }
    }
    
    @Composable
    fun FloorSelector(
        floors: List<Floor>,
        currentFloor: Int,
        onFloorSelected: (Int) -> Unit,
        modifier: Modifier = Modifier
    ) {
        Card(
            modifier = modifier,
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(8.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                floors.forEachIndexed { index, floor ->
                    FilterChip(
                        selected = currentFloor == index,
                        onClick = { onFloorSelected(index) },
                        label = { Text(floor.name) }
                    )
                }
            }
        }
    }
    
    @Composable
    fun POIInfoCard(
        poiId: String,
        onDismiss: () -> Unit,
        modifier: Modifier = Modifier
    ) {
        Card(
            modifier = modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "Détails de l'emplacement",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "ID: $poiId",
                    style = MaterialTheme.typography.bodyMedium
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Fermer")
                    }
                    Button(
                        onClick = { /* Naviguer vers ce POI */ },
                        modifier = Modifier.padding(start = 8.dp)
                    ) {
                        Text("Naviguer ici")
                    }
                }
            }
        }
    }
    ```

---

## <span class="emoji"> :material-cog: </span> Configuration avancée

### Configuration caméra personnalisée

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.CameraConfig
    import com.machinestalk.indoornavigationengine.components.CameraController
    
    fun setupCustomCamera(sceneView: MineSceneView) {
        val cameraConfig = CameraConfig(
            // Position initiale de la caméra (x, y, z)
            initialPosition = floatArrayOf(10f, 20f, 30f),
            
            // Point vers lequel la caméra regarde
            lookAt = floatArrayOf(0f, 0f, 0f),
            
            // Champ de vision en degrés
            fov = 60f,
            
            // Plan de découpage proche
            near = 0.1f,
            
            // Plan de découpage lointain
            far = 500f
        )
        
        sceneView.setCameraConfig(cameraConfig)
        
        // Contrôleur de caméra avancé
        val cameraController = CameraController(sceneView).apply {
            // Définir la vitesse de déplacement
            movementSpeed = 5.0f
            
            // Définir la sensibilité de rotation
            rotationSensitivity = 0.5f
            
            // Activer les animations fluides
            enableSmoothTransitions = true
            transitionDuration = 300 // millisecondes
        }
    }
    
    // Animer la caméra vers un emplacement spécifique
    fun animateCameraToLocation(
        cameraController: CameraController,
        target: FloatArray
    ) {
        cameraController.animateTo(
            position = target,
            duration = 1000,
            onComplete = {
                Log.d("Camera", "Animation terminée")
            }
        )
    }
    ```

### Configuration de thème personnalisé

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.ThemeConfig
    import android.graphics.Color
    
    fun createCustomTheme(): ThemeConfig {
        return ThemeConfig(
            // Couleur principale de la marque
            primaryColor = Color.parseColor("#2196F3"),
            
            // Couleur d'accentuation pour les surbrillances
            accentColor = Color.parseColor("#FF5722"),
            
            // Couleur d'arrière-plan
            backgroundColor = Color.parseColor("#FAFAFA"),
            
            // Couleur du chemin/itinéraire
            pathColor = Color.parseColor("#4CAF50"),
            
            // Largeur du chemin en pixels
            pathWidth = 8f,
            
            // Couleurs des marqueurs POI
            poiMarkerColor = Color.parseColor("#FFC107"),
            poiMarkerSize = 24f,
            
            // Couleurs du texte
            textPrimaryColor = Color.parseColor("#212121"),
            textSecondaryColor = Color.parseColor("#757575"),
            
            // Couleurs d'étage (couleur différente par étage)
            floorColors = listOf(
                Color.parseColor("#E3F2FD"),
                Color.parseColor("#FFF3E0"),
                Color.parseColor("#F3E5F5")
            )
        )
    }
    
    // Appliquer le thème à la scène
    fun applyTheme(sceneView: MineSceneView, theme: ThemeConfig) {
        sceneView.setThemeConfig(theme)
    }
    ```

### Gestion des étages

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.Floor
    import com.machinestalk.indoornavigationengine.components.FloorManager
    
    class FloorNavigationManager(private val sceneView: MineSceneView) {
        
        private val floorManager = FloorManager(sceneView)
        
        fun switchToFloor(floorIndex: Int, animated: Boolean = true) {
            if (animated) {
                floorManager.switchToFloorAnimated(
                    floorIndex = floorIndex,
                    duration = 500,
                    onComplete = {
                        Log.d("Floor", "Basculé vers l'étage $floorIndex")
                    }
                )
            } else {
                floorManager.switchToFloor(floorIndex)
            }
        }
        
        fun getCurrentFloor(): Floor? {
            return floorManager.currentFloor
        }
        
        fun getFloorByLevel(level: Int): Floor? {
            return floorManager.getFloorByLevel(level)
        }
        
        fun getAllFloors(): List<Floor> {
            return floorManager.getAllFloors()
        }
        
        // Écouteur de changement d'étage
        fun setupFloorListener() {
            floorManager.setOnFloorChangedListener { oldFloor, newFloor ->
                Log.d("Floor", "Changé de ${oldFloor?.name} à ${newFloor?.name}")
            }
        }
    }
    ```

---

## <span class="emoji"> :material-navigation: </span> Navigation et routage

### Recherche de chemin

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.components.PathFinder
    import com.machinestalk.indoornavigationengine.models.Location
    import com.machinestalk.indoornavigationengine.models.Route
    
    class NavigationManager(private val sceneView: MineSceneView) {
        
        private val pathFinder = PathFinder(sceneView)
        
        fun findRoute(
            from: Location,
            to: Location,
            accessible: Boolean = false
        ): Route? {
            return pathFinder.findPath(
                start = from,
                end = to,
                accessibleOnly = accessible,
                onRouteCalculated = { route ->
                    // Afficher l'itinéraire sur la carte
                    displayRoute(route)
                }
            )
        }
        
        fun displayRoute(route: Route) {
            sceneView.clearRoute() // Effacer l'itinéraire existant
            sceneView.drawRoute(
                route = route,
                color = Color.BLUE,
                width = 8f,
                animated = true
            )
            
            // Ajouter des marqueurs de points de passage
            route.waypoints.forEach { waypoint ->
                sceneView.addMarker(
                    position = waypoint.position,
                    icon = R.drawable.ic_waypoint
                )
            }
        }
        
        fun startNavigation(route: Route) {
            sceneView.startNavigation(route) { step ->
                // Gérer l'étape de navigation
                showNavigationInstruction(step)
            }
        }
        
        fun stopNavigation() {
            sceneView.stopNavigation()
            sceneView.clearRoute()
        }
    }
    ```

### Instructions étape par étape

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.NavigationStep
    
    fun showNavigationInstruction(step: NavigationStep) {
        val instruction = when (step.action) {
            NavigationStep.Action.TURN_LEFT -> "Tournez à gauche"
            NavigationStep.Action.TURN_RIGHT -> "Tournez à droite"
            NavigationStep.Action.GO_STRAIGHT -> "Continuez tout droit"
            NavigationStep.Action.ARRIVE -> "Vous êtes arrivé"
            NavigationStep.Action.CHANGE_FLOOR -> {
                "Allez à ${step.targetFloorName}"
            }
        }
        
        // Afficher dans l'UI
        showNotification(
            title = instruction,
            message = step.description,
            distance = "${step.distanceToNext}m"
        )
    }
    ```

---

## <span class="emoji"> :material-map-marker: </span> Points d'intérêt (POI)

### Gestion des POI

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.PointOfInterest
    import com.machinestalk.indoornavigationengine.components.POIManager
    
    class POIController(private val sceneView: MineSceneView) {
        
        private val poiManager = POIManager(sceneView)
        
        fun addPOI(
            id: String,
            name: String,
            position: FloatArray,
            floorId: String,
            category: String,
            iconRes: Int
        ) {
            val poi = PointOfInterest(
                id = id,
                name = name,
                position = position,
                floorId = floorId,
                category = category,
                metadata = mapOf(
                    "icon" to iconRes.toString()
                )
            )
            
            poiManager.addPOI(poi)
        }
        
        fun findNearbyPOIs(
            location: FloatArray,
            radius: Float,
            category: String? = null
        ): List<PointOfInterest> {
            return poiManager.findNearby(
                position = location,
                radius = radius,
                filterCategory = category
            )
        }
        
        fun highlightPOI(poiId: String) {
            poiManager.highlightPOI(
                poiId = poiId,
                color = Color.YELLOW,
                duration = 2000 // millisecondes
            )
        }
        
        fun setupPOIClickListener() {
            poiManager.setOnPOIClickListener { poi ->
                // Gérer le clic sur POI
                showPOIDetails(poi)
            }
        }
    }
    ```

---

## <span class="emoji"> :material-speedometer: </span> Optimisation des performances

### Bonnes pratiques

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.DisplayConfig
    
    fun optimizePerformance(sceneView: MineSceneView) {
        sceneView.apply {
            // Utiliser une qualité de rendu appropriée
            displayConfig = DisplayConfig(
                renderQuality = when {
                    isHighEndDevice() -> DisplayConfig.RenderQuality.HIGH
                    isMidRangeDevice() -> DisplayConfig.RenderQuality.MEDIUM
                    else -> DisplayConfig.RenderQuality.LOW
                },
                
                // Désactiver les fonctionnalités coûteuses sur les appareils bas de gamme
                shadowsEnabled = isHighEndDevice(),
                ambientOcclusion = isHighEndDevice(),
                antiAliasing = !isLowEndDevice()
            )
            
            // Limiter la fréquence d'images si nécessaire
            maxFrameRate = 60
            
            // Activer le culling
            enableFrustumCulling = true
            
            // Paramètres LOD (Niveau de détail)
            enableLOD = true
            lodDistances = floatArrayOf(10f, 25f, 50f)
        }
    }
    
    fun isHighEndDevice(): Boolean {
        val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        return activityManager.memoryClass >= 512
    }
    ```

### Gestion de la mémoire

=== "Kotlin"

    ```kotlin
    class MemoryEfficientMapActivity : AppCompatActivity() {
        
        private var sceneView: MineSceneView? = null
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            sceneView = MineSceneView(this)
            setContentView(sceneView)
        }
        
        override fun onLowMemory() {
            super.onLowMemory()
            // Libérer les ressources non essentielles
            sceneView?.apply {
                clearCache()
                reduceTextureQuality()
            }
        }
        
        override fun onTrimMemory(level: Int) {
            super.onTrimMemory(level)
            when (level) {
                ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW -> {
                    sceneView?.clearCache()
                }
                ComponentCallbacks2.TRIM_MEMORY_UI_HIDDEN -> {
                    sceneView?.onPause()
                }
            }
        }
        
        override fun onDestroy() {
            // Nettoyer correctement
            sceneView?.onDestroy()
            sceneView = null
            super.onDestroy()
        }
    }
    ```

---

## <span class="emoji"> :material-bug: </span> Débogage et journalisation

### Activer le mode débogage

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.util.MineLogger
    
    fun setupDebugging(sceneView: MineSceneView) {
        if (BuildConfig.DEBUG) {
            // Activer la journalisation détaillée
            MineLogger.setLogLevel(MineLogger.Level.VERBOSE)
            
            // Afficher le compteur FPS
            sceneView.showFpsCounter = true
            
            // Afficher la superposition de débogage
            sceneView.showDebugOverlay = true
            
            // Activer le mode fil de fer
            sceneView.debugWireframe = false // Définir sur true pour voir les fils de fer
            
            // Journaliser les statistiques de rendu
            sceneView.setOnRenderStatsListener { stats ->
                Log.d("Render", "FPS: ${stats.fps}, " +
                               "Appels de dessin: ${stats.drawCalls}, " +
                               "Triangles: ${stats.triangles}")
            }
        }
    }
    ```

---

## <span class="emoji"> :material-check-circle: </span> Exemple d'utilisation complet

Voici un exemple complet rassemblant tous les éléments :

=== "Kotlin (Complet)"

    ```kotlin
    package com.example.indoornavapp
    
    import android.os.Bundle
    import android.widget.Toast
    import androidx.appcompat.app.AppCompatActivity
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import com.machinestalk.indoornavigationengine.util.JsonUtil
    import com.machinestalk.indoornavigationengine.models.*
    import com.machinestalk.indoornavigationengine.components.*
    
    class FullFeaturedMapActivity : AppCompatActivity() {
        
        private lateinit var sceneView: MineSceneView
        private lateinit var navigationManager: NavigationManager
        private lateinit var poiController: POIController
        private lateinit var floorManager: FloorNavigationManager
        
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialiser la scène
            setupScene()
            
            // Charger les données de carte
            loadMapData()
            
            // Configurer les composants
            setupComponents()
            
            // Configurer les interactions
            setupInteractions()
        }
        
        private fun setupScene() {
            sceneView = MineSceneView(this).apply {
                // Configurer l'affichage
                displayConfig = DisplayConfig(
                    renderQuality = DisplayConfig.RenderQuality.HIGH,
                    antiAliasing = true,
                    shadowsEnabled = true
                )
                
                // Définir un thème personnalisé
                setThemeConfig(createCustomTheme())
                
                // Configurer la caméra
                setCameraConfig(CameraConfig(
                    initialPosition = floatArrayOf(0f, 20f, 20f),
                    lookAt = floatArrayOf(0f, 0f, 0f),
                    fov = 55f
                ))
            }
            
            setContentView(sceneView)
        }
        
        private fun loadMapData() {
            val mapData = JsonUtil.LoadJsonFromAsset(this, "maps/venue.json")
            
            mapData?.let {
                sceneView.setMapData(it)
                Toast.makeText(this, "Carte chargée avec succès", Toast.LENGTH_SHORT).show()
            } ?: run {
                Toast.makeText(this, "Échec du chargement de la carte", Toast.LENGTH_LONG).show()
            }
        }
        
        private fun setupComponents() {
            navigationManager = NavigationManager(sceneView)
            poiController = POIController(sceneView)
            floorManager = FloorNavigationManager(sceneView)
            
            // Configurer la gestion des clics POI
            poiController.setupPOIClickListener()
            
            // Configurer l'écouteur de changement d'étage
            floorManager.setupFloorListener()
        }
        
        private fun setupInteractions() {
            val gestureHandler = GestureHandler(sceneView).apply {
                isPanEnabled = true
                isZoomEnabled = true
                isRotationEnabled = true
                
                setOnGestureListener(object : GestureHandler.OnGestureListener {
                    override fun onSingleTap(x: Float, y: Float) {
                        handleMapTap(x, y)
                    }
                })
            }
        }
        
        private fun handleMapTap(x: Float, y: Float) {
            sceneView.hitTest(x, y) { result ->
                result?.let {
                    // L'utilisateur a touché un emplacement
                    showLocationOptions(it)
                }
            }
        }
        
        private fun createCustomTheme() = ThemeConfig(
            primaryColor = getColor(R.color.primary),
            accentColor = getColor(R.color.accent),
            pathColor = getColor(R.color.path),
            backgroundColor = getColor(R.color.background)
        )
        
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

---

## <span class="emoji"> :material-arrow-right-circle: </span> Prochaines étapes

<div class="grid cards" markdown>

-   :material-map-marker-path:{ .lg .middle } **Fonctionnalités de navigation**

    ---

    Implémentez le routage avancé et la navigation étape par étape

    [:octicons-arrow-right-24: En savoir plus](../features/navigation.md)

-   :material-palette:{ .lg .middle } **Personnalisation du thème**

    ---

    Créez de magnifiques thèmes personnalisés pour vos cartes

    [:octicons-arrow-right-24: Personnaliser](../features/theme_customization.md)

-   :material-widgets:{ .lg .middle } **Composants UI**

    ---

    Ajoutez des composants UI pré-construits pour améliorer l'expérience utilisateur

    [:octicons-arrow-right-24: Explorer les composants](../features/ui_components.md)

-   :material-api:{ .lg .middle } **Référence API**

    ---

    Plongez dans la documentation API complète

    [:octicons-arrow-right-24: Documentation API](../api_reference/module_overview.md)

</div>

---

## <span class="emoji"> :material-frequently-asked-questions: </span> Questions courantes

??? question "Comment gérer plusieurs cartes dans une seule application ?"
    Créez des instances `MineSceneView` séparées pour chaque carte, ou réutilisez une seule instance et appelez `setMapData()` avec différentes configurations lors du changement de cartes.

??? question "Puis-je utiliser cette bibliothèque avec d'autres bibliothèques de rendu 3D ?"
    Le Moteur de Navigation Intérieure utilise Filament pour le rendu. Bien que vous puissiez utiliser d'autres bibliothèques dans votre application, le rendu de carte est géré exclusivement par le moteur.

??? question "Comment optimiser pour la durée de vie de la batterie ?"
    Réduisez la qualité de rendu, désactivez les ombres et l'occlusion ambiante, abaissez la fréquence d'images et mettez en pause le rendu lorsque l'application est en arrière-plan.

??? question "Puis-je charger des cartes depuis un serveur distant ?"
    Oui ! Utilisez `mapLoader.loadFromUrl()` pour récupérer les données de carte depuis un point de terminaison distant. Assurez-vous de gérer les erreurs réseau et d'implémenter une mise en cache appropriée.

---

## <span class="emoji"> :material-book-open: </span> Ressources supplémentaires

- 📖 [Référence API](../api_reference/module_overview.md) - Documentation API complète
- 🎯 [Aperçu des fonctionnalités](../features/features_overview.md) - Toutes les fonctionnalités disponibles
- 🐛 [Dépannage](../support/troubleshooting.md) - Problèmes courants et solutions
- 💬 [FAQ](../support/faq.md) - Questions fréquemment posées
- 📧 [Support](../support/contact_us.md) - Obtenez de l'aide de notre équipe

!!! success "Vous êtes prêt !"
    Vous avez maintenant une connaissance complète de l'utilisation du Moteur de Navigation Intérieure. Commencez à créer des expériences de navigation intérieure exceptionnelles !
