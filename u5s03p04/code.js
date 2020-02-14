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

/** number of cards on the cards screen */
var numberOfCards = 0;

/**
 * Handles displaying cards on the cards screen
 * The screen can show a max of 11 cards at a time
 * @param {number} start index of first card to display
 * @param {number} end index of last card to display
 */
function showCards(start, end) {
    setScreen("cards");
    // delete cards on screen
    for (var i = 0; i < numberOfCards; i++) {
        deleteElement("cards_term" + i);
        deleteElement("cards_edit" + i);
        deleteElement("cards_del" + i);
    }
    numberOfCards = 0;

    // add new cards
    /** min of cards.length and end + 1 */
    var lastCard = Math.min(cards.length, end + 1);
    for (var i = start; i < lastCard; i++) {
        numberOfCards++;
        var y = i * 25 + 50;

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
            showCards(0, 9);
        });
    }

    // update the "showing" text
    setText("cards_t_showing", "showing " + (start+1) + " to " + lastCard + " of " + cards.length + " cards");
}

// welcome screen
onEvent("welcome_b_newCard", "click", function () {
    // initialize card list
    // cards = [];

    setScreen("create");
});

// create screen
onEvent("create_b_done", "click", function () {
    // save the card
    cards.push({
        term: getText("create_a_term"),
        def: getText("create_a_def")
    });

    showCards(0, 9);
});
