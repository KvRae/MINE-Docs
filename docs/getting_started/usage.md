
# Using the Indoor Navigation Engine Library

This guide will walk you through the process of integrating and utilizing the Indoor Navigation Engine library in your Android projects.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- Android Studio
- JDK 17
- Android SDK with minimum SDK version 24 and target SDK version 34
- Gradle 8.2

## Installation

To integrate the Indoor Navigation Engine library into your Android project, follow these steps:

### Gradle

1. Open your project's `build.gradle` file.
2. Add the following dependency in the `dependencies` block:

    ```groovy
    dependencies {
        implementation 'com.machinestalk:indoornavigationengine:1.0.0'
    }
    ```

3. Sync your project with Gradle to apply the changes.

### Maven

1. Open your project's `pom.xml` file.
2. Add the following dependency:

    ```xml
    <dependency>
        <groupId>com.machinestalk</groupId>
        <artifactId>indoornavigationengine</artifactId>
        <version>1.0.0</version>
        <type>pom</type>
    </dependency>
    ```

3. Save the file.
## Basic Usage

Now that you've added the library to your project, let's explore how to use it:

### 1. Initialize the Map Scene

First, you need to initialize the map scene in your activity or fragment. Here's a basic example using Compose:

```kotlin
@Composable
fun MapScene() {
    // Define map scene components here
}
```

### 2. Customize Map Components

You can customize various aspects of the map components such as ground color, wall color, space color, etc. Here's an example:

```kotlin
IndoorNavigationComponent(
    groundColor = Color(0.863f, 0.871f, 0.925f, 1.0f),
    wallColor = Color(0.588f, 0.588f, 0.588f, 1.0f),
    spaceColor = Color(0.992f, 0.847f, 0.208f, 1.0f),
    cameraConfiguration = CameraConfiguration(
        is2D = is2D.value,
    ),
)
```

### 3. Customize Navigation System

You can implement and customize the navigation system according to your requirements.
