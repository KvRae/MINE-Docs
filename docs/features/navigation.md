# <span class="emoji"> :material-navigation: </span> Navigation

The navigation is a feature that allows the user to navigate through the 3D map,
a user marker is placed on the map and the user can move it to any location on the map using bluetooth beacons.
Along with beacons, other sensors like accelerometer, gyroscope, and magnetometer are used to provide a better navigation experience to the user.
for more accurate navigation, we are adding the steps to the navigation path, so the user can follow the path to reach the destination easily.

## <span class="emoji"> :material-list-status: </span> Requirements

The beacons are used to provide the user's location on the map. Configuring the beacons is a simple process:

1. Place the beacons in the area where you want to provide navigation.
2. Try to place the beacons in a way that they cover the whole area and at least 3 beacons are visible to the user at any time.
3. Turn on the beacons and make sure they are connected to the device.
4. Add the beacons data to the json file in the assets' folder.

!!! Tip
    You can find the beacons data example in the beacons.json file in the assets folder of the project.


 Now you are ready to use the beacons for navigation.

 ![Ins](https://github.com/user-attachments/assets/cd83f011-8e9d-4475-bfb7-645283c5bd7d){loading=lazy}


!!! Note
    The Positioning of the beacons is important for the accuracy of the navigation. We are following the trilateration method to calculate the user's position on the map.
    Here is a simple explanation of the trilateration method [Trilateration](https://en.wikipedia.org/wiki/Trilateration)

