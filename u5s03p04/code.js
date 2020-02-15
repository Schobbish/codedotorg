speed(100);

/** list of cards */
var cards = [
    {
        term: "example",
        def: "a thing characteristic of its kind or illustrating a general rule"
    }, {
        term: "one",
        def: "the first cardinal number"
    }, {
        term: "two",
        def: "number after one"
    }, {
        term: "three",
        def: "number after two"
    }, {
        term: "four",
        def: "number after three"
    }, {
        term: "five",
        def: "number after four"
    }, {
        term: "six",
        def: "number after five"
    }, {
        term: "seven",
        def: "number after six"
    }, {
        term: "eight",
        def: "number after seven"
    }, {
        term: "nine",
        def: "number after eight"
    }, {
        term: "ten",
        def: "number after nine"
    }
];

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
/** cards allowed per page @constant @default 10 */
var cardsPerPage = 10;

// quiz scores
var correctFirstTry = 0;
var totalCorrect = 0;
var skippedCards = 0;
var unknownCards = 0;
/** whether it is the first try for this question */
var firstTry = true;

/** default entry for the term field */
var defaultTerm = "Enter term...";
/** default entry for the definition field */
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
        var y = (i - firstCardDisplayed) * 25 + 50;

        var termID = "cards_term" + i;
        textLabel(termID, cards[i].term);
        setStyle(termID, "margin: 0px; line-height: 1; font-family: Verdana, Geneva, sans-serif; font-size: 13px; padding: 2px 15px; height: 20px; position: absolute; left: 20px; text-align: left; width: 235px;");
        setProperty(termID, "y", y);

        var editID = "cards_edit" + i;
        image(editID, "icon://fa-pencil-square-o");
        setStyle(editID, "height: 20px; width: 20px; position: absolute; left: 260px; margin: 0px; object-fit: contain;");
        setProperty(editID, "icon-color", "#4d575f");
        setProperty(editID, "y", y);

        var delID = "cards_del" + i;
        image(delID, "icon://fa-trash-o");
        setStyle(delID, "height: 20px; width: 20px; position: absolute; left: 280px; margin: 0px; object-fit: contain;");
        setProperty(delID, "icon-color", "#4d575f");
        setProperty(delID, "y", y);

        // add event listener for the delete button
        onEvent(delID, "click", function (event) {
            console.log("delete card " + event.targetId.slice(9));
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
}

/** Check answer of current quiz card and show the right/wrong screen. */
function checkAnswer() {
    var ans = getText("quiz_a_ans");
    setText("quiz_a_ans", "");
    if (quizOrder[currentQuizCard].term === ans) {
        setScreen("right");
    } else {
        setScreen("wrong");
        // reset screen
        hideElement("wrong_a_ans");
        setText("wrong_a_ans", quizOrder[currentQuizCard].term);
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
        setText("finish_t_firstTry", "Correct answers (first try): " + correctFirstTry);
        setText("finish_t_totalCorrect", "Total correct answers: " + totalCorrect);
        setText("finish_t_skipped", "Skipped cards: " + skippedCards);
        setText("finish_t_unknown", "Unknown answers: " + unknownCards);
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
    // initialize card list
    // cards = [];

    editCard();
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
// delete all cards
onEvent("cards_b_delAll", "click", function () {
    setScreen("del");
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
    showCards(firstCardDisplayed, lastCardDisplayed);
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
    showElement("wrong_a_ans");
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
onEvent("finish_b_quit", "click", function () {
    showCards(0, cardsPerPage - 1);
});
