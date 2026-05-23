# Travel Companion AI — Japon & Corée V5

Application mobile React/Vite prête pour GitHub + Vercel.

## Fonctionnalités

- Planning voyage jour par jour
- GPS Google Maps : à pied, transport, taxi, recherche lieu
- Restaurants et spots photo par journée
- Budget global avec JPY / KRW / EUR
- Export CSV des dépenses
- Notes par journée
- Favoris
- Checklist voyage
- Urgences Japon / Corée
- Phrases utiles japonais / coréen
- Section indépendante Instagram Buzz
- Traducteur photo pour menus japonais/coréens
- Traducteur vocal push-to-talk français ↔ japonais / coréen
- Assistant IA via fonction Vercel `/api/ask.js`
- PWA installable téléphone

## Installation locale

```bash
npm install
npm run dev
```

## Déploiement Vercel

1. Envoyer ce dossier sur GitHub.
2. Importer le dépôt dans Vercel.
3. Build command : `npm run build`.
4. Output directory : `dist`.
5. Ajouter la variable d’environnement :

```txt
OPENAI_API_KEY=ta_cle_openai
```

## Fonctions IA incluses

- `/api/ask.js` : assistant voyage
- `/api/translate-photo.js` : traduction photo menu / panneau
- `/api/voice-translate.js` : traduction texte issue du vocal

La clé OpenAI ne doit jamais être mise dans `src/App.jsx`. Elle reste uniquement dans les variables d’environnement Vercel.

## Important

Le traducteur vocal utilise d’abord la reconnaissance vocale du navigateur. Sur Android, Chrome est recommandé. Sur iPhone, la reconnaissance vocale navigateur peut être limitée ; la traduction reste prévue côté serveur via OpenAI.
