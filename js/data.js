/*
  Données du portfolio.
  Pour ajouter un projet : copie un bloc { ... } et adapte-le.
  Les champs vides ou absents (equipe, resultat, role, outils, chiffres, code, liens)
  ne sont simplement pas affichés.

  categories possibles : "web", "jeu", "equipe"
*/

window.PROFIL = {
  nom: "Léo Murça",
  email: "leo.murca@edu.devinci.fr",
  telephone: "06 63 73 79 88",
  telephoneLien: "+33663737988",
  ville: "Montfermeil (93)",
};

window.CATEGORIES = [
  { id: "web", label: "Sites web" },
  { id: "jeu", label: "Jeux et algorithmie" },
  { id: "equipe", label: "En équipe" },
];

window.PROJETS = [
  {
    slug: "collection-lol",
    titre: "Runedex",
    accroche:
      "Un jeu de collection de cartes League of Legends : boosters à ouvrir, échanges entre joueurs, expéditions et duels.",
    annee: 2026,
    cadre: "Projet final de 1re année",
    equipe: "",
    resultat: "Présenté en fin d'année",
    role: "",
    categories: ["web"],
    tags: ["Site web", "PHP et SQLite", "API", "Authentification"],
    image: "assets/img/runedex.jpg",
    imageAlt:
      "Page Boosters de Runedex : une grille de paquets bleu nuit à cadre doré (Assassins, Mages, Tireurs…) et le panneau du paquet choisi avec le bouton « Ouvrir ».",
    contexte: [
      "C'est le projet que j'ai présenté à la fin de ma 1re année, sous le nom « LOL c'est bien ». Le sujet : construire un site de collection de cartes autour de League of Legends, avec les mécaniques d'un vrai jeu de cartes à collectionner.",
      "La version finale a été perdue. En novembre 2026, je l'ai reconstruite à partir de mon devoir d'avril et renommée Runedex. J'en ai profité pour refaire le design et ajouter de nouvelles mécaniques de jeu.",
      "Toutes les données des champions et des objets viennent de Data Dragon, l'API officielle de Riot Games. Les comptes, les collections et les échanges sont enregistrés dans une base SQLite côté serveur.",
    ],
    objectifs: [
      "Limiter l'ouverture des boosters dans le temps, avec un délai vérifié côté serveur",
      "Créer un vrai système de connexion et lier chaque collection à un compte",
      "Repérer et gérer les doublons",
      "Gérer les échanges de cartes entre joueurs",
      "Mettre en place un système de favoris",
    ],
    fonctionnalitesTitre: "Fonctionnalités",
    fonctionnalites: [
      {
        titre: "Boosters",
        texte:
          "Un paquet par classe de champion (assassins, mages, tanks…). Un booster est ajouté au stock toutes les 10 minutes, et on peut en ouvrir 1, 5 ou 10 d'un coup, avec une animation de déchirure et une révélation carte par carte.",
      },
      {
        titre: "Booster holographique",
        texte:
          "Un booster sur 100 est holographique : le paquet devient arc-en-ciel à l'ouverture et donne 50 cartes au lieu de 5. Le tirage se fait côté serveur, donc impossible à forcer.",
      },
      {
        titre: "Collection et favoris",
        texte:
          "Toutes les cartes obtenues sont rangées dans un album avec le taux de complétion. Une étoile met une carte en favori pour l'afficher en premier.",
      },
      {
        titre: "Doublons et rubis",
        texte:
          "Les doublons se recyclent en rubis, la monnaie du jeu, qui sert à acheter de nouveaux boosters.",
      },
      {
        titre: "Échanges entre joueurs",
        texte:
          "On propose une carte contre une autre à un joueur, qui accepte ou refuse. À l'acceptation, tout est revérifié dans une transaction pour éviter les triches.",
      },
      {
        titre: "Expéditions et skins",
        texte:
          "On envoie un champion en expédition sur une carte de Runeterra dessinée en SVG. Il revient avec des rubis, des objets et parfois un skin à équiper.",
      },
      {
        titre: "Objets et duels",
        texte:
          "On fabrique des objets à partir de composants, puis on les équipe sur un champion pour affronter 10 paliers de bots. Le combat est calculé avec les vraies statistiques du jeu.",
      },
      {
        titre: "Défis et classement",
        texte:
          "Des défis rapportent des rubis, une récompense quotidienne augmente avec les jours de connexion d'affilée, et un classement compare les joueurs.",
      },
      {
        titre: "Comptes et thème",
        texte:
          "Inscription et connexion avec mots de passe hachés, plus un mode clair et un mode sombre.",
      },
    ],
    apprentissages: [
      "Concevoir une base de données et écrire les requêtes SQL d'un vrai jeu",
      "Vérifier les règles côté serveur (délais, stock, échanges) pour qu'on ne puisse pas tricher depuis le navigateur",
      "Utiliser des transactions pour garder des données cohérentes entre plusieurs comptes",
      "Passer par un proxy PHP pour exploiter une API externe",
      "Reprendre un ancien projet et le faire évoluer sans tout réécrire",
      "Présenter et défendre un projet à l'oral",
    ],
    outils: ["HTML", "CSS", "JavaScript", "PHP", "SQLite (PDO)", "API Data Dragon"],
    chiffres: [
      { valeur: 167, suffixe: "", label: "champions à collectionner" },
      { valeur: 9, suffixe: "", label: "types de boosters" },
      { valeur: 10, suffixe: "", label: "paliers de duels" },
    ],
    code: null,
    liens: [{ label: "Code sur GitHub", url: "https://github.com/leomurca2006/runedex" }],
  },

  {
    slug: "ocean-studio",
    titre: "Océan Studio",
    accroche:
      "Un site, un jeu vidéo et une charte graphique pour une association fictive qui protège les bélugas.",
    annee: 2026,
    cadre: "Projet transversal",
    equipe: "10 personnes",
    resultat: "3e sur 9 groupes",
    role: "",
    categories: ["web", "jeu", "equipe"],
    tags: ["Site web", "Jeu vidéo", "Identité visuelle"],
    image: "assets/img/ocean-studio.jpg",
    cadrage: "contenir", // "contenir" = image affichée en entier (logo)
    imageAlt:
      "Logo Océan Studio : cinq tuiles blanches formant le mot OCEAN, avec une queue de baleine et des nageoires dessinées dans les lettres.",
    contexte: [
      "Projet transversal mené en groupe de dix. Le brief : représenter une association fictive qui veut protéger les bélugas de manière ludique, et lui donner une identité complète.",
      "Nous devions livrer trois choses : un site web, un jeu vidéo et une charte graphique. Le logo en est issu : chaque lettre est une tuile, avec une queue de baleine dans le O et des nageoires cachées dans les autres lettres.",
    ],
    objectifs: [
      "Créer une identité visuelle cohérente pour l'association",
      "Développer un site qui présente l'association et sa cause",
      "Concevoir un jeu vidéo qui sensibilise à la protection des bélugas",
      "Coordonner une équipe de dix personnes sur trois livrables",
    ],
    fonctionnalitesTitre: "Livrables",
    fonctionnalites: [
      {
        titre: "Le site web",
        texte: "La vitrine de l'association : sa mission, son univers et sa cause.",
      },
      {
        titre: "Le jeu vidéo",
        texte:
          "Une façon ludique de sensibiliser le public à la protection des bélugas.",
      },
      {
        titre: "La charte graphique",
        texte:
          "Logo, couleurs et règles visuelles partagées par le site et le jeu.",
      },
    ],
    chiffres: [
      { valeur: 10, suffixe: "", label: "personnes dans l'équipe" },
      { valeur: 3, suffixe: "", label: "livrables : site, jeu, charte" },
      { valeur: 3, suffixe: "e", label: "place sur 9 groupes" },
    ],
    apprentissages: [
      "Travailler à dix : se répartir les tâches et tenir un planning commun",
      "Faire dialoguer design, développement web et jeu vidéo sur un même projet",
      "Rendre un sujet sérieux accessible grâce au jeu",
    ],
    outils: [],
    code: null,
    liens: [],
  },

  {
    slug: "pokedex",
    titre: "Pokédex",
    accroche:
      "Le Pokédex revisité dans une interface plus agréable, branchée sur l'API Pokémon.",
    annee: 2026,
    cadre: "Projet de cours",
    equipe: "Binôme",
    resultat: "",
    role: "",
    categories: ["web", "equipe"],
    tags: ["Site web", "API", "Recherche et filtres"],
    image: "assets/img/pokedex.jpg",
    imageAlt:
      "Interface du Pokédex : une grille de cartes Bulbizarre, Herbizarre, Florizarre et Salamèche, avec une barre de recherche et un filtre par type.",
    contexte: [
      "Projet réalisé en binôme. L'idée : utiliser l'API Pokémon (PokéAPI) pour reproduire le Pokédex dans une interface plus agréable à parcourir.",
      "Toutes les données (numéros, noms, sprites, types) viennent de l'API. Notre travail : les récupérer, les afficher proprement et rendre la liste facile à explorer.",
    ],
    objectifs: [
      "Récupérer les données des Pokémon depuis une API externe",
      "Afficher chaque Pokémon sous forme de carte",
      "Permettre de chercher et de filtrer rapidement",
      "Ajouter une couche de personnalisation avec les favoris",
    ],
    fonctionnalitesTitre: "Fonctionnalités",
    fonctionnalites: [
      {
        titre: "Cartes Pokémon",
        texte:
          "Chaque Pokémon a sa carte avec son numéro, son sprite et son nom, chargés depuis l'API.",
      },
      {
        titre: "Recherche",
        texte: "Une barre de recherche pour retrouver un Pokémon par son nom.",
      },
      {
        titre: "Filtre par type",
        texte: "Un menu « Tous les types » pour n'afficher qu'un type de Pokémon.",
      },
      {
        titre: "Favoris",
        texte:
          "Un cœur sur chaque carte, et un compteur qui indique combien de Pokémon sont en favoris.",
      },
      {
        titre: "Musique d'ambiance",
        texte: "Un lecteur audio intégré pour écouter une musique en parcourant le Pokédex.",
      },
    ],
    apprentissages: [
      "Consommer une API REST et gérer des requêtes asynchrones",
      "Transformer des données brutes en interface lisible",
      "Rechercher et filtrer une liste côté client",
      "Travailler à deux sur le même code",
    ],
    // À vérifier : adapte cette liste aux technos réellement utilisées
    outils: ["HTML", "CSS", "JavaScript", "PokéAPI"],
    chiffres: [],
    code: null,
    liens: [{ label: "Code sur GitHub", url: "https://github.com/sashadlp/Pokedex-projet-1" }],
  },

  {
    slug: "the-farmer-was-replaced",
    titre: "The Farmer Was Replaced",
    accroche:
      "Automatiser une ferme entière avec un drone, en écrivant du code très proche du Python.",
    annee: 2026,
    cadre: "Jeu de programmation",
    equipe: "Solo",
    resultat: "",
    role: "",
    categories: ["jeu"],
    tags: ["Algorithmie", "Python", "Automatisation"],
    image: "assets/img/farmer.jpg",
    imageAlt:
      "Capture du jeu : une dizaine de fenêtres de code (citrouilles, tournesols, cactus, arbres) à côté d'un champ de citrouilles géantes.",
    contexte: [
      "Dans ce jeu de programmation très apprécié de la communauté, on n'utilise pas la souris pour les tâches répétitives des jeux de ferme. Le fermier est remplacé par un drone coiffé d'un chapeau de paille, qu'il faut entièrement automatiser dans un langage proche du Python.",
      "Chaque nouvelle culture ajoute une règle. Il faut donc sans cesse réécrire ses scripts pour exploiter la ferme au mieux : c'est une suite de petits problèmes d'algorithmie.",
    ],
    objectifs: [
      "Automatiser toutes les cultures sans intervention manuelle",
      "Écrire des fonctions réutilisables pour chaque type de culture",
      "Optimiser les déplacements du drone pour récolter plus vite",
    ],
    fonctionnalitesTitre: "Mes scripts",
    fonctionnalites: [
      {
        titre: "Citrouilles",
        texte:
          "Le drone parcourt la grille, laboure si besoin et replante les citrouilles qui n'ont pas poussé, pour obtenir des citrouilles géantes.",
      },
      {
        titre: "Tournesols",
        texte:
          "Je plante des tournesols partout, puis je récolte en priorité ceux qui ont 15 pétales, le maximum, pour produire le plus d'énergie.",
      },
      {
        titre: "Cactus",
        texte:
          "Les cactus doivent être triés par taille. Mon script compare chaque cactus à ses voisins avec measure() et les échange avec swap() : un tri à bulles en deux dimensions.",
      },
      {
        titre: "Arbres",
        texte:
          "Les arbres poussent mal côte à côte : je les plante en alternance selon la parité de la ligne.",
      },
      {
        titre: "Labyrinthes",
        texte:
          "Je génère des labyrinthes avec la Weird Substance et je travaille sur un algorithme de déplacement pour y trouver le trésor.",
      },
    ],
    chiffresNote: "Ressources accumulées par mes scripts dans ma partie.",
    chiffres: [
      { valeur: 829, suffixe: " M", label: "de bois récolté" },
      { valeur: 164, suffixe: " M", label: "de foin" },
      { valeur: 21.6, suffixe: " M", label: "de carottes" },
      { valeur: 13.3, suffixe: " M", label: "de citrouilles" },
    ],
    code: {
      titre: "Extrait du script des tournesols",
      langage: "python",
      simulation: "tournesols", // affiche la mini-ferme animée à côté du code
      contenu: `def farmPower():
    for y in range(get_world_size()):
        for i in range(get_world_size()):
            harvest()
            if get_ground_type() != Grounds.Soil:
                till()
            plant(Entities.Sunflower)
            move(North)
        move(East)
    numSunFlowers = get_world_size()**2
    pedalsCounter = 15
    while numSunFlowers != 0:
        for y in range(get_world_size()):
            for i in range(get_world_size()):
                if measure() == pedalsCounter:
                    while can_harvest() == False:
                        do_a_flip()
                    harvest()`,
    },
    apprentissages: [
      "Décomposer un problème en fonctions réutilisables",
      "Parcourir une grille avec des boucles imbriquées",
      "Appliquer un algorithme de tri à un cas concret",
      "Optimiser : moins de déplacements, plus de ressources par minute",
    ],
    outils: ["Syntaxe Python", "Boucles et fonctions", "Algorithmes de tri"],
    liens: [],
  },

  {
    slug: "the-miner-was-replaced",
    titre: "The Miner Was Replaced",
    accroche:
      "Programmer un drone qui creuse, explore et extrait des ressources en optimisant ses trajets.",
    annee: 2026,
    cadre: "Jeu de programmation",
    equipe: "Solo",
    resultat: "",
    role: "",
    categories: ["jeu"],
    tags: ["Algorithmie", "Python", "Optimisation"],
    image: "assets/img/miner.jpg",
    cadrage: "contenir",
    imageAlt:
      "Visuel de The Miner Was Replaced : un drone avec un casque de mineur au-dessus de blocs de minerai.",
    contexte: [
      "Même principe que The Farmer Was Replaced, mais sous terre. Il faut programmer un drone, toujours dans un langage simplifié très proche du Python, pour creuser, explorer et extraire des ressources.",
      "Ici, tout se joue sur le déplacement : chaque mouvement coûte du temps, il faut donc optimiser les trajectoires du drone.",
    ],
    objectifs: [
      "Automatiser le minage de bout en bout",
      "Explorer efficacement des zones inconnues",
      "Réduire au maximum les déplacements inutiles",
    ],
    fonctionnalitesTitre: "Ce que fait mon drone",
    fonctionnalites: [
      { titre: "Creuser", texte: "Le drone creuse ses galeries tout seul, case par case." },
      { titre: "Explorer", texte: "Il parcourt la mine pour repérer les ressources." },
      { titre: "Extraire", texte: "Il récupère les minerais trouvés sur son chemin." },
      {
        titre: "Optimiser",
        texte: "Ses trajets sont pensés pour limiter les allers-retours.",
      },
    ],
    apprentissages: [
      "Raisonner en trajectoires et en coût de déplacement",
      "Réutiliser les réflexes acquis sur The Farmer Was Replaced",
      "Améliorer un script par itérations successives",
    ],
    outils: ["Syntaxe Python", "Parcours et exploration", "Optimisation de trajets"],
    chiffres: [],
    code: null,
    liens: [],
  },
];

window.PARCOURS = [
  {
    periode: "2025",
    titre: "Bac général",
    texte: "Spécialités mathématiques et NSI (numérique et sciences informatiques).",
  },
  {
    periode: "2025 – 2026",
    titre: "IIM, 1re année",
    texte:
      "Premiers projets web : le Pokédex en binôme, le projet transversal Océan Studio, puis le site de collection LoL (Runedex) présenté en fin d'année.",
  },
  {
    periode: "2026 – 2027",
    titre: "IIM, 2e année en développement web",
    texte: "En cours. Je me spécialise en développement web.",
    enCours: true,
  },
];

window.COMPETENCES = [
  {
    groupe: "Développement web",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
    projets: ["collection-lol", "pokedex", "ocean-studio"],
  },
  {
    groupe: "Données et API",
    items: ["API REST", "Requêtes asynchrones", "Authentification", "Recherche et filtres", "PHP", "SQL (SQLite)"],
    projets: ["pokedex", "collection-lol"],
  },
  {
    groupe: "Algorithmie",
    items: ["Syntaxe Python", "Parcours de grille", "Algorithmes de tri", "Optimisation de trajets"],
    projets: ["the-farmer-was-replaced", "the-miner-was-replaced"],
  },
  {
    groupe: "Travail en équipe",
    items: ["Projet à 10 personnes", "Binôme", "Présentation orale"],
    projets: ["ocean-studio", "pokedex", "collection-lol"],
  },
];
