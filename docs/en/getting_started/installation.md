# <span class="emoji"> :material-download: </span> Installation

Get started with **MINE - Indoor Navigation Engine** by integrating it into your Android project. This comprehensive guide walks you through the complete installation process, from prerequisites to verification.

---

## <span class="emoji"> :material-wrench-cog: </span> Prerequisites

Before integrating the Indoor Navigation Engine, ensure your development environment meets the following requirements:

| Requirement | Version | Description |
|------------|---------|-------------|
| **Android Studio** | Latest stable | Recommended IDE for Android development |
| **JDK** | 17+ | Required for compilation and runtime |
| **Android SDK** | Min: 24, Target: 34 | API level compatibility |
| **Gradle** | 8.2+ | Build automation tool |

!!! tip "Development Environment"
    We recommend using the latest stable version of Android Studio with the Android SDK Platform 34 for optimal development experience.

---

## <span class="emoji"> :octicons-diff-added-16: </span> Adding the Dependency

Choose your preferred build system to integrate the Indoor Navigation Engine into your project.

### <span class="emoji"> :simple-gradle: </span> Gradle (Recommended)

=== "Kotlin DSL (build.gradle.kts)"

    ```kotlin
    dependencies {
        // Indoor Navigation Engine - Core library
        implementation("com.machinestalk:indoornavigationengine:1.0.0")
    }
    ```

=== "Groovy DSL (build.gradle)"

    ```groovy
    dependencies {
        // Indoor Navigation Engine - Core library
        implementation 'com.machinestalk:indoornavigationengine:1.0.0'
    }
    ```

!!! success "Latest Version"
    The current stable version is **1.0.0**. Check our [release notes](../release_notes/release_notes.md) for the latest updates and features.

---

### <span class="emoji"> :simple-apachemaven: </span> Maven

If you're using Maven as your build system, add the following dependency to your `pom.xml`:

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

### Java 17 Compatibility

!!! warning "Java 17 Required"
    The Indoor Navigation Engine uses [Filament](https://google.github.io/filament/), a powerful native 3D rendering library written in C++. The JNI bindings are compiled with **Java 17**, making it mandatory for your project.

Configure your project's Java compatibility in the module-level `build.gradle` file:

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

Add the following permissions to your `AndroidManifest.xml` to enable full functionality:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Required for network operations and map loading -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Optional: For location-based features -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
</manifest>
```

!!! info "Permission Rationale"
    - **INTERNET**: Required for loading map data and assets
    - **ACCESS_NETWORK_STATE**: Enables network connectivity checks
    - **Location permissions**: Optional, only needed if you're using location-based positioning features

---

### ProGuard Rules

If you're using code obfuscation, add these ProGuard rules to prevent runtime issues:

```proguard
# Indoor Navigation Engine
-keep class com.machinestalk.indoornavigationengine.** { *; }
-keepclassmembers class com.machinestalk.indoornavigationengine.** { *; }

# Filament native libraries
-keep class com.google.android.filament.** { *; }
-keepclassmembers class com.google.android.filament.** { *; }
```

---

## <span class="emoji"> :material-check-circle: </span> Verify Installation

After adding the dependency and syncing your project, verify the installation by creating a simple test:

=== "Kotlin"

    ```kotlin
    import com.machinestalk.indoornavigationengine.ui.MineSceneView
    import android.os.Bundle
    import androidx.appcompat.app.AppCompatActivity
    
    class MainActivity : AppCompatActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            
            // Initialize the navigation engine
            val sceneView = MineSceneView(this)
            setContentView(sceneView)
            
            // If this builds successfully, installation is complete!
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
            
            // Initialize the navigation engine
            MineSceneView sceneView = new MineSceneView(this);
            setContentView(sceneView);
            
            // If this builds successfully, installation is complete!
        }
    }
    ```

!!! success "Installation Complete"
    If your project builds without errors, congratulations! The Indoor Navigation Engine is successfully installed. Proceed to the [Quick Start Guide](quick_start.md) to begin implementing navigation features.

---

## <span class="emoji"> :material-alert-circle: </span> Troubleshooting

Encountering issues? Here are common problems and their solutions:

### Build Errors

??? question "Failed to resolve: com.machinestalk:indoornavigationengine"
    **Solution**: Ensure you have the correct repository configured in your `settings.gradle` or `build.gradle`:
    
    ```kotlin
    repositories {
        google()
        mavenCentral()
        // Add your repository URL here
    }
    ```

??? question "Java version compatibility issues"
    **Solution**: Verify that your JDK 17 is properly configured in Android Studio:
    
    1. Go to **File → Project Structure → SDK Location**
    2. Ensure JDK location points to JDK 17 or higher
    3. Clean and rebuild your project

??? question "Native library not found errors"
    **Solution**: The library includes native binaries for multiple architectures. Ensure you're not filtering ABIs in your build configuration:
    
    ```kotlin
    android {
        defaultConfig {
            // Don't use abiFilters unless necessary
            ndk {
                abiFilters += listOf("armeabi-v7a", "arm64-v8a", "x86", "x86_64")
            }
        }
    }
    ```

### Runtime Issues

For more detailed troubleshooting, visit our [Troubleshooting Guide](../support/troubleshooting.md) or [contact support](../support/contact_us.md).

---

## <span class="emoji"> :material-arrow-right-circle: </span> Next Steps

Now that you've successfully installed the Indoor Navigation Engine, you're ready to start building:

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } **Quick Start**

    ---

    Learn the basics and create your first navigation experience

    [:octicons-arrow-right-24: Quick Start Guide](quick_start.md)

-   :material-code-braces:{ .lg .middle } **Usage Examples**

    ---

    Explore practical examples and implementation patterns

    [:octicons-arrow-right-24: Usage Guide](usage.md)

-   :material-feature-search:{ .lg .middle } **Features**

    ---

    Discover all the powerful features available in the engine

    [:octicons-arrow-right-24: Explore Features](../features/features_overview.md)

-   :material-api:{ .lg .middle } **API Reference**

    ---

    Deep dive into the complete API documentation

    [:octicons-arrow-right-24: API Docs](../api_reference/module_overview.md)

</div>

---

!!! question "Need Help?"
    If you encounter any issues during installation, don't hesitate to reach out:
    
    - Check our [FAQ](../support/faq.md)
    - Visit our [Support page](../support/contact_us.md)
    - Review [Troubleshooting guide](../support/troubleshooting.md)

