# weeb_thomas_roux

Application web fullstack composée d'un frontend React, d'un backend Django REST et d'un module Machine Learning standalone.

## Structure du projet

```
weeb_thomas_roux/
├── frontend/          # Frontend React + Vite + Tailwind CSS
├── backend/           # API Django REST + Auth JWT + PostgreSQL
```

## Frontend

```bash
cd frontend
npm install
npm run dev       # Démarre sur http://localhost:5173
npm run build     
npm run lint      
npm run test     
```

## Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver   # Démarre sur http://localhost:8000
pytest                       # Tests avec couverture
flake8 . --max-line-length=120 --exclude=migrations,__pycache__
```