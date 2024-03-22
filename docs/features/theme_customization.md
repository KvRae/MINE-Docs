MachInNav Engine supports by default the Light and Dark themes. However, you can customize the theme to match your app's design and branding.
This section will guide you through the process of customizing the theme of the MachInNav Engine.

## Default Theme Colors
The default theme of the MachInNav Engine is a combination of Light and Dark themes.
here is the default theme color palette:

| Theme | Ground  | PathWays | Walls   | Poi     | selectedPoi |
|-------|---------|----------|---------|---------|-------------|
| Dark  | #282828 | #575757  | #282828 | #3F3F3F | #2D7C32     |
| Light | #FDE4E4 | #FDE4E4  | #888383 | #B9B2B2 | #779CB7     |

The default theme colors are used to render the map components such as the ground, pathways, walls, points of interest (POI), and selected POI.
The demo below shows the default theme of the MachInNav Engine in action:

<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/18a0fbef-ae91-4513-9903-81db8d1948a2" alt="default_theme">
</p>


To achieve this result, you can leave the mapColorTheme parameter empty when initializing the MachInNav Engine
The default theme will be applied automatically. Here is an example of how to initialize the MachInNav Engine with the default theme:

```kotlin
IndoorNavigationScene(
// No need to pass the mapColorTheme parameter
)
```

## Customizing the Theme
MachInNav Engine allows you to customize the theme colors to match your app's design and branding.
The theme customization process involves defining the color palette for the map components such as the ground, pathways, walls, points of interest (POI), and selected POI.
Here is an example of how to customize the theme colors:

```kotlin
// Use jetpack compose isSystemInDarkTheme() function to determine the current system theme 
val isDarkTheme = isSystemInDarkTheme()
// Define the custom theme color palette
val customTheme = MapColorTheme(
    groundColor = if (isDarkTheme) Color(0xFF282828) else Color(0xFFFDE4E4),
    pathWaysColor = if (isDarkTheme) Color(0xFF575757) else Color(0xFFFDE4E4),
    wallColor = if (isDarkTheme) Color(0xFF282828) else Color(0xFF888383),
    poiColor = if (isDarkTheme) Color(0xFF3F3F3F) else Color(0xFFB9B2B2),
    selectedPoiColor = if (isDarkTheme) Color(0xFF2D7C32) else Color(0xFF779CB7)
)
// Pass the custom theme to the MachInNav Engine
IndoorNavigationScene(
       mapColorTheme = customTheme
     )
```

In the code snippet above, we use the isSystemInDarkTheme() function to determine the current system theme.
Based on the system theme, we define the custom theme color palette for the map components.
Finally, we pass the custom theme to the MachInNav Engine by setting the mapColorTheme parameter to customTheme.

By customizing the theme colors, you can create a unique and branded navigation experience for your users.
The demo below shows the MachInNav Engine with a custom theme in action (Don't Mind the colors, I am not a designer):


<p align="center">
  <img src="https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/74e30214-c734-4712-97a4-ca1a560181f6" alt="custom_theme">
</p>

Hope this helps you to customize the theme of the MachInNav Engine to match your app, if you have any questions, feel free to 
[contact us](mailto:) or [raise an issue]().

[]: # (END)



