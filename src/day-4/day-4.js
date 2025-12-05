const INPUT_FILE = 'input-day-4.txt';

const {readFileSync} = require('../utils/file-reader');

let matrix = []
let sum = 0;
const surroundings = [
    {x: -1, y: 1},
    {x: 0, y: 1},
    {x: 1, y: 1},
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 1, y: -1},
    {x: 0, y: -1},
    {x: -1, y: -1},
]

function parseInput(input) {
    const lines = input.split('\n');
    for (const line of lines) {
        const row = Array.from(line).reduce((acc, curr) => {
            if (curr === '.') {
                acc.push(1000);
            } else {
                acc.push(0);
            }
            return acc;
        }, [])
        matrix.push(row);
    }
    return matrix;
}

function checkNeighbors(pos) {
    let neighbors = 0;
    const self = matrix[pos.y][pos.x];
    if (self === 1000) {
        return;
    }
    surroundings.forEach(surrounding => {
        const newPosition = getPosition(pos, surrounding);
        if (
            newPosition.y >= 0 &&
            newPosition.y < matrix.length &&
            newPosition.x >= 0 &&
            newPosition.x < matrix[newPosition.y].length
        ) {
            if (matrix[newPosition.y][newPosition.x] === 0) {
                neighbors++;
            }
        }
    });
    if (neighbors < 4) {
        matrix[pos.y][pos.x] = 1000;
        sum++;
    }
}

const getPosition = (orig, toAdd) => {
    return {x: orig.x + toAdd.x, y: orig.y + toAdd.y};
}

function solve_1(input) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            checkNeighbors({y: i, x: j});
        }
    }
    console.log('Solution Day 4 Part 1: ', sum);
}


function drawMap() {
    for (let i = 0; i < matrix.length; i++) {
        let line = '';
        for (let j = 0; j < matrix[i].length; j++) {
            const num = matrix[i][j];
            if (num >= 1000) {
                line += '.';
            } else {
                line += '@';
            }
        }
        console.log(line);
    }

}

function solve_2(input) {
    let i = 0;
    console.log('before');
    drawMap();
    sum = 0;
    let sumBefore = 9999;
    while (sum !== sumBefore) {
        sumBefore = sum;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                checkNeighbors({y: i, x: j});
            }
        }
        console.log('iteration: ' + ++i)
    drawMap();
    }
    console.log('Solution Day 4 Part 2: ', sum);
}

const input = readFileSync(INPUT_FILE);
parseInput(input);
console.log(`max: people ${matrix.length * matrix[0].length}`)
solve_1(input);
matrix = [];
parseInput(input);
solve_2(input);
