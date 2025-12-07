const INPUT_FILE = 'input-day-7.txt';

const {readFileSync} = require('../utils/file-reader')

function solve_1() {
    let splits = 0;
    const input = readFileSync(INPUT_FILE);
    const lines = input.split('\n');
    const beamSet = new Set();
    for (const line of lines) {
        const beamBuffer = [];
        const fields = Array.from(line);
        for (let pos = 0; pos < fields.length; pos++) {
            if (fields[pos] === 'S') {
                beamSet.add(pos);
                continue;
            }
            if (fields[pos] === '^' && beamSet.has(pos)) {
                splits++;
                beamSet.delete(pos)
                if (pos > 0) {
                    beamBuffer.push(pos - 1);
                }
                if (pos < fields.length - 1) {
                    beamBuffer.push(pos + 1);
                }
            }
            if (beamBuffer.length > 0) {
                beamBuffer.forEach(beam => {
                    beamSet.add(beam);
                });
            }
        }
    }
    console.log('Solution Day 7 Part 1: ', splits);
}

function solve_2() {
    const input = readFileSync(INPUT_FILE);
    const lines = input.split('\n');
    const buffer = Array.from(lines[0]).map((line) => {
        if (line === 'S') {
            return 1;
        } else {
            return 0;
        }
    });
    for (const line of lines) {
        const fields = Array.from(line);
        for (let pos = 1; pos < fields.length; pos++) {
            if (fields[pos] === '^') {
                const currentBeam = buffer[pos];
                buffer[pos - 1] += currentBeam;
                buffer[pos + 1] += currentBeam;
                buffer[pos] = 0;
            }
        }
    }
    console.log('Solution Day 7 Part 2: ', buffer.reduce((a, b) => a + b, 0));
}

solve_1();
solve_2();