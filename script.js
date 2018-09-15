//https://www.datamuse.com/api/

//Feedback:
// Keep variables inside the main game function
// Do not declare variables inside the function.  Do it outside and pass them in.


var chosenWord;
var letterCount;
var data;
var bloodyCrappyArray = ["number", "part", "quantities", "amount", "amounts", "extent", "proportion", 
						"areas", "cities", "area", "portion", "measure", "group", "size", "quantity", 
						"majority", "room", "doses", "body", "sums", "score", "family", "eyes", "percentage", 
						"companies", "volume", "population", "firms", "house", "sum", "city", "force", 
						"degree", "share", "corporations", "volumes", "intestine", "towns", "families", 
						"building", "variety", "increase", "masses", "mass", "company", "estates", "bowl", 
						"vessels", "tree", "army", "trees", "collection", "tracts", "organisations", "bodies", 
						"blocks", "crowd", "piece", "populations", "stones", "pieces", "projects", "town", 
						"sections", "hall", "audience", "houses", "enterprises", "farms", "portions", "sample", 
						"table", "plants", "buildings", "windows", "circle", "head", "rooms", "letters", 
						"stone"];

function createGame(){
    return {
        livesLeft : 10,
        begin : function(){

			var maxLength = $('#maxLength').val();
	
			// Create a request variable and assign a new XMLHttpRequest object to it.
			var request = new XMLHttpRequest();

			// Open a new connection, using the GET request on the URL
			// No idea what True is for
			// Cheated a little with the api, it is only returning nouns that are often described by the adjective large
			request.open('GET', 'https://api.datamuse.com/words?rel_jja=large', true);

			request.onload = function () {

				// Begin accessing JSON data here
				data = JSON.parse(this.response);
				console.log(data);
				
				// Checking successful request
				if (request.status >= 200 && request.status < 400) {
					if (maxLength != ""){
						if (maxLength >= 4){
							// Getting a random object from the JSON data and accessing its 'word' property
							do {
								chosenWord = data[Math.floor(Math.random()*data.length)].word;
								// There must be a better way of doing this
							}
							while (chosenWord.length != maxLength)
	    				}
    					// Left this in so we can cheat if we need to
						console.log(chosenWord);
	    			}
	    			else {
	    				chosenWord = data[Math.floor(Math.random()*data.length)].word;
	    				// Left this in so we can cheat if we need to
						console.log(chosenWord);
	    			}
				} 
				//else {
			    	////console.log('Error fetching data. Refresh page.');
				////}

				// Replacing each letter with an underscore
       			for(i = 0; i < chosenWord.length; i++) {
					$('#word').append('<span id="' + i + '">_ </span>');
				};
			}

							
							
			// Send request
			request.send();

			// Returns the chosen word for access later
        	return chosenWord;
        },

        noVowels : function(){
			$('.vowel').addClass("disabled");
        },

        newWord : function(game, lives, livesLeft, obj, loserButton, alphabetContainer, wordGuessContainer, livesContainer, disVowel, disVowelLabel, maxLength){
    		// Call the begin function in CreateGame
		    game.begin();
		    // Update the Lives box
		    lives.text(livesLeft);
		    // Hide new word button
		    obj.hide();

		    $('.hideOnStart').hide();

		    if(disVowel.is(':checked') == true){
		    	game.noVowels();
		    }
		    // Show relevant game features
		    loserButton.show();
			alphabetContainer.show();
			wordGuessContainer.show();
			livesContainer.show();
        },

        letterClick : function(event, livesLeft, lives){
        	// Store the letter object
			var letterObj = event;
			// Get the letter value/string from that object
			var letterVal = letterObj.attr('id');

			// Already picked
			if (letterObj.hasClass("disabled")) {
				alert('You have already used that letter or chose to disallow it. Pick another.');
			}
			// Found letter
			else if (chosenWord.indexOf(letterVal) >= 0 ) {	

				// Start letterPos off at 0 (first letter)
			  	var letterPos = 0;
			  	// Set i to -1 which means no occurance in terms of the indexOf
					var i = -1;

					// Search the string and counts the position of the chosen letter
					// If the letterPos does not equal -1 then it has found an occurance in the string
					// While loop so it will get multiple instances of the same letter
					while (letterPos != -1) {
						// Get the position of the letter in the string using the letter and the 0 start point
					letterPos = chosenWord.indexOf(letterVal, i + 1);

					// Set i to equal the new letter position so next time the loop starts looking from there
					// If this isn't done i will stay at 0 and cause infinite loop (YES I DID THAT)
					i = letterPos;

					// Get the corresponding ID to the position and reveal the letter
					$('#'+letterPos).text(letterVal);
					}

				// Diable the letter so it can't be picked again
				letterObj.addClass('disabled');

				// To store how many letters are left to reveal
				var lettersLeft = 0;
				$("#word span").each(function(){
				    if ($(this).text() == "_ ") {
				    	// Check if any of the word containers spans still contain the underscore
				    	// If so add one to letters left
				        lettersLeft ++;
				    }
				});

				// If lettersLeft now equals 0 that means you've guessed all the letters and won
				if (lettersLeft == 0){
					alert('YOU WON');
				}

			}
			// Didn't find letter
			else {
				// Lose a life
				livesLeft --;
				// Update lives box with current remaining lives
				lives.text(livesLeft);
				// Disables the letter so you can't pick it again
				letterObj.addClass('disabled');
				// Check if you have zero lives left
				if (livesLeft == 0) {
					// If you have zero left you are a loser
					alert('TELL YOUR MOTHER SHE RAISED A LOSER');
					// Get the word element. This has to be done here so it is the most up to date instance of the element
					word = $('#word');
					// Remove all current contents
					word.children().remove();
					// Reveal the word
					word.text(chosenWord);
				}
				
			}
			return livesLeft;
        },

        guess : function(wordGuessInput, livesLeft, lives){
        	// Get the guess from the input box
			var yourGuess = wordGuessInput.val();
			
			// Check if your guess is the same as the chosen word
			if (yourGuess === chosenWord){
				// Need to get a new instance of the word container as it's contents have changed since initialised
				word = $('#word');
				word.children().remove();
				word.text(chosenWord);
				alert('YOU WIN');
			}
			else {
				livesLeft --;
		    	lives.text(livesLeft);
				if (livesLeft == 0) {
					alert('TELL YOUR MOTHER SHE RAISED A LOSER');
					word = $('#word');
					word.children().remove();
					word.text(chosenWord);
				}
			}
			return livesLeft;
        }
    };
}


$().ready(function(){
	// Grabs the elements to work with
	var newWordButton = $('#newWord');
	var loserButton = $('#loser');
	var alphabetContainer = $('#alphabetContainer');
	var wordGuessContainer = $('#wordGuessContainer');
	var wordGuessInput = $('#wordGuess');
	var wordGuessButton = $('#guessing');
	var livesContainer = $('#lives');
	var lives = $('#lives span');
	var disVowel = $('#disVowel');
	var disVowelLabel = $('#disVowelLabel');
	var maxLengthContainer = $('#maxLengthContainer');
	
	// Define a new instance of the game
	var game = createGame();
	// Store the amount of lives defined in the game
	var livesLeft = game.livesLeft;

	loserButton.hide();
	alphabetContainer.hide();
	wordGuessContainer.hide();
	livesContainer.hide();

	// On click of the new word button
    newWordButton.on('click', function(){
    	game.newWord(game, lives, livesLeft, $(this), loserButton, alphabetContainer, wordGuessContainer, livesContainer, disVowel, disVowelLabel, maxLength);
    });

    loserButton.on('click', function(){
    	alert('YOU ARE A LOSER');
    	// Lazy way of resetting the game
    	location.reload();
    });

    alphabetContainer.on('click', 'li', function(){
    	// Run letter click function passing in objects which will be needed
    	// Assign the return of the function to livesLeft
    	livesLeft = game.letterClick($(this), livesLeft, lives, disVowel);
    });

    // Button for if you want to type and guess the answer
	wordGuessButton.on('click', function(){
		livesLeft = game.guess(wordGuessInput, livesLeft, lives);
	});
});