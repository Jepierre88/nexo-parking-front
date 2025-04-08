#!/bin/bash

# Limpiar carpeta anterior
rm -rf prod && \
echo "🧹 Eliminando carpeta prod anterior..."

# Compilar en modo standalone
echo "⚙️ Ejecutando build..."
npm run build

# Crear carpeta destino
mkdir -p prod

# Buscar la ruta interna generada (match con el nombre del proyecto)
INNER_PATH=$(find .next/standalone -name server.js | head -n 1 | xargs dirname)

# Copiar archivos internos a prod/
echo "📦 Copiando archivos desde: $INNER_PATH"
cp -r "$INNER_PATH/"* prod/

# Copiar estáticos y públicos
mkdir -p prod/.next && cp -r .next/static prod/.next/
[ -d public ] && cp -r public prod/ || echo "⚠️ No hay carpeta public, omitida."
cp package.json prod/
cp .env.production prod/ 2>/dev/null || true

echo "✅ ¡Listo! Carpeta 'prod/' limpia y lista para desplegar."
