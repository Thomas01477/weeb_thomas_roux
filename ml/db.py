"""Accès direct à la base du backend Django (SQLite ou PostgreSQL), sans dépendre de Django."""
import os
import sqlite3

from dotenv import load_dotenv

load_dotenv()

TABLE = 'contact_contactmessage'


def _connect(database_url):
    """Détecte le type de base depuis le préfixe de DATABASE_URL et retourne (connexion, placeholder SQL)."""
    if database_url.startswith('sqlite:///'):
        path = database_url.removeprefix('sqlite:///')
        return sqlite3.connect(path), '?'
    import psycopg2  # import différé : inutile si on n'utilise que SQLite en local
    return psycopg2.connect(database_url), '%s'


def get_connection():
    """Ouvre une connexion vers la base pointée par DATABASE_URL (ml/.env)."""
    return _connect(os.environ['DATABASE_URL'])


def get_unanalyzed_messages():
    """Retourne les messages dont la satisfaction n'a pas encore été calculée (satisfaction IS NULL)."""
    conn, _ = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(f'SELECT id, message FROM {TABLE} WHERE satisfaction IS NULL')
        return cursor.fetchall()
    finally:
        conn.close()


def update_satisfaction(message_id, satisfaction):
    """Écrit le score de satisfaction (0 ou 1) prédit pour un message donné."""
    conn, ph = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(f'UPDATE {TABLE} SET satisfaction = {ph} WHERE id = {ph}', (satisfaction, message_id))
        conn.commit()
    finally:
        conn.close()


def get_all_results():
    """Retourne tous les messages avec leur score de satisfaction (ou None si non analysé)."""
    conn, _ = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(f'SELECT id, name, email, message, created_at, satisfaction FROM {TABLE}')
        return cursor.fetchall()
    finally:
        conn.close()
