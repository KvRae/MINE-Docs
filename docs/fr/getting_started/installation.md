# <span class="emoji"> :material-download: </span> Installation

Démarrez avec **MINE - Moteur de Navigation Intérieure** en l'intégrant dans votre projet Android. Ce guide complet vous accompagne tout au long du processus d'installation, des prérequis à la vérification.

---

## <span class="emoji"> :material-wrench-cog: </span> Prérequis

Avant d'intégrer le Moteur de Navigation Intérieure, assurez-vous que votre environnement de développement répond aux exigences suivantes :

| Prérequis | Version | Description |
|-----------|---------|-------------|
| **Android Studio** | Dernière version stable | IDE recommandé pour le développement Android |
| **JDK** | 17+ | Requis pour la compilation et l'exécution |
| **Android SDK** | Min: 24, Cible: 34 | Compatibilité du niveau d'API |
| **Gradle** | 8.2+ | Outil d'automatisation de build |

!!! tip "Environnement de développement"
    Nous recommandons d'utiliser la dernière version stable d'Android Studio avec la plateforme Android SDK 34 pour une expérience de développement optimale.

---

## <span class="emoji"> :octicons-diff-added-16: </span> Ajout de la dépendance

Choisissez votre système de build préféré pour intégrer le Moteur de Navigation Intérieure dans votre projet.

### <span class="emoji"> :simple-gradle: </span> Gradle (Recommandé)

=== "Kotlin DSL (build.gradle.kts)"

    ```kotlin
    dependencies {
        // Moteur de Navigation Intérieure - Bibliothèque principale
        implementation("com.machinestalk:indoornavigationengine:1.0.0")
    }
    ```

=== "Groovy DSL (build.gradle)"

    ```groovy
    dependencies {
        // Moteur de Navigation Intérieure - Bibliothèque principale
        implementation 'com.machinestalk:indoornavigationengine:1.0.0'
    }
    ```

!!! success "Dernière version"
    La version stable actuelle est **1.0.0**. Consultez nos [notes de version](../release_notes/release_notes.md) pour les dernières mises à jour et fonctionnalités.

---

### <span class="emoji"> :simple-apachemaven: </span> Maven

Si vous utilisez Maven comme système de build, ajoutez la dépendance suivante à votre `pom.xml` :

```xml
<dependency>
    <groupId>com.machinestalk</groupId>
    <artifactId>indoornavigationengine</artifactId>
    <version>1.0.0</version>
    <type>aar</type>
</dependency>
```

---

## <span class="emoji"> :material-cog: </span> Configuration

### Compatibilité Java 17

!!! warning "Java 17 requis"
    Le Moteur de Navigation Intérieure utilise [Filament](https://google.github.io/filament/), une puissante bibliothèque native de rendu 3D écrite en C++. Les liaisons JNI sont compilées avec **Java 17**, ce qui le rend obligatoire pour votre projet.

Configurez la compatibilité Java de votre projet dans le fichier `build.gradle` au niveau du module :

=== "Kotlin DSL"

    ```kotlin
    android {
        compileOptions {
            sourceCompatibility = JavaVersion.VERSION_17
            targetCompatibility = JavaVersion.VERSION_17
        }
        
        kotlinOptions {
            jvmTarget = "17"
        }
    }
    ```

=== "Groovy DSL"

    ```groovy
    android {
        compileOptions {
            sourceCompatibility JavaVersion.VERSION_17
            targetCompatibility JavaVersion.VERSION_17
        }
        
        kotlinOptions {
            jvmTarget = '17'
        }
    }
    ```

---

### Permissions

Ajoutez les permissions suivantes à votre `AndroidManifest.xml` pour activer toutes les fonctionnalités :

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Requis pour les opérations réseau et le chargement de cartes -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Optionnel : Pour les fonctionnalités basées sur la localisation -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
</manifest>
```

!!! info "Justification des permissions"
    - **INTERNET** : Requis pour charger les données et ressources de carte
    - **ACCESS_NETWORK_STATE** : Permet de vérifier la connectivité réseau
    - **Permissions de localisation** : Optionnelles, nécessaires uniquement si vous utilisez des fonctionnalités de positionnement basées sur la localisation

---

### Règles ProGuard

Si vous utilisez l'obfuscation de code, ajoutez ces règles ProGuard pour éviter les problèmes d'exécution :

```proguard
# Moteur de Navigation Intérieure
-keep class com.machinestalk.indoornavigationengine.** { *; }
-keepclassmembers class com.machinestalk.indoornavigationengine.** { *; }

# Bibliothèques natives Filament
-keep class com.google.android.filament.** { *; }
-keepclassmembers class com.google.android.filament.** { *; }
```

---

## <span class="emoji"> :material-check-circle: </span> Vérifier l'installation

Après avoir ajouté la dépendance et synchronisé votre projet, vérifiez l'installation en créant un test simple :

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import android.os.Bundle
    import androidx.appcompat.app.AppCompatActivity
    
    class MainActivity : AppCompatActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialiser le moteur de navigation
            val sceneView = MineSceneView(this)
            setContentView(sceneView)
            
            // Si cela se compile avec succès, l'installation est terminée !
        }
    }
    ```

=== "Java"

    ```java
    import com.machinestalk.indoornavigationengine.ui.MineSceneView;
    import android.os.Bundle;
    import androidx.appcompat.app.AppCompatActivity;
    
    public class MainActivity extends AppCompatActivity {
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            
            // Initialiser le moteur de navigation
            MineSceneView sceneView = new MineSceneView(this);
            setContentView(sceneView);
            
            // Si cela se compile avec succès, l'installation est terminée !
        }
    }
    ```

!!! success "Installation terminée"
    Si votre projet se compile sans erreur, félicitations ! Le Moteur de Navigation Intérieure est installé avec succès. Passez au [Guide de démarrage rapide](quick_start.md) pour commencer à implémenter les fonctionnalités de navigation.

---

## <span class="emoji"> :material-alert-circle: </span> Dépannage

Vous rencontrez des problèmes ? Voici les problèmes courants et leurs solutions :

### Erreurs de compilation

??? question "Échec de résolution : com.machinestalk:indoornavigationengine"
    **Solution** : Assurez-vous d'avoir le bon dépôt configuré dans votre `settings.gradle` ou `build.gradle` :
    
    ```kotlin
    repositories {
        google()
        mavenCentral()
        // Ajoutez l'URL de votre dépôt ici
    }
    ```

??? question "Problèmes de compatibilité de version Java"
    **Solution** : Vérifiez que votre JDK 17 est correctement configuré dans Android Studio :
    
    1. Allez dans **Fichier → Structure du projet → Emplacement du SDK**
    2. Assurez-vous que l'emplacement JDK pointe vers JDK 17 ou supérieur
    3. Nettoyez et recompilez votre projet

??? question "Erreurs de bibliothèque native introuvable"
    **Solution** : La bibliothèque inclut des binaires natifs pour plusieurs architectures. Assurez-vous de ne pas filtrer les ABI dans votre configuration de build :
    
    ```kotlin
    android {
        defaultConfig {
            // N'utilisez pas abiFilters sauf si nécessaire
            ndk {
                abiFilters += listOf("armeabi-v7a", "arm64-v8a", "x86", "x86_64")
            }
        }
    }
    ```

### Problèmes d'exécution

Pour un dépannage plus détaillé, consultez notre [Guide de dépannage](../support/troubleshooting.md) ou [contactez le support](../support/contact_us.md).

---

## <span class="emoji"> :material-arrow-right-circle: </span> Prochaines étapes

Maintenant que vous avez installé avec succès le Moteur de Navigation Intérieure, vous êtes prêt à commencer à construire :

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } **Démarrage rapide**

    ---

    Apprenez les bases et créez votre première expérience de navigation

    [:octicons-arrow-right-24: Guide de démarrage rapide](quick_start.md)

-   :material-code-braces:{ .lg .middle } **Exemples d'utilisation**

    ---

    Explorez des exemples pratiques et des modèles d'implémentation

    [:octicons-arrow-right-24: Guide d'utilisation](usage.md)

-   :material-feature-search:{ .lg .middle } **Fonctionnalités**

    ---

    Découvrez toutes les fonctionnalités puissantes disponibles dans le moteur

    [:octicons-arrow-right-24: Explorer les fonctionnalités](../features/features_overview.md)

-   :material-api:{ .lg .middle } **Référence API**

    ---

    Plongez dans la documentation API complète

    [:octicons-arrow-right-24: Documentation API](../api_reference/module_overview.md)

</div>

---

!!! question "Besoin d'aide ?"
    Si vous rencontrez des problèmes lors de l'installation, n'hésitez pas à nous contacter :
    
    - Consultez notre [FAQ](../support/faq.md)
    - Visitez notre [page de support](../support/contact_us.md)
    - Consultez le [guide de dépannage](../support/troubleshooting.md)
