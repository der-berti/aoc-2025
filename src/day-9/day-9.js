const INPUT_FILE = 'input-day-9.txt';

const {readFileSync} = require('../utils/file-reader')

function parseInput() {
    return readFileSync(INPUT_FILE)
        .trim()
        .split('\n')
        .map(line => line.split(',').map(Number));
}

const toPoint = (coordArray) => coordArray.map(([x, y]) => ({x,y}));

const pairs = coords =>
    coords.flatMap((a, i) =>
        coords.slice(i + 1).map(b => [a, b])
    );

const areas = pairs =>
    pairs.map(([a, b]) => calcArea(a, b));

const maxOf = arr =>
    arr.reduce((a, b) => Math.max(a, b), 0);

function calcArea(pointA, pointB) {
    const width  = Math.abs(pointA.x - pointB.x) + 1;
    const height = Math.abs(pointA.y - pointB.y) + 1;
    return width * height;
}

const inRange = (a1, a2, b1, b2) =>
    !(a1 <= b1 && a1 <= b2 && a2 <= b1 && a2 <= b2) &&
    !(a1 >= b1 && a1 >= b2 && a2 >= b1 && a2 >= b2);

const intersects = (rect, sides) => {
    const [[x1, y1], [x2, y2]] = rect;
    return sides.some(([[sx1, sy1], [sx2, sy2]]) =>
        inRange(sy1, sy2, y1, y2) && inRange(sx1, sx2, x1, x2)
    );
};


function solve_1() {
    const result = maxOf(areas(pairs(toPoint(parseInput()))));

    console.log('Solution Day 9 Part 1: ', result);

}

function solve_2() {
    const points = parseInput();

    const sides = points.map((p, i) => [
        p,
        points[(i + 1) % points.length]
    ]);

    const result = pairs(points)
        .filter(([a, b]) => !intersects([a, b], sides))
        .map(([a, b]) => {
            const width  = Math.abs(a[0] - b[0]) + 1;
            const height = Math.abs(a[1] - b[1]) + 1;
            return width * height;
        })
        .reduce((max, curr) => Math.max(max, curr), 0);

    console.log('Solution Day 9 Part 2:', result);
}

solve_1();
solve_2();