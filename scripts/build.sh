#!/bin/bash
# Build and push Docker images

set -e

REGISTRY="${REGISTRY:-ghcr.io/rishabhpr}"
TAG="${TAG:-latest}"

echo "🐳 Building Docker images..."
echo "Registry: $REGISTRY"
echo "Tag: $TAG"
echo ""

# Build API
echo "📦 Building API image..."
docker build -t $REGISTRY/btc-price-api:$TAG ./api

# Build Frontend
echo "📦 Building Frontend image..."
docker build -t $REGISTRY/btc-frontend:$TAG ./frontend

echo ""
echo "✅ Images built successfully!"
echo ""

# Push if PUSH=true
if [ "$PUSH" = "true" ]; then
    echo "⬆️ Pushing images to $REGISTRY..."
    docker push $REGISTRY/btc-price-api:$TAG
    docker push $REGISTRY/btc-frontend:$TAG
    echo "✅ Images pushed!"
else
    echo "ℹ️ To push images, run: PUSH=true ./scripts/build.sh"
fi
