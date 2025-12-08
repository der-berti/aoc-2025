const INPUT_FILE = 'input-day-8.txt';

const {readFileSync} = require('../utils/file-reader')

const parseInput = (input) => {
    return input.trim()
        .split('\n')
        .map(line => {
            const [x, y, z] = line.split(',').map(Number);
            return {x, y, z};
        })
}

class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (ignored, i) => i);
        this.size = Array.from({ length: n }, () => 1);
        this.numComponents = n;
    }

    find(node) {
        if (this.parent[node] !== node) {
            this.parent[node] = this.find(this.parent[node]);
        }
        return this.parent[node];
    }

    union(a, b) {
        let rootA = this.find(a);
        let rootB = this.find(b);

        if (rootA === rootB) return false;

        if (this.size[rootA] < this.size[rootB]) {
            [rootA, rootB] = [rootB, rootA];
        }

        this.parent[rootB] = rootA;
        this.size[rootA] += this.size[rootB];

        this.numComponents--;

        return true;
    }

    componentSizes() {
        const sizeByRoot = new Map();
        for (let node = 0; node < this.parent.length; node++) {
            const root = this.find(node);
            sizeByRoot.set(root, (sizeByRoot.get(root) || 0) + 1);
        }
        return [...sizeByRoot.values()];
    }
}


function calcEuclidean(point1, point2) {
    return Math.sqrt(
        (point1.x - point2.x) ** 2 +
        (point1.y - point2.y) ** 2 +
        (point1.z - point2.z) ** 2
    );
}

function solve_1() {
    const rawInput = readFileSync(INPUT_FILE);
    const points = parseInput(rawInput);
    const pointsCount = points.length;

    const edges = Array.from({length: pointsCount}, (ignored, pointIndexA) =>
        Array.from({length: pointsCount - (pointIndexA + 1)}, (ignored, offset) => {
            const pointIndexB = pointIndexA + offset + 1;
            return {fromIndex: pointIndexA, toIndex: pointIndexB, d: calcEuclidean(points[pointIndexA], points[pointIndexB])}
        })
    ).flat();

    edges.sort((e1, e2) => e1.d - e2.d);

    const uf = new UnionFind(pointsCount);

    const EDGE_LIMIT = 1000;
    for (let i = 0; i < Math.min(EDGE_LIMIT, edges.length); i++) {
        uf.union(edges[i].fromIndex, edges[i].toIndex);
    }

    const sizes = uf.componentSizes().sort((a, b) => b - a);

    const result = sizes[0] * sizes[1] * sizes[2];
    console.log('Solution Day 8 Part 1:', result);
}

function solve_2() {
    const rawInput = readFileSync(INPUT_FILE);
    const points = parseInput(rawInput);
    const pointCount = points.length;

    const edges = Array.from({ length: pointCount }, (_, pointIndexA) =>
        Array.from({ length: pointCount - (pointIndexA + 1) }, (_, offset) => {

            const pointIndexB = pointIndexA + offset + 1;

            return {
                fromIndex: pointIndexA,
                toIndex: pointIndexB,
                distance: calcEuclidean(points[pointIndexA], points[pointIndexB])
            };

        })
    ).flat();

    edges.sort((edgeA, edgeB) => edgeA.distance - edgeB.distance);

    const uf = new UnionFind(pointCount);

    let lastUsedEdge = null;

    for (const edge of edges) {
        const merged = uf.union(edge.fromIndex, edge.toIndex);

        if (merged) {
            lastUsedEdge = edge;

            if (uf.numComponents === 1) {
                break;
            }
        }
    }

    if (!lastUsedEdge) {
        console.log("No connecting edge found.");
        return;
    }

    const x1 = points[lastUsedEdge.fromIndex].x;
    const x2 = points[lastUsedEdge.toIndex].x;

    const result = x1 * x2;

    console.log("Solution Day 8 Part 2:", result);
}

solve_1();
solve_2();