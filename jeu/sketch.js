var histoire = {}; // from json
var ressources = {}; // combien de ressources a le joueur

function preload () {
	histoire = loadJSON('histoire.json');
}

function setup() {
	print("Le jeu des batons")
	noCanvas();
	noLoop();
	actualiser();

}

function actualiser() {
	evenements();
	cycles();

	for (var i = 0; i < histoire.perso.length; i++) {
		afficherPerso(histoire.perso[i]);
	}
	for (var i = 0; i < histoire.cycle.length; i++) {
		afficherCycle(histoire.cycle[i]);
	}
	for (var ressource in ressources) {
		if (ressources.hasOwnProperty(ressource, ressources[ressource])) {
			afficherRessource(ressource, ressources[ressource]);
		}
	}

}

// Affiche la ressource concernée s'il faut
function afficherRessource(nom, quantite) {
	var bloc = select("#ressources");
	if(!bloc && quantite > 0){
		bloc = createDiv("");
		bloc.addClass("bloc");
		bloc.id("ressources");
	}
	var id="ressource-" + nom;;
	var imgCSS = "url('img/" + nom + ".png')";
	var txtHTML = quantite;
	var blocRessource = select("#" + id);
	if(!blocRessource && quantite > 0){
		blocRessource = createDiv("");
		blocRessource.addClass("ressource");
		blocRessource.id(id);
		blocRessource.html(txtHTML)
		blocRessource.style("background-image", imgCSS);
		bloc.child(blocRessource);
	} else if (blocRessource) {
		if(blocRessource.html() != txtHTML){
			blocRessource.html(txtHTML)
		}
	}
}

// Afficher le bloc perso concerné s'il faut
function afficherPerso(perso) {

	// Variables
	var actif = perso.actif;
	var moment = perso.scenar[perso.scenarIdx];
	var id = "perso" + perso.idx;
	var imgCSS = "url('img/perso/" + perso.idx + ".png')";
	var txtHTML = "<p>" + moment.txt + "</p>";

	// containeur de personnages
	var container = select("#perso-container");
	if(!container) container = createDiv("").id("perso-container");

	// Bloc et contenu
	var bloc = select("#" + id);
	if (!bloc && actif) {
		bloc = createDiv("");
		bloc.addClass("bloc");
		bloc.addClass("perso");
		bloc.id(id)

		var content = createDiv(txtHTML);
		content.addClass("content");
		content.style("background-image", imgCSS);
		bloc.child(content);
		container.child(bloc)
	}
	else if (bloc && !actif) {
		bloc.remove();
	}
	else if (bloc){
		var content = select('.content', bloc);
		if (content.html() != txtHTML) {
			content.html(txtHTML);
		}
	}

	// Choix
	if(bloc) {
		var choices = select(".choices", bloc)
		if (choices) choices.remove()
		choices = createDiv("");
		choices.addClass("choices");

		function faireFaire(moment, choix, perso) {
			return function(e) {faire(moment[choix], perso);};
		}

		var oui = createA("#", "Oui");
		oui.addClass("button");
		oui.addClass("oui");
		if (peutFaire(moment.oui)) {
			oui.mouseClicked(faireFaire(moment, 'oui', perso));
		}
		else {
			oui.addClass("impossible");
		}

		var non = createA("#", "Non");
		non.addClass("button");
		non.addClass("non");
		if (peutFaire(moment.non)) {
			non.mouseClicked(faireFaire(moment, 'non', perso));
		}
		else {
			non.addClass("impossible");
		}

		choices.child(oui);
		choices.child(non);
		bloc.child(choices);
	}
}

function afficherCycle(cycle) {
	// Variables
	var actif = cycle.actif;
	var temps = cycle.temps;
	var duree = cycle.duree;
	var id = "cycle" + cycle.idx;
	var imgCSS = "url('img/cycle/" + cycle.idx + ".png')";
	var txtHTML = "<p>" + cycle.txt + "</p>";

	// containeur de personnages
	var container = select("#cycle-container");
	if(!container) container = createDiv("").id("cycle-container");

	// Bloc et contenu
	var bloc = select("#" + id);
	if (!bloc && actif) {
		bloc = createDiv("");
		bloc.addClass("bloc");
		bloc.addClass("cycle");
		bloc.id(id)

		var content = createDiv(txtHTML);
		content.addClass("content");
		content.style("background-image", imgCSS);
		bloc.child(content);
		container.child(bloc)
	}
	else if (bloc && !actif) {
		bloc.remove();
	}
	else if (bloc){
		var content = select('.content', bloc);
		if (content.html() != txtHTML) {
			content.html(txtHTML);
		}
	}

	// Temps
	if(bloc) {
		var progressBar = select(".progress-bar", bloc);
		var progress;
		if (progressBar){
			progress = select(".progress", progressBar);
		}
		else {
			progressBar = createDiv("");
			progressBar.addClass("progress-bar");
			progress = createDiv("");
			progress.addClass("progress");
			progressBar.child(progress);
			bloc.child(progressBar);
		}

		pourcentage = temps/duree*100;
		pourcentage += "%";
		progress.style("width", pourcentage);
	}

}
function afficherGameOver(msg){
	var txtHTML = "<img src='img/game_over.png'/><p><b>Game over</b> : " + msg + "</p><a href='#'onclick='javascript:location.reload();'>Rejouer.</a>";

	bloc = createDiv("");
	bloc.addClass("game-over");

	var content = createDiv(txtHTML);
	content.addClass("content");
	bloc.child(content);

}

function peutFaire(actions){
	var possible = true;
	for (var i = 0; i < actions.length; i++) {
		var args = actions[i].split(" ");
		var action = args.shift();
		if (action == "SUB"){
			var quantite = args.shift();
			var ressource = ressources[args.shift()];
			possible &= ressource && ressource - quantite >= 0;
		};
	}
	return possible;
}
function faire(actions, perso) {
	for (var i = 0; i < actions.length; i++) {
		var args = actions[i].split(" ");
		var action = args.shift();
		if (action == "GOTO") goto(args);
		else if (action == "GOTOWITH") gotowith(args);
		else if (action == "SUB") sub(args);
		else if (action == "ADD") add(args);
		else if (action == "MULT") mult(args);
		else if (action == "OPEN") open(args);
		else if (action == "CLOSE") close(args);
		else if (action == "GAMEOVER") gameover(args);
		else console.error("Le mot clé de l'action n'a pas été reconnu");
	}
	actualiser()
	function goto(args) {
		perso.scenarIdx = args.shift();
	}
	function gotowith(args) {
		var scenarIdx = args.shift();
		var persoIdx = args.shift();
		for (var i = 0; i < histoire.perso.length; i++) {
			if(histoire.perso[i].idx == persoIdx){
				histoire.perso[i].scenarIdx = scenarIdx;
			}
		}
	}
	function add(args) {
		var quantite = int(args.shift());
		var ressource = args.join(" ");
		if (ressources[ressource]) ressources[ressource] += quantite;
		else ressources[ressource] = quantite;
	}
	function sub(args) {
		var quantite = args.shift();
		var ressource = args.shift();
		if (ressources[ressource]) ressources[ressource] -= quantite;
		else ressources[ressource] = quantite;
	}
	function open(args) {
		var type = args.shift();
		var idx = int(args.shift());
		for (var i = 0; i < histoire[type].length; i++) {
			if (histoire[type][i].idx == idx) histoire[type][i].actif = true;
		}
	}
	function close(args) {
		var type = args.shift();
		var idx = int(args.shift());
		for (var i = 0; i < histoire[type].length; i++) {
			if (histoire[type][i].idx == idx) histoire[type][i].actif = false;
		}
	}
	function mult(args) {
		var type = args.shift();
		var idx = int(args.shift());
		var attr = args.shift();
		var multiplicateur = float(args.shift());
		histoire[type][idx][attr] *= multiplicateur;
		print(histoire[type][idx][attr] + "*=" + multiplicateur);
	}
	function gameover(args) {
		for (var i = 0; i < histoire.perso.length; i++) {
			histoire.perso[i].actif = false;
		}
		for (var i = 0; i < histoire.cycle.length; i++) {
			histoire.cycle[i].actif = false;
		}
		afficherGameOver(args.join(" "))
	}

}

function verifier(condition){
	var condition = condition.split(" ")
	var ressource = condition.shift()
	var operateur = condition.shift()
	var valeur = int(condition.shift())

	if (operateur == ">") return ressources[ressource] > valeur
	else if (operateur == ">=") return ressources[ressource] >= valeur
	else if (operateur == "<") return ressources[ressource] < valeur
	else if (operateur == "<=") return ressources[ressource] <= valeur
	else if (operateur == "=") return ressources[ressource] == valeur
	else return false
}

function evenements () {
	// Regarder toutes les conditions de l'objet evenements.
	// Faire les actions correspondants aux conditions vérifiées.
	for (var condition in histoire.evenements) {
		if (histoire.evenements.hasOwnProperty(condition)) {

			if (histoire.evenements[condition] && verifier(condition)) {
				action = histoire.evenements[condition]
				histoire.evenements[condition] = null

				faire(action);
			}
		}
	}
}

function cycles() {
	var fps = 50;

	function faireProgress(idx) {
		return function() {
			if (! histoire.cycle[idx].actif){
				clearInterval(histoire.cycle[idx].interval)
			}
			histoire.cycle[idx].temps += 1/fps;
			if (histoire.cycle[idx].temps>=histoire.cycle[idx].duree){
				histoire.cycle[idx].temps = 0;
				faire(histoire.cycle[idx].action)
			}
			afficherCycle(histoire.cycle[idx])
		}

	}
	for (var i = 0; i < histoire.cycle.length; i++) {
		if(! histoire.cycle[i].interval && histoire.cycle[i].actif) {
			histoire.cycle[i].temps = histoire.cycle[i].duree;
			histoire.cycle[i].interval = setInterval(faireProgress(i), 1000/fps);
		}
	}
}
