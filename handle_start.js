// funktionen für den Startbildschirm, die die Spielereingabe verwalten


var ct = 0;

// zeichnet neue Inputfelder für weiteren Spieler
function handleAddPlayer()
{
	var newelem = '<div id="pl' + ct++ +'">';
	
	newelem += '<input id="plNames" type="text" required>';
	newelem += '<input id="plChar" style="width: 20px;" type="text" pattern="[a-zA-Z0-9-]" required>';
	newelem += '<input type="button" class="plDelBut" value="- delete player" onclick="handleDeletePlayer(this);">';
	
	newelem += '</div>\n';
			
	return $(newelem).appendTo("#playerInput");
}

// erlaubt dem Programmierer Spieler hinzuzufügen, in dem Fall nur benötigt um den Default Spieler zu erstellen (in trifix_main.html)
function addPlayer(name="", char="")
{
	let curpl = handleAddPlayer();
		
	$("#plNames", curpl[0]).val(name);
	$("#plChar", curpl[0]).val(char);
	
	return curpl;
}

function handleDeletePlayer(sender)
{		
	$("#" + sender.parentNode.id).remove();	
}

// überprüft ob die Eingaben korrekt sind, falls ja werden die Spieler ausgelesen und das Hauptspiel gestartet
function handleButtonStart()
{
	if (!$("#plSelForm")[0].checkValidity())
		return false;
	else
	{			
		var names = [];
		var chars = [];			
		
		// speichere Namen und Buchstaben in den entsprechenden Arrays
		$("#playerInput").children().each(function(){
				$("#" + this.id).children("#plNames").each(function(){
				console.log(names.push(this.value));});
				$("#" + this.id).children("#plChar").each(function(){
				console.log(chars.push(this.value));});
				});
		
		
		// überprüfe ob doppelte Buchstaben vorkommen
		
		for (let i = 0; i < chars.length; ++i)
			chars[i] = chars[i].toLowerCase();
		
		for (let i = 0; i < chars.length; ++i)
		{
			if (chars.lastIndexOf(chars[i]) != i)
			{
				alert("Es darf kein Buchstabe doppelt vorkommen");
				return 0;
			}
		}
		
		// bereite Spielstart vor
		
		var players = [];
		
		for (let i = 0; i < names.length; ++i)
			players.push(new player(names[i], chars[i]));
		
		//~ console.log(players);
		
		$("#start").hide();
		$("#main").show();
		
		startNewGame(players);
		
		return true;
	}
}
	
