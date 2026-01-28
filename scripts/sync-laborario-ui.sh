#!/bin/bash
# Sync Laborario UI components from the laborario repo
# Usage: pnpm sync-laborario-ui

set -e

LABORARIO_PATH="${LABORARIO_PATH:-$HOME/laborario}"
UI_SRC="$LABORARIO_PATH/packages/ui/src"
DEST="components/laborario"

if [ ! -d "$UI_SRC" ]; then
  echo "Error: Laborario UI package not found at $UI_SRC"
  echo "Make sure the laborario repo is at $LABORARIO_PATH"
  exit 1
fi

echo "Syncing Laborario UI components from $UI_SRC..."

# Copy components
cp "$UI_SRC/public-header.tsx" "$DEST/"
cp "$UI_SRC/public-footer.tsx" "$DEST/"
cp "$UI_SRC/public-layout.tsx" "$DEST/"
cp "$UI_SRC/nav-icons.tsx" "$DEST/"
cp "$UI_SRC/context.tsx" "$DEST/"

# Copy logo
mkdir -p public/icons
cp "$LABORARIO_PATH/public/icons/laborario-logo.svg" public/icons/

echo "Done! Synced Laborario UI components."
echo ""
echo "Note: You may need to update components/laborario/provider.tsx if the context API changed."
