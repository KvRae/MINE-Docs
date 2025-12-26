# <span class="emoji"> :material-rocket-launch: </span> Démarrage rapide

Créez votre première expérience de navigation intérieure en quelques minutes ! Ce guide vous accompagnera dans la création d'une application de navigation de base utilisant **MINE - Moteur de Navigation Intérieure**, de l'initialisation à l'affichage d'une carte 3D interactive.

!!! tip "Avant de commencer"
    Assurez-vous d'avoir complété les étapes d'[installation](installation.md) avant de suivre ce guide.

---

## <span class="emoji"> :material-chart-timeline: </span> Ce que vous allez créer

À la fin de ce guide, vous aurez une application Android entièrement fonctionnelle qui :

- ✅ Initialise le Moteur de Navigation Intérieure
- ✅ Affiche une carte 3D intérieure interactive
- ✅ Gère les événements du cycle de vie de la carte
- ✅ Implémente des contrôles caméra de base
- ✅ Charge des données de carte personnalisées

**Temps estimé** : 10-15 minutes

---

## <span class="emoji"> :material-numeric-1-circle: </span> Étape 1 : Configurer votre Activity

Tout d'abord, créez une Activity qui hébergera le moteur de navigation. Nous utiliserons `MineSceneView` comme composant principal pour afficher les cartes.

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
            
            // Initialiser la vue de scène
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
            
            // Initialiser la vue de scène
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

!!! info "Gestion du cycle de vie"
    Une bonne gestion du cycle de vie de `MineSceneView` est cruciale pour des performances optimales et pour éviter les fuites mémoire. Appelez toujours `onResume()`, `onPause()`, et `onDestroy()` dans les méthodes correspondantes du cycle de vie de l'Activity.

---

## <span class="emoji"> :material-numeric-2-circle: </span> Étape 2 : Charger une carte

Maintenant, chargeons une carte intérieure. Le moteur prend en charge divers formats de carte, y compris les modèles glTF/GLB.

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
            
            // Initialiser le chargeur de carte
            mapLoader = MapLoader(sceneView)
            
            // Charger la carte depuis les assets
            loadMap()
        }
        
        private fun loadMap() {
            val mapPath = "maps/my_venue.glb" // Chemin vers votre fichier de carte dans assets
            
            mapLoader.loadFromAssets(
                context = this,
                assetPath = mapPath,
                onSuccess = { mapData ->
                    // Carte chargée avec succès
                    setupCamera(mapData)
                    showToast("Carte chargée avec succès !")
                },
                onError = { error ->
                    // Gérer l'erreur
                    showToast("Échec du chargement de la carte : ${error.message}")
                }
            )
        }
        
        private fun setupCamera(mapData: MapData) {
            // Positionner la caméra pour voir toute la carte
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
            
            // Initialiser le chargeur de carte
            mapLoader = new MapLoader(sceneView);
            
            // Charger la carte depuis les assets
            loadMap();
        }
        
        private void loadMap() {
            String mapPath = "maps/my_venue.glb"; // Chemin vers votre fichier de carte dans assets
            
            mapLoader.loadFromAssets(
                this,
                mapPath,
                mapData -> {
                    // Carte chargée avec succès
                    setupCamera(mapData);
                    showToast("Carte chargée avec succès !");
                },
                error -> {
                    // Gérer l'erreur
                    showToast("Échec du chargement de la carte : " + error.getMessage());
                }
            );
        }
        
        private void setupCamera(MapData mapData) {
            // Positionner la caméra pour voir toute la carte
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

!!! success "Chargement de carte"
    Le moteur prend en charge le chargement de cartes depuis plusieurs sources, y compris les assets, le stockage local et les URL distantes. Consultez le [Guide de chargement de carte](../features/map_loading.md) pour plus de détails.

---

## <span class="emoji"> :material-numeric-3-circle: </span> Étape 3 : Ajouter l'interaction utilisateur

Permettez aux utilisateurs d'interagir avec la carte via des gestes tactiles comme le panoramique, le zoom et la rotation.

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
            
            // Activer les contrôles gestuels
            setupGestureControls()
        }
        
        private fun setupGestureControls() {
            gestureHandler = GestureHandler(sceneView).apply {
                // Activer le geste de panoramique
                isPanEnabled = true
                
                // Activer le pincement pour zoomer
                isZoomEnabled = true
                
                // Activer la rotation
                isRotationEnabled = true
                
                // Définir les limites de zoom
                minZoom = 1.0f
                maxZoom = 10.0f
                
                // Ajouter un écouteur de geste
                setOnGestureListener(object : GestureHandler.OnGestureListener {
                    override fun onSingleTap(x: Float, y: Float) {
                        // Gérer le toucher sur la carte
                        handleMapTap(x, y)
                    }
                    
                    override fun onLongPress(x: Float, y: Float) {
                        // Gérer l'appui long
                        showContextMenu(x, y)
                    }
                })
            }
        }
        
        private fun handleMapTap(x: Float, y: Float) {
            // Effectuer un test de collision pour détecter les objets touchés
            sceneView.hitTest(x, y) { result ->
                result?.let {
                    // Afficher les informations sur l'emplacement touché
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
            
            // Activer les contrôles gestuels
            setupGestureControls();
        }
        
        private void setupGestureControls() {
            gestureHandler = new GestureHandler(sceneView);
            
            // Activer le geste de panoramique
            gestureHandler.setPanEnabled(true);
            
            // Activer le pincement pour zoomer
            gestureHandler.setZoomEnabled(true);
            
            // Activer la rotation
            gestureHandler.setRotationEnabled(true);
            
            // Définir les limites de zoom
            gestureHandler.setMinZoom(1.0f);
            gestureHandler.setMaxZoom(10.0f);
            
            // Ajouter un écouteur de geste
            gestureHandler.setOnGestureListener(new GestureHandler.OnGestureListener() {
                @Override
                public void onSingleTap(float x, float y) {
                    // Gérer le toucher sur la carte
                    handleMapTap(x, y);
                }
                
                @Override
                public void onLongPress(float x, float y) {
                    // Gérer l'appui long
                    showContextMenu(x, y);
                }
            });
        }
        
        private void handleMapTap(float x, float y) {
            // Effectuer un test de collision pour détecter les objets touchés
            sceneView.hitTest(x, y, result -> {
                if (result != null) {
                    // Afficher les informations sur l'emplacement touché
                    showLocationInfo(result);
                }
            });
        }
    }
    ```

---

## <span class="emoji"> :material-numeric-4-circle: </span> Étape 4 : Configurer l'affichage de la carte

Personnalisez l'apparence et le comportement de l'affichage de votre carte.

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.models.DisplayConfig
    
    private fun configureMapDisplay() {
        sceneView.apply {
            // Définir la couleur d'arrière-plan
            setBackgroundColor(android.graphics.Color.WHITE)
            
            // Configurer la qualité de rendu
            displayConfig = DisplayConfig(
                antiAliasing = true,
                shadowsEnabled = true,
                ambientOcclusion = true,
                renderQuality = DisplayConfig.RenderQuality.HIGH
            )
            
            // Activer le compteur FPS pour le débogage
            showFpsCounter = BuildConfig.DEBUG
            
            // Définir les conditions d'éclairage
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
        // Définir la couleur d'arrière-plan
        sceneView.setBackgroundColor(android.graphics.Color.WHITE);
        
        // Configurer la qualité de rendu
        DisplayConfig config = new DisplayConfig.Builder()
            .setAntiAliasing(true)
            .setShadowsEnabled(true)
            .setAmbientOcclusion(true)
            .setRenderQuality(DisplayConfig.RenderQuality.HIGH)
            .build();
        sceneView.setDisplayConfig(config);
        
        // Activer le compteur FPS pour le débogage
        sceneView.setShowFpsCounter(BuildConfig.DEBUG);
        
        // Définir les conditions d'éclairage
        sceneView.getLighting().setAmbientLightIntensity(0.5f);
        sceneView.getLighting().setDirectionalLightIntensity(0.8f);
        sceneView.getLighting().setDirectionalLightDirection(
            new float[]{0f, -1f, 0.5f}
        );
    }
    ```

---

## <span class="emoji"> :material-map-marker-path: </span> Exemple complet

Voici un exemple complet et prêt pour la production qui combine toutes les étapes :

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
            
            // Initialiser la vue de scène
            sceneView = MineSceneView(this)
            setContentView(sceneView)
            
            // Configurer l'affichage
            configureMapDisplay()
            
            // Configurer les interactions
            setupGestureControls()
            
            // Charger la carte
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
                    Toast.makeText(this, "Carte chargée !", Toast.LENGTH_SHORT).show()
                },
                onError = { error ->
                    Toast.makeText(
                        this, 
                        "Erreur : ${error.message}", 
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

=== "Layout XML"

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
        
        <!-- Optionnel : Ajouter une superposition de contrôles UI -->
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

## <span class="emoji"> :material-check-all: </span> Tester votre application

Compilez et lancez votre application pour voir le moteur de navigation en action !

1. **Connectez un appareil** ou démarrez un émulateur
2. **Compilez le projet** : `Build → Make Project`
3. **Lancez l'application** : Cliquez sur le bouton Run ou appuyez sur `Shift + F10`

!!! success "Félicitations ! 🎉"
    Vous avez créé avec succès votre première application de navigation intérieure ! La carte devrait maintenant s'afficher avec un support gestuel complet.

---

## <span class="emoji"> :material-lightning-bolt: </span> Prochaines étapes

Maintenant que vous avez une application de navigation de base en fonctionnement, explorez ces fonctionnalités avancées :

<div class="grid cards" markdown>

-   :material-code-braces:{ .lg .middle } **Utilisation avancée**

    ---

    Apprenez les techniques avancées et les bonnes pratiques

    [:octicons-arrow-right-24: Guide d'utilisation](usage.md)

-   :material-navigation:{ .lg .middle } **Navigation et routage**

    ---

    Implémentez la navigation étape par étape et la recherche de chemin

    [:octicons-arrow-right-24: Fonctionnalités de navigation](../features/navigation.md)

-   :material-palette:{ .lg .middle } **Personnaliser les thèmes**

    ---

    Appliquez des thèmes et styles personnalisés à vos cartes

    [:octicons-arrow-right-24: Personnalisation du thème](../features/theme_customization.md)

-   :material-widgets:{ .lg .middle } **Composants UI**

    ---

    Ajoutez des composants UI pré-construits pour une meilleure UX

    [:octicons-arrow-right-24: Composants UI](../features/ui_components.md)

</div>

---

## <span class="emoji"> :material-help-circle: </span> Problèmes courants

??? question "La carte ne s'affiche pas ?"
    **Vérifiez ces éléments :**
    
    - Vérifiez que le fichier de carte existe dans votre dossier `assets/maps/`
    - Assurez-vous que le format de fichier est pris en charge (GLB, GLTF)
    - Consultez logcat pour les messages d'erreur
    - Vérifiez que les méthodes du cycle de vie sont correctement appelées

??? question "Les gestes tactiles ne fonctionnent pas ?"
    **Solution** : Assurez-vous que vous ne consommez pas les événements tactiles dans une vue parente. Vérifiez également que `GestureHandler` est correctement initialisé.

??? question "Problèmes de performance ?"
    **Essayez ces optimisations :**
    
    - Réduisez la `RenderQuality` à `MEDIUM` ou `LOW`
    - Désactivez les ombres ou l'occlusion ambiante
    - Optimisez la taille du fichier de votre modèle 3D
    - Testez sur un appareil physique plutôt qu'un émulateur

Pour plus d'aide au dépannage, consultez notre [Guide de dépannage](../support/troubleshooting.md).

---

## <span class="emoji"> :material-book-open-variant: </span> Ressources supplémentaires

- 📖 [Référence API complète](../api_reference/module_overview.md)
- 🎯 [Aperçu des fonctionnalités](../features/features_overview.md)
- 💬 [FAQ](../support/faq.md)
- 📧 [Contacter le support](../support/contact_us.md)

!!! tip "Rejoignez notre communauté"
    Vous avez des questions ou souhaitez partager votre projet ? Connectez-vous avec d'autres développeurs utilisant MINE !

