# ml

Entraînement du modèle d'analyse de satisfaction utilisé par le backend (satisfaction des messages de contact).

## Prérequis

Python 3.11.

## Installation

```bash
cd ml
python -m venv .venv
source .venv/bin/activate       # Windows : .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # DATABASE_URL, pointe par défaut sur backend/db.sqlite3
```

## Préparation des données

Fusionne les sources anglaises (UCI : Amazon, Yelp, IMDB) et françaises (Allociné), déduplique et nettoie :

```bash
python prepare_data.py
```

Génère `data/sentiment_data.csv`.

## Entraînement

```bash
python train.py
```

- Compare Logistic Regression et Decision Tree (TF-IDF + classifieur).
- Affiche accuracy, precision, recall, F1, matrice de confusion, et l'accuracy par langue.
- Réentraîne le meilleur modèle (F1) sur l'ensemble des données et le sauvegarde dans `model.pkl`.

## Déploiement du modèle

Le backend charge le modèle depuis `backend/contact/ml_model/model.pkl` (voir `backend/contact/ml_utils.py`).