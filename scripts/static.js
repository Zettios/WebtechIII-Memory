let closedCardColorPicker;
let openCardColorPicker;
let matchedCardColorPicker;

let defaultClosedColor = "#90EE90";
let defaultOpenColor = "#013220";
let defaultMatchedColor = "#6a0dad";

document.querySelector('.start_button').onclick = initialiseGame;

document.addEventListener("DOMContentLoaded", function() {

    !async function(){
        let data = await fetch("https://dog.ceo/api/breeds/image/random/3'")
            .then((response) => response.json())
            .then(data => { return data; })
            .catch(error => { console.error(error); });

        console.log(data.message);
    }();

    let cards = document.querySelectorAll('.memory_cards');
    for (let i = 0; i < cards.length; i++) {
        cards[i].id = "card_" + (i+1);
        cards[i].addEventListener("touchstart", cardHandler, false);
        cards[i].onclick = cardHandler;
    }

    closedCardColorPicker = document.querySelector('#closed_card_color');
    closedCardColorPicker.value = defaultClosedColor;
    closedCardColorPicker.addEventListener("change", updateAll, false);

    openCardColorPicker = document.querySelector('#open_card_color');
    openCardColorPicker.value = defaultOpenColor;
    openCardColorPicker.addEventListener("change", updateAll, false);

    matchedCardColorPicker = document.querySelector('#matched_cards_color');
    matchedCardColorPicker.value = defaultMatchedColor;
    matchedCardColorPicker.addEventListener("change", updateAll, false);

    updateAll();
});

function cardHandler(e) {
    if (e.target.classList.contains("card_closed")) {
        e.target.classList.add('card_open')
        e.target.classList.remove('card_closed')
        e.target.style.background
    } else if (e.target.classList.contains("card_open")) {
        // e.target.classList.add('card_closed')
        // e.target.classList.remove('card_open')
        console.log('todo');
    } else {
        console.log('todo');
    }

    updateAll();
}

function updateAll() {
    let closedCards = document.querySelectorAll('.card_closed');
    let openCards = document.querySelectorAll('.card_open');
    let matchedCards = document.querySelectorAll('.card_matched');


    for (let i = 0; i < closedCards.length; i++) {
        closedCards[i].style.background = closedCardColorPicker.value;
    }

    for (let i = 0; i < openCards.length; i++) {
        openCards[i].style.background = openCardColorPicker.value;
    }

    for (let i = 0; i < matchedCards.length; i++) {
        matchedCards[i].style.background = matchedCardColorPicker.value;
    }
}

function resetCards() {
    let cards = document.querySelectorAll('.memory_cards');
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains("card_open")) {
            cards[i].classList.add('card_closed')
            cards[i].classList.remove('card_open')
        }
    }
    updateAll();
}

function initialiseGame() {
    console.log('e');
    resetCards();

}