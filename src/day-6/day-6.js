const INPUT_FILE = 'input-day-6.txt';

const {readFileSync} = require('../utils/file-reader')

function parseInput() {
    const pattern = new RegExp('[\\w*\\-+/]+', 'g');
    const input = readFileSync(INPUT_FILE);
    const lines = input.split('\n');
    const rows = [];
    for (const line of lines) {
        const cols = [];
        for (const part of line.matchAll(pattern)) {
            cols.push(part[0]);
        }
        rows.push(cols);
    }
    return rows;
}

function calculate(rows) {
    let sum = 0;
    const inputPattern = new RegExp('[+\\-*/]', 'g');

    for (let col = 0; col < rows[0].length; col++) {
        let operation = 'none';
        let partialSum = 0;
        for (let row = rows.length - 1; row >= 0; row--) {
            const part = rows[row][col];
            // console.log(`row: ${row}, col: ${col}: ${part}`);
            if (inputPattern.test(part)) {
                operation = part;
            } else {
                let number = 0;
                number = Number(part);
                switch (operation) {
                    case '*':
                        partialSum = Math.max(partialSum, 1) * number;
                        break;
                    case '-':
                        partialSum -= number;
                        break;
                    case '+':
                        partialSum += number;
                        break;
                    case '/':
                        partialSum = Math.max(partialSum, 1) / number;
                        break;
                    default:
                        console.log(`Unrecognized input operation ${operation}`)
                        throw new Error('Could not execute operation');
                }
            }
        }
        sum += partialSum;
    }
    return sum;
}

function fill(line, maxLenght) {
    while (line.length < maxLenght) {
        line.push(' ');
    }
}

function parseForPart2() {
    const input = readFileSync(INPUT_FILE);
    const lines = input.split('\n');
    const rows = [];
    let maxLength = 0;
    for (const line of lines) {
        if (line.length > maxLength) {
            maxLength = line.length;
        }
        rows.push(Array.from(line));
    }
    rows.forEach((line) => fill(line, maxLength));
    return rows;
}

function solve_1() {
    const rows = parseInput();

    let sum = calculate(rows);
    console.log('Solution Day 6 Part 1: ', sum);
}


function operate(partialSum, numString, operation) {
    const number = Number(numString.trim());
    switch (operation) {
        case '*':
            partialSum = Math.max(partialSum, 1) * number;
            break;
        case '-':
            partialSum -= number;
            break;
        case '+':
            partialSum += number;
            break;
        case '/':
            partialSum = Math.max(partialSum, 1) / number;
            break;
        default:
            console.log(`Unrecognized input operation ${operation}`)
            throw new Error('Could not execute operation');
    }
    return partialSum;
}

function calculateInColumns(rows) {
    let next = false;
    let sum = 0;
    let partialSum = 0;
    let operation = 'none';
    for (let col = 0; col < rows[0].length; col++) {
        const operationField = rows[rows.length - 1][col]
        // console.log('operationField', operationField);
        if (operationField !== ' ' && operationField !== '_') {
            operation = operationField;
        }
        let numString = '';
        for (let row = 0; row < rows.length - 1; row++) {
            if (rows[row][col] === '_') {
                continue;
            }
            numString += rows[row][col];
        }
        if (numString.trim() !== '') {
            // console.log('partial sum', partialSum);
            partialSum = operate(partialSum, numString, operation);
            if (col === rows[0].length - 1) {
                next = true;
            }
        } else {
            next = true;
        }
        if (next) {
            sum += partialSum;
            // console.log('adding: ', partialSum);
            partialSum = 0;
            next = false;
        }
    }
    return sum;
}

function solve_2() {
    const rows = parseForPart2();
    const sum = calculateInColumns(rows);
    console.log('Solution Day 6 Part 2: ', sum);
}

solve_1();

solve_2();