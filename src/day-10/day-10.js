const INPUT_FILE = 'input-day-10.txt'; // oder dein Testfile

const { readFileSync } = require('../utils/file-reader');
const { init } = require('z3-solver');

function parseInput() {
    const lines = readFileSync(INPUT_FILE)
        .trim()
        .split('\n')
        .filter(line => line.trim().length > 0);

    const targetRegex = /\[([.#]+)]/;
    const buttonRegex = /\(([^)]+)\)/g;

    const machines = [];

    for (const line of lines) {
        const targetMatch = line.match(targetRegex);
        if (!targetMatch) {
            continue;
        }

        const targetStr = targetMatch[1];
        const numLights = targetStr.length;

        let targetMask = 0;
        for (let i = 0; i < numLights; i++) {
            if (targetStr[i] === '#') {
                targetMask |= (1 << i);
            }
        }

        const buttons = [];
        for (const match of line.matchAll(buttonRegex)) {
            const inside = match[1].trim();
            if (!inside) continue;

            const indices = inside.split(',').map(n => parseInt(n, 10));

            let mask = 0;
            for (const idx of indices) {
                mask |= (1 << idx);
            }
            buttons.push(mask);
        }

        machines.push({ numLights, targetMask, buttons });
    }

    return machines;
}

function minPressesForMachine(numLights, buttons, targetMask) {
    const maxState = 1 << numLights;

    const dist = new Array(maxState).fill(-1);
    const queue = new Array(maxState);
    let head = 0;
    let tail = 0;

    const startState = 0;
    dist[startState] = 0;
    queue[tail++] = startState;

    while (head < tail) {
        const state = queue[head++];

        if (state === targetMask) {
            return dist[state];
        }

        for (const btn of buttons) {
            const next = state ^ btn;
            if (dist[next] === -1) {
                dist[next] = dist[state] + 1;
                queue[tail++] = next;
            }
        }
    }

    return Infinity;
}

function solve_1() {
    const machines = parseInput();

    let total = 0;
    machines.forEach((m, idx) => {
        const presses = minPressesForMachine(m.numLights, m.buttons, m.targetMask);
        total += presses;
    });

    console.log('Solution Day 10 Part 1:', total);
}

async function solve_2_z3() {
    const { Context } = await init();
    let result = 0;

    const input = readFileSync(INPUT_FILE)
        .trim()
        .split('\n')
        .filter(x => x.length > 0);

    for (const line of input) {
        const parts = line.split(' ');
        parts.shift();
        const requirement = parts.pop().slice(1, -1).split(',').map(Number);

        const buttons = parts.map(p =>
            p.slice(1, -1).split(',').map(Number)
        );

        const { Int, Optimize } = Context('machine');
        const solver = new Optimize();

        const variables = [];
        for (let j = 0; j < buttons.length; j++) {
            const v = Int.const(`x${j}`);
            solver.add(v.ge(0));
            variables.push(v);
        }

        for (let i = 0; i < requirement.length; i++) {
            let expr = Int.val(0);
            for (let j = 0; j < buttons.length; j++) {
                if (buttons[j].includes(i)) {
                    expr = expr.add(variables[j]);
                }
            }
            solver.add(expr.eq(Int.val(requirement[i])));
        }

        let sum = Int.val(0);
        for (const v of variables) sum = sum.add(v);
        solver.minimize(sum);

        if ((await solver.check()) === 'sat') {
            const model = solver.model();
            result += parseInt(model.eval(sum).toString());
        }
    }

    console.log('Solution Day 10 Part 2:', result);
}


solve_1();
solve_2_z3();




