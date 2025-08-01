export const dummyPosts = [
  {
    id: 1,
    slug: 'computer-vision-guide',
    title: '4-Week Computer Vision & Deep Learning Roadmap',
    description: 'Complete guide to mastering computer vision with OpenCV, Keras, and YOLO - from basics to real-world applications',
    content: `# 4-Week Computer Vision & Deep Learning Roadmap

This comprehensive guide will take you from computer vision basics to advanced deep learning applications in just 4 weeks.

## Week 1: Computer Vision Basics with OpenCV

### Day 1 – Introduction to OpenCV
**Objective**: Understand OpenCV basics, install it, load and display images

\`\`\`python
import cv2
import numpy as np

# Load and display image
img = cv2.imread('image.jpg')
cv2.imshow('Original', img)

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imshow('Grayscale', gray)

cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

### Day 2 – Image Operations
Learn about image arithmetic, bitwise operations, and ROI (Region of Interest).

### Day 3 – Drawing and Mouse Events
Build interactive applications using OpenCV drawing functions.

## Week 2: Deep Learning with Keras & TensorFlow

### Day 8 – Intro to Keras & TensorFlow
Start building neural networks with the Keras API.

\`\`\`python
import tensorflow as tf
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])
\`\`\`

## Week 3: YOLO and Object Detection

Learn to implement real-time object detection using YOLO models.

### Key Features of YOLO:
- **Real-time detection**: Process images in milliseconds
- **Single neural network**: End-to-end detection
- **High accuracy**: State-of-the-art performance

## Week 4: Integration and Final Projects

Combine everything into real-world applications.

### Project Ideas:
1. Real-time mask detection
2. Object counter
3. Traffic light detection
4. Gesture recognition

> **Note**: Practice is key to mastering computer vision. Build projects and experiment with different techniques!`,
    date: '2024-07-25',
    category: 'tutorials',
    tags: ['computer-vision', 'opencv', 'deep-learning', 'yolo', 'keras'],
    readTime: 12,
    featured: true
  },
  {
    id: 2,
    slug: 'dynamic-programming-mastery',
    title: 'Dynamic Programming Mastery Guide',
    description: 'Master dynamic programming with step-by-step explanations and practice problems',
    content: `# Dynamic Programming Mastery Guide

Dynamic Programming is one of the most important techniques in competitive programming.

## What is Dynamic Programming?

Dynamic Programming (DP) is an algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems.

## Key Concepts

### 1. Overlapping Subproblems
Problems that can be broken down into subproblems which are reused several times.

### 2. Optimal Substructure
An optimal solution can be constructed from optimal solutions of its subproblems.

## Classic DP Problems

### Fibonacci Sequence
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
\`\`\`

### Coin Change Problem
\`\`\`python
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
\`\`\`

## Practice Problems

1. **Longest Increasing Subsequence**
   - Find the length of the longest subsequence
   - Time complexity: O(n log n)

2. **0/1 Knapsack Problem**
   - Classic optimization problem
   - Choose items to maximize value

3. **Edit Distance**
   - Minimum operations to transform one string to another
   - Also known as Levenshtein distance

4. **Maximum Subarray Sum**
   - Kadane's algorithm
   - Find contiguous subarray with maximum sum

## Tips for DP Problems

- **Identify the state**: What parameters change?
- **Define recurrence**: How do states relate?
- **Handle base cases**: What are the simplest cases?
- **Optimize space**: Can you reduce dimensions?`,
    date: '2024-07-20',
    category: 'algorithms',
    tags: ['dynamic-programming', 'algorithms', 'optimization'],
    readTime: 8,
    featured: true
  },
  {
    id: 3,
    slug: 'graph-algorithms-complete-guide',
    title: 'Graph Algorithms Complete Guide',
    description: 'Comprehensive guide to graph algorithms including BFS, DFS, Dijkstra, and more',
    content: `# Graph Algorithms Complete Guide

Graphs are fundamental data structures used to represent relationships between objects.

## Graph Representation

### Adjacency List
\`\`\`python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
\`\`\`

### Adjacency Matrix
\`\`\`python
# For a graph with 4 vertices
adj_matrix = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
]
\`\`\`

## Graph Traversal Algorithms

### Breadth-First Search (BFS)
\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        vertex = queue.popleft()
        print(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
\`\`\`

### Depth-First Search (DFS)
\`\`\`python
def dfs(graph, vertex, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(vertex)
    print(vertex)
    
    for neighbor in graph[vertex]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
\`\`\`

## Shortest Path Algorithms

### Dijkstra's Algorithm
Find shortest paths from a source vertex to all other vertices.

**Time Complexity**: O((V + E) log V) with binary heap

### Floyd-Warshall Algorithm
Find shortest paths between all pairs of vertices.

**Time Complexity**: O(V³)

## Applications

| Algorithm | Use Case | Time Complexity |
|-----------|----------|----------------|
| BFS | Shortest path (unweighted) | O(V + E) |
| DFS | Cycle detection, topological sort | O(V + E) |
| Dijkstra | Shortest path (weighted) | O((V + E) log V) |
| Bellman-Ford | Negative weights | O(VE) |

## Advanced Topics

- **Minimum Spanning Tree** (Kruskal's, Prim's)
- **Topological Sorting**
- **Strongly Connected Components**
- **Network Flow Algorithms**
- **Bipartite Matching**`,
    date: '2024-07-18',
    category: 'algorithms',
    tags: ['graphs', 'algorithms', 'bfs', 'dfs', 'dijkstra'],
    readTime: 15,
    featured: true
  },
  {
    id: 4,
    slug: 'binary-search-techniques',
    title: 'Binary Search Techniques and Variations',
    description: 'Master binary search and its variations for competitive programming',
    content: `# Binary Search Techniques and Variations

Binary search is a fundamental algorithm that every competitive programmer must master.

## Basic Binary Search

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
\`\`\`

## Binary Search Variations

### Find First Occurrence
\`\`\`python
def find_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Continue searching in left half
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
\`\`\`

### Find Last Occurrence
\`\`\`python
def find_last(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            left = mid + 1  # Continue searching in right half
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
\`\`\`

## Binary Search on Answer

Sometimes we can binary search on the answer space rather than the array itself.

### Example: Square Root
\`\`\`python
def sqrt(x):
    if x < 2:
        return x
    
    left, right = 2, x // 2
    
    while left <= right:
        mid = (left + right) // 2
        num = mid * mid
        
        if num == x:
            return mid
        elif num < x:
            left = mid + 1
        else:
            right = mid - 1
    
    return right
\`\`\`

## Advanced Applications

### Ternary Search
For finding maximum/minimum of unimodal functions:

\`\`\`python
def ternary_search(left, right, func):
    while right - left > 3:
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3
        
        if func(mid1) > func(mid2):
            right = mid2
        else:
            left = mid1
    
    # Check remaining candidates
    best = left
    for i in range(left, right + 1):
        if func(i) > func(best):
            best = i
    return best
\`\`\`

## Common Patterns

1. **Search in rotated sorted array**
2. **Find peak element**
3. **Search in 2D matrix**
4. **Minimum in rotated sorted array**
5. **Search for range**

> **Pro Tip**: Always think about the search space and what property makes binary search applicable!`,
    date: '2024-07-15',
    category: 'algorithms',
    tags: ['binary-search', 'algorithms', 'searching'],
    readTime: 10,
    featured: false
  },
  {
    id: 5,
    slug: 'data-structures-handbook',
    title: 'Essential Data Structures Handbook',
    description: 'Complete reference for all important data structures in competitive programming',
    content: `# Essential Data Structures Handbook

A comprehensive guide to the most important data structures for competitive programming.

## Linear Data Structures

### Arrays
The most basic data structure for storing elements in contiguous memory.

**Time Complexities:**
- Access: O(1)
- Search: O(n)
- Insertion: O(n)
- Deletion: O(n)

### Linked Lists
\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert(self, val):
        new_node = ListNode(val)
        new_node.next = self.head
        self.head = new_node
    
    def delete(self, val):
        if not self.head:
            return
        
        if self.head.val == val:
            self.head = self.head.next
            return
        
        current = self.head
        while current.next and current.next.val != val:
            current = current.next
        
        if current.next:
            current.next = current.next.next
\`\`\`

### Stacks and Queues
\`\`\`python
# Stack using list
stack = []
stack.append(1)  # push
item = stack.pop()  # pop

# Queue using deque
from collections import deque
queue = deque()
queue.append(1)     # enqueue
item = queue.popleft()  # dequeue
\`\`\`

## Tree Data Structures

### Binary Trees
\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    if not root:
        return []
    
    result = []
    result.extend(inorder_traversal(root.left))
    result.append(root.val)
    result.extend(inorder_traversal(root.right))
    return result
\`\`\`

### Binary Search Trees
\`\`\`python
def search(root, val):
    if not root or root.val == val:
        return root
    
    if val < root.val:
        return search(root.left, val)
    return search(root.right, val)

def insert(root, val):
    if not root:
        return TreeNode(val)
    
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    
    return root
\`\`\`

### Heaps
\`\`\`python
import heapq

# Min heap
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 4)

min_val = heapq.heappop(heap)  # Returns 1

# Max heap (negate values)
max_heap = []
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -1)
max_val = -heapq.heappop(max_heap)  # Returns 3
\`\`\`

## Advanced Data Structures

### Disjoint Set Union (DSU)
\`\`\`python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        return True
\`\`\`

### Trie (Prefix Tree)
\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
\`\`\`

## Complexity Comparison

| Data Structure | Access | Search | Insertion | Deletion |
|----------------|--------|--------|-----------|----------|
| Array | O(1) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1) | O(1) |
| Stack | O(n) | O(n) | O(1) | O(1) |
| Queue | O(n) | O(n) | O(1) | O(1) |
| Binary Tree | O(n) | O(n) | O(n) | O(n) |
| BST | O(log n) | O(log n) | O(log n) | O(log n) |
| Heap | O(1) | O(n) | O(log n) | O(log n) |

## Advanced Topics

- **Segment Trees** for range queries
- **Fenwick Trees** for prefix sums
- **Hash Tables** for fast lookups
- **B-Trees** for database systems`,
    date: '2024-07-12',
    category: 'data-structures',
    tags: ['data-structures', 'trees', 'heaps', 'hash-tables'],
    readTime: 20,
    featured: true
  },
  {
    id: 6,
    slug: 'competitive-programming-contest-strategy',
    title: 'Contest Strategy and Time Management',
    description: 'Proven strategies for performing well in competitive programming contests',
    content: `# Contest Strategy and Time Management

Success in competitive programming contests requires more than just algorithmic knowledge.

## Pre-Contest Preparation

### Setup Your Environment
- Configure your IDE with templates
- Prepare commonly used code snippets
- Test your setup with practice problems

### Template Code
\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

#define ll long long
#define vi vector<int>
#define vll vector<long long>
#define pii pair<int, int>
#define F first
#define S second

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}
\`\`\`

## During the Contest

### Problem Selection Strategy
1. **Read all problems first** - Get an overview of the contest
2. **Start with easiest problems** - Build confidence and score points
3. **Identify your strong areas** - Focus on problems you're confident about
4. **Time management** - Don't spend too much time on one problem

### Problem-Solving Approach
1. **Understand the problem** - Read carefully, identify constraints
2. **Think of edge cases** - Consider boundary conditions
3. **Choose the right algorithm** - Match problem pattern to known algorithms
4. **Code efficiently** - Use templates and snippets
5. **Test thoroughly** - Verify with sample inputs and edge cases

## Common Mistakes to Avoid

### Implementation Errors
- Array bounds violations
- Integer overflow
- Off-by-one errors
- Incorrect loop conditions

### Strategic Errors
- Spending too much time on hard problems
- Not reading all problems
- Submitting without proper testing
- Getting stuck on implementation details

## Time Allocation

### 2-hour Contest Example
- **First 10 minutes**: Read all problems
- **Next 30 minutes**: Solve easiest 2-3 problems
- **Next 60 minutes**: Work on medium difficulty problems
- **Last 20 minutes**: Debug and optimize

## Contest Types

### ACM-ICPC Style
- Team contest
- First to solve wins
- Penalty for wrong submissions

### Codeforces/AtCoder Style
- Individual contest
- Points based on problem difficulty
- Time bonus for faster solutions

## Mental Preparation

- **Stay calm** under pressure
- **Don't panic** if you can't solve a problem
- **Take breaks** if you're stuck
- **Maintain confidence** throughout the contest

## Post-Contest Analysis

1. **Review your solutions** - Look for optimizations
2. **Study editorial** - Learn alternative approaches
3. **Practice weak areas** - Focus on problem types you struggled with
4. **Analyze time management** - Identify where you lost time

### Debugging Checklist
- [ ] Check array bounds
- [ ] Verify data types (int vs long long)
- [ ] Test with edge cases
- [ ] Review loop conditions
- [ ] Check for integer overflow`,
    date: '2024-07-10',
    category: 'problem-solving',
    tags: ['contest-strategy', 'time-management', 'competitive-programming'],
    readTime: 8,
    featured: false
  }
]

export const dummyCategories = [
  { id: 'algorithms', name: 'Algorithms', count: 3 },
  { id: 'data-structures', name: 'Data Structures', count: 1 },
  { id: 'problem-solving', name: 'Problem Solving', count: 1 },
  { id: 'tutorials', name: 'Tutorials', count: 1 },
  { id: 'advanced', name: 'Advanced', count: 0 }
]

export const dummyStats = {
  totalPosts: 50,
  totalCategories: 5,
  totalTags: 25,
  totalViews: 12500
}

// Helper functions
export function getAllPosts() {
  return dummyPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlug(slug) {
  return dummyPosts.find(post => post.slug === slug)
}

export function getPostsByCategory(category) {
  if (category === 'all') return getAllPosts()
  return dummyPosts.filter(post => post.category === category)
}

export function getFeaturedPosts(limit = 6) {
  return dummyPosts.filter(post => post.featured).slice(0, limit)
}

export function getRelatedPosts(currentSlug, limit = 3) {
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []
  
  return dummyPosts
    .filter(post => post.slug !== currentSlug && post.category === currentPost.category)
    .slice(0, limit)
}

export function searchPosts(query) {
  const lowercaseQuery = query.toLowerCase()
  return dummyPosts.filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.description.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}