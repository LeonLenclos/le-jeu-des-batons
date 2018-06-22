// Le jeu des bâtons est un jeu de Léon Lenclos
// Sont uttilisées les librairies p5.js et p5.dom.js


////////////////////////////////////////////////////////////////////////////////
//                                    Données                                 //
////////////////////////////////////////////////////////////////////////////////

// Dictionnaire construit à partir de histoire.json
var histoire = {};
 // Dictionnaire contenant les ressources dont dispose le joueur.
var ressources = {};
var tricheur = false;
var tempsAuDebut;

////////////////////////////////////////////////////////////////////////////////
//                               Fonctions de base                            //
////////////////////////////////////////////////////////////////////////////////

// Fonction p5
function preload () {
	// Avant tout, chargement de l'histoire.
	histoire = loadJSON('histoire.json');

}

// Fonction p5
function setup() {
	// Réglage liés à p5.
	noCanvas();
	noLoop();
	// Première actualisation.
	actualiser();
	// Timer
	tempsAuDebut = new Date().getTime();

}

// Fonction principale du jeu
// Doit être appelée à chaque fois que Les choses ont changés afin d'actualiser
// ce qui est affichées et de verifier s'il y a des nouvelles choses à faire.
function actualiser() {
	evenements();
	cycles();
	afficher();
}


////////////////////////////////////////////////////////////////////////////////
//                                    Affichage                               //
////////////////////////////////////////////////////////////////////////////////

// On affiche tout en HTML grace à p5.dom.js
// La pege ressemblera à quelquechose comme ça :
//
// <div id="perso-container">
//
// 	<div class="bloc perso" id="perso0">
// 		<div class="content" style="background-image: url("url/de/limage");">
// 			<p>Texte</p>
// 		</div>
// 		<div class="choices">
// 			<a href="#!" class="button oui">Oui</a>
// 			<a href="#!" class="button non">Non</a>
// 		</div>
// 	</div>
//
// 	<div class="bloc perso" id="perso1">
// 		<div class="content" style="background-image: url("url/de/limage");">
// 			<p>Texte</p>
// 		</div>
// 		<div class="choices">
// 			<a href="#!" class="button oui">Oui</a>
// 			<a href="#!" class="button non">Non</a>
// 		</div>
// 	</div>
//
// </div>
//
// <div id="cycle-container">
//
// 	<div class="bloc cycle" id="cycle0">
// 		<div class="content" style="background-image: url("url/de/limage");">
// 			<p>Texte</p>
// 		</div>
// 		<div class="progress-bar">
// 			<div class="progress" style="width: 96.75%;"></div>
// 		</div>
// 	</div>
//
// 	<div class="bloc cycle" id="cycle1">
// 		<div class="content" style="background-image: url("url/de/limage");">
// 			<p>Texte</p>
// 		</div>
// 		<div class="progress-bar">
// 			<div class="progress" style="width: 96.75%;"></div>
// 		</div>
// 	</div>
//
// </div>
//
// <div class="bloc" id="ressources">
// 	<div class="ressource" id="ressource-nom_de_la_ressource" style="background-image: url("url/de/limage");">Valeur</div>
// 	<div class="ressource" id="ressource-nom_de_la_ressource" style="background-image: url("url/de/limage");">Valeur</div>
// </div>

// Affiche tous les ellements du jeu.
function afficher() {
	// Afficher stats
	afficherStat();
	// Afficher les personnages.
	for (var i = 0; i < histoire.perso.length; i++) {
		afficherPerso(histoire.perso[i]);
	}
	// Afficher les cycles.
	for (var i = 0; i < histoire.cycle.length; i++) {
		afficherCycle(histoire.cycle[i]);
	}
	// Afficher les ressources.
	for (var ressource in ressources) {
		if (ressources.hasOwnProperty(ressource, ressources[ressource])) {
			afficherRessource(ressource, ressources[ressource]);
		}
	}
}

// transforme une duree en millisecondes en une phrases type "3 minutes et 40 secondes"
function tempsLisible(milis) {
	var secondes = Math.floor(milis/1000);
	var minutes = Math.floor(secondes/60);
	secondes %= 60
	txt = "";
	if (minutes > 1) txt += minutes + " minutes et ";
	else txt += minutes + " minute et ";
	if (secondes > 1) txt += secondes + " secondes";
	else txt += secondes + " seconde";
	return txt
}

// Affiche les statistiques
function afficherStat() {
	// Récuperer le bloc #ressources ou le créer s'il n'existe pas.
	var bloc = select("#stat");
	if(!bloc){
		bloc = createDiv("");
		bloc.addClass("bloc");
		bloc.id("stat");
		bloc.hide();
	}
	// Meilleur temps
	var meilleurTemps = Cookies.get('ljdb1.0-meilleur-temps');
	var meilleurTempsHTML = "Tu n'as jamais gagné le jeu des bâtons.";
	if (meilleurTemps) {
		meilleurTempsHTML = "Tu as déjà gagné le jeu des bâtons en " + tempsLisible(JSON.parse(meilleurTemps)) +".";
	}
	// Fins explorées
	var finsExplorees = Cookies.get('ljdb1.0-fins-explorees');
	var finsExploreesHTML = "Tu n'as encore exploré aucune fin.";
	if (finsExplorees) {
		finsExplorees = JSON.parse(finsExplorees);
		var n = finsExplorees.length;
		var plu = n > 1 ? 's' : '';
		finsExploreesHTML = "Tu as exploré " + n + " fin"+plu+" sur 9.";
	}
	// Ressources decouvertes
	var ressourcesDecouvertes = Cookies.get('ljdb1.0-ressources-decouvertes');
	var ressourcesDecouvertesHTML = "Tu n'as encore découvert aucune ressource.";
	if (ressourcesDecouvertes) {
		ressourcesDecouvertes = JSON.parse(ressourcesDecouvertes);
		var n = ressourcesDecouvertes.length;
		var plu = n > 1 ? 's' : '';
		ressourcesDecouvertesHTML = "Tu as découvert " + n + " ressource"+plu+" sur 7.";
	}
	// Personnage rencontrés
	var personnagesRencontres = Cookies.get('ljdb1.0-personnages-rencontres');
	var personnagesRencontresHTML = "Tu n'as encore rencontré aucun personnage.";
	if (personnagesRencontres) {
		personnagesRencontres = JSON.parse(personnagesRencontres);
		var n = personnagesRencontres.length;
		var plu = n > 1 ? 's' : '';
		personnagesRencontresHTML = "Tu as rencontré " + n + " personnage"+plu+" sur 10.";
	}

	var txtHTML = "<div class='content'><a href='#!' class='lien-info' onclick=\"select('#stat').hide();\">[X]</a><p>"+meilleurTempsHTML+"</p><p>"+finsExploreesHTML+"</p><p>"+ressourcesDecouvertesHTML+"</p><p>"+personnagesRencontresHTML+"</p>";
	if (bloc.html() != txtHTML) bloc.html(txtHTML);



}

// Affiche la ressource concernée s'il faut.
function afficherRessource(nom, quantite) {
	// Récuperer le bloc #ressources ou le créer s'il n'existe pas.
	var bloc = select("#ressources");
	if(!bloc && quantite > 0){
		bloc = createDiv("");
		bloc.addClass("bloc");
		bloc.id("ressources");
	}
	// Informations relatives à la ressource à afficher
	var id="ressource-" + nom;;
	// Le nom de la ressource est rendu lisible en enlevant les _
	var nomLisible = nom.split("_");
	// si necessaire on rétablis l'accord de nombre
	if(quantite < 2) {
		for (var i = 0; i < nomLisible.length; i++) {
			if (nomLisible[i].endsWith('s')) {
				nomLisible[i] = nomLisible[i].slice(0, -1);
				break;
			}
		}
	}
	nomLisible = nomLisible.join(" ");
	var imgCSS = "url('img/" + nom.replace("â","a") + ".png')";
	var txtHTML = quantite + " <small>" + nomLisible + "</small>";
	// Récupérer le bloc de la ressource à afficher, le créer s'il n'éxiste pas et
	// que c'est necessaire
	var blocRessource = select("#" + id);
	if(!blocRessource && quantite > 0){
		blocRessource = createDiv("");
		blocRessource.addClass("ressource");
		blocRessource.id(id);
		blocRessource.html(txtHTML)
		blocRessource.style("background-image", imgCSS);
		bloc.child(blocRessource);
	}
	// S'il existe déjà, se contenter de changer son contenu
	else if (blocRessource) {
		if(blocRessource.html() != txtHTML){
			blocRessource.html(txtHTML)
		}
	}
}

// Afficher le bloc perso concerné s'il faut
function afficherPerso(perso) {

	// Information relative au personnage à afficher
	var actif = perso.actif;
	var moment = perso.scenar[perso.scenarIdx];
	var id = "perso" + perso.idx;
	var imgCSS = "url('img/perso/" + perso.idx + ".png')";
	var txtHTML = "<p><small>" + perso.nom + " :</small> "+ moment.txt + "</p>";

	// Récuperer #perso-container, le créer s'il n'éxiste pas.
	var container = select("#perso-container");
	if(!container) container = createDiv("").id("perso-container");

	// Récupérer le bloc du personnage à afficher.
	var bloc = select("#" + id);
	// Le créer s'il n'éxiste pas et que c'est necessaire.
	if (!bloc && actif) {
		bloc = createDiv("");
		bloc.addClass("bloc");
		bloc.addClass("perso");
		bloc.id(id)
		// Ce bloc contient un div.content ou seront affichés le texte et l'image
		var content = createDiv(txtHTML);
		content.addClass("content");
		content.style("background-image", imgCSS);
		bloc.child(content);
		container.child(bloc)
		function faireVieillir(bloc) {
			return function(e) {
				bloc.removeClass('new');
			};
		}
		bloc.mouseOver(faireVieillir(bloc));
	}
	// Le supprimer si c'est necessaire.
	else if (bloc && !actif) {
		bloc.remove();
	}
	// Changer son contenu sinon.
	else if (bloc){
		var content = select('.content', bloc);
		if (content.html() != txtHTML) {
			if(!bloc.class().match('new')) bloc.addClass("new");
			content.html(txtHTML);
		}
	}

	// Le bloc du personnage contient aussi un div.choices ou sont affichés les
	// boutons oui/non
	if(bloc) {
		// Cette fonction renvoie une fonction à appeller quand on clic sur un bouton
		function faireFaire(moment, choix, perso) {
			return function(e) {faire(moment[choix], perso);};
		}

		// Récupérer ce bloc, le supprimer s'il éxiste et en créer un nouveau
		var choices = select(".choices", bloc)
		if (choices) choices.remove()
		choices = createDiv("");
		choices.addClass("choices");

		// Créer le bouton Oui
		var oui = createA("#!", "Oui");
		oui.addClass("button");
		oui.addClass("oui");
		// Les bouton sont differents selon que les actions correspondantes sont
		// posisbles ou pas.
		if (peutFaire(moment.oui)) {
			oui.mouseClicked(faireFaire(moment, 'oui', perso));
		}
		else {
			oui.addClass("impossible");
		}
		// Créer le bouton Non
		var non = createA("#!", "Non");
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

// Afficher le bloc cycle concerné s'il faut
function afficherCycle(cycle) {
	// Information relative au cycle à afficher
	var actif = cycle.actif;
	var temps = cycle.temps;
	var duree = cycle.scenar[cycle.scenarIdx].duree;
	var id = "cycle" + cycle.idx;
	var imgCSS = "url('img/cycle/" + cycle.idx + ".png')";
	var txtHTML = "<p>" + cycle.scenar[cycle.scenarIdx].txt + "</p>";

	// Récuperer #cycle-container, le créer s'il n'éxiste pas.
	var container = select("#cycle-container");
	if(!container) container = createDiv("").id("cycle-container");

	// Récupérer le bloc du personnage à afficher.
	var bloc = select("#" + id);
	// Le créer s'il n'éxiste pas et que c'est necessaire.
	if (!bloc && actif) {
		bloc = createDiv("");
		bloc.addClass("bloc");
		bloc.addClass("cycle");
		bloc.id(id)
		// Ce bloc contient un div.content ou seront affichés le texte et l'image
		var content = createDiv(txtHTML);
		content.addClass("content");
		content.style("background-image", imgCSS);
		bloc.child(content);
		container.child(bloc)
	}
	// Le supprimer si c'est necessaire.
	else if (bloc && !actif) {
		bloc.remove();
	}
	// Changer son contenu sinon.
	else if (bloc){
		var content = select('.content', bloc);
		if (content.html() != txtHTML) {
			content.html(txtHTML);
		}
	}

	// Le bloc du cycle contient aussi un div.progress-bar ou est affichée la
	// progression du cycle. Le récupérer et l'actualiser ou le créer.
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

// Afficher le bloc game over.
function afficherGameOver(msg, milis){
	var txtHTML = "<img src='img/game_over.png'/><p><strong>Game over</strong> : " + msg + "</p>";
	afficherFin(txtHTML, "echec", milis);
}

// Afficher le bloc victoire.
function afficherVictoire(milis){
	var txtHTML = "<img src='img/sceptre_chronique.png'/><p><strong>Victoire</strong> : Bravo ! Tu as gagné. Tu as permis à Yom de construire le sceptre chronique. Tu as sauvé l'univers. Tous les habitants de l'univers parlerons encore de toi dans 1000 ans.</p>";
	afficherFin(txtHTML, "victoire", milis);
}

//Affiche le bloc de fin (echec ou victoire)
function afficherFin(contenu, classe, milis) {

		contenu += "<hr/><p><small>Après "+ tempsLisible(milis) +", tu es arrivé à une des 9 fins du jeu. Clique sur Rejouer pour rejouer :</small> <a href='#'onclick='javascript:location.reload();'>Rejouer.</a></p>"

		bloc = createDiv("");
		bloc.addClass(classe);
		bloc.addClass("bloc");

		var content = createDiv(contenu);
		content.addClass("content");
		bloc.child(content);

}

////////////////////////////////////////////////////////////////////////////////
//                                Actions                                     //
////////////////////////////////////////////////////////////////////////////////

// Les actions sont écrites dans un genre de mini language dont la syntaxe est :
// `ACTION argument argument argument`
// Les actions traitées sont
//   - `GOTO scenarIdx`(eg. `GOTO 1`)
//       Changer le `scenarIdx` du personnage qui appelle l'action.
//       (Passer à une autre étape de son scénario)
//   - `GOTOWITH scenarIdx type idx` (eg. `GOTOWITH 1 perso 3`)
//       Changer le `scenarIdx` de l'ellement (`perso` ou `cycles`) indiqué
//   - `SUB valeur ressource` (eg. `SUB 3 bâtons`)
//       Soustraire la valeur indiquée à la ressource indiquée
//   - `ADD valeur ressource` (eg. `SUB 3 bâtons`)
//       Àjouter la valeur indiquée à la ressource indiquée
//   - `MULT type idx attribut multiplicateur` (eg. `MULT cycle 0 duree 2`)
//       Multiplie l'attribut indiqué par le multiplicateur indiqué
//   - `OPEN type idx` (eg. `OPEN perso 1`)
//       Rend `actif` de l'ellement (`perso` ou `cycles`) indiqué
//   - `CLOSE type idx` (eg. `CLOSE perso 1`)
//       Rend non `actif` de l'ellement (`perso` ou `cycles`) indiqué
//   - `GAMEOVER Le message à afficher` (eg. `GAMEOVER Le joueur est mort`)
//       Appelle la fonction afficherGameOver, met fin au jeu
//   - `WIN` (eg. `WIN`)
//       Appelle la fonction afficherVictoire, met fin au jeu

// Cette fonction retourne true ou false selon que les actions passées sont
// faisables
function peutFaire(actions){
	var possible = true;
	// Passer en revue toutes les actions du tableau
	for (var i = 0; i < actions.length; i++) {
		var args = actions[i].split(" ");
		var action = args.shift();
		// Observer les actions de type "SUB"
		if (action == "SUB"){
			// Vérifier qu'il y a assez de la ressource concernée.
			var quantite = args.shift();
			var ressource = ressources[args.shift()];
			possible &= ressource && ressource - quantite >= 0;
		}
	}
	return possible;
}

// Effectuer les actions passées sur le perso passé
function faire(actions, perso) {
	// parcourir toutes les actions du tableau `actions`
	for (var i = 0; i < actions.length; i++) {
		// Séparer les mots
		var args = actions[i].split(" ");
		// Le premier mot est l'action à appeller
		var action = args.shift();
		// L'appeller avec les autres mots dans un tableau en guise d'arguments
		if (action == "GOTO") goto(args);
		else if (action == "GOTOWITH") gotowith(args);
		else if (action == "SUB") sub(args);
		else if (action == "ADD") add(args);
		else if (action == "MULT") mult(args);
		else if (action == "OPEN") open(args);
		else if (action == "CLOSE") close(args);
		else if (action == "GAMEOVER") gameover(args);
		else if (action == "WIN") win(args);
		else console.error("Le mot clé de l'action n'a pas été reconnu");
	}
	// Une fois que c'est fait, actualiser
	actualiser()

	// Les fonctions correspondantes aux actions
	function goto(args) {
		perso.scenarIdx = args.shift();
	}
	function gotowith(args) {
		var scenarIdx = args.shift();
		var type = args.shift();
		var persoIdx = args.shift();
		for (var i = 0; i < histoire.perso.length; i++) {
			if(histoire[type][i].idx == persoIdx){
				histoire[type][i].scenarIdx = scenarIdx;
				break;
			}
		}
	}
	function add(args) {
		var quantite = int(args.shift());
		var ressource = args.join(" ");
		if (ressources[ressource]) ressources[ressource] += quantite;
		else ressources[ressource] = quantite;
		var cook = Cookies.get('ljdb1.0-ressources-decouvertes')
		if (cook){
			cook = JSON.parse(cook);
			set = new Set(cook);
			set.add(ressource);
			cook = Array.from(set);
		}
		else cook = [ressource];
		if (!tricheur) Cookies.set('ljdb1.0-ressources-decouvertes', cook, { expires: 365 })

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
		var cook = Cookies.get('ljdb1.0-personnages-rencontres')
		if (cook){
			cook = JSON.parse(cook);
			set = new Set(cook);
			set.add(idx);
			cook = Array.from(set);
		}
		else cook = [idx];
		if (!tricheur) Cookies.set('ljdb1.0-personnages-rencontres', cook, { expires: 365 })
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
		histoire[type][idx].scenar[histoire[type][idx].scenarIdx][attr] *= multiplicateur;
	}
	function gameover(args) {
		for (var i = 0; i < histoire.perso.length; i++) {
			histoire.perso[i].actif = false;
		}
		for (var i = 0; i < histoire.cycle.length; i++) {
			histoire.cycle[i].actif = false;
		}
		var msg = args.join(" ");
		var cook = Cookies.get('ljdb1.0-fins-explorees')
		if (cook){
			cook = JSON.parse(cook);
			set = new Set(cook);
			set.add(msg);
			cook = Array.from(set);
		}
		else cook = [msg];
		if (!tricheur) Cookies.set('ljdb1.0-fins-explorees', cook, { expires: 365 })
		afficherGameOver(msg, new Date().getTime() - tempsAuDebut)
	}
	function win(args) {
		for (var i = 0; i < histoire.perso.length; i++) {
			histoire.perso[i].actif = false;
		}
		for (var i = 0; i < histoire.cycle.length; i++) {
			histoire.cycle[i].actif = false;
		}
		var msg = "win"
		var cook = Cookies.get('ljdb1.0-fins-explorees')
		if (cook){
			cook = JSON.parse(cook);
			set = new Set(cook);
			set.add(msg);
			cook = Array.from(set);
		}
		else cook = [msg];
		if (!tricheur) Cookies.set('ljdb1.0-fins-explorees', cook, { expires: 365 })

		var temps = new Date().getTime() - tempsAuDebut;
		cook = Cookies.get('ljdb1.0-meilleur-temps');
		if(cook) {
			cook = JSON.parse(cook);
			if(temps < cook){
				cook = temps;
			}
		} else cook = temps
		if (!tricheur) Cookies.set('ljdb1.0meilleur-temps', cook, { expires: 365 });

		afficherVictoire(temps)
	}

}


////////////////////////////////////////////////////////////////////////////////
//                                Evenements                                  //
////////////////////////////////////////////////////////////////////////////////

// Les evennements sont un dictionnaire, les clés sont les conditions et les
// valeurs sont les actions à effectuer si la condition est éxécutée. Une fois
// les actions exécutées, l'évennement est supprimé du dictionnaire.
//
// la syntaxe des condtions est la suivante :
// `ressource opérateur veleur` ou `cycle idx attribut opérateur valeur`
// (eg. `bâtons > 10` ou `cycle 0 duree < 1`)
// Les opérateurs supportés sont `>`, `<`, `<=`, `>=`, `=`

// Cette fonction renvois vrai ou faux selon que la condition est vrai ou fausse
function verifier(condition){
	// on comparera valeur1 à valeur2
	var condition = condition.split(" ");
	var cle = condition.shift();
	var valeur1 = null;

	// si le premier argument corresepond à une ressource, ce sera valeur 1
	if (ressources[cle] !== undefined) valeur1 = ressources[cle];
	// sinon si le premier argument est `cycle`, la valeur de l'attribut
	// corresepondant au cycle indiqué sera la valeur 1
	else if (cle == "cycle"){
		var cycle = histoire[cle][condition.shift()]
		valeur1 = float(cycle.scenar[cycle.scenarIdx][condition.shift()]);
	}
	else if (cle == "START") {
		return true;
	}
	else return null;

	// Effectuer la comparaison
	var operateur = condition.shift();
	var valeur2 = float(condition.shift());
	if (operateur == ">") return valeur1 > valeur2;
	else if (operateur == ">=") return valeur1 >= valeur2;
	else if (operateur == "<") return valeur1 < valeur2;
	else if (operateur == "<=") return valeur1<= valeur2;
	else if (operateur == "=") return valeur1 == valeur2;
	else return null;
}

// Regarder toutes les conditions de l'objet evenements.
// Faire les actions correspondants aux conditions vérifiées.
function evenements () {
	for (var condition in histoire.evenements) {
		if (histoire.evenements.hasOwnProperty(condition)) {
			if (histoire.evenements[condition] && verifier(condition)) {
				action = histoire.evenements[condition];
				histoire.evenements[condition] = null;
				faire(action);
			}
		}
	}
}


////////////////////////////////////////////////////////////////////////////////
//                                Cycles                                      //
////////////////////////////////////////////////////////////////////////////////

// Faire tourner les cycles
function cycles() {
	// frames par secondes pour l'actualisation des cycles
	var fps = 50;

	// renvois une fonction à appeller à chaque intervale
	function faireProgress(idx) {
		return function() {
			// Si le cycle n'est plus actif, arrêter l'interval
			if (! histoire.cycle[idx].actif){
				clearInterval(histoire.cycle[idx].interval)
				histoire.cycle[idx].interval = 0;
			}
			// Faire progresser `temps`
			histoire.cycle[idx].temps += 1/fps;
			// S'il dépasse `duree` le remettre à 0 et effectuer les actions correspondantes
			if (histoire.cycle[idx].temps>=histoire.cycle[idx].scenar[histoire.cycle[idx].scenarIdx].duree){
				histoire.cycle[idx].temps = 0;
				faire(histoire.cycle[idx].scenar[histoire.cycle[idx].scenarIdx].action)
			}
			// réafficher le cycle
			afficherCycle(histoire.cycle[idx])
		}
	}

	// Parcourir les cycles
	for (var i = 0; i < histoire.cycle.length; i++) {
		// Lancer les cycles qui sont actif et qui ne sont pas encore lancés
		if(! histoire.cycle[i].interval && histoire.cycle[i].actif) {
			histoire.cycle[i].temps = 0;
			histoire.cycle[i].interval = setInterval(faireProgress(i), 1000/fps);
		}
	}
}


// TRICHE

function triche(n){tricheur=true;var r=ressources;r["bâtons"]=r.citrons=r.chaussures=r.paires_de_chaussures=r.balles_de_ping_pong=r.diamants=r.boites_en_carton=n;actualiser();clear();print("Wikipedia :");return "La tricherie est le fait de ne pas respecter des règles pour profiter d'avantages. On peut tricher au jeu, dans le sport, à un examen. Quelqu'un qui triche est appelé un tricheur. Lorsqu'on découvre que quelqu'un a triché, il est généralement sanctionné.";}
