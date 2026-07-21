# weeb_thomas_roux

Application web fullstack composée d'un frontend React, d'un backend Django REST.

## Production

- **Application :** https://weeb-thomas-roux.vercel.app/
- **Status page (UptimeRobot) :** https://stats.uptimerobot.com/xx9MwZ9kQm

## Structure du projet

```
weeb/
├── backend/                  # Application Django REST : API JSON, authentification JWT
│   ├── weeb/                   # Projet Django : configuration globale
│   │   └── settings/             # Settings séparés (base, development, production)
│   ├── accounts/                # App : utilisateurs, inscription, connexion, profil
│   │   ├── migrations/
│   │   └── tests/
│   ├── blog/                    # App : articles et catégories
│   │   ├── migrations/
│   │   └── tests/
│   ├── contact/                  # App : messages de contact
│   │   ├── migrations/
│   │   └── tests/
│   └── openapi.yaml             # Spécification OpenAPI de l'API
│
├── frontend/                 # Application React : SPA, Vite, Tailwind CSS
│   ├── public/                  # Fichiers statiques servis tels quels
│   └── src/
│       ├── pages/                  # Une page par écran (Blog, Contact, Login...)
│       ├── components/             # Éléments réutilisables (Form, NavBar, Button...)
│       ├── context/                # État global d'authentification
│       ├── hooks/                  # Hooks personnalisés (useAuth)
│       ├── api/                    # Client HTTP centralisé (Axios)
│       ├── utils/                  # Fonctions utilitaires (animations)
│       └── __tests__/              # Tests Vitest / Testing Library
│
└── .github/
    └── workflows/             # CI : lint et tests, backend et frontend séparément
```

## Installation

### Prérequis

Python 3.11, Node.js 20, Git.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # remplir SECRET_KEY (les autres variables sont optionnelles en dev)
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver      # http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

### Tests de l'installation

| Étape | Commande de vérification | Résultat attendu |
|---|---|---|
| Backend installé | `python manage.py check` | "System check identified no issues" |
| Migrations appliquées | `python manage.py showmigrations` | Toutes cochées |
| Tests backend | `pytest --cov=. --cov-report=term-missing` | 61 tests passent ; le pourcentage de couverture s'affiche mais n'est pas un critère bloquant |
| Linter backend | `flake8 .` | 0 erreur |
| Frontend installé | `npm run lint` | 0 erreur ESLint |
| Tests frontend | `npm run test -- --run` | 49 tests passent |
| API accessible | `GET http://localhost:8000/api/articles/` | 200 + liste paginée (`{ "count": 0, "next": null, "previous": null, "results": [] }` sur une base vide) |
| Frontend accessible | Ouvrir http://localhost:5173 | Page d'accueil visible |
