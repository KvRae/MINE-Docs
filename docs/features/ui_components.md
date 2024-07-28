# UI Components

The MachInNav Engine provides a variety of Ui components to enhance the user's navigation experience. These components are designed to be intuitive and easy to use, providing users with a seamless navigation experience.
Here's an overview of the key ui components represented in the diagram below:
<br>

<div style="text-align: center;">
  <figure style="width: 100%; margin: auto;">
``` mermaid
graph TB
    A[Map Scene Layout] --> B[Indoor Navigation Scene]
    A ---> D[UI Utils]
    D --> E[Top Search Bars]
    E --> F[SearchBarDropdown]
    E --> G[SearchBarLayout]
    D --> H[Navigation Bar]
    H --> I[Bottom Navigation Bar]
    D --> J[Bottom Sheets]
    J --> K[Map Info Bottom Sheet]
    J --> L[POI Bottom Sheet]
    J --> M[Saved Locations Bottom Sheet]
    D --> N[Floating Buttons]
    N --> O[Current Location Button]
    N --> P[Map Mode Switch Button]
    
```
<figcaption>UI Components Overview</figcaption>
  </figure>
</div>

## Map Scene Layout [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-scene-layout.html)

The map scene layout is the main view of the indoor environment, providing users with a visual representation of the map and key features such as pathways, walls, points of interest (POI), and other elements.
it is a combination of the indoor navigation scene, and the other UI components such as the bottom navigation bar, bottom sheet, search bar layout, and current location button.
In the demo below, you can see the map scene layout in action:


Here is a code snippet that shows how to use the map scene layout:

```kotlin
@Composable
fun MapScreen(
    context: Context = LocalContext.current,
) {
    val map = MapLoader.loadMapFromAsset(
        context = context,
        fileName = "map.json"
    ) // Load the map from the asset folder

    val databaseHandler by lazy {
        DatabaseHandler(
            PoiRepository(InNavEngineDb.getInstance(context))
        )
    } // Initialize the database handler

    val uiLayoutHandler: UiLayoutHandler = viewModel {
        UiLayoutHandler(mapBuild = map)
    } // Initialize the UI layout handler

    MapSceneLayout(
        mapBuild = map,
        databaseHandler = databaseHandler,
        uiLayoutHandler = uiLayoutHandler,
    )  // Display the map scene layout
}
```

## Indoor Navigation Scene [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-indoor-navigation-scene.html)
The indoor navigation scene provides a detailed view of the indoor environment, including pathways, walls, points of interest (POI), and other key features.
In the demo below, you can see the indoor navigation scene in action:


Here is a code snippet that shows how to use the indoor navigation scene:

```kotlin
IndoorNavigationScene(
 uiHandler = uiLayoutHandler,
 mapBuild = mapBuild,
 mapTheme = mapThemeColors,
)
```

## Bottom Navigation Bar [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-bottom-navigation-bar.html)
the floor selector allows users to switch between different floors of a building,
making it easy to navigate multi-level indoor environments.
In the demo below, you can see the floor selector in action:
<br>
<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/282d63e2-2379-4400-bf54-bf3805554295" alt="Floor Selector"/>
</p>

Here is a code snippet that shows how to use the bottom navigation bar

```kotlin
// Code snippet for Bottom Navigation Bar
```


## Map Scene Bottom Sheet [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-scene-bottom-sheet.html)
This bottom sheet provides additional information about the map within the indoor environment, allowing users to view details such as the building name, floor number, and other relevant information.
In the demo below, you can see the bottom sheet in action:
<br>
<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/24492e3e-8950-4959-ad7b-0536cfc27605" alt="POI Selector"/>
</p>

Here is a code snippet that shows how to use the POI selector:

```kotlin
// Code snippet for POI Selector
```

### Building Sheet [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-scene-bottom-sheet.html)
The building sheet provides additional information about the building within the indoor environment, allowing users to view details such as the building name, floor number, and points of interest (POI) within the floor.
In the demo below, you can see the building sheet in action:

<br>
<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/37bca2d0-2bdd-4b69-a549-d7296f38ccfd" alt="POI Selector"/>
</p>


Here is a code snippet that shows how to use the building sheet:
```kotlin
// Code snippet for Building Sheet
```

### POI Sheet [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-poi-details-sheet-content.html)
The POI sheet provides additional information about the points of interest (POI) within the floor,
allowing users to view details such as the POI name, description, opening hours, contacts and other relevant information.

In the demo below, you can see the POI sheet in action:

Here is a code snippet that shows how to use the POI sheet:

```kotlin
// Code snippet for POI Sheet
```

### Saved Locations Sheet [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-saved-loc-sheet-content.html)
The saved locations sheet allows users to view and manage their saved locations within the indoor environment, making it easy to access frequently visited places or points of interest.
In the demo below, you can see the saved locations sheet in action:

Here is a code snippet that shows how to use the saved locations sheet:

```kotlin
// Code snippet for Saved Locations Sheet
```

## Search Bar Layout [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-search-bar-layout.html)
The 3D/2D Map switcher button allows users to switch between 3D and 2D views of the map, providing a different perspective of the indoor environment.
In the demo below, you can see the 3D/2D Map switcher button in action:


<br>
<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/cfc06d87-c2e9-4183-b1e8-ca2ab43a0e18" alt="3D/2D Map switcher button"/>
</p>

Here is a code snippet that shows how to use the 3D/2D Map switcher button:

```kotlin
// Code snippet for 3D/2D Map switcher button
```

## Search Bar with Dropdown [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-top-search-bar.html)
The search bar with dropdown allows users to search for specific locations or points of interest (POI) within the indoor environment, providing a quick and easy way to find their desired destination.
In the demo below, you can see the search bar with a dropdown in action:

<br>
<p align="center">
  <img src=https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/7cb8dd28-372b-4899-8946-c4f1e5ec3590" alt="3D/2D Map switcher button"/>
</p>

Here is a code snippet that shows how to use the search bar layout:

```kotlin
// Code snippet for 3D/2D Map switcher button
```

## Current Location Button [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-localisation-button.html)
The current location button allows users to view their current location within the indoor environment, providing real-time information on their position.
In the demo below, you can see the current location button in action:

Here is a code snippet that shows how to use the current location button:

```kotlin
// Code snippet for Current Location Button
```

## Map Mode Switch Button [🡕](https://indoor-navigation-lib.bitbucket.io/indoornavigationengine/com.machinestalk.indoornavigationengine.ui/-map-mode-switch-button.html)

The map mode switch button allows users to switch between different map modes such as 3D and 2D views, providing a different perspective of the indoor environment.
In the demo below, you can see the map mode switch button in action:
<p align="center">

</p>

Here is a code snippet that shows how to use the map mode switch button:

```kotlin
// Code snippet for Map Mode Switch Button*
```

Each of these UI components plays a crucial role in enhancing the user's navigation experience within the indoor environment,
providing intuitive and easy-to-use features that make it easy to navigate and explore the space.

