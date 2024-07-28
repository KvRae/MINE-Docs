# <span class="emoji"> :material-help-rhombus: </span> Troubleshooting
This page contains a list of common issues and their solutions.

## <span class="emoji"> :octicons-bug-16: </span> Issue 1: Map file not found
When loading a map,
you may encounter this issue if the map file is not found or the path is incorrect. 
To resolve this issue, make sure that the map file is located in the correct directory 
and that the path is specified correctly in the code.

```kotlin
val mapPath = "path/to/map/file"
val map = MapLoader.loadMap(mapPath)
```

## <span class="emoji"> :octicons-bug-16: </span> Issue 2: Navigation is not working
If navigation is not working, check the following:

- Ensure that you set up the beacons correctly.
- Make sure that the beacons are in range and have a clear line of sight.
- Verify beacons data in the json file.

if the issue persists, please refer to the [documentation](../features/navigation.md) for more information on setting up navigation.
