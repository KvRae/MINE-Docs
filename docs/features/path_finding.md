# <span class="emoji"> :material-map-marker-path: </span> Path Finding
Path finding is the process of finding a path from a starting point to a goal point. This is a common problem in games,
where the player needs to navigate through a maze or a map. Path finding algorithms are used to find the shortest path between two points. 
There are many different path finding algorithms, each with its own strengths and weaknesses. 

Some of the most popular path finding algorithms include Dijkstra's algorithm, A* algorithm, and Breadth First Search (BFS).
In this project, we are using the A* algorithm to find the shortest path between two points on the map.
The A* algorithm is a popular path finding algorithm that is used in many games and applications. It is a heuristic search algorithm that uses an admissible heuristic to find the shortest path between two points. The A* algorithm is efficient and can find the shortest path in a reasonable amount of time.

The A* algorithm works by maintaining a priority queue of nodes to be explored. 
It starts by adding the starting node to the priority queue. 
Then, it iteratively explores the nodes in the priority queue until it finds the goal node. At each iteration, the algorithm selects the node with the 
lowest cost and expands it by adding its neighbors to the priority queue. 

The cost of a node is the sum of the cost of the path from the starting node to the current node and the heuristic cost from the current node to the goal node.
The A* algorithm uses a heuristic function to estimate the cost of the path from the current node to the goal node. The heuristic function is admissible if it never overestimates the cost of the path. The A* algorithm guarantees that it will find the shortest path if the heuristic function is admissible.

## <span class="emoji"> :material-list-status: </span> Requirements
The path finding algorithm requires the following components:
- Path Points: The A* algorithm requires a set of path points that represent the map. Each path point has a position and a cost.
- Point Neighbors: The A* algorithm requires a function that returns the neighbors of a given path point.


## <span class="emoji"> :material-code-tags: </span> Implementation
The path finding algorithm is implemented in the `NodeExtensions` file. The  file provides a method called `findPath` that takes the starting point, the goal point, and the path points as parameters and returns the shortest path between the starting point and the goal point.
Here is an example of how to use the `AStar` class to find the shortest path between two points:
```kotlin
// Code snippet implementing the path finding feature
```


![Path Finding Demo](https://github.com/user-attachments/assets/667184e6-6037-468a-ba53-22e97c3217f2){ loading=lazy }


## <span class="emoji"> :material-check-all: </span> Conclusion
Path finding is an important feature in many applications, including games and robotics. The A* algorithm is a popular path finding algorithm that is used to find the shortest path between two points. The A* algorithm is efficient and can find the shortest path in a reasonable amount of time. In this project, we are using the A* algorithm to find the shortest path between two points on the map. The A* algorithm requires a set of path points and a function that returns the neighbors of a given path point. The A* algorithm guarantees that it will find the shortest path if the heuristic function is admissible.



