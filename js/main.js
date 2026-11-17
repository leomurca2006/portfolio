/*
  Portfolio Léo Murça : rendu, navigation et animations.
  Aucune dépendance : ouvrir index.html suffit.
*/
(function () {
  "use strict";

  const doc = document.documentElement;
  doc.classList.add("js");

  const PROJETS = window.PROJETS || [];
  const CATEGORIES = window.CATEGORIES || [];
  const PARCOURS = window.PARCOURS || [];
  const COMPETENCES = window.COMPETENCES || [];
  const PROFIL = window.PROFIL || {};

  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointeurFin = window.matchMedia("(hover: hover) and (pointer: fine)");
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  const TITRE_ACCUEIL = document.title;

  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  function echapper(texte) {
    return String(texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function lettres(texte) {
    return Array.from(texte);
  }

  // url() dans une variable CSS est résolue depuis la feuille de style :
  // on passe donc une adresse absolue.
  function fondImage(chemin) {
    const absolue = new URL(chemin, document.baseURI).href;
    return `--img: url('${echapper(absolue)}')`;
  }

  function projetParSlug(slug) {
    return PROJETS.find((p) => p.slug === slug);
  }

  function enumeration(elements) {
    if (elements.length <= 1) return elements.join("");
    return elements.slice(0, -1).join(", ") + " et " + elements[elements.length - 1];
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  /* ==========================================================
     Rendu de l'accueil
     ========================================================== */

  function rendreListe() {
    const liste = $("#projets-liste");
    liste.innerHTML = PROJETS.map((p) => {
      const meta = [p.annee, p.cadre, p.equipe].filter(Boolean).map((m) => `<span>${echapper(m)}</span>`).join("");
      const tags = (p.tags || []).map((t) => `<li>${echapper(t)}</li>`).join("");
      return `
        <li class="projet" data-slug="${echapper(p.slug)}" data-categories="${echapper((p.categories || []).join(" "))}">
          <a class="projet-lien" href="#/projet/${echapper(p.slug)}" data-curseur="voir">
            <div class="projet-media">
              <div class="fenetre${p.cadrage === "contenir" ? " contenir" : ""}" style="${fondImage(p.image)}">
                <img src="${echapper(p.image)}" alt="" loading="lazy" decoding="async">
                <span class="reflet" aria-hidden="true"></span>
              </div>
            </div>
            <div class="projet-texte">
              <h3 class="projet-titre" style="--i:0">${echapper(p.titre)}</h3>
              <p class="projet-accroche" style="--i:1">${echapper(p.accroche)}</p>
              <p class="projet-meta" style="--i:2">${meta}</p>
              ${tags ? `<ul class="puces" style="--i:3" aria-label="Thèmes">${tags}</ul>` : ""}
              <span class="projet-cta" style="--i:4">Voir le projet</span>
            </div>
          </a>
        </li>`;
    }).join("");
    alterner();
    majCompte();
  }

  function alterner() {
    $$(".projet").filter((el) => !el.hidden).forEach((el, i) => el.classList.toggle("inverse", i % 2 === 1));
  }

  function majCompte() {
    const n = $$(".projet").filter((el) => !el.hidden).length;
    $(".projets-compte").innerHTML = `<span id="projets-nombre">${n}</span> projet${n > 1 ? "s" : ""}`;
  }

  /* ---------- Filtres avec animation FLIP ---------- */

  let filtreActif = "tous";

  function rendreFiltres() {
    const conteneur = $("#filtres");
    const options = [{ id: "tous", label: "Tous", nb: PROJETS.length }].concat(
      CATEGORIES.map((c) => ({ id: c.id, label: c.label, nb: PROJETS.filter((p) => (p.categories || []).includes(c.id)).length }))
    ).filter((o) => o.nb > 0);

    conteneur.innerHTML = options.map((o) =>
      `<button type="button" class="filtre" data-filtre="${o.id}" aria-pressed="${o.id === "tous"}">${echapper(o.label)}<span class="filtre-nb">${o.nb}</span></button>`
    ).join("");

    conteneur.addEventListener("click", (e) => {
      const bouton = e.target.closest(".filtre");
      if (bouton) appliquerFiltre(bouton.dataset.filtre);
    });
  }

  function appliquerFiltre(id) {
    if (id === filtreActif) return;
    filtreActif = id;
    $$(".filtre").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filtre === id)));

    const items = $$(".projet");
    const morceaux = items.flatMap((el) => [$(".projet-media", el), $(".projet-texte", el)]);
    const avant = new Map(morceaux.map((m) => [m, m.getBoundingClientRect()]));
    const dejaVisibles = new Set(items.filter((el) => !el.hidden));

    items.forEach((el) => {
      el.hidden = !(id === "tous" || el.dataset.categories.split(" ").includes(id));
    });
    alterner();
    majCompte();

    if (reduit.matches) return;

    items.forEach((el) => {
      if (el.hidden) return;
      if (!dejaVisibles.has(el)) {
        el.classList.add("visible");
        el.animate(
          [{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }],
          { duration: 700, easing: EASE, delay: 120 }
        );
        return;
      }
      [$(".projet-media", el), $(".projet-texte", el)].forEach((m) => {
        const a = avant.get(m);
        const b = m.getBoundingClientRect();
        const dx = a.left - b.left;
        const dy = a.top - b.top;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          m.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
            { duration: 750, easing: EASE }
          );
        }
      });
    });
  }

  /* ---------- Parcours, compétences, contact ---------- */

  function rendreFrise() {
    const frise = $("#frise");
    frise.innerHTML =
      `<span class="frise-trait" aria-hidden="true"></span>` +
      PARCOURS.map((e) => `
        <li class="etape${e.enCours ? " en-cours" : ""}">
          <span class="etape-periode">${echapper(e.periode)}</span>
          <h4 class="etape-titre">${echapper(e.titre)}</h4>
          <p class="etape-texte">${echapper(e.texte)}</p>
        </li>`).join("");
  }

  function rendreCompetences() {
    $("#competences-grille").innerHTML = COMPETENCES.map((g) => {
      const liens = (g.projets || []).map(projetParSlug).filter(Boolean)
        .map((p) => `<a href="#/projet/${echapper(p.slug)}">${echapper(p.titre)}</a>`);
      return `
        <div class="competence-groupe">
          <h3>${echapper(g.groupe)}</h3>
          <ul class="competence-items">${g.items.map((it, i) => `<li style="--i:${i}">${echapper(it)}</li>`).join("")}</ul>
          ${liens.length ? `<p class="competence-vu">Mis en pratique dans ${enumeration(liens)}.</p>` : ""}
        </div>`;
    }).join("");
  }

  function rendreContact() {
    if (PROFIL.email) {
      const lien = $("#contact-email");
      lien.href = "mailto:" + PROFIL.email;
      lien.textContent = PROFIL.email;
    }
    if (PROFIL.telephone) {
      const tel = $("#contact-tel");
      tel.textContent = PROFIL.telephone;
      tel.href = "tel:" + (PROFIL.telephoneLien || PROFIL.telephone.replace(/\s/g, ""));
    }
    if (PROFIL.ville) {
      $("#contact-ville").textContent = PROFIL.ville;
      $("#apropos-ville").textContent = PROFIL.ville;
    }

    $("#copier-email").addEventListener("click", async () => {
      const email = PROFIL.email || $("#contact-email").textContent;
      let ok = false;
      try {
        await navigator.clipboard.writeText(email);
        ok = true;
      } catch (e) {
        const zone = document.createElement("textarea");
        zone.value = email;
        zone.setAttribute("readonly", "");
        zone.style.position = "fixed";
        zone.style.opacity = "0";
        document.body.appendChild(zone);
        zone.select();
        try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
        zone.remove();
      }
      afficherToast(ok ? "Adresse copiée" : "Copie impossible : sélectionnez l'adresse à la main");
    });
  }

  let minuteurToast = 0;
  function afficherToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(minuteurToast);
    minuteurToast = setTimeout(() => toast.classList.remove("visible"), 2400);
  }

  /* ==========================================================
     Page projet
     ========================================================== */

  const MOTS_CLES = new Set(["def", "for", "in", "if", "elif", "else", "while", "return", "import", "from", "and", "or", "not", "True", "False", "None", "break", "continue", "pass"]);

  function colorer(ligne) {
    const re = /(#.*$)|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;
    let sortie = "";
    let m;
    while ((m = re.exec(ligne))) {
      const [jeton, commentaire, chaine, nombre, ident] = m;
      if (commentaire) sortie += `<span class="t-c">${echapper(commentaire)}</span>`;
      else if (chaine) sortie += `<span class="t-s">${echapper(chaine)}</span>`;
      else if (nombre) sortie += `<span class="t-n">${nombre}</span>`;
      else if (ident) {
        if (MOTS_CLES.has(ident)) sortie += `<span class="t-k">${ident}</span>`;
        else if (ligne[re.lastIndex] === "(") sortie += `<span class="t-f">${ident}</span>`;
        else if (/^[A-Z]/.test(ident)) sortie += `<span class="t-e">${ident}</span>`;
        else sortie += ident;
      } else sortie += echapper(jeton);
    }
    return sortie;
  }

  function rendreCode(code) {
    const lignes = code.contenu.split("\n").map((l, i) =>
      `<span class="ligne" data-ligne="${i}"><span class="num">${i + 1}</span>${colorer(l)}</span>`
    ).join("");
    const sim = code.simulation === "tournesols";
    return `
      <div class="code" data-simulation="${sim ? "tournesols" : ""}">
        <div class="code-barre">
          <p class="code-titre">${echapper(code.titre || "Extrait de code")}</p>
          ${sim ? `<button type="button" class="bouton bouton-contour bouton-petit" data-executer>Exécuter le script</button>` : ""}
        </div>
        <div class="code-corps${sim ? " avec-sim" : ""}">
          <pre aria-label="${echapper(code.titre || "Extrait de code")}"><code>${lignes}</code></pre>
          ${sim ? `
            <div class="sim">
              <div class="sim-grille" aria-hidden="true">
                ${Array.from({ length: 25 }, () => `<span class="sim-case"></span>`).join("")}
                <span class="sim-drone"></span>
              </div>
              <p class="sim-statut" aria-live="polite">Ferme de 5 × 5 cases, en attente.</p>
            </div>` : ""}
        </div>
      </div>`;
  }

  function titreAnime(texte) {
    let i = 0;
    return texte.split(" ").map((mot) =>
      `<span class="mot">${lettres(mot).map((c) => `<span class="lettre" style="--i:${i++}">${echapper(c)}</span>`).join("")}</span>`
    ).join(" ");
  }

  function formaterNombre(valeur, decimales) {
    return valeur.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  }

  function rendreDetail(p, avecVT) {
    const index = PROJETS.indexOf(p);
    const precedent = PROJETS[(index - 1 + PROJETS.length) % PROJETS.length];
    const suivant = PROJETS[(index + 1) % PROJETS.length];

    const meta = [
      ["Année", p.annee],
      ["Cadre", p.cadre],
      ["Équipe", p.equipe],
      ["Résultat", p.resultat],
    ].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${echapper(v)}</dd></div>`).join("");

    const blocs = [];
    if (p.contexte && p.contexte.length) {
      blocs.push({ id: "contexte", titre: "Contexte", html: p.contexte.map((t) => `<p>${echapper(t)}</p>`).join("") });
    }
    if (p.role) {
      blocs.push({ id: "role", titre: "Mon rôle", html: `<p>${echapper(p.role)}</p>` });
    }
    if (p.objectifs && p.objectifs.length) {
      blocs.push({ id: "objectifs", titre: "Objectifs", html: `<ul class="liste">${p.objectifs.map((o) => `<li>${echapper(o)}</li>`).join("")}</ul>` });
    }
    if (p.fonctionnalites && p.fonctionnalites.length) {
      blocs.push({
        id: "fonctionnalites",
        titre: p.fonctionnalitesTitre || "Fonctionnalités",
        html: `<div class="fonctions">${p.fonctionnalites.map((f, i) =>
          `<div class="fonction" style="--i:${i}"><h3>${echapper(f.titre)}</h3><p>${echapper(f.texte)}</p></div>`
        ).join("")}</div>`,
      });
    }
    if (p.chiffres && p.chiffres.length) {
      blocs.push({
        id: "chiffres",
        titre: "En chiffres",
        html: (p.chiffresNote ? `<p class="detail-note">${echapper(p.chiffresNote)}</p>` : "") +
          `<div class="chiffres">${p.chiffres.map((c) => {
            const dec = Number.isInteger(c.valeur) ? 0 : 1;
            const suffixe = (c.suffixe || "").replace(/^ /, " ");
            return `<div class="chiffre"><span class="chiffre-valeur" data-valeur="${c.valeur}" data-decimales="${dec}" data-suffixe="${echapper(suffixe)}">${formaterNombre(c.valeur, dec)}${echapper(suffixe)}</span><span class="chiffre-label">${echapper(c.label)}</span></div>`;
          }).join("")}</div>`,
      });
    }
    if (p.code) {
      blocs.push({ id: "code", titre: "Le code", html: rendreCode(p.code) });
    }
    if (p.apprentissages && p.apprentissages.length) {
      blocs.push({ id: "apprentissages", titre: "Ce que j'ai appris", html: `<ul class="liste liste-cyan">${p.apprentissages.map((a) => `<li>${echapper(a)}</li>`).join("")}</ul>` });
    }
    if (p.outils && p.outils.length) {
      blocs.push({ id: "outils", titre: "Outils et notions", html: `<ul class="puces">${p.outils.map((o) => `<li>${echapper(o)}</li>`).join("")}</ul>` });
    }
    if (p.liens && p.liens.length) {
      blocs.push({
        id: "liens",
        titre: "Liens",
        html: `<div class="hero-actions">${p.liens.map((l, i) =>
          `<a class="bouton ${i === 0 ? "bouton-plein" : "bouton-contour"} aimant" href="${echapper(l.url)}" target="_blank" rel="noopener">${echapper(l.label)}</a>`
        ).join("")}</div>`,
      });
    }

    const fleche = (sens) => `<svg viewBox="0 0 16 16" aria-hidden="true" shape-rendering="crispEdges" fill="currentColor">${
      sens === "g"
        ? '<rect x="3" y="7" width="11" height="2"/><rect x="5" y="5" width="2" height="2"/><rect x="7" y="3" width="2" height="2"/><rect x="5" y="9" width="2" height="2"/><rect x="7" y="11" width="2" height="2"/>'
        : '<rect x="2" y="7" width="11" height="2"/><rect x="9" y="5" width="2" height="2"/><rect x="7" y="3" width="2" height="2"/><rect x="9" y="9" width="2" height="2"/><rect x="7" y="11" width="2" height="2"/>'
    }</svg>`;

    return `
      <article class="detail anime${avecVT ? "" : " sans-vt"}" data-slug="${echapper(p.slug)}">
        <div class="detail-barre">
          <a class="lien-retour" href="#projets">Tous les projets</a>
          <div class="detail-navigation">
            <a href="#/projet/${echapper(precedent.slug)}" aria-label="Projet précédent : ${echapper(precedent.titre)}">${fleche("g")}</a>
            <span class="detail-position">${index + 1} / ${PROJETS.length}</span>
            <a href="#/projet/${echapper(suivant.slug)}" aria-label="Projet suivant : ${echapper(suivant.titre)}">${fleche("d")}</a>
          </div>
        </div>

        <header>
          <h1 class="detail-titre" tabindex="-1" aria-label="${echapper(p.titre)}"><span aria-hidden="true">${titreAnime(p.titre)}</span></h1>
          <p class="detail-accroche">${echapper(p.accroche)}</p>
          ${meta ? `<dl class="detail-meta">${meta}</dl>` : ""}
        </header>

        <figure class="detail-media${p.cadrage === "contenir" ? " contenir" : ""}" style="${fondImage(p.image)}">
          <img src="${echapper(p.image)}" alt="${echapper(p.imageAlt || p.titre)}">
        </figure>

        <div class="detail-corps">
          <aside class="detail-sommaire">
            <nav aria-label="Sur cette page">
              <ul>${blocs.map((b) => `<li><button type="button" class="sommaire-lien" data-cible="bloc-${b.id}">${echapper(b.titre)}</button></li>`).join("")}</ul>
            </nav>
          </aside>
          <div class="detail-contenu">
            ${blocs.map((b) => `<section class="detail-bloc" id="bloc-${b.id}" aria-labelledby="titre-${b.id}"><h2 id="titre-${b.id}">${echapper(b.titre)}</h2>${b.html}</section>`).join("")}
          </div>
        </div>

        <a class="suivant" href="#/projet/${echapper(suivant.slug)}" data-curseur="suivant">
          <span>
            <span class="suivant-label">Projet suivant</span>
            <span class="suivant-titre">${echapper(suivant.titre)}</span>
          </span>
          <span class="suivant-vignette"><img src="${echapper(suivant.image)}" alt="" loading="lazy"></span>
        </a>
      </article>`;
  }

  // Section active du sommaire : la dernière dont le haut a passé le tiers de l'écran,
  // ou la dernière tout court quand on arrive en bas de page.
  function majSommaire() {
    if (vueProjet.hidden) return;
    const blocs = $$(".detail-bloc", vueProjet);
    if (!blocs.length) return;
    const enBas = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    let actif = blocs[0];
    if (enBas) actif = blocs[blocs.length - 1];
    else blocs.forEach((b) => { if (b.getBoundingClientRect().top < window.innerHeight * 0.35) actif = b; });
    $$(".sommaire-lien", vueProjet).forEach((l) => l.classList.toggle("actif", l.dataset.cible === actif.id));
  }

  function initialiserDetail(racine) {
    const media = $(".detail-media", racine);
    const img = $("img", media);
    const marquerPetite = () => {
      if (img.naturalWidth && img.naturalWidth < 900) media.classList.add("petite");
    };
    if (img.complete) marquerPetite();
    else img.addEventListener("load", marquerPetite, { once: true });

    $$(".detail-bloc", racine).forEach(observerRevelation);
    $$(".chiffre-valeur", racine).forEach(observerCompteur);
    aimanter(racine);

    // Sommaire
    $$(".sommaire-lien", racine).forEach((b) => {
      b.addEventListener("click", () => {
        const cible = document.getElementById(b.dataset.cible);
        if (!cible) return;
        const y = cible.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: y, behavior: reduit.matches ? "auto" : "smooth" });
        const titre = $("h2", cible);
        if (titre) {
          titre.setAttribute("tabindex", "-1");
          titre.focus({ preventScroll: true });
        }
      });
    });

    majSommaire();

    // Script exécutable
    const code = $('.code[data-simulation="tournesols"]', racine);
    if (code) initialiserSimulation(code);
  }

  /* ---------- Compteurs ---------- */

  function observerCompteur(el) {
    if (reduit.matches || !("IntersectionObserver" in window)) return;
    const cible = parseFloat(el.dataset.valeur);
    const dec = parseInt(el.dataset.decimales, 10) || 0;
    const suffixe = el.dataset.suffixe || "";
    el.textContent = formaterNombre(0, dec) + suffixe;
    const io = new IntersectionObserver((entrees) => {
      if (!entrees[0].isIntersecting) return;
      io.disconnect();
      const debut = performance.now();
      const duree = 1400;
      const pas = (maintenant) => {
        const t = Math.min(1, (maintenant - debut) / duree);
        const e = 1 - Math.pow(1 - t, 4);
        el.textContent = formaterNombre(cible * e, dec) + suffixe;
        if (t < 1) requestAnimationFrame(pas);
      };
      requestAnimationFrame(pas);
    }, { threshold: 0.6 });
    io.observe(el);
  }

  /* ---------- Mini-ferme : exécute le script ligne par ligne ---------- */

  let simulationActive = null;

  function initialiserSimulation(code) {
    const bouton = $("[data-executer]", code);
    const cases = $$(".sim-case", code);
    const drone = $(".sim-drone", code);
    const statut = $(".sim-statut", code);
    const lignes = $$(".ligne", code);
    const TAILLE = 5;
    const PAS = 33; // 30 px + 3 px d'espace

    function caseEn(x, y) {
      // y = 0 en bas, comme dans le jeu
      return cases[(TAILLE - 1 - y) * TAILLE + x];
    }

    function placerDrone(x, y) {
      drone.style.transform = `translate(${x * PAS}px, ${(TAILLE - 1 - y) * PAS}px)`;
    }

    function surligner(n) {
      lignes.forEach((l) => l.classList.toggle("exec", Number(l.dataset.ligne) === n));
    }

    function reinitialiser() {
      cases.forEach((c) => (c.className = "sim-case"));
      placerDrone(0, 0);
      surligner(-1);
    }

    // Suite d'instructions qui reproduit le script ligne par ligne
    function programme() {
      const etapes = [];
      let x = 0, y = 0, plantes = 0;
      etapes.push({ ligne: 0 });
      for (let col = 0; col < TAILLE; col++) {
        etapes.push({ ligne: 1 });
        for (let r = 0; r < TAILLE; r++) {
          const cx = x, cy = y;
          etapes.push({ ligne: 2 });
          etapes.push({ ligne: 3, action: () => caseEn(cx, cy).classList.remove("pousse", "tournesol") });
          etapes.push({ ligne: 4 });
          etapes.push({ ligne: 5, action: () => caseEn(cx, cy).classList.add("terre") });
          plantes++;
          const n = plantes;
          etapes.push({ ligne: 6, action: () => { caseEn(cx, cy).classList.add("pousse"); statut.textContent = `Tournesols plantés : ${n} / ${TAILLE * TAILLE}`; } });
          y = (y + 1) % TAILLE;
          const ny = y;
          etapes.push({ ligne: 7, action: () => placerDrone(cx, ny) });
        }
        x = (x + 1) % TAILLE;
        const nx = x, ny2 = y;
        etapes.push({ ligne: 8, action: () => placerDrone(nx, ny2) });
      }
      etapes.push({ ligne: 9, action: () => cases.forEach((c) => { c.classList.remove("pousse"); c.classList.add("tournesol"); }) });
      etapes.push({ ligne: 10 });
      etapes.push({ ligne: 11, fin: true });
      return etapes;
    }

    function arreter(message) {
      if (simulationActive && simulationActive.code === code) {
        clearTimeout(simulationActive.minuteur);
        simulationActive = null;
      }
      bouton.textContent = "Exécuter le script";
      surligner(-1);
      if (message) statut.textContent = message;
    }

    bouton.addEventListener("click", () => {
      if (simulationActive && simulationActive.code === code) {
        arreter("Script arrêté.");
        return;
      }
      reinitialiser();
      bouton.textContent = "Arrêter";
      const etapes = programme();
      let i = 0;
      const delai = reduit.matches ? 0 : 75;
      simulationActive = { code: code, minuteur: 0 };

      if (reduit.matches) {
        etapes.forEach((e) => e.action && e.action());
        arreter(`25 tournesols plantés. Le drone peut maintenant récolter ceux à 15 pétales.`);
        return;
      }

      const suivante = () => {
        if (!simulationActive || simulationActive.code !== code) return;
        const e = etapes[i++];
        surligner(e.ligne);
        if (e.action) e.action();
        if (e.fin || i >= etapes.length) {
          simulationActive.minuteur = setTimeout(() => arreter("25 tournesols plantés. Le drone peut maintenant récolter ceux à 15 pétales."), 600);
          return;
        }
        simulationActive.minuteur = setTimeout(suivante, e.ligne === 6 ? delai * 1.6 : delai);
      };
      suivante();
    });

    reinitialiser();
  }

  function stopperSimulation() {
    if (simulationActive) {
      clearTimeout(simulationActive.minuteur);
      simulationActive = null;
    }
  }

  /* ==========================================================
     Routeur (#/projet/slug)
     ========================================================== */

  const vueAccueil = $("#vue-accueil");
  const vueProjet = $("#vue-projet");
  let route = null;
  let positionAccueil = 0;

  function analyserRoute() {
    let h = location.hash || "";
    try { h = decodeURIComponent(h); } catch (e) { /* hash invalide */ }
    const m = h.match(/^#\/projet\/([\w-]+)\/?$/);
    if (m) return { vue: "projet", slug: m[1] };
    return { vue: "accueil", ancre: h.replace(/^#\/?/, "") };
  }

  function dansLaVue(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
  }

  function naviguer() {
    const nouvelle = analyserRoute();
    if (nouvelle.vue === "projet" && !projetParSlug(nouvelle.slug)) {
      history.replaceState(null, "", "#projets");
      naviguer();
      return;
    }
    const ancienne = route;
    route = nouvelle;

    if (!ancienne) {
      appliquerRoute(nouvelle, null, false);
      return;
    }

    if (ancienne.vue === "accueil" && nouvelle.vue === "accueil") {
      defilerVers(nouvelle.ancre, true);
      return;
    }

    const vtPossible = typeof document.startViewTransition === "function" && !reduit.matches;
    if (!vtPossible) {
      appliquerRoute(nouvelle, ancienne, false);
      return;
    }

    // Prépare l'élément partagé (l'image) avant la capture
    if (ancienne.vue === "accueil" && nouvelle.vue === "projet") {
      const fen = $(`.projet[data-slug="${nouvelle.slug}"] .fenetre`);
      if (dansLaVue(fen)) fen.style.viewTransitionName = "projet-media";
    } else if (ancienne.vue === "projet" && nouvelle.vue === "projet") {
      const media = $(".detail-media", vueProjet);
      if (media) media.style.viewTransitionName = "none";
      const vignette = $(".suivant-vignette", vueProjet);
      const lienSuivant = $(".suivant", vueProjet);
      if (vignette && lienSuivant && lienSuivant.getAttribute("href") === "#/projet/" + nouvelle.slug && dansLaVue(vignette)) {
        vignette.style.viewTransitionName = "projet-media";
      }
    }

    const transition = document.startViewTransition(() => appliquerRoute(nouvelle, ancienne, true));
    transition.finished.finally(() => {
      $$(".fenetre").forEach((f) => (f.style.viewTransitionName = ""));
    });
  }

  function appliquerRoute(r, ancienne, viaVT) {
    stopperSimulation();

    if (r.vue === "projet") {
      if (ancienne && ancienne.vue === "accueil") positionAccueil = window.scrollY;
      const p = projetParSlug(r.slug);
      vueProjet.innerHTML = rendreDetail(p, viaVT);
      vueAccueil.hidden = true;
      vueProjet.hidden = false;
      window.scrollTo(0, 0);
      document.title = `${p.titre}, un projet de Léo Murça`;
      initialiserDetail(vueProjet);
      if (ancienne) {
        const h1 = $(".detail-titre", vueProjet);
        if (h1) h1.focus({ preventScroll: true });
      }
      majNavActive(null);
      return;
    }

    // Retour à l'accueil
    vueProjet.hidden = true;
    vueProjet.innerHTML = "";
    vueAccueil.hidden = false;
    document.title = TITRE_ACCUEIL;
    if (window.Ville) window.Ville.regenerer();

    if (ancienne && ancienne.vue === "projet") {
      const ancre = r.ancre;
      const ligne = $(`.projet[data-slug="${ancienne.slug}"]`);
      if ((ancre === "projets" || ancre === "") && ligne && !ligne.hidden) {
        ligne.classList.add("visible", "sans-transition");
        requestAnimationFrame(() => requestAnimationFrame(() => ligne.classList.remove("sans-transition")));
        const rect = ligne.getBoundingClientRect();
        const y = rect.top + window.scrollY - Math.max(80, (window.innerHeight - rect.height) / 2);
        window.scrollTo(0, Math.max(0, y));
        if (viaVT) {
          const fen = $(".fenetre", ligne);
          if (fen) fen.style.viewTransitionName = "projet-media";
        }
        const lien = $(".projet-lien", ligne);
        if (lien) lien.focus({ preventScroll: true });
      } else if (ancre) {
        defilerVers(ancre, false);
      } else {
        window.scrollTo(0, positionAccueil);
      }
    } else if (r.ancre) {
      defilerVers(r.ancre, false);
    }
    surDefilement();
  }

  function defilerVers(id, doux) {
    const comportement = doux && !reduit.matches ? "smooth" : "auto";
    if (!id || id === "accueil") {
      window.scrollTo({ top: 0, behavior: comportement });
      return;
    }
    const cible = document.getElementById(id);
    if (!cible) return;
    const y = cible.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: Math.max(0, y), behavior: comportement });
    if (!cible.hasAttribute("tabindex")) cible.setAttribute("tabindex", "-1");
    cible.focus({ preventScroll: true });
  }

  // Liens internes : défilement doux sur l'accueil, routeur ailleurs
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = a.getAttribute("href");
    fermerMenu();

    if (href === "#contenu") {
      e.preventDefault();
      const main = $("#contenu");
      main.focus({ preventScroll: true });
      window.scrollTo({ top: route && route.vue === "accueil" ? window.innerHeight : 0, behavior: reduit.matches ? "auto" : "smooth" });
      return;
    }
    if (href.startsWith("#/")) return; // le hashchange prend le relais

    if (route && route.vue === "accueil") {
      e.preventDefault();
      defilerVers(href.slice(1), true);
      history.replaceState(null, "", href);
      route = analyserRoute();
    }
  });

  window.addEventListener("hashchange", naviguer);

  // Clavier sur la page projet
  document.addEventListener("keydown", (e) => {
    if (!route || route.vue !== "projet") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest("pre, input, textarea, select")) return;
    const index = PROJETS.findIndex((p) => p.slug === route.slug);
    if (e.key === "Escape") {
      location.hash = "#projets";
    } else if (e.key === "ArrowRight") {
      location.hash = "#/projet/" + PROJETS[(index + 1) % PROJETS.length].slug;
    } else if (e.key === "ArrowLeft") {
      location.hash = "#/projet/" + PROJETS[(index - 1 + PROJETS.length) % PROJETS.length].slug;
    }
  });

  /* ==========================================================
     Navigation : état, menu mobile, indicateur de section
     ========================================================== */

  const nav = $("#nav");
  const boutonMenu = $(".nav-bouton");
  const indicateur = $(".nav-indicateur");

  $$(".nav-liens li").forEach((li, i) => li.style.setProperty("--i", i));

  function fermerMenu() {
    if (!nav.classList.contains("ouvert")) return;
    nav.classList.remove("ouvert");
    boutonMenu.setAttribute("aria-expanded", "false");
    $(".nav-bouton-texte").textContent = "Menu";
    doc.classList.remove("menu-ouvert");
  }

  boutonMenu.addEventListener("click", () => {
    const ouvrir = !nav.classList.contains("ouvert");
    if (!ouvrir) {
      fermerMenu();
      return;
    }
    nav.classList.add("ouvert");
    nav.classList.remove("cachee");
    boutonMenu.setAttribute("aria-expanded", "true");
    $(".nav-bouton-texte").textContent = "Fermer";
    doc.classList.add("menu-ouvert");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("ouvert")) {
      fermerMenu();
      boutonMenu.focus();
    }
  });

  window.matchMedia("(min-width: 761px)").addEventListener("change", fermerMenu);
  nav.addEventListener("focusin", () => nav.classList.remove("cachee"));

  function majNavActive(id) {
    let actif = null;
    $$(".nav-liens a").forEach((a) => {
      const ok = a.dataset.section === id;
      a.classList.toggle("actif", ok);
      if (ok) {
        a.setAttribute("aria-current", "true");
        actif = a;
      } else {
        a.removeAttribute("aria-current");
      }
    });
    if (!indicateur) return;
    if (!actif) {
      indicateur.style.opacity = "0";
      return;
    }
    const navRect = indicateur.parentElement.getBoundingClientRect();
    const r = actif.getBoundingClientRect();
    indicateur.style.opacity = "1";
    indicateur.style.transform = `translateX(${r.left - navRect.left}px) scaleX(${r.width})`;
  }

  let sectionActive = null;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((en) => {
        if (en.isIntersecting) sectionActive = en.target.id;
        else if (sectionActive === en.target.id) sectionActive = null;
      });
      if (route && route.vue === "accueil") majNavActive(sectionActive);
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["projets", "a-propos", "competences", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ==========================================================
     Défilement : barre de progression, nav, frise
     ========================================================== */

  const barre = $(".progression span");
  let dernierY = window.scrollY;
  let rafDefil = 0;

  function majFrise() {
    const frise = $("#frise");
    if (!frise || vueAccueil.hidden) return;
    const trait = $(".frise-trait", frise);
    const ligneVisee = window.innerHeight * 0.65;
    const r = frise.getBoundingClientRect();
    const p = reduit.matches ? 1 : Math.min(1, Math.max(0, (ligneVisee - r.top) / r.height));
    if (trait) trait.style.transform = `scaleY(${p})`;
    $$(".etape", frise).forEach((et) => {
      et.classList.toggle("atteinte", reduit.matches || et.getBoundingClientRect().top + 12 < ligneVisee);
    });
  }

  function surDefilement() {
    rafDefil = 0;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    barre.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    nav.classList.toggle("defile", y > 40);
    if (!nav.classList.contains("ouvert")) {
      if (y > dernierY + 4 && y > 500) nav.classList.add("cachee");
      else if (y < dernierY - 4 || y < 500) nav.classList.remove("cachee");
    }
    dernierY = y;
    majFrise();
    majSommaire();
  }

  window.addEventListener("scroll", () => {
    if (!rafDefil) rafDefil = requestAnimationFrame(surDefilement);
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (route && route.vue === "accueil") majNavActive(sectionActive);
    surDefilement();
  });

  /* ==========================================================
     Révélations au défilement et titres brouillés
     ========================================================== */

  const GLYPHES = "#%&*+=<>/\\_-01";

  function brouiller(el) {
    const final = el.dataset.texte || el.textContent;
    el.dataset.texte = final;
    if (reduit.matches) {
      el.textContent = final;
      return;
    }
    if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", final);
    const caracteres = lettres(final);
    const debut = performance.now();
    const duree = 650 + caracteres.length * 25;
    const image = (maintenant) => {
      const p = Math.min(1, (maintenant - debut) / duree);
      const fixes = Math.floor(p * caracteres.length);
      let s = "";
      for (let i = 0; i < caracteres.length; i++) {
        if (i < fixes || caracteres[i] === " ") s += caracteres[i];
        else s += GLYPHES[Math.floor(Math.random() * GLYPHES.length)];
      }
      el.textContent = s;
      if (p < 1) requestAnimationFrame(image);
      else el.textContent = final;
    };
    requestAnimationFrame(image);
  }

  const observateur = "IntersectionObserver" in window
    ? new IntersectionObserver((entrees) => {
      entrees.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("visible");
        if (en.target.hasAttribute("data-brouille")) brouiller(en.target);
        observateur.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 })
    : null;

  function observerRevelation(el) {
    if (!observateur || reduit.matches) {
      el.classList.add("visible");
      return;
    }
    observateur.observe(el);
  }

  /* ==========================================================
     Interactions au pointeur : curseur, aimant, inclinaison
     ========================================================== */

  function curseur() {
    if (!pointeurFin.matches) return;
    const el = $(".curseur");
    const anneau = $(".curseur-anneau");
    const point = $(".curseur-point");
    const label = $(".curseur-label");
    doc.classList.add("curseur-actif");

    let x = -100, y = -100, ax = -100, ay = -100;
    let actif = false;

    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!actif) {
        actif = true;
        ax = x;
        ay = y;
        el.classList.add("visible");
      }
      point.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const cible = e.target.closest ? e.target.closest("a, button, [data-curseur]") : null;
      const avecLabel = cible && cible.closest("[data-curseur]");
      const texte = avecLabel ? avecLabel.dataset.curseur : "";
      el.classList.toggle("survol", !!cible);
      el.classList.toggle("avec-label", !!texte);
      if (texte && label.textContent !== texte) label.textContent = texte;
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      actif = false;
      el.classList.remove("visible");
    });
    window.addEventListener("pointerdown", () => el.classList.add("appui"));
    window.addEventListener("pointerup", () => el.classList.remove("appui"));

    const boucle = () => {
      const k = reduit.matches ? 1 : 0.2;
      ax += (x - ax) * k;
      ay += (y - ay) * k;
      anneau.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      requestAnimationFrame(boucle);
    };
    requestAnimationFrame(boucle);
  }

  function aimanter(racine) {
    if (!pointeurFin.matches || reduit.matches) return;
    $$(".aimant", racine).forEach((el) => {
      if (el.dataset.aimant) return;
      el.dataset.aimant = "1";
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  function inclinaison() {
    if (!pointeurFin.matches || reduit.matches) return;
    $$(".projet-lien").forEach((lien) => {
      const fen = $(".fenetre", lien);
      let raf = 0;
      lien.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = fen.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          const cx = Math.max(-0.5, Math.min(0.5, px - 0.5));
          const cy = Math.max(-0.5, Math.min(0.5, py - 0.5));
          fen.style.transform = `rotateY(${cx * 9}deg) rotateX(${-cy * 9}deg) translateZ(0)`;
          fen.style.setProperty("--gx", `${px * 100}%`);
          fen.style.setProperty("--gy", `${py * 100}%`);
        });
      });
      lien.addEventListener("pointerleave", () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        fen.style.transform = "";
      });
    });
  }

  /* ==========================================================
     Intro : écran de lancement puis nom tapé au clavier
     ========================================================== */

  function chargeur() {
    return new Promise((resolve) => {
      if (!doc.classList.contains("intro")) {
        resolve();
        return;
      }
      try { sessionStorage.setItem("lm-intro", "1"); } catch (e) { /* stockage indisponible */ }

      const el = $("#chargeur");
      const terminal = $("#chargeur-terminal");
      const commande = "npm run portfolio";
      const lignes = [
        `  chargement de ${PROJETS.length} projets ......... <span class="ok">ok</span>`,
        `  allumage de la ville .......... <span class="ok">ok</span>`,
      ];
      let tape = "";
      let i = 0;

      const ecrire = (extra) => {
        terminal.innerHTML = `<span class="p">&gt;</span> <span class="cmd">${tape}</span>${extra || ""}`;
      };

      const finir = () => {
        el.classList.add("ouvert");
        setTimeout(resolve, 280);
        setTimeout(() => doc.classList.remove("intro"), 1100);
      };

      const taperCommande = () => {
        if (i < commande.length) {
          tape += commande[i++];
          ecrire('<span class="curseur-term"></span>');
          setTimeout(taperCommande, 28 + Math.random() * 40);
          return;
        }
        let n = 0;
        const afficherLigne = () => {
          n++;
          ecrire("\n" + lignes.slice(0, n).join("\n") + (n < lignes.length ? "" : ""));
          if (n < lignes.length) setTimeout(afficherLigne, 280);
          else setTimeout(finir, 360);
        };
        setTimeout(afficherLigne, 220);
      };

      ecrire('<span class="curseur-term"></span>');
      setTimeout(taperCommande, 250);
    });
  }

  function introHero() {
    const hero = $(".hero");
    const nom = $(".hero-nom");
    const texte = nom.textContent;
    nom.innerHTML = lettres(texte).map((c) => `<span class="lettre">${c === " " ? " " : echapper(c)}</span>`).join("");
    const spans = $$(".lettre", nom);

    if (!pointeurFin.matches) {
      $(".hero-astuce").textContent = "Touchez un immeuble pour allumer ses lumières";
    }

    if (reduit.matches) {
      spans.forEach((s) => s.classList.add("vue"));
      hero.classList.add("tape");
      return;
    }

    let i = 0;
    const taper = () => {
      spans.forEach((s) => s.classList.remove("dernier"));
      if (i >= spans.length) {
        hero.classList.add("tape");
        return;
      }
      spans[i].classList.add("vue", "dernier");
      i++;
      setTimeout(taper, i === spans.length ? 260 : 70 + Math.random() * 70);
    };
    setTimeout(taper, 150);
  }

  /* ==========================================================
     Démarrage
     ========================================================== */

  rendreFiltres();
  rendreListe();
  rendreFrise();
  rendreCompetences();
  rendreContact();

  $$(".projet, .revele, [data-brouille], .competence-groupe").forEach(observerRevelation);
  curseur();
  aimanter(document);
  inclinaison();

  naviguer();
  surDefilement();

  chargeur().then(introHero);

  reduit.addEventListener("change", () => {
    $$(".projet, .revele, [data-brouille], .competence-groupe, .detail-bloc").forEach((el) => el.classList.add("visible"));
    majFrise();
  });
})();
