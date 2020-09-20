// In dieser Datei sind die Funktionen die sich um die Statistik die während dem Spiel angezeigt wird kümmern

// das Objekt Stat repräsentiert die Statistik

class StatsImpl
{
	constructor()
	{
		this.timer = 0;
		this.interv = null;
	}
	
	init(nCards, players)
	{			
		this.interv = setInterval(refrTime, 1000, this);
		
		this.refresh(nCards, players);
	}


	refresh(nCards, players)
	{
		$("#cardsLeft").text(nCards);
			
		
		$("#playerInfo")[0].innerHTML="";

			
		for (let i = 0; i < players.length; ++i)
		{
			let tmpPlInf = '<div>'
			tmpPlInf += '<p><label>' + players[i].name + ' </label>';
			tmpPlInf += '<output id="infoPl' + i + '">' + players[i].points + '</output></p>'
			tmpPlInf += '</div>"';
		
			$(tmpPlInf).appendTo("#playerInfo");
		}
		
	}
	
	clear(nCards, players)
	{
		this.refresh(nCards, players);
		clearInterval(this.interv);
	}
}

var Stats = new StatsImpl();

// gibt im Element #passedTime die Zeit im Format min : sek aus
function refrTime(elem){
		let minutes = Math.floor(elem.timer*1 / 60);
		let seconds = elem.timer*1 % 60;
	
		$("#passedTime").text(minutes + ":" + (seconds >= 10 ? "":0) + seconds);	
		++elem.timer;
	};
