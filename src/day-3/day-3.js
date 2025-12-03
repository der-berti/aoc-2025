const INPUT_FILE = 'input-day-3.txt';

const {readFileSync} = require('../utils/file-reader')

function arrayToNumber(arr) {
    let digits = arr.length - 1;
    let result = 0;
    for (const num of arr) {
        result += num * Math.max(Math.pow(10, digits--), 1);
    }
    return result;
}

function toNumberArray(str) {
    return [...str].map(Number);
}

function findHighestRecurse(start, numbers, highestNumberArr, digits) {
    let highest = 0;
    for (let i = start; i < numbers.length - ((digits - 1) - highestNumberArr.length); i++) {
        const currentNumber = numbers[i];
        if (currentNumber > highest) {
            highest = currentNumber;
            start = i;
        }
    }
    highestNumberArr.push(highest);
    if (highestNumberArr.length < digits) {
        findHighestRecurse(start + 1, numbers, highestNumberArr, digits);
    }
}

function solve_1(input) {
    const pattern = new RegExp('\\d+', 'g');
    let sum = 0;
    for (const match of input.matchAll(pattern)) {
        const numbers = toNumberArray(match[0]);
        const highestNumberArr = [];
        findHighestRecurse(0, numbers, highestNumberArr, 2);
        const result = arrayToNumber(highestNumberArr);
        sum += result;
    }
    console.log('Solution Day 3 Part 1: ', sum);
}

function solve_2(input) {
    const pattern = new RegExp('\\d+', 'g');
    let sum = 0;
    for (const match of input.matchAll(pattern)) {
        const numbers = toNumberArray(match[0]);
        const highestNumberArr = [];
        findHighestRecurse(0, numbers, highestNumberArr, 12);
        const result = arrayToNumber(highestNumberArr);
        sum += result;
    }
    console.log('Solution Day 3 Part 2: ', sum);
}

const input = readFileSync(INPUT_FILE);
solve_1(input);
solve_2(input);