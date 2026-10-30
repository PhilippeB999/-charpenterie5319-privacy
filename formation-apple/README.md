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

## Photos

`build.js` place automatiquement une photo si `photos.json` et `img/<clé>.jpg` existent
(clé = `title` pour la couverture, ou le numéro du chapitre `1` à `22`).
Format de `photos.json` :

```json
{ "1": { "file": "File:Nom.jpg", "author": "Auteur", "license": "CC BY-SA 4.0", "alt": "Description" } }
```

Une diapositive « Crédits photos » est ajoutée automatiquement. `search2.py q1.json titles1.json`
cherche des candidates sur Wikimedia Commons (une requête par mot-clé de `q1.json`).
Recadrer les photos de chapitre au format 4.2 × 3.1 et celle de couverture au format 5 × 7.5.
