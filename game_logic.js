// enthält die Logik des Trifix-Spiels

var poss = {		// speichert die möglichen Werte der Attribute
					anzahlen:	['eins', 'zwei', 'drei'],
					farben	:	['blau', 'orange', 'rot'],
					formen	:	['dreieck', 'viereck', 'fuenfeck'],
					fuellungen:	['leer', 'muster', 'voll']
			};
			
var numCards;
			
class Tcard		// repräsentiert eine Karte
{
	constructor(anz, farbe, form, fuell)
	{
		this.anz = anz;
		this.farbe = farbe;
		this.form = form;
		this.fuell = fuell;
	}
}
	
function compare3(x, y, z)
{
	return (x==y) && (y==z) && (z==x);
}

function compare3Inv(x, y, z)
{
	return (x!=y) && (y!=z) && (z!=x);
}

function compareTrifix(x, y, z)
{
	return (compare3(x, y, z) || compare3Inv(x, y, z));
}

function isTrifix(c1, c2, c3)
{
	for (prop in c1)
	{
		if (!compareTrifix(c1[prop], c2[prop], c3[prop]))
			return false;
	}
	return true;
}

// durchmischt Array
function shuffle(arr)
{
	var currInd = arr.length;
	var tmp, randInd;

	while (0 !== currInd)
	{
		randInd = Math.floor(Math.random() * currInd);
		--currInd;

		tmp = arr[currInd];
		arr[currInd] = arr[randInd];
		arr[randInd] = tmp;
	}

	return arr;
}

// generiert alle möglichen Trifix-Karten und mischt
function initialize()
{
	var cards = [];
	
	for (anz in poss.anzahlen)
		for (farbe in poss.farben)
			for (form in poss.formen)
				for (fuell in poss.fuellungen)
					cards.push(new Tcard(poss.anzahlen[anz], poss.farben[farbe], poss.formen[form], poss.fuellungen[fuell]));
	
	cards = shuffle(cards);
	// numCards = 3**4;
	
	return cards;
}

// finde die Indizes eines Trifixes in cards
function findTrifix(cards, shuff = false)
{
	var indices = [];
	for (let i = 0; i < cards.length; ++i)
		indices.push(i);
	
	
	// Ohne dieses Shuffle würde er mit hoher Wahrscheinlichkeit immer so etwas wie [0, 1, 10] zurückliefern
	// also bevorzugt Trifixe mit niedrigem Index, woraus ein schlauer Spieler einen Vorteil ziehen könnte
	if (shuff)
		indices = shuffle(indices);
			
	for (i in indices)
		for (j in indices)
			for (k in indices)
				if (([cards[indices[i]], cards[indices[j]], cards[indices[k]]].lastIndexOf(-1) == -1) && (compare3Inv(indices[i], indices[j], indices[k]) && isTrifix(cards[indices[i]], cards[indices[j]], cards[indices[k]])))
					return [indices[i], indices[j], indices[k]];
					
	return -1;
}
	
function containsTrifix(cards)
{
	return (findTrifix(cards) == -1) ? false : true;	
}
