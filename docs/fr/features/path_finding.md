# <span class="emoji"> :material-map-marker-path: </span> Recherche de chemin

## Vue d'ensemble

La **recherche de chemin** calcule des itinéraires optimaux entre deux points dans des environnements intérieurs complexes. Avec des algorithmes avancés et une optimisation multi-critères, MINE fournit des routes adaptées (distance, accessibilité, évitement d'obstacles, préférences).

!!! abstract "Capacités clés"
    - 🎯 **Algorithme A*** : calcul de plus court chemin avec heuristique
    - 🔀 **Routage multi-critères** : distance, accessibilité, temps, préférences
    - 🏢 **Multi-étages** : calcul fluide entre niveaux
    - ♿ **Accessibilité** : parcours PMR avec priorité ascenseurs
    - 🚧 **Obstacles dynamiques** : ajustement en temps réel
    - 🔄 **Routes alternatives** : plusieurs options proposées

---

## Algorithmes de recherche

### Algorithme A*

A* combine coût parcouru et heuristique vers l'objectif :

```
f(n) = g(n) + h(n)
```

1. Ajouter le départ à l'open set (file de priorité)
2. Extraire le nœud au plus faible f(n)
3. Si objectif, reconstruire le chemin
4. Sinon, déplacer en closed set et explorer les voisins
5. Mettre à jour g/h/f et parents si meilleur coût, réinsérer en open set

### Fonctions heuristiques

<div class="grid" markdown>

=== "Distance euclidienne"

    ```kotlin
    fun euclideanDistance(a: Point, b: Point): Double {
        val dx = a.x - b.x
        val dy = a.y - b.y
        return sqrt(dx * dx + dy * dy)
    }
    ```
    **Cas** : espaces ouverts, diagonales autorisées

=== "Distance Manhattan"

    ```kotlin
    fun manhattanDistance(a: Point, b: Point): Double {
        return abs(a.x - b.x) + abs(a.y - b.y)
    }
    ```
    **Cas** : grille sans diagonales

=== "Distance diagonale"

    ```kotlin
    fun diagonalDistance(a: Point, b: Point): Double {
        val dx = abs(a.x - b.x)
        val dy = abs(a.y - b.y)
        return max(dx, dy) + (sqrt(2.0) - 1) * min(dx, dy)
    }
    ```
    **Cas** : mouvement 8 directions

=== "Pondérée personnalisée"

    ```kotlin
    fun weightedDistance(a: Point, b: Point, weight: Double = 1.0): Double {
        val dx = a.x - b.x
        val dy = a.y - b.y
        return sqrt(dx * dx + dy * dy) * weight
    }
    ```
    **Cas** : préférer certaines zones

</div>

!!! tip "Heuristiques admissibles"
    Les heuristiques ci-dessus sont admissibles et cohérentes (garantissent le plus court chemin avec A*).

---

## Implémentation

### Base

```kotlin
val options = PathFindingOptions(
    heuristic = HeuristicType.EUCLIDEAN,
    allowDiagonal = true,
    maxIterations = 10000
)
val route = pathFinder.findPath(start, goal, pathNodes, options)
```

### Extension sur nœud

```kotlin
fun PathNode.findPath(goal: PathNode, allNodes: List<PathNode>, options: PathFindingOptions = PathFindingOptions()): List<PathNode>? { /* A* avec open/closed sets, g/h/f, parents, maxIterations */ }
```

### Voisins

```kotlin
fun PathNode.getNeighbors(allNodes: List<PathNode>, options: PathFindingOptions): List<PathNode> { /* voisins connectés + diagonales si permis et non bloquées */ }
```

---

## Routage multi-critères

```kotlin
enum class OptimizationCriteria {
    SHORTEST_DISTANCE, FASTEST_TIME, ACCESSIBILITY, LEAST_CROWDED, SCENIC_ROUTE, EMERGENCY_EXIT
}

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

- Pondération des nœuds selon accessibilité, zones à éviter/privilégier, encombrement, poids custom
- Choix heuristique selon critère (ex. LEAST_CROWDED → pondérer crowdingFactor)

---

## Multi-étages

- Trouver points de transition (ascenseurs, escaliers, escalators)
- Calculer start → entrée transition, sortie transition → destination
- Combiner et choisir le coût minimal

```kotlin
data class FloorTransition(
    val type: TransitionType,
    val fromFloor: Int,
    val toFloor: Int,
    val entryNode: PathNode,
    val exitNode: PathNode,
    val cost: Double
)
```

---

## Routes alternatives

- Route primaire (critère choisi)
- Variante « plus rapide », « scénique », ou via autre transition d'étage
- Filtrer les routes trop similaires (>80% de chevauchement)

---

## Obstacles dynamiques

- Liste d'obstacles temporaires / zones restreintes
- Exclure les nœuds bloqués avant A*
- Générer des avertissements sur les segments concernés

---

## Optimisation des performances

- Cache LRU des routes (clé start/goal/préférences)
- Index spatial (QuadTree) pour limiter les voisins
- Limiter le corridor de recherche autour start/goal
- Itérations max pour éviter les boucles

---

## Bonnes pratiques

!!! success "À faire"
    - Choisir l'heuristique adaptée (Manhattan sans diagonale, Euclidienne avec diagonale)
    - Limiter l'espace de recherche (index spatial, corridor)
    - Mettre en cache les routes fréquentes
    - Valider la traversabilité et la connectivité

!!! warning "À éviter"
    - Heuristiques non admissibles
    - Oublier les cas sans chemin
    - Laisser des itérations infinies
    - Graphes denses sans simplification

---

## Dépannage

- **Aucun chemin** : vérifier connectivité, augmenter maxIterations, détecter groupes isolés
- **Lent** : index spatial, réduire densité, hiérarchiser, profiler
- **Chemins sous-optimaux** : valider heuristique, poids d'arêtes, cohérence des coûts

---

## Benchmarks cibles

| Scénario | Nœuds | Longueur chemin | Temps | Mémoire |
|----------|-------|-----------------|-------|---------|
| Petit lieu | < 500 | ~20 nœuds | < 50 ms | < 10 MB |
| Moyen | 500-2000 | ~40 nœuds | < 200 ms | < 50 MB |
| Grand | 2000-5000 | ~80 nœuds | < 500 ms | < 100 MB |
| Multi-étages | 5000+ | ~100 nœuds | < 1000 ms | < 200 MB |

---

## Docs associées

- [Navigation](navigation.md)
- [Chargement de carte](map_loading.md)
- [Composants UI](ui_components.md)
- [Référence API](../api_reference/module_overview.md)

## Prochaines étapes

1. **[Implémenter la navigation](navigation.md)**
2. **[Construire l'UI](ui_components.md)**
3. **[Optimiser les perfs](../support/troubleshooting.md)**
