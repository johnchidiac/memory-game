const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "teal",
  "lime",
  "yellow",
  "teal",
  "lime",
  "yellow"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);
// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const card = document.createElement('div');
    
    // give it a class attribute for the value we are looping over
    card.dataset.color = color;
    card.dataset.inPlay = 'true';
    // call a function handleCardClick when a div is clicked on
    card.addEventListener('click', handleCardClick);
    
    // append the div to the element with an id of game
    gameContainer.append(card);

  }
}

// TODO: Implement this function!

let clickCount = 0;
let guessCount = 0;
const guessCountDisplay = document.querySelector('#guessCount');

function handleCardClick(e) {
  // you can use event.target to see which element was clicked
  
  const card = e.target;
  const color = card.dataset.color;
  card.removeEventListener('click', handleCardClick);

  if (clickCount < 2) {
    clickCount++;
  } else {
    const cards = gameContainer.querySelectorAll('div');
    cards.forEach(card => {
      card.removeEventListener('click', handleCardClick);
    });
  }
  console.log(clickCount);
  // console.log(card, color);
  registerGuess(card, color);
}

function setBoard() {
  shuffledColors = shuffle(COLORS);
  gameContainer.replaceChildren();
  createDivsForColors(shuffledColors);
  guessCountDisplay.innerText = guessCount;
}

let firstGuess = null;
let gameOver = 8;

function resetBoard() {
  if (!gameOver) {
    // END GAME: ALL MATCHES HAVE BEEN FOUND
    setTimeout(function() {
      const gameOverMessage = document.createElement('div');
      gameOverMessage.classList.add('gameOverMessage');
      gameOverMessage.innerText = 'Game Over!';
      gameContainer.replaceChildren(gameOverMessage);
    }, 3000);
  } else {
    // PAIR ATTEMPTED BUT SOME CARDS REMAIN - CONTINUE GAME
    const cards = gameContainer.querySelectorAll('div');
    cards.forEach(card => {
      if (card.dataset.inPlay === 'true') {
        card.addEventListener('click', handleCardClick);
        card.removeAttribute('class');
      }
    });
    firstGuess = null;
    clickCount = 0;
  }
}

const registerGuess = (card, color) => {
  
  card.classList.add(color)
  if (firstGuess != null) {
    // console.log(`Second guess: ${card}: ${color}`);
    const firstGuessColor = firstGuess.getAttribute('data-color');
    if (color === firstGuessColor) {

      card.dataset.inPlay = 'false';
      firstGuess.dataset.inPlay = 'false';
      const colorQuery = `[data-color="${color}"]`;
      const matchedCards = document.querySelectorAll(colorQuery);
      for (let matchedCard of matchedCards) {
        matchedCard.style.color = 'white';
        matchedCard.innerText = 'Match!';
      }

      setTimeout(function() {
        for (let matchedCard of matchedCards) {
          matchedCard.style.color = color;
          matchedCard.innerText = '';
        }
        resetBoard();
      }, 500);
      gameOver--;
    } else {
      console.log(`No match: ${color} is not a match with ${firstGuessColor}`);
      setTimeout(function() {
        resetBoard();
      }, 1000);
    }
    updateGuessCount();
  } else {
    firstGuess = card;
    firstGuess.classList.add(color);
    // console.log(`First guess: ${firstGuess.getAttribute('class')}`);
  }

  // const storedCard = localStorage.getItem('firstGuess');
	// return (storedCard) ? JSON.parse(storedCard) : null;
}

function updateGuessCount() {
  guessCount++;
  guessCountDisplay.innerText = guessCount;
}

function saveGuess(guess) {
	localStorage.setItem('firstGuess', JSON.stringify(guess));
}


// when the DOM loads
setBoard();

