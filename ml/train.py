"""Compare Logistic Regression et Decision Tree, entraîne le meilleur et le sauvegarde.

Méthodologie : split train/test simple (pas de validation croisée), évaluation via
accuracy/precision/recall/F1/matrice de confusion, comparaison score train vs score
test pour détecter le surapprentissage. La vectorisation TF-IDF est nécessaire au
préalable : un modèle scikit-learn ne peut pas recevoir du texte brut en entrée.
"""
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier

MODELS = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Decision Tree': DecisionTreeClassifier(random_state=42),
}


def make_pipeline(model):
    return Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', model),
    ])


def evaluate_by_language(y_test, y_pred, lang_test):
    """Accuracy par langue sur le jeu de test, pour vérifier qu'aucune langue n'est mal servie."""
    per_lang = pd.DataFrame({'y_test': y_test.values, 'y_pred': y_pred, 'lang': lang_test.values})
    for lang, group in per_lang.groupby('lang'):
        acc = accuracy_score(group['y_test'], group['y_pred'])
        print(f"  Accuracy [{lang}] ({len(group)} exemples) : {acc:.3f}")


def main():
    df = pd.read_csv('data/sentiment_data.csv')

    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
    X_train, y_train = train_df['text'], train_df['label']
    X_test, y_test = test_df['text'], test_df['label']

    results = {}
    for name, model in MODELS.items():
        pipeline = make_pipeline(model)
        pipeline.fit(X_train, y_train)

        train_score = pipeline.score(X_train, y_train)
        test_score = pipeline.score(X_test, y_test)

        y_pred = pipeline.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)

        results[name] = {
            'train_score': train_score,
            'test_score': test_score,
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1,
        }

        print(f"\n{'=' * 50}\n{name}")
        print(f"Score train: {train_score:.3f} | Score test: {test_score:.3f}")
        print(f"Accuracy: {accuracy:.3f} | Precision: {precision:.3f} | Recall: {recall:.3f} | F1: {f1:.3f}")
        evaluate_by_language(y_test, y_pred, test_df['lang'])
        print(classification_report(y_test, y_pred))
        print("Matrice de confusion :\n", confusion_matrix(y_test, y_pred))

    print(f"\n{'=' * 50}\nTableau comparatif :")
    summary = pd.DataFrame(results).T
    print(summary)

    best_name = max(results, key=lambda k: results[k]['f1'])
    print(f"\nMeilleur modèle (F1 sur le jeu de test) : {best_name}")

    best_pipeline = make_pipeline(MODELS[best_name])
    best_pipeline.fit(df['text'], df['label'])
    joblib.dump(best_pipeline, 'model.pkl')
    print("Modèle sauvegardé dans model.pkl")


if __name__ == '__main__':
    main()
