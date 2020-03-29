// global variable for deck, dealerHand and playerHand
// start: shuffle logic, cards get popped off

var deck = [];
var dHand = [];
var pHand = [];

var backCard = "";
var backToggle = 0;
var suits = ["hearts", "diamonds", "clubs", "spades"];
// make 13 cards for each
// one loop monitors which suit, another loop for each card

var dealButton = document.getElementById('deal-button');
var hitButton = document.getElementById('hit-button');
var standButton = document.getElementById('stand-button');
var dealerHand = document.getElementById('dealer-hand');
var playerHand = document.getElementById('player-hand');
var dealerPoints = document.getElementById('dealer-points');
var playerPoints = document.getElementById('player-points');
var message = document.getElementById('message');

function makeDeck(){
    hitButton.setAttribute('style', "display: inline-block");
    standButton.setAttribute('style', 'display: inline-block')
    suits.forEach(function(element){
        var imgCode = '';
        switch(element){
            case "hearts":
                imgCode = "hearts";
                break;
            case "diamonds":
                imgCode = "diamonds";
                break;
            case "spades":
                imgCode = "spades";
                break;
            case "clubs":
                imgCode = "clubs";
                break;
        }
    
        for (var i = 1; i < 14; i++){
            var faceValueCard = "";
            var cardValue;
            switch(i){
                case 1: // ACE
                    faceValueCard = "A";
                    cardValue = "ace";
                    cardPoints = 11;
                    break
                case 11:
                    faceValueCard = "J";
                    cardValue = "jack";
                    cardPoints = 10;
                    break;
                case 12:
                    faceValueCard = "Q";
                    cardValue = "queen";
                    cardPoints = 10;
                    break;
                case 13:
                    faceValueCard = "K";
                    cardValue = "king";
                    cardPoints = 10;
                    break;
                default:
                    if (element == "hearts"){
                        faceValueCard = ""
                    } else if (element == "spades"){
                        faceValueCard = ""
                    } else if (element == "diamonds"){
                        faceValueCard = ""
                    } else if (element == "clubs"){
                        faceValueCard = ""
                    }
                    cardValue = i;
                    cardPoints = i;
            };
    
            var imgURLPath = "images/" + cardValue + "_of_" + imgCode + ".png";
            card = {
                suit: element,
                faceCard: faceValueCard,
                cardValue: i,
                points: cardPoints,
                imgURL: imgURLPath
            };
            deck.push(card);
        };
    });
};

// Shuffle the deck prior to dealing
function shuffleDeck() {
	for (let i = 0; i < 1000; i++){
		let location1 = Math.floor((Math.random() * deck.length));
		let location2 = Math.floor((Math.random() * deck.length));
		let tmp = deck[location1];
		deck[location1] = deck[location2];
		deck[location2] = tmp;
	};
};

// Deal function
function dealHand(){
    if(dHand.length == 0){
        dHand.push(deck.pop());
        dHand.push(deck.pop());
        pHand.push(deck.pop());
        pHand.push(deck.pop());
    } else {
        return alert("The hand has already been dealt.");
    }
}

// Display the initial cards in the deck
function displayCards(){
    if(pHand.length < 3){
        for(let i = 0; i < dHand.length; i++){
            if(i == 0){
                var img = document.createElement('img');
                img.setAttribute('src', dHand[i].imgURL);
                dealerHand.appendChild(img);
            } else {
                backCard = dHand[i].imgURL;
                backToggle = 1;
                var img = document.createElement('img');
                img.setAttribute('src', "images/cardBack.png");
                img.setAttribute('id', "backcard");
                dealerHand.appendChild(img);
            }
        }
        for(let i = 0; i < pHand.length; i++){
            var img = document.createElement('img');
            img.setAttribute('src', pHand[i].imgURL)
            playerHand.appendChild(img);
        }
    }
}

// calculate score to determine next move
function score(){
    if(calculatePointsPlayer() > 21){
        hitButton.setAttribute('style', "display: none");
        standButton.setAttribute('style', "display: none");
        message.setAttribute('style', 'display: inline-block');
        message.innerText = "Bust! You lose...";
        dealButton.setAttribute('style', "display: inline-block");
    } else if (calculatePointsPlayer() > calculatePointsDealer()){
        hitButton.setAttribute('style', "display: none");
        standButton.setAttribute('style', "display: none");
        message.setAttribute('style', 'display: inline-block');
        message.innerText = "You Win!!!";
        dealButton.setAttribute('style', "display: inline-block");
    } else if (calculatePointsDealer() > 21){
        hitButton.setAttribute('style', "display: none");
        standButton.setAttribute('style', "display: none");
        message.setAttribute('style', 'display: inline-block');
        message.innerText = "Dealer Bust! You Win!!!";
        dealButton.setAttribute('style', "display: inline-block");
    } else if (calculatePointsDealer() > calculatePointsPlayer()){
        hitButton.setAttribute('style', "display: none");
        standButton.setAttribute('style', "display: none");
        message.setAttribute('style', 'display: inline-block');
        message.innerText = "Dealer wins...";
        dealButton.setAttribute('style', "display: inline-block");
    } else {
        hitButton.setAttribute('style', "display: none");
        standButton.setAttribute('style', "display: none");
        message.setAttribute('style', 'display: inline-block');
        message.innerText = "Push...";
        dealButton.setAttribute('style', "display: inline-block");
    }
}

// insert card into deck after hit button is pressed
function hit(){
    if(calculatePointsPlayer() < 21){
        pHand.push(deck.pop());
        var img = document.createElement('img');
        i = pHand.length - 1;
        img.setAttribute('src', pHand[i].imgURL)
        playerHand.appendChild(img);
        calculatePointsPlayer();
        if(calculatePointsPlayer() > 21){
            score();
        }
    }
}

function stand(){
    while(calculatePointsDealer() < 17){
        var replace = document.getElementById('backcard');
        replace.setAttribute('src', backCard);
        dealerHand.appendChild(replace);
        dHand.push(deck.pop());
        var img = document.createElement('img');
        i = dHand.length - 1;
        img.setAttribute('src', dHand[i].imgURL)
        dealerHand.appendChild(img);
    }
    score();
}

function calculatePointsDealer(){
    var totalD = 0;
    if(backToggle == 1){
        totalD = dHand[0].points;
        dealerPoints.innerHTML = totalD;
        backToggle = 0;
    } else {
        for(i = 0; i < dHand.length; i++){
            totalD += dHand[i].points;
            // If src = back card, display totalD - previous cards points
            dealerPoints.innerHTML = totalD;
        }
    }
    return totalD
}

function calculatePointsPlayer(){
    var totalP = 0;
    for(i = 0; i < pHand.length; i++){
        totalP += pHand[i].points;
        playerPoints.innerHTML = totalP;
    }
    return totalP
}

function clearTable(){
    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';
    pHand = [];
    dHand = [];
    deck = [];
    message.innerText = '';
    message.setAttribute('style', "display: none");
}


// initial function run after pressing Deal button
function main(){
    clearTable();
    makeDeck();
    shuffleDeck();
    dealHand();
    displayCards();
    calculatePointsPlayer();
    calculatePointsDealer();
}

// event listener for clicking Deal button
dealButton.addEventListener('click', function(){
    main();
    dealButton.setAttribute('style', "display: none");
});

// event listen for clicking Hit button
hitButton.addEventListener('click', function(){
    hit();
})

// event listen for clicking Hit button
standButton.addEventListener('click', function(){
    stand();
})