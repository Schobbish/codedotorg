var code;
var lines;
var currentLine = 0;
var names = {};
var continueRunningCode = true;
var verbose = false;
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
    // "for": startFor, // TODO
    "while": startWhile,
    // no do while!!!!!!!!!!
    "else": invalidElse,
    "end": invalidEnd,
    "verbose": toggleVerbosity,
};

function validateName(name) {
    if (name === null) return true;
    if (!isNaN(name) || name === undefined) {
        echo("Error: invalid name " + name);
        exit(1);
        return false;
    } else {
        return true;
    }
}

function readLine(line) {
    if (line === null) return false;
    var cmd = line.split(" ");
    for (var word = 0; word < cmd.length; word++) {
        // sub in variables
        if (cmd[word] === "getX") {
            cmd[word] = getX();
        } else if (cmd[word] === "getY") {
            cmd[word] = getY();
        } else if (cmd[word] === "getDirection") {
            cmd[word] = getDirection();
        } else if (cmd[word][0] === "$") {
            cmd[word] = names[cmd[word].slice(1)];
        } else if (cmd[word].slice(0, 2) === "\\$") {
            // one escaped dollar sign
            cmd[word] = cmd[word].slice(1);
        }
    }
    if (verbose) echo("        run " + cmd.join(" ") + " #" + currentLine);
    // run command
    if (!continueRunningCode) {
        return false;
    } else if (builtins[cmd[0]]) {
        builtins[cmd[0]].apply(null, cmd.slice(1));
        return true;
    } else {
        echo("Error: command not found: " + cmd[0] + " on line " + currentLine);
        exit(127);
        return false;
    }
}

function blockLineReader() {
    var block = [];
    var nest = 0;
    while (true) {
        var line = lines[currentLine];
        if (verbose) echo("            read " + line + " #" + currentLine);
        var firstWord = line.split(" ")[0];
        currentLine++;
        if (firstWord === "end") {
            if (nest <= 0) {
                break;
            } else {
                nest--;
                block.push(line);
            }
        } else if (firstWord === "if" || firstWord === "function" ||
            firstWord === "for" || firstWord === "while") {
            nest++;
            block.push(line);
        } else if (firstWord === "EOF") {
            echo("Error: unexpected EOF");
            exit(1);
            break;
        } else {
            block.push(line);
        }
    }
    return block;
}

function exit(code) {
    if (code) echo(code);
    // stop code asap
    continueRunningCode = false;

    // hide stop buttons
    hideElement("console_b_stop");
    hideElement("turtle_b_stop");
    setStyle("console", "cursor: auto");
    setStyle("console_t_title", "cursor: auto");
    setStyle("turtle", "cursor: auto");
    setStyle("turtle_t_title", "cursor: auto");
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
    setText("console_area", getText("console_area") + args.join(" ") + "\n");
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
                echo("Error: bad operator " + op + " on line " + currentLine);
                exit(1);
                break;
        }
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
        if (verbose) echo("            read " + line + " #" + currentLine);
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
        } else if (firstWord === "if" || firstWord === "function" ||
            firstWord === "for" || firstWord === "while") {
            nest++;
            statement.trueBlock.push(line);
        } else if (firstWord === "EOF") {
            echo("Error: unexpected EOF");
            exit(1);
            break;
        } else {
            statement.trueBlock.push(line);
        }
    }

    // then execute
    if (compute(null, null, a, op, b)) {
        for (var line = 0; line < statement.trueBlock.length; line++) {
            lines.splice(currentLine + line, 0, statement.trueBlock[line]);
        }
    } else {
        for (var line = 0; line < statement.falseBlock.length; line++) {
            lines.splice(currentLine + line, 0, statement.falseBlock[line]);
        }
    }
}

function startFunction(name) {
    if (validateName(name)) {
        names[name] = blockLineReader();
    }
}

function runFunction(name) {
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
    } else {
        echo("Error: function not found: " + name + " on line " + currentLine);
    }
}

/* function startFor(variable, start, end, increment) {
    if (typeof increment === "undefined") increment = 1;
} */

function startWhile(a, op, b) {
    var blockStartLine = currentLine - 1;
    var block = blockLineReader();
    var blockEndLine = currentLine;
    // if condition is met splice the block and run once
    // then splice the whole statement again (recursive in a way)
    if (compute(null, null, a, op, b)) {
        Array.prototype.splice.apply(
            lines, [currentLine, 0].concat(block).concat(
                lines.slice(blockStartLine, blockEndLine)));
    }
}

function invalidElse() {
    echo("Error: unexpected else on line " + currentLine);
    exit(2);
}

function invalidEnd() {
    echo("Error: unexpected end on line " + currentLine);
    exit(2);
}

function toggleVerbosity() {
    verbose = !verbose;
}

function loopyFunction() {
    var line = lines[currentLine];
    currentLine++;
    if (readLine(line) && continueRunningCode) {
        setTimeout(loopyFunction, delay);
    }
}

function runCode() {
    if (verbose) echo("    running code");

    // reset vars
    code = getText("code_area") + "\nEOF";
    lines = code.split("\n");
    currentLine = 0;
    names = {};
    continueRunningCode = true;
    delay = 1;
    verbose = false;
    setText("console_area", "");

    // reset turtle
    penDown();
    moveTo(160, 240);
    turnTo(0);
    penRGB(255, 255, 255, 1);
    dot(340);
    penRGB(0, 0, 0, 1);
    hide();

    // show stop buttons
    showElement("console_b_stop");
    showElement("turtle_b_stop");
    setStyle("console", "cursor: progress");
    setStyle("console_t_title", "cursor: progress");
    setStyle("turtle", "cursor: progress");
    setStyle("turtle_t_title", "cursor: progress");

    // start the loop
    setTimeout(loopyFunction, delay);
}

function tabSwitcher(event) {
    setScreen(event.targetId.split("_")[3]);
}

// make tab bar buttons
var screens = ["start", "code", "console", "turtle", "docs"];
for (var current = 0; current < screens.length; current++) {
    for (var destination = 0; destination < screens.length; destination++) {
        var buttonID = screens[current] + "_tabbar_b_" + screens[destination];
        setStyle(buttonID, "cursor: pointer");
        // no buttons to start screen
        if (screens[destination] !== "start")
            onEvent(buttonID, "click", tabSwitcher);
    }
}

onEvent("console_b_run", "click", function () {
    // do some weird things to make sure the turtle works
    // when console code is run first
    setScreen("turtle");
    show();
    hide();
    setScreen("console");
    runCode();
});
onEvent("turtle_b_run", "click", runCode);

onEvent("console_b_stop", "click", function () {
    exit();
});
onEvent("turtle_b_stop", "click", function () {
    exit();
});

// example programs
onEvent("code_examples", "change", function () {
    switch (getText("code_examples")) {
        case "While FizzBuzz":
            setText("code_area", "var i = 1\n\nfunction fizzBuzz\
\n\nwhile $i <= 100\ncompute mod3 = $i % 3\ncompute mod5 = $i % 5\
\ncompute mod15 = $i % 15\n\nif $mod15 !\necho FizzBuzz\nelse\nif $mod3 !\
\necho Fizz\nelse\nif $mod5 !\necho Buzz\nelse\necho $i\nend\nend\nend\
\n\ncompute i = $i + 1\nend\n\nend\n\nrun fizzBuzz\n");
            break;
        case "Recursion FizzBuzz":
            setText("code_area", "var i = 1\n\nfunction fizzBuzz\
\ncompute mod3 = $i % 3\ncompute mod5 = $i % 5\ncompute mod15 = $i % 15\
\n\nif $mod15 !\necho FizzBuzz\nelse\nif $mod3 !\necho Fizz\nelse\nif $mod5 !\
\necho Buzz\nelse\necho $i\nend\nend\nend\n\nif $i < 100\ncompute i = $i + 1\
\nrun fizzBuzz\nend\nend\n\nrun fizzBuzz\n");
            break;
        case "Grid maker":
            setText("code_area", "# 3x3 grid\n\nfunction turnR\nturnLeft\
\nturnLeft\nturnLeft\nend\n\nfunction turnAroundRight\nrun turnR\nmoveForward\
\nrun turnR\nend\n\nfunction move3\nmoveForward\nmoveForward\nmoveForward\nend\
\n\nfunction squiggle\nrun move3\nrun turnAroundRight\nrun move3\nturnLeft\
\nmoveForward\nturnLeft\nrun move3\nrun turnAroundRight\nrun move3\nend\
\n\nrun squiggle\nrun turnR\nrun squiggle\n\n# return to start\nrun turnR\
\nrun move3\nrun turnR\nrun move3\nrun turnR\n\n# full grid\
\nfunction drawCorner\nturnLeft\nmoveForward\nturnLeft\nmoveForward\nend\
\n\npenUp\nturnLeft\nturnLeft\nmoveForward\nmoveForward\nmoveForward\
\nmoveForward\nmoveForward\nmoveForward\nmoveForward\nmoveForward\nmoveForward\
\nturnLeft\nmoveForward\nmoveForward\nmoveForward\nmoveForward\nmoveForward\
\nmoveForward\nmoveForward\nturnLeft\npenDown\n\nvar c1 = 1\nwhile $c1 <= 32\
\nvar c2 = 1\nwhile $c2 <= $c1\nrun drawCorner\nturnLeft\nturnLeft\
\ncompute c2 = $c2 + 1\nend\nturnLeft\nturnLeft\nturnLeft\nvar c3 = 1\
\nwhile $c3 <= $c1\nmoveForward\ncompute c3 = $c3 + 1\nend\nturnLeft\
\nvar c4 = 1\nwhile $c4 <= $c1\nmoveForward\ncompute c4 = $c4 + 1\nend\
\nmoveForward\ncompute c1 = $c1 + 1\nend\n");
    }
});
