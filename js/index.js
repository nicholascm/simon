angular.module('games', [])

.controller('simonController', ['$interval', function($interval) {

  var simon = this;

  simon.statusMessage = "Simon";
  
  simon.strictMode = false; 
  simon.getCrazy = false; 
  //simon.soundsOn = false; 
  
  simon.sequence = [];
 
  simon.playerSequence = [];
  
  simon.sounds = ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3']; 

  simon.playSound = function(sound) {
    var sound = new Audio(sound); 
    sound.play(); 
  }; 

  //utility for random number in range
  simon.generateRandomNumber = function(sequence, minimum, maximum) {
    var randomDigit = Math.floor((Math.random() * maximum) + minimum);
    return sequence.push(randomDigit);
  };

  //utility to compares two arrays only as far as the second argument defines 
  simon.compareArrays = function(sequence, playerSequence) {
    var matching = true;
    for (i = 0; i < playerSequence.length; i++) {
      if (playerSequence[i] != sequence[i]) {
        matching = false;
      }
    }
    return matching;
  };

  simon.buttons = {
    startAvailable: true,
    tryAgainAvailable: false,
    clearPlayerAvailable: false
  };

  simon.reset = function(status) {
    if (status == "strict") {
      simon.statusMessage = "Simon";
      $interval.cancel(timer); 
      simon.sequence = [];
      simon.playerSequence = [];
      simon.checkMoves();       
      console.log('reset'); 
    } else if(status == "user" && window.confirm("Are you sure you want to restart? A new game will immediately begin.")) {
      simon.statusMessage = "Simon";
      $interval.cancel(timer); 
      simon.sequence = [];
      simon.playerSequence = [];
      simon.checkMoves(); 
    }
  };

  simon.clearPlayerSequence = function() {
      simon.playerSequence = [];
    }
    //appends a value to an array 

  simon.appendChoice = function(value, choiceArray) {
    //if the value is added to the players array, needs to check if this is the final move, otherwise it continues to allow moves.
    if (choiceArray == simon.playerSequence) {
      if (simon.playersTurn()) {
        choiceArray.push(value);
        simon.statusMessage = "You got this!";
        simon.view.highlight(value, 100);
        simon.checkMoves();
      }
    } else {
      choiceArray.push(value);
    }
  };

  simon.checkMoves = function() {
    //checks to see if the player has made the final and all moves are correct so that the computer can go
    if (simon.compareArrays(simon.sequence, simon.playerSequence) && simon.sequence.length == simon.playerSequence.length && simon.playerSequence.length < 20) {
      simon.generateRandomNumber(simon.sequence, 1, 4);
      simon.clearPlayerSequence();
      simon.view.displaySequence();
      simon.compareArrays(simon.sequence, simon.playerSequence);
    }
      else if (simon.compareArrays(simon.sequence, simon.playerSequence) && simon.sequence.length == simon.playerSequence.length && simon.playerSequence.length < 20) {
        alert("YOU WON!!!!!!! Wow, never thought this would happen!"); 
        simon.reset("strict"); 
      }
     else if (!simon.compareArrays(simon.sequence, simon.playerSequence)) {
        if (simon.strictMode) { 
           simon.statusMessage = "Missed it! Restarting...";
           simon.reset("strict");  
        } else {
         simon.statusMessage = "You missed it at "+(simon.playerSequence.length-1)+" of "+simon.sequence.length+" steps. Watch and try again!";
        simon.clearPlayerSequence(); 
        simon.view.displaySequence();
        }
    }
  };

  //determines whose turn it should be  
  simon.playersTurn = function() {
    if (simon.sequence.length > simon.playerSequence.length && simon.compareArrays(simon.sequence, simon.playerSequence) && !simon.view.sequenceOngoing) {
      return true;
    } else {
      false;
    }
  };

  
  simon.one = false;

  simon.two = false;

  simon.three = false;

  simon.four = false;

  simon.view = {
    
    sequenceOngoing: false, 
    
    displaySequence: function() {
      simon.view.sequenceOngoing = true; 
      var displaySequence = simon.sequence;
      var timelapse; 
      if (simon.sequence.length <= 5) {
         timelapse = 1100;
      } else if (simon.sequence.length <= 9) {
        timelapse = 900; 
      } else if (simon.sequence.length <= 13) {
        timelapse = 700; 
      } else {
        timelapse = 600;  
      }
      var index = 0;

      function nextDigit() {
        simon.one = false;
        simon.two = false;
        simon.three = false;
        simon.four = false;
        console.log(displaySequence[index]);
        simon.view.highlight(displaySequence[index], 500);

        if (index == displaySequence.length - 1) {
          $interval.cancel(timer);
          simon.view.sequenceOngoing = false; 
        } else { 
          index++;
        }
      }

      timer = $interval(nextDigit, timelapse);

    },
    highlight: function(square, delayTime) {
      if (square == 1) {
        simon.one = true;
        $interval(function() {
          return simon.one = false;
        }, delayTime, 1);
        simon.playSound(simon.sounds[0]);
      } else if (square == 2) {
        simon.two = true;
        $interval(function() {
          return simon.two = false;
        }, delayTime, 1);
        simon.playSound(simon.sounds[1]);
      } else if (square == 3) {
        simon.three = true;
        $interval(function() {
          return simon.three = false;
        }, delayTime, 1);
        console.log("three");
        simon.playSound(simon.sounds[2]); 
      } else if (square == 4) {
        simon.four = true;
        $interval(function() {
          return simon.four = false;
        }, delayTime, 1);
        simon.playSound(simon.sounds[3]); 
      } else {
        console.log("else");
      }
    }
  }

}]);