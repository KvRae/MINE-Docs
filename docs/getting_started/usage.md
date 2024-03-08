
# Using the Indoor Navigation Engine Library

This guide will walk you through the process of integrating and utilizing the Indoor Navigation Engine library in your Android projects.

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

### 2. Load Map Data

Next, you need to load the map data for the desired location.
For that you will need to add the json file to the assets folder and load it using the following code:

```kotlin
val mapData = JsonUtil.LoadJsonFromAsset(context, "map.json")
```

### 2. Add Map Components to the Scene

You can customize various aspects of the map components such as theme, camera configuration, and map build.
Here's an example of how to add these components to the map scene:

```kotlin
IndoorNavigationScene(
     mapBuild = mapData,
)
```

by default the scene will display the map with the first floor,
it also takes the default theme and camera configuration.



