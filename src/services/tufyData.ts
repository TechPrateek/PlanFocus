export interface TufyProblemGuidance {
  problemName: string;
  pattern: string;
  difficulty: 'easy' | 'medium' | 'hard';
  intuition: string;
  bruteForce: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
  };
  optimal: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    keyInvariant: string;
  };
  faangPitfalls: string[];
  takeuforwardUrl: string;
}

export const TUFY_PROBLEM_DATABASE: Record<string, TufyProblemGuidance> = {
  "Kadane's Algorithm & Maximum Subarray Sum": {
    problemName: "Kadane's Algorithm & Maximum Subarray Sum",
    pattern: "Arrays / Prefix Sum",
    difficulty: "medium",
    intuition:
      "A negative sum prefix will never contribute positively to any contiguous subarray that follows it. Whenever your running sum drops below zero, reset it back to 0. Otherwise, carry the positive momentum forward.",
    bruteForce: {
      approach: "Iterate over all possible subarray start and end points using nested loops, computing the sum for each and tracking the global maximum.",
      timeComplexity: "O(N²)",
      spaceComplexity: "O(1)",
    },
    optimal: {
      approach: "Maintain running 'currSum' and 'maxSum'. In a single pass, add nums[i] to currSum. Update maxSum = max(maxSum, currSum). If currSum < 0, reset currSum = 0.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      keyInvariant: "currSum holds the maximum subarray sum ending strictly at the current index.",
    },
    faangPitfalls: [
      "All-negative numbers test case: If all elements are negative (e.g. [-3, -1, -5]), resetting to 0 without care may return 0 instead of -1. Initialize maxSum with nums[0] or INT_MIN.",
      "Follow-up asked at Microsoft/Amazon: Return the actual starting and ending indices of the maximal subarray, not just the maximum sum.",
    ],
    takeuforwardUrl: "https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array/",
  },
  "Two Sum & 3-Sum Problem": {
    problemName: "Two Sum & 3-Sum Problem",
    pattern: "Two Pointers / Hash Map",
    difficulty: "medium",
    intuition:
      "For Two Sum, check if (target - num) was seen before using an instant hash map lookup. For 3-Sum, sort the array first, lock in the first element, and use opposite two-pointers (low & high) to find pairs that sum to -nums[i] while skipping duplicates.",
    bruteForce: {
      approach: "Triple nested loops (O(N³)) checking every triplet (i, j, k) to see if nums[i] + nums[j] + nums[k] == 0, filtering duplicates with a hash set.",
      timeComplexity: "O(N³)",
      spaceComplexity: "O(N)",
    },
    optimal: {
      approach: "Sort array in O(N log N). Loop i from 0 to N-3. Skip duplicates if nums[i] == nums[i-1]. Set left = i+1, right = N-1. If sum == 0, record triplet and advance left/right while skipping equal values.",
      timeComplexity: "O(N²)",
      spaceComplexity: "O(1) extra space",
      keyInvariant: "Sorting enables monotonic movement: if sum < 0, advance left; if sum > 0, decrement right.",
    },
    faangPitfalls: [
      "Duplicate triplets: Forgetting to skip duplicate consecutive values for both the outer index i and the inner two pointers (left and right).",
      "Integer overflow in language runtimes when target is very large (cast to long long in C++ / 64-bit int).",
    ],
    takeuforwardUrl: "https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array/",
  },
  "Search in Rotated Sorted Array": {
    problemName: "Search in Rotated Sorted Array",
    pattern: "Binary Search",
    difficulty: "hard",
    intuition:
      "Even though the array has been rotated, dividing it at the midpoint ALWAYS guarantees that at least one half (left or right) is completely sorted. Identify the sorted half and test if the target lies within its boundaries.",
    bruteForce: {
      approach: "Linear scan from index 0 to N-1 checking if nums[i] == target.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
    },
    optimal: {
      approach: "Standard binary search with mid = (low + high) / 2. If nums[low] <= nums[mid], the left half is sorted: if target is between nums[low] and nums[mid], search left; else search right. Otherwise, the right half is sorted: apply symmetric check.",
      timeComplexity: "O(log N)",
      spaceComplexity: "O(1)",
      keyInvariant: "At every step, exactly one half is strictly sorted. Binary search can eliminate half the search space in O(1).",
    },
    faangPitfalls: [
      "Duplicates follow-up (Search in Rotated Sorted Array II): When nums[low] == nums[mid] == nums[high], you cannot deduce which half is sorted; must shrink low++ and high-- yielding O(N) worst case.",
      "Off-by-one errors with <= versus < when checking sorted boundaries.",
    ],
    takeuforwardUrl: "https://takeuforward.org/data-structure/search-in-rotated-sorted-array/",
  },
  "Longest Substring Without Repeating Characters": {
    problemName: "Longest Substring Without Repeating Characters",
    pattern: "Sliding Window",
    difficulty: "medium",
    intuition:
      "Maintain a dynamic window [left, right]. As right expands, record the character index in a hash map. When a repeated character is encountered inside the current window, instantly jump the 'left' pointer to lastSeenIndex + 1.",
    bruteForce: {
      approach: "Check every substring with nested loops, checking each substring for character uniqueness with a frequency array or hash set.",
      timeComplexity: "O(N²)",
      spaceComplexity: "O(N)",
    },
    optimal: {
      approach: "Use a map/array of size 256 storing last seen index of each char. Loop right from 0 to N-1. If char was seen at or after left, left = lastSeen[char] + 1. Update lastSeen[char] = right, maxLen = max(maxLen, right - left + 1).",
      timeComplexity: "O(N)",
      spaceComplexity: "O(min(N, 256))",
      keyInvariant: "The window [left, right] is always guaranteed to contain unique characters at the end of each iteration.",
    },
    faangPitfalls: [
      "Stale index bug: If the duplicate character was seen before the current 'left' boundary, jumping 'left' backwards would corrupt the invariant. Always use left = max(left, lastSeen[char] + 1).",
      "Character encoding assumptions: Clarify ASCII vs Unicode with the interviewer.",
    ],
    takeuforwardUrl: "https://takeuforward.org/data-structure/length-of-longest-substring-without-any-repeating-character/",
  },
  "Lowest Common Ancestor in Binary Tree": {
    problemName: "Lowest Common Ancestor in Binary Tree",
    pattern: "Binary Trees / Recursion",
    difficulty: "hard",
    intuition:
      "If the current root matches either node p or q, that root is a candidate ancestor. Otherwise, recursively search the left and right subtrees. If both recursive calls return non-null, the current root is the lowest common meeting point.",
    bruteForce: {
      approach: "Traverse the tree to construct root-to-node paths for p and q into lists, then compare the paths from the start until they diverge.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N) to store paths",
    },
    optimal: {
      approach: "Recursive post-order traversal: if root is null, p, or q, return root. Call left = LCA(root.left) and right = LCA(root.right). If both left and right are non-null, return root. If only one is non-null, return that non-null child.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(H) recursion stack where H is tree height",
      keyInvariant: "Returns non-null if either p or q (or both) exists in the subtree rooted at current node.",
    },
    faangPitfalls: [
      "LCA in BST vs General Binary Tree: In BST, you can compare root.val with p.val and q.val to navigate left or right in O(H) without checking both branches.",
      "Existence guarantee: Ask the interviewer if both nodes are guaranteed to exist in the tree.",
    ],
    takeuforwardUrl: "https://takeuforward.org/data-structure/lowest-common-ancestor-for-two-given-nodes/",
  },
  "Number of Islands & Graph Cycle Detection": {
    problemName: "Number of Islands & Graph Cycle Detection",
    pattern: "Graphs / BFS & DFS",
    difficulty: "hard",
    intuition:
      "Treat land cells ('1') as vertices and 4-directional adjacent land cells as edges. Scan the grid; whenever unvisited land is found, increment the island counter and launch BFS/DFS to sink the entire connected component (mark as '0' or visited).",
    bruteForce: {
      approach: "Flood fill via repeated scans or Disjoint Set Union (DSU) without path compression.",
      timeComplexity: "O(R * C)",
      spaceComplexity: "O(R * C)",
    },
    optimal: {
      approach: "Iterate through each cell (r, c). When grid[r][c] == '1', increment islandCount and trigger iterative BFS (using a queue) or recursive DFS to sink all connected '1's to '0'.",
      timeComplexity: "O(R * C)",
      spaceComplexity: "O(min(R, C)) for BFS queue",
      keyInvariant: "Every connected component of '1's is traversed and neutralized exactly once.",
    },
    faangPitfalls: [
      "Queue memory explosion / Stack overflow on deep grids: BFS queue size is bounded by the perimeter, while DFS can reach O(R * C) recursion depth on snake-like grids. Prefer iterative BFS.",
      "Modifying input array: Confirm whether you are allowed to modify the grid in-place or if a separate visited matrix is required.",
    ],
    takeuforwardUrl: "https://takeuforward.org/data-structure/number-of-islands/",
  },
  "0/1 Knapsack & Subset Sum Problem": {
    problemName: "0/1 Knapsack & Subset Sum Problem",
    pattern: "Dynamic Programming",
    difficulty: "hard",
    intuition:
      "For each item, we face a binary decision: either include the item in the knapsack (if weight <= capacity) or exclude it. Overlapping subproblems depend only on (itemIndex, remainingCapacity).",
    bruteForce: {
      approach: "Pure recursion trying both choices (pick / not-pick) for each item.",
      timeComplexity: "O(2^N)",
      spaceComplexity: "O(N) call stack",
    },
    optimal: {
      approach: "1D space-optimized DP: dp[w] = max value with capacity w. Loop items i from 0 to N-1, and loop capacity w backwards from W down to weight[i]: dp[w] = max(dp[w], value[i] + dp[w - weight[i]]).",
      timeComplexity: "O(N * W)",
      spaceComplexity: "O(W) with 1D array",
      keyInvariant: "Iterating backwards prevents the same item from being picked multiple times (distinguishing 0/1 Knapsack from Unbounded Knapsack).",
    },
    faangPitfalls: [
      "Pseudo-polynomial time complexity: Explain to the interviewer that O(N * W) is pseudo-polynomial because W is proportional to 2^(bit length of capacity).",
      "Forward iteration bug: Looping capacity w forwards accidentally solves Unbounded Knapsack instead of 0/1 Knapsack.",
    ],
    takeuforwardUrl: "https://takeuforward.org/data-structure/0-1-knapsack-problem-dp-19/",
  },
};

export function getTufyGuidance(problemName: string, pattern = "Data Structures & Algorithms"): TufyProblemGuidance {
  if (TUFY_PROBLEM_DATABASE[problemName]) {
    return TUFY_PROBLEM_DATABASE[problemName];
  }

  // Fallback dynamic guidance
  return {
    problemName,
    pattern,
    difficulty: "medium",
    intuition: `Mastering '${problemName}' requires identifying the invariant of the '${pattern}' pattern. Break the problem into subproblems, identify edge cases (empty inputs, single element, negative values), and test if a greedy, two-pointer, or DP approach applies.`,
    bruteForce: {
      approach: "Generate all candidate states or permutations and validate each against problem constraints.",
      timeComplexity: "O(N²) or O(2^N)",
      spaceComplexity: "O(1) or O(N)",
    },
    optimal: {
      approach: `Leverage '${pattern}' to prune redundant computations or search spaces in logarithmic or linear time.`,
      timeComplexity: "O(N) or O(N log N)",
      spaceComplexity: "O(1) to O(N)",
      keyInvariant: "State transitions strictly maintain optimal subproblem substructure.",
    },
    faangPitfalls: [
      "Boundary constraints: Pay close attention to integer overflow, empty collections, and duplicate entries.",
      "Trade-offs: Always explain time vs. space complexity trade-offs to the interviewer before coding.",
    ],
    takeuforwardUrl: "https://takeuforward.org/",
  };
}
