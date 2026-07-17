"""Fusionne les sources UCI (EN) et Allociné (FR), qualifie et nettoie le dataset."""
import csv
import pandas as pd

SOURCES_EN = [
    ('data/amazon_cells_labelled.txt', 'amazon'),
    ('data/yelp_labelled.txt', 'yelp'),
    ('data/imdb_labelled.txt', 'imdb'),
]
SOURCE_FR = ('data/allocine_sample.csv', 'allocine')


def load_english():
    dfs = []
    for path, source in SOURCES_EN:
        # QUOTE_NONE : des guillemets non appariés dans les critiques (ex. imdb) font sinon
        # fusionner plusieurs lignes en un seul champ lors du parsing CSV par défaut.
        df = pd.read_csv(path, sep='\t', header=None, names=['text', 'label'], quoting=csv.QUOTE_NONE)
        df['source'] = source
        df['lang'] = 'en'
        dfs.append(df)
    return pd.concat(dfs, ignore_index=True)


def load_french():
    path, source = SOURCE_FR
    df = pd.read_csv(path, encoding='utf-8')
    df['source'] = source
    df['lang'] = 'fr'
    return df


def load_and_merge():
    return pd.concat([load_english(), load_french()], ignore_index=True)


def qualify(df):
    """Affiche les statistiques de qualification du dataset."""
    print(f"Total : {len(df)} exemples")
    print(f"\nDistribution des labels :\n{df['label'].value_counts()}")
    print(f"\nDistribution des langues :\n{df['lang'].value_counts()}")
    print(f"\nDoublons (texte identique) : {df.duplicated(subset='text').sum()}")
    lengths = df.groupby('lang')['text'].apply(lambda s: s.str.split().str.len().mean())
    print(f"\nLongueur moyenne des phrases par langue (tokens) :\n{lengths}")
    print(f"\nValeurs manquantes :\n{df.isnull().sum().to_dict()}")


if __name__ == '__main__':
    df = load_and_merge()
    qualify(df)

    before = len(df)
    df.drop_duplicates(subset='text', inplace=True)
    df.dropna(subset=['text', 'label'], inplace=True)
    after = len(df)
    print(f"\n{before - after} ligne(s) supprimée(s) (doublons / valeurs manquantes)")

    df.to_csv('data/sentiment_data.csv', index=False, encoding='utf-8')
    print(f"\nDataset final sauvegardé dans data/sentiment_data.csv ({after} lignes)")
