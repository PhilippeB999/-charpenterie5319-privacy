# Formation Apple – génération du PPT

Sources du fichier `../Apple_TableMatieres.pptx`.

- `toc.json` : table des matières structurée (extraite du PDF avec `parse.py`)
- `notes_a.js`, `notes_b.js`, `notes_c.js` : notes de l'orateur complètes par chapitre
- `build.js` : génère le PPT avec pptxgenjs

Reconstruire :

```bash
cd formation-apple
npm install pptxgenjs react-icons react react-dom sharp
NODE_PATH=$PWD/node_modules node build.js <dossier-du-skill-pptx>
cp Apple_TableMatieres.pptx ..
```

`build.js` reçoit en argument le dossier du skill pptx, pour charger `scripts/apply_theme.js`.

Étape suivante prévue : ajouter de vraies photos (Wikimedia Commons, libres de droits) sur chaque diapositive de chapitre.
