# Portfolio Léo Murça

Portfolio animé en HTML, CSS et JavaScript, sans dépendance ni installation.

## Ouvrir le site

Double-clique sur `index.html` : tout fonctionne directement dans le navigateur.
(Les polices viennent de Google Fonts, une connexion internet les charge.)

## Modifier le contenu

Tout le texte est dans **`js/data.js`** :

| Ce que tu veux changer | Où |
| --- | --- |
| Email, téléphone, ville | `PROFIL` |
| Les projets | `PROJETS` (un bloc `{ ... }` par projet) |
| Les filtres de projets | `CATEGORIES` |
| La frise du parcours | `PARCOURS` |
| Les compétences | `COMPETENCES` |

Pour **ajouter un projet** : copie un bloc existant dans `PROJETS`, change le `slug`
(sans espace ni accent, il sert d'adresse : `#/projet/mon-slug`) et mets l'image dans `assets/img/`.

Les champs optionnels (`equipe`, `resultat`, `role`, `chiffres`, `code`, `outils`, `liens`)
ne s'affichent que s'ils sont remplis. Exemple de liens :

```js
liens: [
  { label: "Voir le site", url: "https://..." },
  { label: "Code sur GitHub", url: "https://github.com/..." },
],
```

`cadrage: "contenir"` affiche l'image en entier (utile pour un logo) au lieu de la recadrer.

## Animations

- Écran de lancement façon terminal (une fois par session)
- Ville de nuit en pixel-art générée en canvas : pluie, néons, étoiles filantes, parallaxe ;
  un clic sur un immeuble allume ou éteint ses étages, un clic dans le ciel lance une étoile filante
- Nom tapé au clavier, titres de section qui se « décodent »
- Projets qui s'ouvrent comme un store, inclinaison 3D au survol, filtres animés
- Transition d'image entre la liste et la page projet (View Transitions)
- Frise du parcours qui se dessine au défilement, compteurs animés
- Script de The Farmer Was Replaced exécutable : le drone plante les tournesols ligne par ligne
- Curseur personnalisé, boutons aimantés, barre de progression

Tout respecte le réglage « réduire les animations » du système.

## Fichiers

```
index.html       structure de la page
css/style.css    styles et animations CSS
js/data.js       contenu (à modifier)
js/ville.js      la ville en canvas du haut de page
js/main.js       navigation, rendu des projets, animations
assets/img/      captures des projets (compressées)
```

## Mettre en ligne

Le dossier est un site statique : il suffit de l'envoyer tel quel sur
GitHub Pages, Netlify ou Vercel (aucune commande de build).
