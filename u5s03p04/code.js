speed(100);

/**
 * list of cards
 * @example can import using CSV:
 *  https://quizlet.com/305600676/ap-chemistry-polyatomic-ions-flash-cards/
 */
var cards = [
    {
        term: "Term 1",
        def: "Definition 1"
    }, {
        term: "Term 2",
        def: "Definition 2"
    }, {
        term: "Term 3",
        def: "Definition 3"
    }
];

/** cards allowed per page @constant @default 10 */
var cardsPerPage = 10;
/** indicies of cards on the cards screen */
var cardsDisplayed = [];
/** index of first card displayed */
var firstCardDisplayed;
/** index of last card displayed */
var lastCardDisplayed;
/** index of card being edited */
var editingCard;
/** cards but shuffled for quiz */
var quizOrder = [];
/** index of card being quizzed on */
var currentQuizCard;

// quiz scores
var correctFirstTry = 0;
var totalCorrect = 0;
var skippedCards = 0;
var unknownCards = 0;
/** whether it is the first try for this question */
var firstTry = true;

/** default entry for the term field @constant */
var defaultTerm = "Enter term...";
/** default entry for the definition field @constant */
var defaultDef = "Enter definition...";

/**
 * Shuffles an array!
 * adapted from https://stackoverflow.com/a/6274398
 */
function shuffle(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

/** Puts CSV in the box and stuff and shows the csv screen */
function showCSV() {
    var csv = "";
    for (var i = 0; i < cards.length; i++) {
        csv += cards[i].term;
        csv += ",";
        csv += cards[i].def;
        csv += "\n";
    }
    // trim off trailing newline
    csv = csv.slice(0, -1);
    setScreen("csv");
    setText("csv_t_title", "View/edit CSV");
    setText("csv_a_cards", csv);
}

/**
 * Handles displaying cards on the cards screen
 * The screen can show a max of 11 cards at a time
 * @param {number} start index of first card to display
 * @param {number} end index of last card to display
 */
function showCards(start, end) {
    /** min of cards.length and end + 1 */
    var lastCard = Math.min(cards.length, end + 1);
    firstCardDisplayed = start;
    lastCardDisplayed = lastCard - 1;

    setScreen("cards");
    // delete cards on screen
    for (var i = 0; i < cardsDisplayed.length; i++) {
        deleteElement("cards_term" + cardsDisplayed[i]);
        deleteElement("cards_edit" + cardsDisplayed[i]);
        deleteElement("cards_del" + cardsDisplayed[i]);
    }
    cardsDisplayed = [];

    // add new cards
    for (var i = start; i < lastCard; i++) {
        cardsDisplayed.push(i);
        var y = (i - firstCardDisplayed) * 25 + 54;

        var termID = "cards_term" + i;
        textLabel(termID, cards[i].term);
        setStyle(termID, "margin: 0px; line-height: 1; overflow: hidden; font-family: Verdana, Geneva, sans-serif; font-size: 12px; padding: 2px 15px 0px 15px; height: 15px; position: absolute; left: 20px; text-align: left; width: 235px;");
        setProperty(termID, "y", y);

        var editID = "cards_edit" + i;
        image(editID, "icon://fa-pencil-square-o");
        setStyle(editID, "height: 20px; width: 20px; position: absolute; left: 260px; margin: 0px; object-fit: contain;");
        setProperty(editID, "icon-color", "#4d575f");
        setProperty(editID, "y", y - 1);

        var delID = "cards_del" + i;
        image(delID, "icon://fa-trash-o");
        setStyle(delID, "height: 20px; width: 20px; position: absolute; left: 280px; margin: 0px; object-fit: contain;");
        setProperty(delID, "icon-color", "#4d575f");
        setProperty(delID, "y", y - 1);

        // add event listener for the delete button
        onEvent(delID, "click", function (event) {
            cards.splice(event.targetId.slice(9), 1);
            showCards(0, cardsPerPage - 1);
        });

        // add event listener for the edit button
        onEvent(editID, "click", function (event) {
            editCard(event.targetId.slice(10));
        });
    }

    // update the "showing" text
    setText("cards_t_showing", "showing " + (start + 1) + " to " + lastCard + " of " + cards.length + " cards");

    // hide quiz button if no cards
    if (!cards.length) {
        hideElement("cards_b_quiz");
    } else {
        showElement("cards_b_quiz");
    }
}

/**
 * Edit or create a card.
 * @param {number} [i] Index of card to edit.
 *  If not given, default values will be given (to create a new card)
 */
function editCard(i) {
    editingCard = i;
    if (editingCard === undefined) {
        setText("create_a_term", defaultTerm);
        setText("create_a_def", defaultDef);
    } else {
        setText("create_a_term", cards[i].term);
        setText("create_a_def", cards[i].def);
    }
    setScreen("create");
}

/** Shows the question based on the value of currentQuizCard. */
function showQuestion() {
    setScreen("quiz");
    setText("quiz_a_def", quizOrder[currentQuizCard].def);
    setText("quiz_t_progress", (currentQuizCard + 1) + "/" + quizOrder.length)
}

/** Check answer of current quiz card and show the right/wrong screen. */
function checkAnswer() {
    var ans = getText("quiz_a_ans").trim().toLowerCase();
    setText("quiz_a_ans", "");
    if (quizOrder[currentQuizCard].term.trim().toLowerCase() === ans) {
        setScreen("right");
    } else {
        setScreen("wrong");
        // reset screen
        hideElement("wrong_t_ans");
        setText("wrong_t_ans", quizOrder[currentQuizCard].term);
        showElement("wrong_b_reveal");
        showElement("wrong_b_skip");
        showElement("wrong_b_retry");
        hideElement("wrong_b_next");
    }
}

/** Show the next question (increments currentQuizCard). */
function nextQuestion() {
    // check if last card
    if (currentQuizCard >= quizOrder.length - 1) {
        setScreen("finish");
        setText("finish_t_firstTry", "Correct answers (first try): " + correctFirstTry + " (" + (Math.round(correctFirstTry * 100 / quizOrder.length)) + "%)");
        setText("finish_t_totalCorrect", "Total correct answers: " + totalCorrect + " (" + (Math.round(totalCorrect * 100 / quizOrder.length)) + "%)");
        setText("finish_t_skipped", "Skipped cards: " + skippedCards + " (" + (Math.round(skippedCards * 100 / quizOrder.length)) + "%)");
        setText("finish_t_unknown", "Unknown answers: " + unknownCards + " (" + (Math.round(unknownCards * 100 / quizOrder.length)) + "%)");
        setText("finish_t_total", "Total cards: " + quizOrder.length);
    } else {
        currentQuizCard++;
        firstTry = true;
        showQuestion();
    }
}


/**
 * welcome screen
 */
onEvent("welcome_b_newCard", "click", function () {
    // remove cards
    cards = [];
    editCard();
});
onEvent("welcome_b_csv", "click", function () {
    showCSV();
    setText("csv_t_title", "Import CSV");
});

/**
 * csv screen
 */
// discard any changes and go to cards screen
onEvent("csv_b_cancel", "click", function () {
    showCards(0, cardsPerPage - 1);
});
// parse csv into cards
onEvent("csv_b_save", "click", function () {
    var csv = getText("csv_a_cards");
    var lines = csv.split("\n");
    cards = [];

    for (var i = 0; i < lines.length; i++) {
        // skip if empty line
        if (lines[i] != "") {
            // fancy regex that I can't use bc not enough support: /(?<!\\),/
            var cardComponents = lines[i].split(",");
            // make sure cardComponents has at least 2 items so no undefined stuff
            for (var j = cardComponents.length; j < 2; j++) {
                cardComponents.push("");
            }
            cards.push({
                term: cardComponents[0],
                def: cardComponents.slice(1).join(",")
            });
        }
    }
    showCards(0, cardsPerPage - 1);
});

/**
 * create screen
 */
// clear term field when clicked with default value
onEvent("create_a_term", "click", function () {
    if (getText("create_a_term") === defaultTerm) {
        setText("create_a_term", "");
    }
});
// clear def field when clicked with default value
onEvent("create_a_def", "click", function () {
    if (getText("create_a_def") === defaultDef) {
        setText("create_a_def", "");
    }
});
// save card
onEvent("create_b_done", "click", function () {
    // use editingCard to determine whether to add new card or change a card
    if (editingCard === undefined) {
        cards.push({
            term: getText("create_a_term"),
            def: getText("create_a_def")
        });
    } else {
        cards[editingCard] = {
            term: getText("create_a_term"),
            def: getText("create_a_def")
        };
    }
    editingCard = undefined;
    showCards(0, cardsPerPage - 1);
});

/**
 * cards screen
 */
// make new card
onEvent("cards_b_newCard", "click", function () {
    // make sure event is not passed to editCard
    editCard();
});
// option screen
onEvent("cards_b_opt", "click", function () {
    setScreen("opt");
});
// start quiz
onEvent("cards_b_quiz", "click", function () {
    quizOrder = shuffle(cards.slice(0));
    currentQuizCard = 0;
    correctFirstTry = 0;
    totalCorrect = 0;
    skippedCards = 0;
    unknownCards = 0;
    showQuestion();
});
// back one page of cards
onEvent("cards_i_back", "click", function () {
    // only if the first card which would get displayed is gt 0
    if (firstCardDisplayed - cardsPerPage >= 0) {
        showCards(firstCardDisplayed - cardsPerPage, firstCardDisplayed - 1);
    }
});
// next page of cards
onEvent("cards_i_next", "click", function () {
    // only if the last card displayed is less than the number of cards
    if (lastCardDisplayed < cards.length - 1) {
        showCards(lastCardDisplayed + 1, lastCardDisplayed + cardsPerPage);
    }
});

/**
 * options screen
 */
// sort cards
onEvent("opt_b_sort", "click", function () {
    // taken from an example on the MDN web docs for Array.prototype.sort()
    cards.sort(function (a, b) {
        var termA = a.term.toUpperCase(); // ignore upper and lowercase
        var termB = b.term.toUpperCase(); // ignore upper and lowercase
        if (termA < termB) {
            return -1;
        }
        if (termA > termB) {
            return 1;
        }

        // terms must be equal
        return 0;
    });
    showCards(0, cardsPerPage - 1);
});
// swap cards
onEvent("opt_b_swap", "click", function () {
    for (var i = 0; i < cards.length; i++) {
        var tempDef = cards[i].def;
        cards[i].def = cards[i].term;
        cards[i].term = tempDef;
    }
    showCards(0, cardsPerPage - 1);
});
// view csv
onEvent("opt_b_csv", "click", showCSV);
// delete all
onEvent("opt_b_delAll", "click", function () {
    setScreen("del");
});
// go back
onEvent("opt_b_back", "click", function () {
    showCards(firstCardDisplayed, lastCardDisplayed);
})

/**
 * delete screen
 */
// mouse over del, show red background
onEvent("del_b_del", "mouseover", function () {
    setProperty("del", "background-color", "#ff0000");
});
// mouse off del, show black background
onEvent("del_t_catch", "mouseover", function () {
    setProperty("del", "background-color", "#000000");
});
// delete call cards
onEvent("del_b_del", "click", function () {
    setScreen("welcome");
    cards = [];
});
// go back to previous screen
onEvent("del_b_cancel", "click", function () {
    setScreen("opt")
});

/**
 * quiz screen
 */
// submit answer
onEvent("quiz_b_submit", "click", checkAnswer);
// can also press enter
onEvent("quiz_a_ans", "keydown", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
// quit quiz
onEvent("quiz_b_quit", "click", function () {
    setScreen("quit");
});

/**
 * quit screen
 */
// mouse over quit, show red background
onEvent("quit_b_quit", "mouseover", function () {
    setProperty("quit", "background-color", "#ff0000");
});
// mouse off quit, show black background
onEvent("quit_t_catch", "mouseover", function () {
    setProperty("quit", "background-color", "#000000");
});
// quit to the cards screen
onEvent("quit_b_quit", "click", function () {
    showCards(0, cardsPerPage - 1);
});
// go back to the question
onEvent("quit_b_cancel", "click", showQuestion);

/**
 * right screen
 */
// advance to next question
onEvent("right_b_next", "click", function () {
    totalCorrect++;
    if (firstTry) {
        correctFirstTry++;
    }
    nextQuestion();
});
// can also press enter!
onEvent("right", "keydown", function (event) {
    if (event.key === "Enter") {
        totalCorrect++;
        if (firstTry) {
            correctFirstTry++;
        }
        nextQuestion();
    }
});

/**
 * wrong screen
 */
// reveal answer and change buttons
onEvent("wrong_b_reveal", "click", function () {
    unknownCards++;
    showElement("wrong_t_ans");
    hideElement("wrong_b_reveal");
    hideElement("wrong_b_skip");
    hideElement("wrong_b_retry");
    showElement("wrong_b_next");
});
// skip card
onEvent("wrong_b_skip", "click", function () {
    skippedCards++;
    nextQuestion();
});
// retry card
onEvent("wrong_b_retry", "click", function () {
    firstTry = false;
    showQuestion();
});
// advance to next question
onEvent("wrong_b_next", "click", nextQuestion);

/**
 * finish screen
 */
// go back to cards screen
onEvent("finish_b_exit", "click", function () {
    showCards(0, cardsPerPage - 1);
});
