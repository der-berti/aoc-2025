const INPUT_FILE = 'input-day-5.txt';

const {readFileSync} = require('../utils/file-reader')

function parseInput(input) {
    const freshIds = [];
    const freshIdSet = new Set();
    const testIds = [];
    const rangePattern = RegExp('(\\d+)-(\\d+)', 'g');
    const idPattern = RegExp('^\\d+$', 'gm');
    for (const match of input.matchAll(rangePattern)) {
        let start = Number(match[1]);
        const end = Number(match[2]);
        freshIds.push({start, end});
    }
    for (const match of input.matchAll(idPattern)) {
        testIds.push(Number(match[0]));
    }
    return {freshIds, testIds, freshIdSet};
}

const input = readFileSync(INPUT_FILE);

function solve_1(input) {
    let sum = 0;
    const {freshIds, testIds} = parseInput(input);
    for (const testId of testIds) {
        for (const freshId of freshIds) {
            if (testId >= freshId.start && testId <= freshId.end) {
                sum++;
                break;
            }
        }
    }
    console.log('Solution Day 5 Part 1: ', sum);
}

function parseInputForPart2(input) {
    const freshIds = [];
    const rangePattern = RegExp('(\\d+)-(\\d+)', 'g');

    for (const match of input.matchAll(rangePattern)) {
        let start = Number(match[1]);
        const end = Number(match[2]);
        freshIds.push({start, end});

    }

    freshIds.sort((a, b) => a.start - b.start);

    return {freshIds};
}

function solve_2(input) {
    let sum = 0;
    const { freshIds } = parseInputForPart2(input);
    let lastEnd = 0;

    for (const freshId of freshIds) {
        if (freshId.start > lastEnd) {
            sum += freshId.end - freshId.start + 1;
            lastEnd = freshId.end;
        }
        else if (freshId.end > lastEnd) {
            sum += freshId.end - lastEnd;
            lastEnd = freshId.end;
        }
    }

    console.log('Solution Day 5 Part 2:', sum);
}

solve_1(input);
solve_2(input);