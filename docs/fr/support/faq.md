# <span class="emoji"> :material-chat-question: </span> Questions fréquemment posées

Trouvez rapidement des réponses aux questions courantes sur **MINE - Moteur de Navigation Intérieure**. Vous ne trouvez pas ce que vous cherchez ? [Contactez notre équipe de support](contact_us.md).

!!! tip "Recherche rapide"
    Utilisez `Ctrl+F` (ou `Cmd+F` sur Mac) pour rechercher des mots-clés sur cette page.

---

## <span class="emoji"> :material-compass: </span> Table des matières

- [Démarrage](#demarrage)
- [Fonctionnalités et capacités](#fonctionnalites-capacites)
- [Questions techniques](#questions-techniques)
- [Licence et tarification](#licence-tarification)
- [Support de plateforme](#support-plateforme)
- [Intégration et développement](#integration-developpement)
- [Performance et optimisation](#performance-optimisation)
- [Dépannage](#depannage)
- [Communauté et support](#communaute-support)

---

## <span class="emoji"> :material-rocket-launch: </span> Démarrage

### Comment démarrer avec MINE ?

Le démarrage est facile ! Suivez ces étapes :

1. **Installer la bibliothèque** : Ajoutez la dépendance à votre fichier `build.gradle`
   ```kotlin
   implementation("com.machinestalk:indoornavigationengine:0.4.0-alpha")
   ```

2. **Configurer votre projet** : Configurez la compatibilité Java 17
   ```kotlin
   compileOptions {
       sourceCompatibility = JavaVersion.VERSION_17
       targetCompatibility = JavaVersion.VERSION_17
   }
   ```

3. **Suivre le guide de démarrage rapide** : Notre [Guide de démarrage rapide](../getting_started/quick_start.md) fournit un tutoriel étape par étape pour configurer votre première expérience de navigation.

4. **Explorer les exemples** : Consultez le [Guide d'utilisation](../getting_started/usage.md) pour des exemples de code complets.

**Temps estimé** : 10-15 minutes pour avoir une application de navigation fonctionnelle !

---

### Quels sont les prérequis pour utiliser MINE ?

Vous aurez besoin de :

| Prérequis | Minimum | Recommandé |
|-----------|---------|------------|
| **Android Studio** | Arctic Fox | Dernière version stable |
| **JDK** | 17 | 17+ |
| **Android SDK** | API 24 (Android 7.0) | API 34 (Android 14) |
| **Gradle** | 8.2 | Dernière version |
| **Kotlin** | 1.8.0 | Dernière version |

**Prérequis supplémentaires** :
- Connaissances de base du développement Android
- Compréhension de Kotlin ou Java
- Modèles de cartes 3D au format glTF/GLB
- (Optionnel) Infrastructure de positionnement intérieur (WiFi, balises)

---

### Fournissez-vous des projets d'exemple ou des démos ?

Oui ! Nous fournissons :

- 📱 **Application d'exemple** : Implémentation de référence complète présentant toutes les fonctionnalités
- 💻 **Extraits de code** : Exemples de code prêts à l'emploi dans notre documentation
- 🎥 **Tutoriels vidéo** : Guides vidéo étape par étape (à venir)
- 🗂️ **Données de carte d'exemple** : Exemples de configurations JSON et modèles 3D

Consultez notre [dépôt GitHub](#) ou [contactez-nous](contact_us.md) pour accéder aux projets d'exemple.

---

## <span class="emoji"> :material-feature-search: </span> Fonctionnalités et capacités

### Quelles sont les principales fonctionnalités de MINE ?

MINE offre un ensemble complet de fonctionnalités pour la navigation intérieure :

<div class="grid cards" markdown>

-   :material-cube-outline:{ .lg .middle } **Rendu 3D/2D**

    ---

    Rendu accéléré matériellement avec basculement de vue transparent

-   :material-map-marker-path:{ .lg .middle } **Recherche de chemin**

    ---

    Algorithme A* avancé avec support multi-étages

-   :material-navigation-variant:{ .lg .middle } **Navigation en temps réel**

    ---

    Instructions étape par étape avec suivi de position en direct

-   :material-widgets:{ .lg .middle } **Composants UI**

    ---

    Composants pré-construits et personnalisables pour la navigation

-   :material-theme-light-dark:{ .lg .middle } **Support de thème**

    ---

    Mode sombre/clair avec capacités de thème personnalisé

-   :material-map-marker-radius:{ .lg .middle } **Suivi de localisation**

    ---

    Positionnement multi-fournisseur (WiFi, Bluetooth, capteurs)

-   :material-routes:{ .lg .middle } **Routage accessible**

    ---

    Chemins accessibles en fauteuil roulant et itinéraires alternatifs

-   :material-timer-sand:{ .lg .middle } **Support hors-ligne**

    ---

    Fonctionne sans connexion internet (à venir)

</div>

**Liste complète des fonctionnalités** : Consultez notre [Aperçu des fonctionnalités](../features/features_overview.md) pour des informations détaillées.

---

### MINE supporte-t-il la navigation multi-étages ?

**Oui !** La navigation multi-étages est entièrement supportée :

- ✅ Détection automatique d'étage
- ✅ Routage par ascenseur et escalier
- ✅ Transitions d'étage transparentes
- ✅ Composant UI de sélection d'étage
- ✅ Recherche de chemin sensible aux étages

**Exemple** :
```kotlin
// Naviguer entre les étages
val route = pathFinder.findPath(
    start = Location(floor = "ground", x = 10f, y = 5f),
    end = Location(floor = "first", x = 25f, y = 15f)
)
// L'itinéraire inclut automatiquement les instructions de changement d'étage
```

Apprenez-en plus dans notre [Guide de navigation](../features/navigation.md).

---

### Puis-je personnaliser l'apparence de la carte ?

**Absolument !** MINE offre une personnalisation étendue :

**Personnalisation du thème** :
- Couleurs primaire, secondaire et d'accentuation
- Couleurs et largeurs de chemin
- Styles de marqueurs POI
- Couleurs d'arrière-plan
- Typographie et polices

**Éléments visuels** :
- Icônes personnalisées pour les POI
- Superpositions de plan d'étage
- Styles de visualisation d'itinéraire
- Style des composants UI

**Exemple** :
```kotlin
val customTheme = ThemeConfig(
    primaryColor = Color.parseColor("#FF5722"),
    pathColor = Color.parseColor("#4CAF50"),
    poiMarkerColor = Color.parseColor("#FFC107")
)
sceneView.setThemeConfig(customTheme)
```

Voir [Personnalisation du thème](../features/theme_customization.md) pour tous les détails.

---

### MINE supporte-t-il la navigation vocale ?

**Bientôt disponible !** La navigation vocale est prévue pour la v0.5.0 (T4 2024) :

- 🔊 Instructions étape par étape avec synthèse vocale
- 🌐 Support multilingue (15+ langues)
- 🎚️ Paramètres vocaux ajustables
- 🔇 Mode silencieux optionnel

**Capacités actuelles** :
- Instructions visuelles étape par étape
- Indicateurs de progression
- Estimations de distance et de temps
- Retour haptique

Suivez nos [Notes de version](../release_notes/release_notes.md) pour les mises à jour !

---

## <span class="emoji"> :material-code-braces: </span> Questions techniques

### Quels formats de carte MINE supporte-t-il ?

**Modèles 3D** :
- ✅ glTF (.gltf)
- ✅ glTF binaire (.glb) - Recommandé
- ❌ OBJ, FBX, BLEND (non supportés)

**Configuration de carte** :
- ✅ JSON pour la structure de carte et les métadonnées
- ✅ Propriétés personnalisées et extensions

**Bonnes pratiques** :
- Utiliser le format `.glb` pour de meilleures performances
- Garder les modèles sous 50MB pour un chargement optimal
- Optimiser les textures pour les appareils mobiles
- Utiliser la compression Draco si possible

---

### Quelle est la précision du positionnement intérieur ?

La précision dépend de la technologie de positionnement utilisée :

| Technologie | Précision typique | Meilleur cas d'usage |
|-------------|-------------------|----------------------|
| **Empreinte WiFi** | 3-5 mètres | Grands lieux |
| **Balises Bluetooth** | 1-3 mètres | Navigation précise |
| **Fusion de capteurs** | 2-8 mètres | Complémentaire |
| **PDR** | 5-15 mètres | Suivi de mouvement |
| **Combiné** | 1-3 mètres | Configuration optimale |

**Améliorer la précision** :
- Déployer plus de balises
- Utiliser la calibration d'empreinte WiFi
- Activer la fusion de capteurs
- Maintenance régulière de l'infrastructure

---

### Puis-je utiliser mon propre système de positionnement ?

**Oui !** MINE supporte les fournisseurs de localisation personnalisés :

```kotlin
class CustomLocationProvider : LocationProvider {
    
    override val name = "Fournisseur personnalisé"
    
    override fun startTracking() {
        // Votre logique de positionnement
    }
    
    override fun stopTracking() {
        // Nettoyage
    }
    
    override fun getCurrentLocation(): Location {
        // Retourner la position actuelle
        return Location(x = x, y = y, floor = floorId)
    }
}

// Enregistrer votre fournisseur
locationTracker.addProvider(CustomLocationProvider(), priority = 10)
```

Voir [Suivi de localisation](../features/navigation.md#location-tracking) pour plus de détails.

---

### Quel moteur de rendu MINE utilise-t-il ?

MINE utilise **Google Filament** - un moteur de rendu basé sur la physique :

**Avantages** :
- 🎨 Graphiques 3D de haute qualité
- ⚡ Performances accélérées matériellement
- 📱 Optimisé pour les appareils mobiles
- 🔧 Pipeline standard de l'industrie

**Performances** :
- 60 FPS sur les appareils de milieu de gamme
- Utilisation mémoire efficace
- Rendu optimisé pour la batterie

**En savoir plus** : [Référence API Filament](../api_reference/filament.md)

---

### MINE fonctionne-t-il hors-ligne ?

**Support partiel** :
- ✅ Actuellement : Les cartes pré-chargées fonctionnent hors-ligne
- ✅ Actuellement : Navigation sans internet
- ❌ Actuellement : Pas de téléchargements de cartes hors-ligne
- 🔄 Arrive dans v0.5.0 : Paquets de cartes hors-ligne complets

**Capacités hors-ligne actuelles** :
```kotlin
// Charger la carte depuis les assets (fonctionne hors-ligne)
val mapData = JsonUtil.LoadJsonFromAsset(context, "maps/venue.json")
sceneView.setMapData(mapData)

// La navigation fonctionne sans internet
navigationManager.startNavigation(destination)
```

---

## <span class="emoji"> :material-currency-usd: </span> Licence et tarification

### MINE est-il gratuit ?

**Options de licence** :

| Type de licence | Coût | Cas d'usage |
|----------------|------|-------------|
| **Développement** | Gratuit | Tests et développement |
| **Commercial** | Payant | Applications de production |
| **Entreprise** | Personnalisé | Déploiements à grande échelle |
| **Open Source** | Gratuit* | Projets non commerciaux |

*Gratuit pour les projets open source approuvés

**Ce qui est inclus** :
- ✅ Accès complet aux fonctionnalités
- ✅ Mises à jour régulières
- ✅ Documentation
- ✅ Corrections de bugs
- ✅ Support communautaire

**La licence commerciale inclut** :
- ✅ Support prioritaire
- ✅ Développement personnalisé
- ✅ Garanties SLA
- ✅ Options de déploiement sur site

**Commencer** : [Contactez-nous](contact_us.md) pour les informations de tarification.

---

### Offrez-vous des réductions éducatives ?

**Oui !** Nous soutenons l'éducation :

- 🎓 **Licences académiques** : Gratuit pour les universités et la recherche
- 👨‍🎓 **Réductions étudiantes** : Tarifs réduits pour les projets étudiants
- 🏫 **Institutions éducatives** : Paliers de tarification spéciaux

**Prérequis** :
- Adresse email éducative valide
- Preuve d'inscription/d'emploi
- Utilisation non commerciale

**Postuler** : [Contactez-nous](contact_us.md) avec vos identifiants éducatifs.

---

### Puis-je évaluer MINE avant d'acheter ?

**Absolument !** Nous offrons :

- ⏰ **Essai de 30 jours** : Évaluation avec toutes les fonctionnalités
- 📊 **Preuve de concept** : Test avec vos données
- 🤝 **Consultation technique** : Aide pour l'évaluation
- 💻 **Projets d'exemple** : Exemples pré-construits

**L'essai inclut** :
- Toutes les fonctionnalités déverrouillées
- Support technique
- Accès à la documentation
- Exemples de cartes et données

**Démarrer l'essai** : [Contactez-nous](contact_us.md) pour demander un accès d'évaluation.

---

## <span class="emoji"> :material-android: </span> Support de plateforme

### Quelles versions d'Android sont supportées ?

| Version Android | Niveau API | Statut de support |
|-----------------|------------|-------------------|
| Android 14 | 34 | ✅ Entièrement supporté |
| Android 13 | 33 | ✅ Entièrement supporté |
| Android 12 | 31-32 | ✅ Entièrement supporté |
| Android 11 | 30 | ✅ Entièrement supporté |
| Android 10 | 29 | ✅ Entièrement supporté |
| Android 9 | 28 | ✅ Entièrement supporté |
| Android 8 | 26-27 | ✅ Supporté |
| Android 7 | 24-25 | ✅ Minimum requis |
| Android 6 | 23 | ❌ Non supporté |

**SDK cible** : 34 (Android 14)  
**SDK minimum** : 24 (Android 7.0)

---

### MINE supporte-t-il iOS ?

**Pas actuellement** : MINE est Android uniquement pour le moment.

**Plans futurs** :
- 🔄 Version iOS en considération
- 📱 Utiliserait les API natives iOS
- 🎯 Prévu pour 2025 (provisoire)

**Alternatives** :
- Envisager Kotlin Multiplatform Mobile (KMM) à l'avenir
- Contactez-nous pour exprimer votre intérêt pour le support iOS

**Demander des mises à jour** : [Rejoignez notre liste de diffusion](contact_us.md) pour les annonces iOS.

---

### Y a-t-il des plans pour Kotlin Multiplatform ?

**En évaluation** : Nous explorons Kotlin Multiplatform (KMP) :

**Considérations** :
- 📊 Évaluation de la demande communautaire
- 🔧 Analyse de faisabilité technique
- 🗓️ Aucune chronologie confirmée pour le moment

**Focus actuel** :
- Amélioration de l'expérience Android
- Ajout de plus de fonctionnalités
- Optimisation des performances

**Partagez votre intérêt** : Si le support KMP est important pour vous, [faites-le nous savoir](contact_us.md) !

---

### MINE supporte-t-il les tablettes ?

**Oui !** MINE fonctionne parfaitement sur les tablettes :

- ✅ Composants UI réactifs
- ✅ Layouts optimisés pour les grands écrans
- ✅ Expérience de navigation améliorée
- ✅ Support écran partagé
- ✅ Testé sur les tablettes 7"-12"

**Fonctionnalités spécifiques aux tablettes** :
- Zone de visualisation de carte plus grande
- Informations POI côte à côte
- Contrôles UI améliorés
- Meilleure lisibilité

---

## <span class="emoji"> :material-puzzle: </span> Intégration et développement

### Puis-je intégrer MINE dans mon application existante ?

**Oui !** MINE est conçu pour une intégration facile :

**Points d'intégration** :
- 🎨 UI/UX personnalisée
- 🗺️ Cartes existantes
- 📍 Services de localisation
- 📊 Plateformes d'analyse
- 🔐 Systèmes d'authentification

**Architecture flexible** :
```kotlin
// Utiliser comme Activity
class NavActivity : AppCompatActivity() {
    private lateinit var sceneView: MineSceneView
}

// Utiliser comme Fragment
class NavFragment : Fragment() {
    private var sceneView: MineSceneView? = null
}

// Utiliser dans Jetpack Compose
@Composable
fun MapScreen() {
    IndoorNavigationScene(mapBuild = mapData)
}
```

Voir [Guide d'utilisation](../getting_started/usage.md) pour les modèles d'intégration.

---

### Comment ajouter des points d'intérêt (POI) personnalisés ?

**Gestion POI facile** :

```kotlin
// Ajouter un POI programmatiquement
val poi = PointOfInterest(
    id = "coffee-shop-01",
    name = "Starbucks",
    category = "Nourriture & Boissons",
    floor = "ground",
    position = floatArrayOf(15.5f, 8.2f, 0f),
    icon = R.drawable.ic_coffee,
    metadata = mapOf(
        "phone" to "+1-555-1234",
        "hours" to "7h-21h"
    )
)

poiManager.addPOI(poi)

// Ou charger depuis JSON
{
  "pointsOfInterest": [
    {
      "id": "coffee-shop-01",
      "name": "Starbucks",
      "category": "Nourriture & Boissons",
      "floor": "ground",
      "position": { "x": 15.5, "y": 8.2, "z": 0 }
    }
  ]
}
```

---

### Puis-je utiliser MINE avec Jetpack Compose ?

**Oui !** Support complet de Compose :

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
        
        // Ajouter des superpositions UI Compose
        FloatingActionButton(
            onClick = { /* Naviguer */ },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp)
        ) {
            Icon(Icons.Default.Navigation, "Naviguer")
        }
    }
}
```

Voir [Intégration Compose](../getting_started/usage.md#jetpack-compose-integration) pour plus.

---

### MINE supporte-t-il K2 (Kotlin 2.0) ?

**Oui !** MINE supporte entièrement Kotlin 2.0 :

- ✅ Compatible avec le compilateur K2
- ✅ Testé avec Kotlin 2.0+
- ✅ Profite des améliorations K2
- ✅ Aucun problème de migration

**Avantages** :
- Temps de compilation plus rapides
- Meilleures performances de l'IDE
- Inférence de type améliorée
- Analyse de code améliorée

Si vous rencontrez des problèmes liés à K2, [veuillez les signaler](contact_us.md).

---

## <span class="emoji"> :material-speedometer: </span> Performance et optimisation

### Comment MINE performe-t-il sur les appareils bas de gamme ?

**Performance adaptative** :

MINE ajuste automatiquement la qualité en fonction des capacités de l'appareil :

| Gamme d'appareil | Fréquence d'images | Qualité | Mémoire |
|------------------|-------------------|---------|---------|
| **Flagship** | 60 FPS | Élevée | 150MB |
| **Milieu de gamme** | 60 FPS | Moyenne | 120MB |
| **Budget** | 30-45 FPS | Basse | 90MB |

**Conseils d'optimisation** :
```kotlin
// Détecter et optimiser pour les appareils bas de gamme
if (DeviceUtil.isLowEndDevice()) {
    sceneView.displayConfig = DisplayConfig(
        renderQuality = DisplayConfig.RenderQuality.LOW,
        shadowsEnabled = false
    )
    sceneView.setRenderMode(RenderMode.MODE_2D)
}
```

Voir [Optimisation des performances](../getting_started/usage.md#performance-optimization).

---

### Quel est l'impact sur la taille de l'application ?

**Taille de la bibliothèque** :
- Taille AAR : ~8MB
- Avec les dépendances : ~15MB
- Bibliothèques natives (tous les ABI) : ~12MB

**Optimisation** :
```kotlin
// Réduire la taille APK en filtrant les ABI
android {
    defaultConfig {
        ndk {
            abiFilters += listOf("armeabi-v7a", "arm64-v8a")
        }
    }
}
```

**Résultat** : Peut réduire d'environ 40% en ciblant des architectures spécifiques.

---

### Quelle est la consommation de batterie de la navigation ?

**Utilisation de la batterie** (1 heure de navigation continue) :

| Scénario | Décharge batterie | Notes |
|----------|-------------------|-------|
| Navigation 3D | 8-10% | Haute qualité |
| Navigation 2D | 5-7% | Optimisée |
| Suivi en arrière-plan | 3-5% | Minimale |

**Optimisation de la batterie** :
- Utiliser le mode 2D quand possible
- Réduire la fréquence de mise à jour de localisation quand stationnaire
- Réduire la qualité de rendu sur batterie faible
- Mettre en pause le rendu quand l'app est en arrière-plan

---

## <span class="emoji"> :material-help-circle: </span> Dépannage

### Où puis-je trouver de l'aide au dépannage ?

**Ressources** :

1. **Guide de dépannage** : [Voir les solutions détaillées](troubleshooting.md)
2. **FAQ** : Vous y êtes ! Consultez d'autres questions
3. **Documentation API** : [Parcourir la référence API](../api_reference/module_overview.md)
4. **Équipe de support** : [Contactez-nous](contact_us.md)

**Problèmes courants** :
- Carte ne se charge pas → Vérifier les chemins de fichiers
- Navigation ne démarre pas → Vérifier les permissions
- Mauvais positionnement → Vérifier la configuration des balises
- Problèmes de performance → Optimiser les paramètres

---

### Comment signaler un bug ?

**Signalement de bug** :

1. **Vérifier les problèmes existants** : Rechercher dans notre [FAQ](#) et [Dépannage](troubleshooting.md)
2. **Rassembler les informations** :
   - Version MINE
   - Version Android et modèle d'appareil
   - Étapes pour reproduire
   - Logs d'erreur
   - Captures d'écran/vidéos

3. **Soumettre le rapport** : [Contacter le support](contact_us.md) avec les détails

**Nous valorisons vos retours** : Chaque rapport de bug aide à améliorer MINE !

---

### Quelle journalisation dois-je activer pour le débogage ?

**Configuration de débogage** :

```kotlin
if (BuildConfig.DEBUG) {
    // Activer la journalisation détaillée
    MineLogger.setLogLevel(MineLogger.Level.VERBOSE)
    
    // Afficher les superpositions de débogage
    sceneView.showDebugOverlay = true
    sceneView.showFpsCounter = true
    
    // Activer le mode fil de fer
    sceneView.debugWireframe = false
    
    // Journaliser les événements de navigation
    navigationManager.enableDebugLogging = true
}

// Capturer les logs
adb logcat MINE:V *:S > mine_logs.txt
```

---

## <span class="emoji"> :material-account-group: </span> Communauté et support

### Où puis-je obtenir de l'aide ?

**Canaux de support** :

<div class="grid cards" markdown>

-   :material-email:{ .lg .middle } **Support par email**

    ---

    Support direct de notre équipe

    [:octicons-arrow-right-24: Contactez-nous](contact_us.md)

-   :material-file-document:{ .lg .middle } **Documentation**

    ---

    Guides complets et références

    [:octicons-arrow-right-24: Parcourir la doc](../getting_started/quick_start.md)

-   :material-chat-question:{ .lg .middle } **FAQ**

    ---

    Réponses rapides aux questions courantes

    [:octicons-arrow-right-24: Voir la FAQ](#)

-   :material-bug:{ .lg .middle } **Rapports de bugs**

    ---

    Signaler des problèmes et suivre les corrections

    [:octicons-arrow-right-24: Signaler un bug](contact_us.md)

</div>

---

### Comment puis-je contribuer à MINE ?

**Statut actuel** : N'accepte pas les contributions publiques

**Mais vous pouvez aider** :
- 📝 Signaler des bugs et problèmes
- 💡 Suggérer des fonctionnalités
- 📖 Partager vos retours sur la documentation
- 🌟 Partager vos réussites

**Plans futurs** : Nous pourrions ouvrir des parties de MINE en open source à l'avenir.

---

### Avez-vous une communauté de développeurs ?

**Ressources communautaires** (à venir) :

- 💬 Forum développeurs
- 👥 Canal Slack
- 🐦 Mises à jour Twitter/X
- 📺 Tutoriels YouTube
- 📝 Blog développeurs

**Restez connecté** : [Contactez-nous](contact_us.md) pour rejoindre notre liste de diffusion !

---

### Quel est le calendrier de sortie ?

**Cycle actuel** :
- Versions majeures : Trimestrielles
- Mises à jour mineures : Mensuelles
- Corrections de bugs : Au besoin
- Correctifs de sécurité : Immédiats

**Versions à venir** :
- **v0.5.0** (T4 2024) : Cartes hors-ligne, guidage vocal
- **v0.6.0** (T1 2025) : Navigation AR, analytique
- **v1.0.0** (T1 2025) : Version de production

Voir [Notes de version](../release_notes/release_notes.md) pour la feuille de route détaillée.

---

## <span class="emoji"> :material-alert-circle: </span> Vous avez encore des questions ?

<div class="grid cards" markdown>

-   :material-email-fast:{ .lg .middle } **Contacter le support**

    ---

    Obtenez de l'aide personnalisée de notre équipe

    [:octicons-arrow-right-24: Envoyer un message](contact_us.md)

-   :material-book-open-variant:{ .lg .middle } **Parcourir la documentation**

    ---

    Explorer les guides complets

    [:octicons-arrow-right-24: Voir la doc](../getting_started/quick_start.md)

-   :material-tools:{ .lg .middle } **Dépannage**

    ---

    Trouver des solutions aux problèmes courants

    [:octicons-arrow-right-24: Obtenir de l'aide](troubleshooting.md)

</div>

---

!!! success "Nous sommes là pour vous aider !"
    Vous ne trouvez pas votre réponse ? N'hésitez pas à [nous contacter](contact_us.md) - nous sommes heureux de vous aider à réussir avec MINE !
