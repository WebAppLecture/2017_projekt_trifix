// Die Hauptspiellogik

var game;	// wird in startNewGame gesetzt soll aber global bekannt sein

function startNewGame(players)
{	
	game = new gameData(players);
	
	$("#restartButt").hide();
	
	game.newRound(true);
	
	
	// nur Debugausgaben
	//-----------
	console.log(containsTrifix(game.stack));	//
	console.log(findTrifix(game.stack));		//
	for(card in game.stack)					//
		console.log(game.stack[card]);		//
	//----------	
}	

// kapselt alle für das Spiel relevanten Karten und kümmert sich um die Korrekte Initialisierung und Zurücksetzung am Ende eine Runde
class gameData
{
	constructor(players)
	{
		this.players = players;
		this.buttons = getButtons(this.players);
		this.currentPlayer = -1;
				
		this.hintTrifix = undefined;
		// this.helper = undefined;
		
		this.hintTimeOut1 = null;
		this.hintTimeOut2 = null;
		
		this.hint1Time = 20000;
		this.hint2Time = 120000;
		
		this.cards = initialize();
		this.stack = [];
		for (let i = 0; i < 12; ++i)
			this.stack.push(-1);		// wird erst in newRound gesetzt
		
		this.selection = [];
		
		this.Spielfeld = $("#Spielfeld")[0];		
		
		this.gameOver = false; // nur für den 1-Spieler-Modus von bedeutung
		
		// fürs Debuggen, falls man mal mit weniger Karten spielen möchte
		 // for(let i = 0; i < 81-14; ++i)	//
			 // this.cards.pop();				//
			
		$("#messLog").text("Der Spieler der ein Trifix gefunden hat muss seinen Knopf drücken!");
		
		window.onkeypress = handleKeyPressed;
				
		Stats.init(this.totalCardsLeft(), this.players);
	}
	
	newRound(resetHint = false)
	{	
		// der mit den meisten Punkten wird zuerst angezeigt
		this.players.sort(function(lhs, rhs){return rhs.points - lhs.points;});
		this.buttons = getButtons(this.players);
		
		// neue Karten ziehen
		for (let i = 0; i < game.stack.length; ++i)
		{
			if (game.stack[i] == -1)
			{
				var tmp = game.cards.pop();
				
				if (tmp == undefined)
					break;
				
				game.stack[i] = tmp;
			}
		}		
		
		
		drawField(Spielfeld);
		
		
		// wird z.B nur benötigt, wenn der Spieler davor ein richtiges "Trifix" gefunden hat, sonst bleibt der Hinweis der selbe
		if (resetHint)
		{
			clearTimeout(this.hintTimeOut1);
			clearTimeout(this.hintTimeOut2);
			
			this.hintTrifix = findTrifix(this.stack, true);
			// falls es kein Trifix gibt einfach random hint anzeigen (weil es auch Punkte für kein Trifix gibt
			// und man es sonst ja merkt wenn nach 20 Sekunden kein hint kommt)
						
			if (this.hintTrifix == -1)
			{
				let tmp = [];
				for (let i = 0; i < this.stack.length; ++i)
					tmp.push(i);
				this.hintTrifix = shuffle(tmp).splice(0,3);
			}
			
			this.hint1Start = new Date();
			this.hint2Start = new Date();
			
			this.hintTimeOut1 = setTimeout(giveHint, this.hint1Time, this.hintTrifix[0]);		//  erster Hinweis nach 20s
			this.hintTimeOut2 = setTimeout(giveHint, this.hint2Time, this.hintTrifix[1]);		// zweiter Hinweis nach 2min
		}
		else
		{
			if ((new Date() - this.hint1Start) > this.hint1Time)
				giveHint(this.hintTrifix[0]);
				
			if ((new Date() - this.hint2Start) > this.hint2Time)
				giveHint(this.hintTrifix[1]);
		}
		
		//~ for (let ind of game.selection)			// unnötig ???
			//~ $("#"+ind).removeAttr("style");
					
		game.selection = [];
			
		game.currentPlayer = -1;
		
		$("#cancelButt").prop("disabled", true);
		$("#noTButt").prop("disabled", true);
		
		document.activeElement.blur(); // focus auf der Seite damit immer Reaktion auf gedrückten Knopf
		
		Stats.refresh(this.totalCardsLeft(), this.players);		
		
		// wenn nur ein Spieler spielt ist er instant am Zug, also "drücken" wir für ihn die Taste
		if (!this.gameOver && this.players.length == 1)
			handleKeyPressed({"key": this.players[0].button});
		
		console.log(findTrifix(game.stack));		//
		console.log(containsTrifix(game.stack)); 	//
	}
	
	finalize()
	{
		window.onkeypress = function(){};
		window.removeEventListener("onkeypress", handleKeyPressed);
		
		clearInterval(this.hintTimeOut1);
		clearInterval(this.hintTimeOut2);
		
		Stats.clear(this.totalCardsLeft(), this.players);
	}
	
	totalCardsLeft()
	{
		let inStack = 0;
		this.stack.forEach(function(x){if (x != -1) ++inStack;});
		let inCards = this.cards.length;
		
		return inStack + inCards;
	}
	
};

// wenn eine Taste gedrückt wurde überprüfen ob sie zu einem Spieler gehört
function handleKeyPressed(e)
{
	console.log("Button pressed, " + e.key);
	
	if (game.currentPlayer == -1 && game.buttons.includes(e.key.toLowerCase()))
	{
		game.currentPlayer = game.buttons.indexOf(e.key.toLowerCase());
		
		// diese Nachricht nur anzeigen, wenn mehr als ein Spieler und in der 1. Runde wenn nur ein Spieler
		if (game.players.length > 1 || (game.cards.length != 81 && game.players[0].points == 30))
			$("#messLog").val(game.players[game.currentPlayer].name + " it's your turn");
		
		$("#cancelButt").prop("disabled", false);
		$("#noTButt").prop("disabled", false);
	}
}

// Karte soll zum wackeln anfangen
function giveHint(hint)
{
	$("#" + hint).addClass("hinted");
}
	
function drawField(field)
{
	field.innerHTML = "";
	for (i in game.stack)
	{
	
		//build the single cards using the following structure:

		//<div class="card0" onclick="handleSelectedCard(this);">
		//	<label class="form drei1 blau fuenfeck">
		//		<label class="innerform fuenfeck muster"></label>
		//	</label>
		//	<label class="form drei2 blau fuenfeck">
		//		<label class="innerform fuenfeck muster"></label>
		//	</label>
		//	<label class="form drei3 blau fuenfeck">
		//		<label class="innerform fuenfeck muster"></label>
		//	</label>
		//</div>	
			
		
		if (game.stack[i] != -1)
		{

			var newcard = '<div id="' + i + '" class="card0" onclick="handleSelectedCard(this);">';
			
			var assoz = {"eins":1, "zwei":2, "drei":3};
			
			for(let j = 1; j <= assoz[game.stack[i].anz]; ++j)
			{
				newcard += '<label class="form ' + game.stack[i].anz + j + ' ' + game.stack[i].farbe + ' ' + game.stack[i].form +'">';
				newcard += '<label class="innerform ' + game.stack[i].form + ' ' + game.stack[i].fuell + '"></label>';
				newcard +='</label>';
			}
			
			newcard += '</div>\n';
			
			field.innerHTML += newcard;
		}
		else
		{
			field.innerHTML += '<div></div>';
		}
	}
	//~ console.log(Spielfeld.innerHTML);
}

// wenn man auf eine Karte gedrückt hat wird diese Funktion aufgerufen
function handleSelectedCard(sender)
{
	if (game.currentPlayer == -1)	// Spieler am Zug?
		return;
	
	if (game.selection.includes(sender.id))	// entweder selecten oder unselecten je nachdem was sie davor war
	{
		game.selection.splice(game.selection.indexOf(sender.id),1);
		console.log("Removed " + sender.id);		//
		
		$("#"+sender.id).removeAttr("style");
	}
	else
	{
		game.selection.push(sender.id)
		console.log("Pushed " + sender.id);			//
		
		$("#"+sender.id).css("background-color", "lightblue");
	}
	//~ alert("Clicked on card " + sender.id + "\n" + $("#Spielfeld")[0].innerHTML.split('\n')[sender.id]);
	
	if (game.selection.length == 3)		// sobald 3 Karten gewählt wurden überprüfen ob "Trifix" dabei
	{
		evaluate();
	}
}

// Überprüfe auf "Trifix" und gib entsprechend Punkte
function evaluate()
{
	if (isTrifix(game.stack[game.selection[0]], game.stack[game.selection[1]], game.stack[game.selection[2]]))
			{
				console.log("Found Trifix");
				
				for (ind of game.selection)
					game.stack[ind] = -1;
									
				game.players[game.currentPlayer].addPoints(20);
				$("#messLog").val(game.players[game.currentPlayer].name + ": +20");
				
				game.newRound(true);
			}
			else
			{
				console.log("Not a Trifix");
				
				game.players[game.currentPlayer].addPoints(-10);
				$("#messLog").val(game.players[game.currentPlayer].name + ": -10");
				
				game.newRound();
			}
			
	// wenn keine Karten mehr da ist Spiel vorbei
	if ((game.cards.length == 0) && !containsTrifix(game.stack))
		endGame();
}

// gib den Gewinner aus, zeige den Neustartknopf und führe Abschlussarbeiten aus
function endGame()
{
		game.gameOver = true;
		game.newRound(true);
		
		alert("Kein Trifix mehr möglich. Das Spiel ist zu Ende!");
		
		var mess = "Spiel ist zuende. ";
		
		var winner = getWinner(game.players);
		
		if (winner == -1)
			mess += "Unentschieden.";
		else
			mess += "Der Gewinner ist " + game.players[winner].name + " mit " + game.players[winner].points +" Punkten!";
		
		$("#messLog").val(mess);
		
		$("#cancelButt").prop("disabled", true);
		$("#noTButt").prop("disabled", true);
		
		$("#restartButt").show();
		
		game.finalize();
}


function handleRestart()
{
	game.finalize();
	
	$("#main").hide();
	$("#start").show();
}

// wenn der Spieler seine Taste gedrückt hat ohne ein "Trifix" gefunden zu haben wird er bestraft
function handleCancel()
{
	game.players[game.currentPlayer].addPoints(-10);
	$("#messLog").val(game.players[game.currentPlayer].name + " wird bestraft: -10");
	
	game.newRound();
}

// ist der Spieler der Meinung dass es kein "Trifix" gibt, dann überprüfe ob er recht hat und gib ihm entsprechend Punkte
function handleNoT()
{
	if (!containsTrifix(game.stack))
	{
		game.players[game.currentPlayer].addPoints(40);
		$("#messLog").val("Sehr gut " + game.players[game.currentPlayer].name + ", das gibt Bonuspunkte: 40");
	
		// zurücklegen, mischen, neu austeilen (in newRound())
	
		for (let i = 0; i< game.stack.length; ++i)
		{
			game.cards.push(game.stack[i]);
			game.stack[i] = -1;
		}
			
		if (!containsTrifix(game.cards))
		{
			endGame();
			return;
		}
		
		game.cards = shuffle(game.cards);
		
		game.newRound(true);
	}
	else
	{
		game.players[game.currentPlayer].addPoints(-10);
		$("#messLog").val("Doch " + game.players[game.currentPlayer].name + ", es gibt schon ein Trifix zu finden: -10");
		
		game.newRound();
	}
}
