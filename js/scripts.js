$( document ).ready(function() {

// List all required variables

let players = [
  'harry-kane',
  'gareth-southgate',
  'ruben-loftus-cheek',
  'jordan-pickford',
  'john-stones',
  'kieran-trippier',
  'jesse-lingard',
  'raheem-sterling'
  ];
let matches = [];
let deck = $('.deck');
let moves = 0;
let rating = 0;
let totalClicks = 0;
let timerPtr;
let secondCount = 0;


// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
   var currentIndex = array.length, temporaryValue, randomIndex;

   while (currentIndex !== 0) {
       randomIndex = Math.floor(Math.random() * currentIndex);
       currentIndex -= 1;
       temporaryValue = array[currentIndex];
       array[currentIndex] = array[randomIndex];
       array[randomIndex] = temporaryValue;
   }

   return array;
}

// Empty an array

function empty(array) {
  array.length = 0;
}

// Click Counter

function clickCounter() {
  totalClicks += 1;
  $("#totalmoves").html(totalClicks);
}

// Timer

function timer() {
  secondCount += 1;
  $("#timer").html(secondCount);
  timerPtr = setTimeout(timer, 1000);
}

// Stop the game

function currentGameEnd() {
  $('.stopgame').click(function() {
    modalWindowOpen('restarted');
    clearTimeout(timerPtr);
    rating = 0;
    secondCount = 0;
    totalClicks = 0;
  });
}

 // Create action for when card is clicked

 function cardClick() {
   $( ".card" ).click(function() {
     clickCounter();
     $( this ).addClass("show flipInY");
     // Disable and restore click from https://stackoverflow.com/questions/1263042/how-to-temporarily-disable-a-click-handler-in-jquery
     $(this).css("pointer-events", "none");
     let playerName = $(this).attr( "playername" );
     matches.push(playerName);
     cardCheck();
   });
 }

// Check to see cards match or not

 function cardCheck() {
   if (matches.length === 2 ) {
     if (matches[0] === matches[1]) {
       let playerMatch = ".card[playername='" + matches[0] + "']";
       $(playerMatch).removeClass("show flipInY").addClass("open pulse");
       empty(matches);
       gameComplete();
     }
     else {
       empty(matches);
       $(".card.show").removeClass('flipInY');
       $(".card.show").addClass('shake');
       $(".card.show").delay(700).queue(function(){
            // Disable and restore click from https://stackoverflow.com/questions/1263042/how-to-temporarily-disable-a-click-handler-in-jquery
            $(this).removeClass("show shake").css("pointer-events", "auto").dequeue();
        });

     }
   }
 }

 // Set star rating

function starRating(clicks) {
  if ( clicks <= 32 ) {
    rating += 3;
  }
  else if ( clicks <= 48 ) {
    rating += 2;
  }
  else {
    rating += 1;
  }
}

// Open Model Window

function modalWindowOpen(status) {
  $('.modal-wrapper').addClass('active');
  if ( status === 'restarted') {
    $(".modal-inner").html('<h3>Did you score an own goal?</h3>' +
      '<p>Don\'t dispair, unlike normal football matches (not including FIFA 18) you can try again and restart.</p>' +
      '<a href="#" class="restartgame">Restart Game</a>');
  }
  else {
    starRating(totalClicks);
    $(".modal-inner").html('<h3>Congratulations</h3>\
       <p>All the cards have been matched in <br> <span class="numberofmoves">' + totalClicks + '</span> moves and <span class="totaltime">' + secondCount + '</span> seconds</p>\
       <ul class="rating stars-' + rating + '">\
       <li class="star">One Star</li>\
       <li class="star">Two Star</li>\
       <li class="star">Three Star</li>\
       </ul>\
       <a href="#" class="restartgame">Restart Game</a>');

  }
  restartGame();
}

// Close Model Window

function modalWindowClose() {
  $('.modal-wrapper').removeClass('active');
}

// Check to see all cards have been flipped

function gameComplete() {
  let cardMatches = $('.open').length
  if ( cardMatches === 16 ) {
    modalWindowOpen();
    clearTimeout(timerPtr);
    secondCount = 0;
    totalClicks = 0;
    rating = 0;
  }
  else {
    console.log( cardMatches + ' Matched');
  }
}

// Restart the game

function restartGame() {
  $('.restartgame').click(function() {
    deck.empty();
    empty(matches);
    $('#totalmoves').html('0');
    $('#timer').html('0');
    let moves = 0;
    let totalClicks = 0;
    modalWindowClose();
    intiGame();
  });
}

// Initiat the game

function intiGame() {
  let playerlist = players.concat(players);
  let shuffledplayers = shuffle(playerlist);
  for (let i = 0; i < playerlist.length; i++) {
		deck.append($('<li class="card animated" playername="' + playerlist[i] + '"><img src="img/cards/' + playerlist[i] + '.jpg"></li>'))
	}
  timerPtr = setTimeout(timer, 1000);
  cardClick();
}

// Start the game

intiGame();
currentGameEnd();

});
