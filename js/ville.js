/*
  La ville de nuit du hero.
  Rendu en basse résolution (1 pixel du canvas = PX pixels à l'écran),
  puis agrandi sans lissage pour obtenir un rendu pixel-art.
*/
(function () {
  "use strict";

  const canvas = document.getElementById("ville");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  const mqReduit = window.matchMedia("(prefers-reduced-motion: reduce)");

  const PX = 3;
  const MARGE = 30; // pixels de débord pour la parallaxe
  const GRAINE = 2026;

  const FENETRES = ["#FFC46B", "#FFC46B", "#FFC46B", "#FFD99A", "#FF8FE6", "#8FF0FF"];
  const NEONS = ["#FF4FD8", "#4FE3FF"];

  const COUCHES = [
    { corps: "#2D1A62", eteinte: "#35206F", parallaxe: 0.12, hMin: 0.26, hMax: 0.52, lMin: 9, lMax: 20, fw: 1, fh: 1, px: 3, py: 3, densite: 0.16, brume: [120, 40, 150, 0.32] },
    { corps: "#201246", eteinte: "#2A1957", parallaxe: 0.3, hMin: 0.2, hMax: 0.42, lMin: 13, lMax: 26, fw: 2, fh: 2, px: 4, py: 4, densite: 0.28, brume: [60, 18, 96, 0.38] },
    { corps: "#150B31", eteinte: "#1F1243", parallaxe: 0.55, hMin: 0.12, hMax: 0.32, lMin: 18, lMax: 34, fw: 2, fh: 3, px: 5, py: 5, densite: 0.36, neon: true },
  ];

  let W = 0, H = 0;
  let couches = [];
  let toutesFenetres = [];
  let etoiles = [];
  let gouttes = [];
  let filantes = [];
  let t = 0;
  let dernier = 0;
  let raf = 0;
  let visible = true;
  let sourisX = 0, sourisCible = 0;
  let prochaineFilante = 300;
  let aleaAnim = Math.random;

  function generateur(graine) {
    let s = graine >>> 0;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function entre(alea, a, b) {
    return a + alea() * (b - a);
  }

  function generer() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(60, Math.ceil(rect.width / PX));
    H = Math.max(60, Math.ceil(rect.height / PX));
    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    const alea = generateur(GRAINE);
    toutesFenetres = [];

    couches = COUCHES.map(function (c, idx) {
      const bats = [];
      let x = -MARGE + Math.floor(alea() * 6);
      while (x < W + MARGE) {
        const w = Math.round(entre(alea, c.lMin, c.lMax));
        const h = Math.round(H * entre(alea, c.hMin, c.hMax));
        const b = { x: x, w: w, h: h, couche: idx, fenetres: [], etages: 0, cascade: null, toit: null, enseigne: null };

        // Détail du toit
        const r = alea();
        if (r < 0.28 && idx > 0) {
          b.toit = { type: "antenne", h: Math.round(entre(alea, 4, 11)), dx: Math.floor(entre(alea, 2, w - 2)), phase: Math.floor(alea() * 90) };
        } else if (r < 0.55) {
          const lw = Math.max(4, Math.round(w * entre(alea, 0.35, 0.6)));
          b.toit = { type: "marche", w: lw, h: Math.round(entre(alea, 2, 6)), dx: Math.floor(entre(alea, 1, w - lw)) };
        }

        // Fenêtres
        const margeX = idx === 0 ? 1 : 2;
        const debutY = idx === 0 ? 3 : 4;
        const colonnes = Math.max(1, Math.floor((w - margeX * 2 + (c.px - c.fw)) / c.px));
        const decalX = Math.floor((w - (colonnes * c.px - (c.px - c.fw))) / 2);
        const lignes = Math.max(0, Math.floor((h - debutY - 3) / c.py));
        b.etages = lignes;
        for (let ly = 0; ly < lignes; ly++) {
          for (let cx = 0; cx < colonnes; cx++) {
            const f = {
              b: b,
              x: decalX + cx * c.px,
              y: debutY + ly * c.py,
              etage: lignes - 1 - ly,
              allumee: alea() < c.densite,
              couleur: FENETRES[Math.floor(alea() * FENETRES.length)],
            };
            b.fenetres.push(f);
            toutesFenetres.push(f);
          }
        }

        // Enseigne néon (premier plan uniquement)
        if (c.neon && w >= 22 && alea() < 0.38) {
          const eh = Math.round(entre(alea, 10, 18));
          b.enseigne = {
            x: alea() < 0.5 ? 1 : w - 4,
            y: Math.round(entre(alea, 6, Math.max(7, h * 0.35))),
            w: 3,
            h: eh,
            couleur: NEONS[Math.floor(alea() * NEONS.length)],
            panne: 0,
          };
        }

        bats.push(b);
        x += w + Math.round(entre(alea, idx === 0 ? 0 : 1, idx === 0 ? 3 : 5));
      }
      return { def: c, bats: bats };
    });

    etoiles = [];
    const nbEtoiles = Math.round((W * H) / 260);
    for (let i = 0; i < nbEtoiles; i++) {
      etoiles.push({ x: Math.floor(alea() * W), y: Math.floor(alea() * H * 0.62), v: entre(alea, 0.01, 0.05), p: alea() * 6.28, b: alea() < 0.12 });
    }

    gouttes = [];
    const nbGouttes = Math.round(W / 3.2);
    for (let i = 0; i < nbGouttes; i++) {
      gouttes.push(nouvelleGoutte(alea, true));
    }
  }

  function nouvelleGoutte(alea, partout) {
    return {
      x: entre(alea, -20, W + 40),
      y: partout ? entre(alea, -H, H) : entre(alea, -40, -4),
      l: Math.round(entre(alea, 3, 7)),
      v: entre(alea, 2.4, 4.2),
      a: entre(alea, 0.12, 0.32),
    };
  }

  function lancerFilante(x, y) {
    filantes.push({
      x: x !== undefined ? x : entre(aleaAnim, W * 0.2, W * 0.9),
      y: y !== undefined ? y : entre(aleaAnim, 4, H * 0.3),
      vx: -entre(aleaAnim, 2.2, 3.4),
      vy: entre(aleaAnim, 0.7, 1.2),
      vie: 1,
    });
  }

  function decalages(def) {
    const defil = window.scrollY / PX;
    return {
      ox: Math.round(-sourisX * def.parallaxe * 16),
      oy: Math.round(defil * (0.6 - def.parallaxe) * 0.6),
    };
  }

  function dessinerCiel() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#110927");
    g.addColorStop(0.45, "#241050");
    g.addColorStop(0.75, "#4B1A72");
    g.addColorStop(1, "#7A2380");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Lueur de la ville sur l'horizon
    const lueur = ctx.createRadialGradient(W * 0.35, H * 1.05, 0, W * 0.35, H * 1.05, Math.max(W, H) * 0.7);
    lueur.addColorStop(0, "rgba(255, 79, 216, 0.35)");
    lueur.addColorStop(1, "rgba(255, 79, 216, 0)");
    ctx.fillStyle = lueur;
    ctx.fillRect(0, 0, W, H);
  }

  function dessinerEtoiles(anime) {
    for (let i = 0; i < etoiles.length; i++) {
      const e = etoiles[i];
      const a = anime ? 0.35 + 0.65 * Math.abs(Math.sin(t * e.v + e.p)) : 0.7;
      ctx.globalAlpha = a;
      ctx.fillStyle = e.b ? "#BFF6FF" : "#FFFFFF";
      ctx.fillRect(e.x, e.y, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  function dessinerLune() {
    const defil = window.scrollY / PX;
    const lx = Math.round(W * 0.8 - sourisX * 3);
    const ly = Math.round(H * 0.17 + defil * 0.45);
    const r = Math.max(6, Math.round(Math.min(W, H) * 0.045));
    const halo = ctx.createRadialGradient(lx, ly, r * 0.5, lx, ly, r * 5);
    halo.addColorStop(0, "rgba(255, 220, 255, 0.28)");
    halo.addColorStop(1, "rgba(255, 220, 255, 0)");
    ctx.fillStyle = halo;
    ctx.fillRect(lx - r * 5, ly - r * 5, r * 10, r * 10);
    ctx.fillStyle = "#FBE9FF";
    ctx.beginPath();
    ctx.arc(lx, ly, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#E7CFF5";
    ctx.fillRect(lx - Math.round(r * 0.4), ly - Math.round(r * 0.2), Math.max(1, Math.round(r * 0.3)), Math.max(1, Math.round(r * 0.3)));
    ctx.fillRect(lx + Math.round(r * 0.2), ly + Math.round(r * 0.3), Math.max(1, Math.round(r * 0.22)), Math.max(1, Math.round(r * 0.22)));
  }

  function dessinerFilantes(dt) {
    for (let i = filantes.length - 1; i >= 0; i--) {
      const f = filantes[i];
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.vie -= 0.012 * dt;
      if (f.vie <= 0 || f.x < -20) {
        filantes.splice(i, 1);
        continue;
      }
      for (let k = 0; k < 10; k++) {
        ctx.globalAlpha = f.vie * (1 - k / 10);
        ctx.fillStyle = k === 0 ? "#FFFFFF" : "#BFF6FF";
        ctx.fillRect(Math.round(f.x - f.vx * k * 0.9), Math.round(f.y - f.vy * k * 0.9), 1, 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  function dessinerCouches(anime) {
    for (let i = 0; i < couches.length; i++) {
      const couche = couches[i];
      const def = couche.def;
      const d = decalages(def);

      for (let j = 0; j < couche.bats.length; j++) {
        const b = couche.bats[j];
        const bx = b.x + d.ox;
        if (bx > W + 4 || bx + b.w < -12) continue;
        const by = H - b.h + d.oy;

        ctx.fillStyle = def.corps;
        ctx.fillRect(bx, by, b.w, b.h + 40);

        if (b.toit) {
          if (b.toit.type === "marche") {
            ctx.fillRect(bx + b.toit.dx, by - b.toit.h, b.toit.w, b.toit.h);
          } else {
            ctx.fillRect(bx + b.toit.dx, by - b.toit.h, 1, b.toit.h);
            const allume = !anime || (t + b.toit.phase) % 90 < 40;
            if (allume) {
              ctx.fillStyle = "#FF5A7A";
              ctx.fillRect(bx + b.toit.dx, by - b.toit.h - 1, 1, 1);
            }
          }
        }

        for (let k = 0; k < b.fenetres.length; k++) {
          const f = b.fenetres[k];
          ctx.fillStyle = f.allumee ? f.couleur : def.eteinte;
          ctx.fillRect(bx + f.x, by + f.y, def.fw, def.fh);
        }

        const e = b.enseigne;
        if (e) {
          let allumee = true;
          if (anime && e.panne > 0) allumee = aleaAnim() > 0.5;
          if (allumee) {
            ctx.globalAlpha = 0.22;
            ctx.fillStyle = e.couleur;
            ctx.fillRect(bx + e.x - 2, by + e.y - 2, e.w + 4, e.h + 4);
            ctx.globalAlpha = 0.45;
            ctx.fillRect(bx + e.x - 1, by + e.y - 1, e.w + 2, e.h + 2);
            ctx.globalAlpha = 1;
            ctx.fillRect(bx + e.x, by + e.y, e.w, e.h);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(bx + e.x + 1, by + e.y + 1, 1, e.h - 2);
          } else {
            ctx.fillStyle = "#3A2357";
            ctx.fillRect(bx + e.x, by + e.y, e.w, e.h);
          }
        }
      }

      // Brume entre les plans
      if (def.brume) {
        const [r, g, bl, a] = def.brume;
        const haut = H * 0.35;
        const grad = ctx.createLinearGradient(0, haut, 0, H);
        grad.addColorStop(0, "rgba(" + r + "," + g + "," + bl + ",0)");
        grad.addColorStop(1, "rgba(" + r + "," + g + "," + bl + "," + a + ")");
        ctx.fillStyle = grad;
        ctx.fillRect(0, haut, W, H - haut);
      }
    }
  }

  function dessinerPluie(dt) {
    ctx.strokeStyle = "rgba(190, 200, 255, 1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < gouttes.length; i++) {
      const g = gouttes[i];
      g.y += g.v * dt;
      g.x -= g.v * 0.22 * dt;
      if (g.y > H + 8) {
        gouttes[i] = nouvelleGoutte(aleaAnim, false);
        continue;
      }
      ctx.globalAlpha = g.a;
      ctx.beginPath();
      ctx.moveTo(Math.round(g.x) + 0.5, Math.round(g.y));
      ctx.lineTo(Math.round(g.x + g.l * 0.22) + 0.5, Math.round(g.y - g.l));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function mettreAJour(dt) {
    // Scintillement des fenêtres
    let bascules = dt * 0.14;
    while (bascules > 0) {
      if (bascules >= 1 || aleaAnim() < bascules) {
        const f = toutesFenetres[Math.floor(aleaAnim() * toutesFenetres.length)];
        if (f && !f.b.cascade) {
          f.allumee = !f.allumee;
          if (f.allumee) f.couleur = FENETRES[Math.floor(aleaAnim() * FENETRES.length)];
        }
      }
      bascules -= 1;
    }

    // Pannes des néons
    for (let i = 0; i < couches.length; i++) {
      const bats = couches[i].bats;
      for (let j = 0; j < bats.length; j++) {
        const e = bats[j].enseigne;
        if (!e) continue;
        if (e.panne > 0) e.panne -= dt;
        else if (aleaAnim() < 0.0025 * dt) e.panne = entre(aleaAnim, 6, 26);
      }
    }

    // Cascades d'étages déclenchées au clic
    for (let i = 0; i < couches.length; i++) {
      const bats = couches[i].bats;
      for (let j = 0; j < bats.length; j++) {
        const b = bats[j];
        if (!b.cascade) continue;
        avancerCascade(b, Math.floor((t - b.cascade.debut) / 2.5));
      }
    }

    // Étoiles filantes
    prochaineFilante -= dt;
    if (prochaineFilante <= 0) {
      lancerFilante();
      prochaineFilante = entre(aleaAnim, 360, 820);
    }

    sourisX += (sourisCible - sourisX) * Math.min(1, 0.06 * dt);
  }

  function avancerCascade(b, progression) {
    const c = b.cascade;
    for (let k = 0; k < b.fenetres.length; k++) {
      const f = b.fenetres[k];
      if (c.mode === "on" && f.etage <= progression) {
        if (!f.allumee) {
          f.allumee = true;
          f.couleur = c.couleur;
        }
      } else if (c.mode === "off" && b.etages - 1 - f.etage <= progression) {
        f.allumee = false;
      }
    }
    if (progression >= b.etages) b.cascade = null;
  }

  function dessiner(dt, anime) {
    dessinerCiel();
    dessinerEtoiles(anime);
    dessinerLune();
    if (anime) dessinerFilantes(dt);
    dessinerCouches(anime);
    if (anime) dessinerPluie(dt);
  }

  function boucle(maintenant) {
    if (!dernier) dernier = maintenant;
    const dt = Math.min(3, (maintenant - dernier) / 16.667);
    dernier = maintenant;
    t += dt;
    mettreAJour(dt);
    dessiner(dt, true);
    raf = requestAnimationFrame(boucle);
  }

  function demarrer() {
    if (raf || mqReduit.matches || !visible || document.hidden) return;
    dernier = 0;
    raf = requestAnimationFrame(boucle);
  }

  function arreter() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function rendreStatique() {
    arreter();
    dessiner(0, false);
  }

  // Trouve l'immeuble sous le pointeur, du premier plan vers le fond
  function immeubleSous(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    const y = ((clientY - rect.top) / rect.height) * H;
    for (let i = couches.length - 1; i >= 0; i--) {
      const d = decalages(couches[i].def);
      const bats = couches[i].bats;
      for (let j = 0; j < bats.length; j++) {
        const b = bats[j];
        const bx = b.x + d.ox;
        const by = H - b.h + d.oy;
        if (x >= bx && x < bx + b.w && y >= by) return b;
      }
    }
    return { ciel: true, x: x, y: y };
  }

  function tauxAllumage(b) {
    if (!b.fenetres.length) return 0;
    let n = 0;
    for (let k = 0; k < b.fenetres.length; k++) if (b.fenetres[k].allumee) n++;
    return n / b.fenetres.length;
  }

  canvas.addEventListener("click", function (e) {
    const cible = immeubleSous(e.clientX, e.clientY);
    if (cible.ciel) {
      if (!mqReduit.matches) lancerFilante(cible.x + 20, cible.y - 6);
      return;
    }
    if (!cible.fenetres.length) return;
    const mode = tauxAllumage(cible) > 0.55 ? "off" : "on";
    cible.cascade = { debut: t, mode: mode, couleur: FENETRES[Math.floor(Math.random() * FENETRES.length)] };
    if (mqReduit.matches) {
      avancerCascade(cible, cible.etages);
      rendreStatique();
    }
    canvas.dataset.curseur = mode === "on" ? "éteindre" : "allumer";
  });

  canvas.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    const cible = immeubleSous(e.clientX, e.clientY);
    canvas.dataset.curseur = cible.ciel ? "un vœu" : tauxAllumage(cible) > 0.55 ? "éteindre" : "allumer";
  });

  window.addEventListener("pointermove", function (e) {
    sourisCible = (e.clientX / window.innerWidth) * 2 - 1;
    if (mqReduit.matches) sourisX = 0;
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entrees) {
      visible = entrees[0].isIntersecting;
      if (visible) demarrer();
      else arreter();
    }).observe(canvas);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) arreter();
    else demarrer();
  });

  let minuteur = 0;
  let largeurPrecedente = 0;
  window.addEventListener("resize", function () {
    clearTimeout(minuteur);
    minuteur = setTimeout(function () {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      if (Math.abs(rect.width - largeurPrecedente) < 2 && Math.abs(Math.ceil(rect.height / PX) - H) < 6) return;
      largeurPrecedente = rect.width;
      generer();
      if (mqReduit.matches) rendreStatique();
    }, 160);
  });

  mqReduit.addEventListener("change", function () {
    if (mqReduit.matches) rendreStatique();
    else demarrer();
  });

  largeurPrecedente = canvas.getBoundingClientRect().width;
  generer();
  dessiner(0, false);
  if (!mqReduit.matches) demarrer();

  window.Ville = {
    regenerer: function () {
      generer();
      if (mqReduit.matches) rendreStatique();
      else dessiner(0, false);
    },
  };
})();
