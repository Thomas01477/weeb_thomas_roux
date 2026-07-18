import os

import joblib
from django.conf import settings

_model = None


def _load_model():
    """Load the trained sentiment model once and keep it cached in memory."""
    global _model
    if _model is None:
        path = os.path.join(settings.BASE_DIR, 'contact', 'ml_model', 'model.pkl')
        _model = joblib.load(path)
    return _model


def predict(text):
    """Return 1 (satisfied) or 0 (not satisfied) for the given text."""
    return int(_load_model().predict([text])[0])
