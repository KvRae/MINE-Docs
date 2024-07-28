# <span class="emoji"> :octicons-package-16: </span> Module Overview
The module is built using jetpack compose, and it is designed to be used in a Compose UI.
The module is responsible for displaying the map and the navigation components.
It also provides a way to customize the map and the navigation components.

a clear overview about the architecture of the module and how it's built on top of Sceneview and filament:



<div style="text-align: center;">
  <figure style="width: 80%; margin: auto;">
    ```mermaid
    flowchart BT
      F[Filament] -->|Renderer| A[Sceneview]
      A -->|Viewer| B[MINE]
    ```
    <figcaption>Module Architecture Overview</figcaption>
  </figure>
</div>
The module is built on top of Sceneview and Filament. Sceneview is a 3D and AR View for Android, 
Flutter and React Native working with ARCore and Google Filament Engine. Filament is a physically based rendering engine for Android,
Windows, Linux, and macOS. It is designed to be as small as possible and as efficient as possible, and is written in C++.

