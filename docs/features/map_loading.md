## Introduction
The map loading feature allows you to load a map from a file and display it in the simulator. The map is loaded from a text file that contains a grid of characters, where each character represents a different type of cell.
The map can be used to define the layout of the environment in which the robot will operate.

## Map File Format
The map file is a JSON file that contains a grid of characters. Each character in the grid represents a different type of map component.

!!! Note
    The map file should be placed in the `assets` folder of the project.

## Map Loading Locally
To load a map from a file, you can use the `MapLoader` class. The `MapLoader` class provides a method called `loadMap` that takes the path to the map file as a parameter and returns a `Map` object.

Here is an example of how to load a map from a file:

```kotlin

// Code snippet to load a map from a file

```

## Map Loading Remotely
To load a map from a remote server, you can use the `MapLoader` class. The `MapLoader` class provides a method called `loadMapFromUrl` that takes the URL of the map file as a parameter and returns a `Map` object.

Here is an example of how to load a map from a remote server:

```kotlin

// Code snippet to load a map from a remote server

```

## Conclusion
The map loading feature allows you to load a map from a file and display it in the simulator. The map file is a JSON file that contains a grid of characters, where each character represents a different type of cell.
The map can be used to define the layout of the environment in which the robot will operate.

!!! tip
    For more information about the map loading feature, you can refer to the map.json file in the assets folder of the project.


