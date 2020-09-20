// enthält die Klasse player die einen Spieler repräsentiert und entsprechende Funktionen

class player
{
	constructor(name, button)
	{
		this.name = name;
		this.button = button;
		this.points = 30;
	}
	
	addPoints(num)
	{
		this.points = Math.max(this.points + num, 0);
	}	
};



function getButtons(players)
{
	var buttons = [];
	for(let player of players)
	{
		buttons.push(player.button);
	}
	return buttons;
}


function getWinner(players)
{
	var winner = 0;
	var unent = false;
	
	for (let i = 1; i < players.length; ++i)
	{
		if (players[winner].points < players[i].points)
		{
			winner = i;
			unent = false;
		}
		else if (players[winner].points == players[i].points)
		{
			unent = true;
		}
	}
	
	return unent ? -1 : winner;
}
	
