const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const Fi = require("react-icons/fi");
const Md = require("react-icons/md");
const { applyTheme } = require(process.argv[2] + "/scripts/apply_theme.js");
const toc = require("./toc.json");
const NOTES = Object.assign({}, require("./notes_a.js"), require("./notes_b.js"), require("./notes_c.js"));

const THEME = {
  name: "Apple Formation", headFontFace: "Arial", bodyFontFace: "Calibri",
  colors: { dk1: "1D1D1F", lt1: "FFFFFF", dk2: "3A3A3C", lt2: "F5F5F7",
    accent1: "C2410C", accent2: "FB923C", accent3: "6E6E73", accent4: "A1A1A6",
    accent5: "D2D2D7", accent6: "2F855A", hlink: "C2410C", folHlink: "6E6E73" },
};
const FOOT = "Tablettes et téléphones Apple – iPad et iPhone";

const CH = {
  1: ["Le monde des tablettes et des téléphones Apple", "Le monde Apple", Md.MdDevices],
  2: ["Les tablettes et les téléphones Apple : principales caractéristiques", "Principales caractéristiques", Md.MdPhoneIphone],
  3: ["Le langage des doigts à l’écran", "Le langage des doigts", Md.MdTouchApp],
  4: ["Gérer les applications et personnaliser l’écran d’accueil", "Gérer les applications", Md.MdApps],
  5: ["Les réglages de base", "Les réglages de base", Md.MdSettings],
  6: ["Édition de texte", "Édition de texte", Md.MdKeyboard],
  7: ["Contacts", "Contacts", Md.MdContacts],
  8: ["Mail (courrier électronique)", "Mail", Md.MdEmail],
  9: ["Calendrier", "Calendrier", Md.MdCalendarMonth],
  10: ["Safari", "Safari", Md.MdExplore],
  11: ["Siri", "Siri", Md.MdMic],
  12: ["Stockage", "Stockage", Md.MdCloud],
  13: ["Appareil photo", "Appareil photo", Md.MdPhotoCamera],
  14: ["Photos", "Photos", Md.MdPhotoLibrary],
  15: ["FaceTime", "FaceTime", Md.MdVideocam],
  16: ["Plans et itinéraires", "Plans et itinéraires", Md.MdMap],
  17: ["Horloge", "Horloge", Md.MdAlarm],
  18: ["Magasins", "Magasins", Md.MdStorefront],
  19: ["Localiser mon iPad", "Localiser mon iPad", Md.MdLocationOn],
  20: ["Les petits plus", "Les petits plus", Md.MdAutoAwesome],
  21: ["Réglages divers", "Réglages divers", Md.MdTune],
  22: ["Autres apps", "Autres apps", Md.MdLibraryMusic],
  23: ["Conclusion", "Conclusion", Md.MdFlag],
  24: ["Sources et références", "Sources et références", Md.MdMenuBook],
};

async function icon(Comp, color = "#FFFFFF") {
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
const fs = require("fs");
const PHOTOS = fs.existsSync("./photos.json") ? require("./photos.json") : {};
const photoPath = (k) => (PHOTOS[k] && fs.existsSync(`img/${k}.jpg`) ? `img/${k}.jpg` : null);
const pad = (n) => String(n).padStart(2, "0");

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = "Tablettes et téléphones Apple – Table des matières";
  pres.author = "Philippe Beaubien";
  const C = pres.SchemeColor;

  const footer = (x) => ({ text: { text: FOOT, options: { x, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: C.accent3, margin: 0 } } });
  const slideNum = { x: 12.23, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: C.accent3, align: "right" };

  pres.defineSlideMaster({
    title: "Titre (sombre)", background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.3, w: 7.2, h: 1.6, fontSize: 44, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "subtitle", type: "body", x: 0.8, y: 4.05, w: 7.2, h: 0.7, fontSize: 28, color: C.accent2, valign: "top", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "tagline", type: "body", x: 0.8, y: 4.9, w: 7.2, h: 0.5, fontSize: 16, color: C.accent4, valign: "top", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "Titre seul", background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.45, w: 12.13, h: 0.85, fontSize: 36, bold: true, color: C.text1, valign: "middle", margin: 0 }, text: "" } },
      footer(0.6),
    ],
    slideNumber: slideNum,
  });
  pres.defineSlideMaster({
    title: "Chapitre", background: { color: C.background1 },
    objects: [
      { rect: { x: 0, y: 0, w: 4.2, h: 7.5, fill: { color: C.text1 } } },
      { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 4.65, w: 3.2, h: 1.7, fontSize: 24, bold: true, color: C.background1, valign: "top", margin: 0 }, text: "" } },
      footer(4.7),
    ],
    slideNumber: slideNum,
  });

  const icons = {};
  for (const k of Object.keys(CH)) icons[k] = await icon(CH[k][2]);
  const iconCircle = (s, k, x, y, d, name) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.accent1 }, line: { type: "none" }, objectName: name + " cercle" });
    const p = d * 0.2;
    s.addImage({ data: icons[k], x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, altText: CH[k][1], objectName: name + " icône" });
  };

  // ---------- Titre ----------
  pres.addSection({ title: "Ouverture" });
  let s = pres.addSlide({ masterName: "Titre (sombre)", sectionTitle: "Ouverture" });
  s.addText("Tablettes et téléphones Apple", { placeholder: "title" });
  s.addText("iPad et iPhone", { placeholder: "subtitle" });
  s.addText("Formation — Table des matières", { placeholder: "tagline" });
  const tab = await icon(Fi.FiTablet), ph = await icon(Fi.FiSmartphone);
  if (photoPath("title")) {
    s.addImage({ path: photoPath("title"), x: 8.33, y: 0, w: 5.0, h: 7.5, altText: PHOTOS.title.alt, objectName: "Photo de couverture" });
  } else {
    s.addShape(pres.shapes.OVAL, { x: 8.7, y: 1.6, w: 3.0, h: 3.0, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Cercle iPad" });
    s.addImage({ data: tab, x: 9.45, y: 2.35, w: 1.5, h: 1.5, altText: "Tablette", objectName: "Icône iPad" });
    s.addShape(pres.shapes.OVAL, { x: 10.6, y: 3.9, w: 2.0, h: 2.0, fill: { color: C.text2 }, line: { color: C.text1, width: 4 }, objectName: "Cercle iPhone" });
    s.addImage({ data: ph, x: 11.1, y: 4.4, w: 1.0, h: 1.0, altText: "Téléphone", objectName: "Icône iPhone" });
  }
  s.addNotes(NOTES.intro);

  // ---------- Survol ----------
  pres.addSection({ title: "Table des matières" });
  for (const [part, from] of [[1, 1], [2, 13]]) {
    s = pres.addSlide({ masterName: "Titre seul", sectionTitle: "Table des matières" });
    s.addText(`Table des matières (${part}/2)`, { placeholder: "title" });
    const tw = (12.13 - 3 * 0.3) / 4, th = 1.55, y0 = 1.65;
    for (let i = 0; i < 12; i++) {
      const n = from + i, c = toc[n - 1];
      const x = 0.6 + (i % 4) * (tw + 0.3), y = y0 + Math.floor(i / 4) * (th + 0.3);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: tw, h: th, rectRadius: 0.12, fill: { color: C.background2 }, line: { type: "none" }, objectName: `Tuile ${n}` });
      iconCircle(s, n, x + 0.2, y + 0.2, 0.6, `Tuile ${n}`);
      s.addText(pad(n), { x: x + 0.95, y: y + 0.2, w: 0.8, h: 0.6, fontSize: 24, bold: true, color: C.accent1, fontFace: THEME.headFontFace, valign: "middle", margin: 0, isTextBox: true, objectName: `Tuile ${n} numéro` });
      s.addText(`p. ${c.p}`, { x: x + tw - 1.0, y: y + 0.2, w: 0.8, h: 0.6, fontSize: 11, color: C.accent3, align: "right", valign: "middle", margin: 0, isTextBox: true, objectName: `Tuile ${n} page` });
      s.addText(CH[n][1], { x: x + 0.2, y: y + 0.88, w: tw - 0.4, h: 0.5, fontSize: 15, bold: true, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: `Tuile ${n} titre` });
    }
    s.addNotes(part === 1 ? NOTES.overview1 : NOTES.overview2);
  }

  // ---------- Chapitres ----------
  pres.addSection({ title: "Chapitres" });
  for (const c of toc.slice(0, 22)) {
    const n = c.n;
    s = pres.addSlide({ masterName: "Chapitre", sectionTitle: "Chapitres" });
    const ph = photoPath(n);
    if (ph) s.addImage({ path: ph, x: 0, y: 0, w: 4.2, h: 3.1, altText: PHOTOS[n].alt, objectName: "Photo du chapitre" });
    iconCircle(s, n, 0.6, 2.65, 0.9, `Chapitre ${n}`);
    s.addText(pad(n), { x: 0.6, y: 3.55, w: 3.2, h: 1.0, fontSize: 60, bold: true, color: C.accent2, fontFace: THEME.headFontFace, valign: "middle", margin: 0, isTextBox: true, objectName: "Numéro du chapitre" });
    s.addText(CH[n][0], { placeholder: "title" });
    const last = c.secs[c.secs.length - 1];
    const lastP = (last && last.subs.length && last.subs[last.subs.length - 1].p) || (last && last.p) || c.p;
    s.addText(`Pages ${c.p} à ${lastP}`, { x: 0.6, y: 6.55, w: 3.2, h: 0.4, fontSize: 13, color: C.accent4, margin: 0, isTextBox: true, objectName: "Pages du chapitre" });

    const secs = c.secs, k = secs.length;
    const cols = k <= 5 ? 1 : 2, rows = Math.ceil(k / cols), gap = 0.25;
    const X0 = 4.7, W = 8.13, Y0 = 0.6, H = 6.15;
    const cw = (W - gap * (cols - 1)) / cols;
    const ch = Math.min(1.45, (H - gap * (rows - 1)) / rows);
    const yStart = Y0 + (H - (rows * ch + gap * (rows - 1))) / 2;
    secs.forEach((sec, i) => {
      const col = cols === 1 ? 0 : Math.floor(i / rows), row = cols === 1 ? i : i % rows;
      const x = X0 + col * (cw + gap), y = yStart + row * (ch + gap);
      const nm = `Section ${sec.n}`;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.1, fill: { color: C.background2 }, line: { type: "none" }, objectName: nm });
      const tx = x + 0.85, tw = cw - 0.85 - 0.85;
      const titleLines = Math.max(1, Math.ceil(sec.t.length / (tw * 10.5)));
      const titleH = titleLines * 0.26;
      const subs = sec.subs.filter((x) => !/^\d+\.\s/.test(x.t)).map((x) => x.t);
      const capW = cw - 0.85 - 0.2, capPerLine = Math.floor(capW * 12.5);
      const capLines = Math.floor((ch - 0.3 - titleH) / 0.21);
      let cap = "";
      if (subs.length && capLines >= 1) {
        const max = capPerLine * capLines;
        let acc = [];
        for (const t of subs) { const next = [...acc, t].join(" · "); if (next.length + 4 > max) break; acc.push(t); }
        cap = acc.join(" · ") + (acc.length < subs.length ? " …" : "");
        if (!acc.length) cap = "";
      }
      const capH = cap ? Math.min(capLines, Math.ceil(cap.length / capPerLine)) * 0.21 : 0;
      const blockH = titleH + (cap ? 0.06 + capH : 0);
      const by = y + (ch - blockH) / 2;
      s.addText(sec.n, { x: x + 0.2, y: by, w: 0.6, h: 0.26, fontSize: 14, bold: true, color: C.accent1, fontFace: THEME.headFontFace, valign: "top", margin: 0, isTextBox: true, objectName: nm + " numéro" });
      s.addText(sec.t, { x: tx, y: by, w: tw, h: titleH, fontSize: 15, bold: true, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: nm + " titre" });
      if (sec.p) s.addText(sec.p, { x: x + cw - 0.8, y: by, w: 0.6, h: 0.26, fontSize: 11, color: C.accent3, align: "right", valign: "top", margin: 0, isTextBox: true, objectName: nm + " page" });
      if (cap) s.addText(cap, { x: tx, y: by + titleH + 0.06, w: capW, h: capH, fontSize: 11, color: C.accent3, valign: "top", margin: 0, isTextBox: true, objectName: nm + " sous-sections" });
    });

    const notes = [`Chapitre ${n} – ${CH[n][0]} (p. ${c.p})`, ""];
    for (const sec of secs) {
      notes.push(`${sec.n}. ${sec.t}${sec.p ? " (p. " + sec.p + ")" : ""}`);
      for (const x of sec.subs) notes.push(`   ${x.n}. ${x.t}${x.p ? " (p. " + x.p + ")" : ""}`);
    }
    s.addNotes(NOTES[n]);
  }

  // ---------- Clôture ----------
  pres.addSection({ title: "Clôture" });
  s = pres.addSlide({ masterName: "Titre (sombre)", sectionTitle: "Clôture" });
  s.addText("Pour terminer", { placeholder: "title" });
  s.addText("Conclusion, sources et exercices", { placeholder: "subtitle" });
  s.addText("Mettez en pratique ce que vous avez appris", { placeholder: "tagline" });
  const ex = await icon(Md.MdEdit);
  const items = [[23, "Conclusion", "p. 23-1", icons[23]], [24, "Sources et références", "p. 23-1", icons[24]], [null, "Exercices", "En fin de document", ex]];
  items.forEach(([n, t, p, img], i) => {
    const y = 1.55 + i * 1.5, x = 8.6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.13, h: 1.2, rectRadius: 0.12, fill: { color: C.text2 }, line: { type: "none" }, objectName: `Clôture ${t}` });
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Clôture ${t} cercle` });
    s.addImage({ data: img, x: x + 0.425, y: y + 0.425, w: 0.35, h: 0.35, altText: t, objectName: `Clôture ${t} icône` });
    s.addText([{ text: (n ? pad(n) + "  " : "") + t, options: { bold: true, fontSize: 17, color: C.background1, breakLine: true } }, { text: p, options: { fontSize: 12, color: C.accent4 } }],
      { x: x + 1.15, y: y + 0.15, w: 2.8, h: 0.9, valign: "middle", margin: 0, isTextBox: true, objectName: `Clôture ${t} texte` });
  });
  s.addNotes(NOTES[23]);

  const credits = Object.entries(PHOTOS).filter(([k]) => photoPath(k));
  if (credits.length) {
    s = pres.addSlide({ masterName: "Titre seul", sectionTitle: "Clôture" });
    s.addText("Crédits photos", { placeholder: "title" });
    const label = (k) => (k === "title" ? "Couverture" : `Ch. ${k}`);
    const rows = credits.map(([k, p]) => [
      { text: label(k), options: { bold: true, color: C.accent1 } },
      { text: `${p.author} – ${p.license}`, options: { color: C.text1 } },
      { text: p.file, options: { color: C.accent3 } },
    ]);
    const half = Math.ceil(rows.length / 2);
    [rows.slice(0, half), rows.slice(half)].forEach((part, i) => {
      if (!part.length) return;
      s.addTable(part, { x: 0.6 + i * 6.2, y: 1.5, w: 5.95, colW: [0.9, 2.45, 2.6], fontSize: 9, fontFace: "Calibri", rowH: 0.21, margin: 0.03, border: { type: "none" }, valign: "middle" });
    });
    s.addText("Photos : Wikimedia Commons (commons.wikimedia.org), utilisées selon leur licence. CC BY / CC BY-SA : creativecommons.org/licenses", { x: 0.6, y: 6.55, w: 12.13, h: 0.3, fontSize: 10, color: C.accent3, margin: 0, isTextBox: true, objectName: "Mention des licences" });
    s.addNotes("Crédits des photos utilisées dans la présentation, conformément aux licences Creative Commons (attribution obligatoire).");
  }
  await pres.writeFile({ fileName: "Apple_TableMatieres.pptx" });
  await applyTheme("Apple_TableMatieres.pptx", THEME);
  console.log("done");
})();
