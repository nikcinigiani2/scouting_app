#!/usr/bin/env bash
set -euo pipefail



echo "📂 Creazione cartelle standard (media, templates)…"
mkdir -p media/note_referti templates/registration static

echo "✂️  Rimozione cartelle obsolete…"
# Rimuoviamo le cartelle di progetto duplicate
git rm -r --cached scouting_app || true
git rm -r --cached scouting      || true
git rm -r --cached frontend/scouting-frontend || true

echo "📦 Spostamento app in apps/ (se non già fatto)…"
# Se non fossero già lì, sposta le app dentro apps/
# git mv note_gara     apps/
# git mv note_referti  apps/
# git mv scouting      apps/

echo "📥 Spostamento file PDF di esempio in media/…"
mv apps/note_referti/*.pdf media/note_referti/ 2>/dev/null || true

echo "✏️  Aggiornamento import Python → config.* e apps.*…"
# Modifica import riferiti al vecchio project package (scouting_app) e alle root apps
find . -type f -name "*.py" -print0 \
  | xargs -0 sed -i '' \
    -e 's|from scouting_app\.settings|from config.settings|g' \
    -e 's|import scouting_app\.settings|import config.settings|g' \
    -e 's|from scouting_app\.urls|from config.urls|g' \
    -e 's|import scouting_app\.urls|import config.urls|g' \
    -e 's|from scouting\.|from apps.scouting.|g' \
    -e 's|import scouting\.|import apps.scouting.|g' \
    -e 's|from note_referti\.|from apps.note_referti.|g' \
    -e 's|import note_referti\.|import apps.note_referti.|g' \
    -e 's|from note_gara\.|from apps.note_gara.|g' \
    -e 's|import note_gara\.|import apps.note_gara.|g'

echo "🛠️  Aggiornamento config(settings.py)…"
sed -i '' \
  -e "s|ROOT_URLCONF = .*|ROOT_URLCONF = 'config.urls'|g" \
  -e "s|^INSTALLED_APPS = \[|INSTALLED_APPS = [\n    'apps.scouting',\n    'apps.note_referti',\n    'apps.note_gara',|g" \
  config/settings.py

echo "📋 Aggiunta .gitignore (venv, node_modules, *.pyc)…"
cat << 'EOF' > .gitignore
venv/
__pycache__/
*.pyc
node_modules/
dist/
media/
static/
EOF
git add .gitignore

echo "✅ Commit delle modifiche"
git add .
git commit -m "refactor: normalize project structure under config/ and apps/, remove duplicates"
git push -u origin refactor/project-structure

echo "🎉 Refactor completo! Adesso sei nel branch refactor/project-structure."
