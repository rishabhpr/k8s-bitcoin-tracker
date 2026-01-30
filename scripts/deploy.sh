#!/bin/bash
# Deploy Bitcoin Tracker to Kubernetes

set -e

echo "🚀 Deploying Bitcoin Tracker to Kubernetes..."
echo ""

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl first."
    exit 1
fi

# Apply all manifests in order
echo "📦 Creating namespace..."
kubectl apply -f k8s/00-namespace.yaml

echo "⚙️ Creating ConfigMap..."
kubectl apply -f k8s/01-configmap.yaml

echo "🔴 Deploying Redis..."
kubectl apply -f k8s/02-redis.yaml

echo "🟢 Deploying API..."
kubectl apply -f k8s/03-api.yaml

echo "🔵 Deploying Frontend..."
kubectl apply -f k8s/04-frontend.yaml

echo "🌐 Creating Ingress..."
kubectl apply -f k8s/05-ingress.yaml

echo "📈 Setting up Autoscaling..."
kubectl apply -f k8s/06-hpa.yaml

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Check status with:"
echo "   kubectl get pods -n bitcoin-tracker"
echo "   kubectl get svc -n bitcoin-tracker"
echo ""
echo "🌐 Access the app:"
echo "   kubectl port-forward svc/btc-frontend 8080:80 -n bitcoin-tracker"
echo "   Then open: http://localhost:8080"
echo ""
echo "🧹 Cleanup:"
echo "   kubectl delete namespace bitcoin-tracker"
