//https://studio.code.org/projects/applab/BOljhCcxJA0uHsCIj9X4Pd4BA9gGci5XB4F5WeCWJXI/view
var code;
var lines;
var currentLine = 0;
var names = {};
var builtins = {
    "moveForward": moveForward,
    "moveBackward": moveBackward,
    "move": move,
    "moveTo": moveTo,
    "dot": dot,
    "turnRight": turnRight,
    "turnLeft": turnLeft,
    "turnTo": turnTo,
    "arcRight": arcRight,
    "arcLeft": arcLeft,
    "getX": getX,
    "getY": getY,
    "getDirection": getDirection,
    "penUp": penUp,
    "penDown": penDown,
    "penWidth": penWidth,
    "penColor": penColor,
    "penRGB": penRGB,
    "show": show,
    "hide": hide,

    "exit": exit,
    "EOF": exit,
    "speed": speed,
    "var": declareVar,
    "randomVar": randVar,
    "echo": echo,
    "#": comment,
    "": comment,
    "compute": compute,
    "if": startIf,
    "function": startFunction,
    "run": runFunction,
    // "for": startFor,
    // "while": startWhile,
    "else": invalidElse,
    "end": invalidEnd,
};

function validateName(name) {
    if (name === null) return true;
    if (!isNaN(name) || name === undefined) {
        console.log("Error: invalid name " + name);
        exit(1);
        return false;
    } else {
        return true;
    }
}

function readLine(line) {
    if (line === null) return false;
    var cmd = line.split(" ");
    for (var i = 0; i < cmd.length; i++) {
        // sub in variables
        if (cmd[i] === "getX") {
            cmd[i] = getX();
        } else if (cmd[i] === "getY") {
            cmd[i] = getY();
        } else if (cmd[i] === "getDirection") {
            cmd[i] = getDirection();
        } else if (cmd[i][0] === "$") {
            cmd[i] = names[cmd[i].slice(1)];
        } else if (cmd[i].slice(0, 2) === "\\$") {
            // one escaped dollar sign
            cmd[i] = cmd[i].slice(1);
        }
    }
    // console.log("                                    run " + cmd.join(" "));
    // run command
    if (!runCode) {
        return false;
    } else if (builtins[cmd[0]]) {
        builtins[cmd[0]].apply(null, cmd.slice(1));
        return true;
    } else {
        console.log("Error: command not found: " + cmd[0] + " on line " + currentLine);
        exit(127);
        return false;
    }
}

function blockLineReader() {
    var block = [];
    var nest = 0;
    while (true) {
        var line = lines[currentLine];
        // console.log([line, nest])
        var firstWord = line.split(" ")[0];
        currentLine++;
        if (firstWord === "end") {
            if (nest <= 0) {
                break;
            } else {
                nest--;
                block.push(line);
            }
        } else if (firstWord === "if" || firstWord === "function" || firstWord === "for" || firstWord === "while") {
            nest++;
            block.push(line);
        } else if (firstWord === "EOF") {
            console.log("Error: unexpected EOF");
            exit(1);
            break;
        } else {
            block.push(line);
        }
    }
    return block;
}

var runCode = true;
function exit(code) {
    if (code) console.log(code);
    runCode = false;
}

var delay = 1;
function speed(value) {
    delay = 1001 - value * 10;
}

function declareVar(name, equals, value) {
    if (validateName(name)) {
        names[name] = value;
    }
}

function randVar(name, equals, low, high) {
    if (validateName(name)) {
        if (name) {
            names[name] = randomNumber(low, high);
        } else {
            return randomNumber(low, high);
        }
    }
}

function echo() {
    // https://stackoverflow.com/a/6396066 alt for ...args
    var args = Array.prototype.slice.call(arguments, 0);
    console.log(args.join(" "));
}

function comment() {
    // does nothing
}

function compute(name, equals, a, op, b) {
    if (validateName(name)) {
        // check if a and b are numbers and convert if so
        if (!isNaN(a)) a = a * 1;
        if (!isNaN(b)) b = b * 1;

        var ans;
        switch (op) {
            case "+": ans = a + b; break;
            case "-": ans = a - b; break;
            case "*": ans = a * b; break;
            case "/": ans = a / b; break;
            case "%": ans = a % b; break;
            case "==": ans = a == b; break;
            case "!=": ans = a != b; break;
            case "===": ans = a === b; break;
            case "!==": ans = a !== b; break;
            case ">": ans = a > b; break;
            case ">=": ans = a >= b; break;
            case "<": ans = a < b; break;
            case "<=": ans = a <= b; break;
            case "&&": ans = a && b; break;
            case "||": ans = a || b; break;
            case "!": ans = !a; break;
            case "&": ans = a & b; break;
            case "|": ans = a | b; break;
            case "~": ans = ~a; break;
            case "<<": ans = a << b; break;
            case ">>": ans = a >> b; break;
            case ">>>": ans = a >>> b; break;
            default:
                console.log("Error: bad operator " + op + " on line " + currentLine);
                exit(1);
                break;
        }
        // console.log([a, op, b, ans]);
        if (name) {
            names[name] = ans;
        } else {
            return ans;
        }
    }
}

function startIf(a, op, b) {
    // collect the block's statements
    var statement = {
        trueBlock: [],
        falseBlock: []
    };
    // modified blockLineReader() because of the else statement
    var nest = 0;
    while (true) {
        var line = lines[currentLine];
        // console.log([line, nest])
        var firstWord = line.split(" ")[0];
        currentLine++;
        if (firstWord === "end") {
            if (nest <= 0) {
                break;
            } else {
                nest--;
                statement.trueBlock.push(line);
            }
        } else if (firstWord === "else" && nest <= 0) {
            statement.falseBlock = blockLineReader();
            break;
        } else if (firstWord === "if" || firstWord === "function" || firstWord === "for" || firstWord === "while") {
            nest++;
            statement.trueBlock.push(line);
        } else if (firstWord === "EOF") {
            console.log("Error: unexpected EOF");
            exit(1);
            break;
        } else {
            statement.trueBlock.push(line);
        }
    }

    // then execute
    if (compute(null, null, a, op, b)) {
        for (var i = 0; i < statement.trueBlock.length; i++) {
            lines.splice(currentLine + i, 0, statement.trueBlock[i]);
        }
    } else {
        for (var i = 0; i < statement.falseBlock.length; i++) {
            lines.splice(currentLine + i, 0, statement.falseBlock[i]);
        }
    }
}

function startFunction(name) {
    if (validateName(name)) {
        names[name] = blockLineReader();
    }
}

function runFunction(name) {
    // console.log(currentLine)
    var args = Array.prototype.slice.call(arguments, 0);
    if (names[name]) {
        for (var line = 0; line < names[name].length; line++) {
            var cmd = names[name][line].split(" ");
            // sub in arguments
            for (var word = 0; word < cmd.length; word++) {
                if (cmd[word][0] === "$" && !isNaN(cmd[word].slice(1))) {
                    cmd[word] = args[parseInt(cmd[word].slice(1))];
                } else if (cmd[word] === "$#") {
                    cmd[word] = args.length - 1;
                }
            }
            lines.splice(currentLine + line, 0, cmd.join(" "));
        }
        // console.log(lines)
    } else {
        console.log("Error: function not found: " + name + " on line " + currentLine);
    }
}

function invalidElse() {
    console.log("Error: unexpected else on line " + currentLine);
    exit(2);
}

function invalidEnd() {
    console.log("Error: unexpected end on line " + currentLine);
    exit(2);
}

function loopyFunction() {
    var line = lines[currentLine];
    currentLine++;
    if (readLine(line) && runCode) {
        setTimeout(loopyFunction, delay);
    }
}
onEvent("run", "click", function () {
    console.log("                                  running code");

    // reset vars
    code = getText("code") + "\nEOF";
    lines = code.split("\n");
    currentLine = 0;
    names = {};
    runCode = true;
    delay = 1;

    // reset turtle
    penDown();
    moveTo(160, 240);
    turnTo(0);
    penRGB(255, 255, 255, 1);
    dot(340);
    penRGB(0, 0, 0, 1);
    hide();

    setTimeout(loopyFunction, delay);
});
