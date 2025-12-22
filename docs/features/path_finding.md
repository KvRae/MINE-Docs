# <span class="emoji"> :material-map-marker-path: </span> Path Finding

## Overview

**Path Finding** is a critical component of the MINE Indoor Navigation Engine that calculates optimal routes between two points in complex indoor environments. Using advanced algorithms and multi-criteria optimization, MINE ensures users receive the best possible routes tailored to their needs, whether prioritizing shortest distance, accessibility, or avoiding specific obstacles.

!!! abstract "Key Capabilities"
    - 🎯 **A* Algorithm**: Efficient shortest path calculation with heuristic optimization
    - 🔀 **Multi-Criteria Routing**: Optimize for distance, accessibility, time, or custom preferences
    - 🏢 **Multi-Floor Support**: Seamless route calculation across building levels
    - ♿ **Accessibility Routing**: Wheelchair-friendly paths with elevator prioritization
    - 🚧 **Dynamic Obstacles**: Real-time path adjustment around temporary obstacles
    - 🔄 **Alternative Routes**: Generate multiple route options for user choice

---

## Path Finding Algorithms

### A* Algorithm

MINE uses the **A* (A-Star)** algorithm as its primary pathfinding solution. A* is a heuristic search algorithm that efficiently finds the shortest path by combining actual path cost with estimated distance to the goal.

#### How A* Works

A* maintains a priority queue of nodes to explore, using this formula to determine priority:

```
f(n) = g(n) + h(n)

Where:
- f(n) = Total estimated cost of path through node n
- g(n) = Actual cost from start to node n
- h(n) = Heuristic estimated cost from node n to goal
```

**Algorithm Steps:**

1. Add start node to open set (priority queue)
2. While open set is not empty:
   - Get node with lowest f(n) score
   - If this is the goal, reconstruct and return path
   - Move node to closed set
   - For each neighbor:
     - Calculate tentative g score
     - If neighbor not visited or new g score is better:
       - Update g, h, and f scores
       - Set parent for path reconstruction
       - Add to open set

#### Visualization

```
Start (S) ──→ Goal (G)

Step 1: Explore from S
  S* ─→ A(5) ─→ B(8)
  ↓
  C(7)

Step 2: Choose lowest cost (A)
  S ─→ A* ─→ B(6)
       ↓
       D(4) ─→ G

Step 3: Continue until goal found
  S ─→ A ─→ D* ─→ G(2)

Final Path: S → A → D → G
```

### Heuristic Functions

MINE supports multiple heuristic functions for different scenarios:

<div class="grid" markdown>

=== "Euclidean Distance"

    ```kotlin
    fun euclideanDistance(a: Point, b: Point): Double {
        val dx = a.x - b.x
        val dy = a.y - b.y
        return sqrt(dx * dx + dy * dy)
    }
    ```
    
    **Use Case**: Open spaces, diagonal movement allowed

=== "Manhattan Distance"

    ```kotlin
    fun manhattanDistance(a: Point, b: Point): Double {
        return abs(a.x - b.x) + abs(a.y - b.y)
    }
    ```
    
    **Use Case**: Grid-based movement, no diagonals

=== "Diagonal Distance"

    ```kotlin
    fun diagonalDistance(a: Point, b: Point): Double {
        val dx = abs(a.x - b.x)
        val dy = abs(a.y - b.y)
        return max(dx, dy) + (sqrt(2.0) - 1) * min(dx, dy)
    }
    ```
    
    **Use Case**: 8-directional movement

=== "Custom Weighted"

    ```kotlin
    fun weightedDistance(a: Point, b: Point, weight: Double = 1.0): Double {
        val dx = a.x - b.x
        val dy = a.y - b.y
        return sqrt(dx * dx + dy * dy) * weight
    }
    ```
    
    **Use Case**: Prefer certain paths or areas

</div>

!!! tip "Admissible Heuristics"
    For A* to guarantee the shortest path, the heuristic must be **admissible** (never overestimate the actual cost) and **consistent** (satisfy the triangle inequality). All heuristics above are admissible.

---

## Implementation

### Basic Path Finding

```kotlin
import com.machinestalk.indoornavigationengine.components.PathFinder
import com.machinestalk.indoornavigationengine.models.PathNode
import com.machinestalk.indoornavigationengine.models.Route

class PathFindingExample {
    
    private val pathFinder = PathFinder()
    
    fun findBasicPath(
        start: PathNode,
        goal: PathNode,
        pathNodes: List<PathNode>
    ): Route? {
        
        // Configure pathfinding options
        val options = PathFindingOptions(
            heuristic = HeuristicType.EUCLIDEAN,
            allowDiagonal = true,
            maxIterations = 10000
        )
        
        // Find path using A* algorithm
        val path = pathFinder.findPath(
            start = start,
            goal = goal,
            nodes = pathNodes,
            options = options
        )
        
        return path?.let { nodes ->
            Route(
                nodes = nodes,
                distance = calculateDistance(nodes),
                estimatedTime = estimateTime(nodes),
                instructions = generateInstructions(nodes)
            )
        }
    }
    
    private fun calculateDistance(nodes: List<PathNode>): Double {
        var totalDistance = 0.0
        for (i in 0 until nodes.size - 1) {
            totalDistance += nodes[i].distanceTo(nodes[i + 1])
        }
        return totalDistance
    }
    
    private fun estimateTime(nodes: List<PathNode>): Long {
        val distance = calculateDistance(nodes)
        val averageSpeed = 1.4 // meters per second (typical walking speed)
        return (distance / averageSpeed * 1000).toLong() // milliseconds
    }
}
```

### Advanced Path Finding with Node Extensions

```kotlin
// Extension function for PathNode
fun PathNode.findPath(
    goal: PathNode,
    allNodes: List<PathNode>,
    options: PathFindingOptions = PathFindingOptions()
): List<PathNode>? {
    
    val openSet = PriorityQueue<PathNodeWrapper>(compareBy { it.fScore })
    val closedSet = mutableSetOf<String>()
    val gScores = mutableMapOf<String, Double>()
    val parents = mutableMapOf<String, PathNode>()
    
    // Initialize start node
    gScores[this.id] = 0.0
    openSet.add(PathNodeWrapper(
        node = this,
        gScore = 0.0,
        hScore = this.heuristic(goal, options.heuristic),
        fScore = this.heuristic(goal, options.heuristic)
    ))
    
    var iterations = 0
    
    while (openSet.isNotEmpty() && iterations < options.maxIterations) {
        iterations++
        
        val current = openSet.poll().node
        
        // Goal reached
        if (current.id == goal.id) {
            return reconstructPath(parents, current)
        }
        
        closedSet.add(current.id)
        
        // Explore neighbors
        val neighbors = current.getNeighbors(allNodes, options)
        
        for (neighbor in neighbors) {
            if (neighbor.id in closedSet) continue
            
            // Calculate tentative g score
            val tentativeGScore = gScores[current.id]!! + 
                current.distanceTo(neighbor) * 
                getEdgeWeight(current, neighbor, options)
            
            // If this path is better
            if (neighbor.id !in gScores || tentativeGScore < gScores[neighbor.id]!!) {
                parents[neighbor.id] = current
                gScores[neighbor.id] = tentativeGScore
                
                val hScore = neighbor.heuristic(goal, options.heuristic)
                val fScore = tentativeGScore + hScore
                
                openSet.add(PathNodeWrapper(
                    node = neighbor,
                    gScore = tentativeGScore,
                    hScore = hScore,
                    fScore = fScore
                ))
            }
        }
    }
    
    // No path found
    return null
}

private fun reconstructPath(
    parents: Map<String, PathNode>,
    goal: PathNode
): List<PathNode> {
    val path = mutableListOf<PathNode>()
    var current: PathNode? = goal
    
    while (current != null) {
        path.add(0, current)
        current = parents[current.id]
    }
    
    return path
}

private data class PathNodeWrapper(
    val node: PathNode,
    val gScore: Double,
    val hScore: Double,
    val fScore: Double
)
```

### Getting Node Neighbors

```kotlin
fun PathNode.getNeighbors(
    allNodes: List<PathNode>,
    options: PathFindingOptions
): List<PathNode> {
    
    val neighbors = mutableListOf<PathNode>()
    
    // Get nodes connected by edges
    this.connectedNodeIds.forEach { neighborId ->
        val neighbor = allNodes.find { it.id == neighborId }
        if (neighbor != null && neighbor.isTraversable) {
            neighbors.add(neighbor)
        }
    }
    
    // If diagonal movement allowed, check diagonal neighbors
    if (options.allowDiagonal) {
        val diagonalNeighbors = findDiagonalNeighbors(allNodes, options)
        neighbors.addAll(diagonalNeighbors)
    }
    
    return neighbors
}

private fun PathNode.findDiagonalNeighbors(
    allNodes: List<PathNode>,
    options: PathFindingOptions
): List<PathNode> {
    val diagonals = mutableListOf<PathNode>()
    val maxDistance = options.neighborSearchRadius
    
    allNodes.forEach { node ->
        if (node.id != this.id && 
            node.floor == this.floor &&
            node.isTraversable) {
            
            val distance = this.distanceTo(node)
            if (distance <= maxDistance) {
                // Check if path is not blocked
                if (!isPathBlocked(this, node, allNodes)) {
                    diagonals.add(node)
                }
            }
        }
    }
    
    return diagonals
}
```

---

## Multi-Criteria Path Finding

MINE supports route optimization based on multiple criteria:

### Optimization Criteria

```kotlin
enum class OptimizationCriteria {
    SHORTEST_DISTANCE,    // Minimize total distance
    FASTEST_TIME,         // Minimize travel time
    ACCESSIBILITY,        // Wheelchair-accessible routes
    LEAST_CROWDED,        // Avoid congested areas
    SCENIC_ROUTE,         // Pass by interesting POIs
    EMERGENCY_EXIT        // Fastest evacuation route
}
```

### Route Preferences

```kotlin
data class RoutePreferences(
    val optimizeFor: OptimizationCriteria = OptimizationCriteria.SHORTEST_DISTANCE,
    val avoidStairs: Boolean = false,
    val preferElevators: Boolean = false,
    val avoidEscalators: Boolean = false,
    val maxWalkingDistance: Double? = null,
    val considerWheelchairAccess: Boolean = false,
    val avoidAreas: List<String> = emptyList(),
    val preferAreas: List<String> = emptyList(),
    val customWeights: Map<String, Double> = emptyMap()
)
```

### Implementing Multi-Criteria Routing

```kotlin
fun calculateOptimalRoute(
    start: PathNode,
    goal: PathNode,
    preferences: RoutePreferences
): Route? {
    
    val options = PathFindingOptions(
        heuristic = getHeuristicForCriteria(preferences.optimizeFor),
        allowDiagonal = true,
        maxIterations = 10000
    )
    
    // Apply preference-based weights
    val weightedNodes = applyPreferenceWeights(allNodes, preferences)
    
    // Find path with A*
    val path = start.findPath(goal, weightedNodes, options)
    
    return path?.let { nodes ->
        Route(
            nodes = nodes,
            distance = calculateDistance(nodes),
            estimatedTime = estimateTimeWithPreferences(nodes, preferences),
            instructions = generateInstructions(nodes),
            accessibility = evaluateAccessibility(nodes, preferences)
        )
    }
}

private fun applyPreferenceWeights(
    nodes: List<PathNode>,
    preferences: RoutePreferences
): List<PathNode> {
    
    return nodes.map { node ->
        node.copy(
            weight = calculateNodeWeight(node, preferences)
        )
    }
}

private fun calculateNodeWeight(
    node: PathNode,
    preferences: RoutePreferences
): Double {
    var weight = 1.0
    
    // Accessibility weighting
    if (preferences.considerWheelchairAccess) {
        if (node.requiresStairs && preferences.avoidStairs) {
            weight *= 10.0 // Heavily penalize stairs
        }
        if (!node.isWheelchairAccessible) {
            weight *= 5.0
        }
    }
    
    // Area preferences
    if (node.areaId in preferences.avoidAreas) {
        weight *= 3.0
    }
    if (node.areaId in preferences.preferAreas) {
        weight *= 0.5
    }
    
    // Crowding factor
    if (preferences.optimizeFor == OptimizationCriteria.LEAST_CROWDED) {
        weight *= node.crowdingFactor
    }
    
    // Custom weights
    preferences.customWeights[node.id]?.let { customWeight ->
        weight *= customWeight
    }
    
    return weight
}
```

![Path Finding Demo](https://github.com/user-attachments/assets/667184e6-6037-468a-ba53-22e97c3217f2){ loading=lazy }

---

## Multi-Floor Path Finding

Calculate routes that span multiple building levels:

```kotlin
fun calculateMultiFloorRoute(
    start: PathNode,
    goal: PathNode,
    preferences: RoutePreferences
): Route? {
    
    // If same floor, use standard pathfinding
    if (start.floor == goal.floor) {
        return calculateOptimalRoute(start, goal, preferences)
    }
    
    // Find floor transition points
    val transitions = findFloorTransitions(start.floor, goal.floor, preferences)
    
    if (transitions.isEmpty()) {
        return null // No way to change floors
    }
    
    var bestRoute: Route? = null
    var bestCost = Double.MAX_VALUE
    
    // Try each transition option
    transitions.forEach { transition ->
        // Path from start to transition entry
        val pathToTransition = calculateOptimalRoute(
            start, 
            transition.entryNode, 
            preferences
        )
        
        // Path from transition exit to goal
        val pathFromTransition = calculateOptimalRoute(
            transition.exitNode, 
            goal, 
            preferences
        )
        
        if (pathToTransition != null && pathFromTransition != null) {
            // Combine paths
            val combinedRoute = combineRoutes(
                pathToTransition,
                transition,
                pathFromTransition
            )
            
            val cost = calculateRouteCost(combinedRoute, preferences)
            
            if (cost < bestCost) {
                bestCost = cost
                bestRoute = combinedRoute
            }
        }
    }
    
    return bestRoute
}

private fun findFloorTransitions(
    fromFloor: Int,
    toFloor: Int,
    preferences: RoutePreferences
): List<FloorTransition> {
    
    val transitions = mutableListOf<FloorTransition>()
    
    // Find elevators
    if (!preferences.avoidElevators) {
        elevators.forEach { elevator ->
            if (elevator.servesFloor(fromFloor) && elevator.servesFloor(toFloor)) {
                transitions.add(FloorTransition(
                    type = TransitionType.ELEVATOR,
                    fromFloor = fromFloor,
                    toFloor = toFloor,
                    entryNode = elevator.getNodeOnFloor(fromFloor),
                    exitNode = elevator.getNodeOnFloor(toFloor),
                    cost = calculateElevatorCost(fromFloor, toFloor)
                ))
            }
        }
    }
    
    // Find stairs
    if (!preferences.avoidStairs) {
        stairs.forEach { stairwell ->
            if (stairwell.connectsFloors(fromFloor, toFloor)) {
                transitions.add(FloorTransition(
                    type = TransitionType.STAIRS,
                    fromFloor = fromFloor,
                    toFloor = toFloor,
                    entryNode = stairwell.getNodeOnFloor(fromFloor),
                    exitNode = stairwell.getNodeOnFloor(toFloor),
                    cost = calculateStairsCost(fromFloor, toFloor)
                ))
            }
        }
    }
    
    // Find escalators
    if (!preferences.avoidEscalators) {
        escalators.forEach { escalator ->
            if (escalator.connectsFloors(fromFloor, toFloor)) {
                transitions.add(FloorTransition(
                    type = TransitionType.ESCALATOR,
                    fromFloor = fromFloor,
                    toFloor = toFloor,
                    entryNode = escalator.getNodeOnFloor(fromFloor),
                    exitNode = escalator.getNodeOnFloor(toFloor),
                    cost = calculateEscalatorCost()
                ))
            }
        }
    }
    
    return transitions
}

data class FloorTransition(
    val type: TransitionType,
    val fromFloor: Int,
    val toFloor: Int,
    val entryNode: PathNode,
    val exitNode: PathNode,
    val cost: Double
)

enum class TransitionType {
    ELEVATOR,
    STAIRS,
    ESCALATOR,
    RAMP
}
```

---

## Alternative Routes

Generate multiple route options for user selection:

```kotlin
fun findAlternativeRoutes(
    start: PathNode,
    goal: PathNode,
    preferences: RoutePreferences,
    maxAlternatives: Int = 3
): List<Route> {
    
    val routes = mutableListOf<Route>()
    
    // Primary route (shortest/optimal)
    val primaryRoute = calculateOptimalRoute(start, goal, preferences)
    if (primaryRoute != null) {
        routes.add(primaryRoute)
    }
    
    // Alternative 1: Fastest route
    if (preferences.optimizeFor != OptimizationCriteria.FASTEST_TIME) {
        val fastestPrefs = preferences.copy(
            optimizeFor = OptimizationCriteria.FASTEST_TIME
        )
        val fastestRoute = calculateOptimalRoute(start, goal, fastestPrefs)
        if (fastestRoute != null && !isSimilarRoute(fastestRoute, routes)) {
            routes.add(fastestRoute)
        }
    }
    
    // Alternative 2: Scenic route
    val scenicPrefs = preferences.copy(
        optimizeFor = OptimizationCriteria.SCENIC_ROUTE
    )
    val scenicRoute = calculateOptimalRoute(start, goal, scenicPrefs)
    if (scenicRoute != null && !isSimilarRoute(scenicRoute, routes)) {
        routes.add(scenicRoute)
    }
    
    // Alternative 3: Use different floor transition
    if (start.floor != goal.floor && routes.size < maxAlternatives) {
        val alternativeTransition = findAlternativeFloorTransition(
            start.floor,
            goal.floor,
            routes
        )
        
        alternativeTransition?.let { transition ->
            val altRoute = calculateRouteViaTransition(start, goal, transition, preferences)
            if (altRoute != null && !isSimilarRoute(altRoute, routes)) {
                routes.add(altRoute)
            }
        }
    }
    
    return routes.take(maxAlternatives)
}

private fun isSimilarRoute(route: Route, existingRoutes: List<Route>): Boolean {
    return existingRoutes.any { existing ->
        val overlap = calculateRouteOverlap(route, existing)
        overlap > 0.8 // More than 80% overlap
    }
}

private fun calculateRouteOverlap(route1: Route, route2: Route): Double {
    val nodes1 = route1.nodes.map { it.id }.toSet()
    val nodes2 = route2.nodes.map { it.id }.toSet()
    val intersection = nodes1.intersect(nodes2).size
    val union = nodes1.union(nodes2).size
    return intersection.toDouble() / union
}
```

---

## Dynamic Obstacle Avoidance

Handle temporary obstacles and restricted areas:

```kotlin
class DynamicPathFinder(
    private val pathFinder: PathFinder
) {
    
    private val temporaryObstacles = mutableListOf<Obstacle>()
    private val restrictedAreas = mutableListOf<RestrictedArea>()
    
    fun addTemporaryObstacle(obstacle: Obstacle) {
        temporaryObstacles.add(obstacle)
    }
    
    fun removeObstacle(obstacleId: String) {
        temporaryObstacles.removeIf { it.id == obstacleId }
    }
    
    fun findPathAvoidingObstacles(
        start: PathNode,
        goal: PathNode,
        preferences: RoutePreferences
    ): Route? {
        
        // Filter out blocked nodes
        val availableNodes = allNodes.filter { node ->
            !isNodeBlocked(node)
        }
        
        // Calculate path with available nodes
        val options = PathFindingOptions(
            heuristic = HeuristicType.EUCLIDEAN,
            allowDiagonal = true
        )
        
        val path = start.findPath(goal, availableNodes, options)
        
        return path?.let { nodes ->
            Route(
                nodes = nodes,
                distance = calculateDistance(nodes),
                estimatedTime = estimateTime(nodes),
                instructions = generateInstructions(nodes),
                warnings = generateObstacleWarnings(nodes)
            )
        }
    }
    
    private fun isNodeBlocked(node: PathNode): Boolean {
        // Check temporary obstacles
        temporaryObstacles.forEach { obstacle ->
            if (obstacle.containsPoint(node.position)) {
                return true
            }
        }
        
        // Check restricted areas
        restrictedAreas.forEach { area ->
            if (area.containsPoint(node.position) && !area.allowedUsers.contains(currentUserId)) {
                return true
            }
        }
        
        return false
    }
}

data class Obstacle(
    val id: String,
    val bounds: BoundingBox,
    val expiresAt: Long? = null,
    val reason: String
)

data class RestrictedArea(
    val id: String,
    val bounds: BoundingBox,
    val allowedUsers: Set<String>,
    val reason: String
)
```

---

## Performance Optimization

### Path Caching

```kotlin
class CachedPathFinder(
    private val pathFinder: PathFinder
) {
    
    private val cache = LruCache<String, Route>(maxSize = 100)
    
    fun findPath(
        start: PathNode,
        goal: PathNode,
        preferences: RoutePreferences
    ): Route? {
        
        val cacheKey = generateCacheKey(start, goal, preferences)
        
        // Check cache
        cache.get(cacheKey)?.let { cachedRoute ->
            if (isCacheValid(cachedRoute)) {
                return cachedRoute
            }
        }
        
        // Calculate new route
        val route = pathFinder.findPath(start, goal, preferences)
        
        // Store in cache
        route?.let {
            cache.put(cacheKey, it)
        }
        
        return route
    }
    
    private fun generateCacheKey(
        start: PathNode,
        goal: PathNode,
        preferences: RoutePreferences
    ): String {
        return "${start.id}_${goal.id}_${preferences.hashCode()}"
    }
    
    private fun isCacheValid(route: Route): Boolean {
        // Check if route is still valid (no obstacles blocking it)
        return route.nodes.all { node ->
            node.isTraversable && !isNodeBlocked(node)
        }
    }
    
    fun clearCache() {
        cache.evictAll()
    }
}
```

### Spatial Indexing

```kotlin
class SpatialIndexedPathFinder {
    
    private val spatialIndex = QuadTree<PathNode>(
        bounds = BoundingBox(0.0, 0.0, 1000.0, 1000.0),
        capacity = 10
    )
    
    fun initializeIndex(nodes: List<PathNode>) {
        nodes.forEach { node ->
            spatialIndex.insert(node.position, node)
        }
    }
    
    fun findNearbyNodes(position: Position, radius: Double): List<PathNode> {
        val searchBounds = BoundingBox(
            minX = position.x - radius,
            minY = position.y - radius,
            maxX = position.x + radius,
            maxY = position.y + radius
        )
        
        return spatialIndex.query(searchBounds)
    }
    
    fun findPath(start: PathNode, goal: PathNode): Route? {
        // Use spatial index to quickly find neighbors
        val relevantNodes = findNodesInPathCorridor(start, goal)
        
        // Run A* on subset of nodes
        return start.findPath(goal, relevantNodes, PathFindingOptions())
    }
    
    private fun findNodesInPathCorridor(
        start: PathNode,
        goal: PathNode
    ): List<PathNode> {
        // Create bounding box around start and goal with padding
        val padding = 50.0 // meters
        val bounds = BoundingBox(
            minX = min(start.x, goal.x) - padding,
            minY = min(start.y, goal.y) - padding,
            maxX = max(start.x, goal.x) + padding,
            maxY = max(start.y, goal.y) + padding
        )
        
        return spatialIndex.query(bounds)
    }
}
```

---

## Best Practices

!!! success "Recommended Practices"
    
    **1. Use Appropriate Heuristics**
    ```kotlin
    // ✅ Good: Match heuristic to movement type
    val options = PathFindingOptions(
        heuristic = if (allowDiagonal) {
            HeuristicType.EUCLIDEAN
        } else {
            HeuristicType.MANHATTAN
        }
    )
    
    // ❌ Bad: Wrong heuristic can reduce efficiency
    val options = PathFindingOptions(
        heuristic = HeuristicType.MANHATTAN, // Wrong for diagonal movement
        allowDiagonal = true
    )
    ```
    
    **2. Limit Search Space**
    ```kotlin
    // ✅ Good: Use spatial indexing to limit nodes
    val relevantNodes = spatialIndex.findNodesInCorridor(start, goal)
    val path = findPath(start, goal, relevantNodes)
    
    // ❌ Bad: Searching all nodes is slow
    val path = findPath(start, goal, allNodes) // Thousands of nodes
    ```
    
    **3. Cache Common Routes**
    ```kotlin
    // ✅ Good: Cache frequently requested routes
    val cachedPathFinder = CachedPathFinder(pathFinder)
    val route = cachedPathFinder.findPath(start, goal, preferences)
    ```
    
    **4. Validate Path Nodes**
    ```kotlin
    // ✅ Good: Ensure path is traversable before returning
    fun validatePath(path: List<PathNode>): Boolean {
        return path.all { it.isTraversable } &&
               path.zipWithNext().all { (a, b) -> a.isConnectedTo(b) }
    }
    ```

!!! warning "Common Pitfalls"
    
    - **Don't** use inadmissible heuristics (will not guarantee shortest path)
    - **Don't** forget to check for no-path scenarios
    - **Always** set maximum iteration limits to prevent infinite loops
    - **Always** validate node connectivity before adding to path
    - **Consider** memory usage with large node graphs
    - **Test** pathfinding with various obstacle configurations

---

## Troubleshooting

### No Path Found

**Problem**: Algorithm returns null even though path exists

**Solutions**:

```kotlin
// 1. Check node connectivity
fun debugConnectivity(start: PathNode, goal: PathNode) {
    Log.d("PathFinding", "Start neighbors: ${start.connectedNodeIds.size}")
    Log.d("PathFinding", "Goal neighbors: ${goal.connectedNodeIds.size}")
    
    val reachableFromStart = findReachableNodes(start)
    val isGoalReachable = goal.id in reachableFromStart
    
    Log.d("PathFinding", "Goal reachable: $isGoalReachable")
}

// 2. Increase max iterations
val options = PathFindingOptions(
    maxIterations = 50000 // Increase from default
)

// 3. Check for isolated node groups
fun findIsolatedGroups(nodes: List<PathNode>): List<List<PathNode>> {
    // Use graph traversal to find connected components
    // Helps identify disconnected areas
}
```

### Slow Path Calculation

**Problem**: Pathfinding takes too long

**Solutions**:

```kotlin
// 1. Use spatial indexing
val spatialFinder = SpatialIndexedPathFinder()
spatialFinder.initializeIndex(allNodes)

// 2. Reduce node density
val simplifiedNodes = simplifyNodeGraph(allNodes, threshold = 2.0)

// 3. Use hierarchical pathfinding for large venues
val hierarchicalFinder = HierarchicalPathFinder()
hierarchicalFinder.precomputeHighLevelGraph(allNodes)

// 4. Profile performance
val startTime = System.currentTimeMillis()
val path = findPath(start, goal)
val duration = System.currentTimeMillis() - startTime
Log.d("PathFinding", "Path calculation took ${duration}ms")
```

### Suboptimal Paths

**Problem**: Generated path is not the shortest

**Diagnostics**:

```kotlin
// Check if heuristic is admissible
fun validateHeuristic(
    node: PathNode,
    goal: PathNode,
    heuristic: HeuristicType
): Boolean {
    val heuristicCost = node.heuristic(goal, heuristic)
    val actualCost = calculateActualShortestPath(node, goal)
    
    if (heuristicCost > actualCost) {
        Log.w("PathFinding", "Heuristic overestimates! Not admissible")
        return false
    }
    
    return true
}

// Verify edge weights are consistent
fun validateEdgeWeights(nodes: List<PathNode>) {
    nodes.forEach { node ->
        node.connectedNodeIds.forEach { neighborId ->
            val neighbor = nodes.find { it.id == neighborId }
            if (neighbor != null) {
                val forwardWeight = getEdgeWeight(node, neighbor)
                val reverseWeight = getEdgeWeight(neighbor, node)
                
                if (abs(forwardWeight - reverseWeight) > 0.01) {
                    Log.w("PathFinding", "Inconsistent edge weights")
                }
            }
        }
    }
}
```

---

## Performance Benchmarks

| Scenario | Nodes | Path Length | Time | Memory |
|----------|-------|-------------|------|--------|
| **Small Venue** | < 500 | ~20 nodes | < 50ms | < 10MB |
| **Medium Venue** | 500-2000 | ~40 nodes | < 200ms | < 50MB |
| **Large Venue** | 2000-5000 | ~80 nodes | < 500ms | < 100MB |
| **Multi-Floor** | 5000+ | ~100 nodes | < 1000ms | < 200MB |

**Optimization Targets:**

- 🎯 **Response Time**: < 500ms for typical routes
- 🎯 **Memory Usage**: < 100MB for path calculation
- 🎯 **Cache Hit Rate**: > 60% for common routes
- 🎯 **Path Quality**: Within 5% of theoretical optimal

---

## Related Documentation

- [Navigation Features](./navigation.md) - Real-time navigation implementation
- [Map Loading](./map_loading.md) - Loading venue maps and path networks
- [UI Components](./ui_components.md) - Route display components
- [API Reference](../api_reference/module_overview.md) - Complete API documentation

---

## Next Steps

Now that you understand path finding:

1. **[Implement Navigation](./navigation.md)** - Add turn-by-turn guidance
2. **[Build UI Components](./ui_components.md)** - Create route visualization
3. **[Optimize Performance](../support/troubleshooting.md)** - Fine-tune for your venue



