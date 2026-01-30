# ₿ Bitcoin Price Tracker

A real-time Bitcoin price tracking application built with Kubernetes, demonstrating microservices architecture, caching, autoscaling, and more.

![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

## 🏗️ Architecture

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    Kubernetes Cluster                    │
                    │                                                          │
                    │  ┌─────────────┐     ┌─────────────┐                    │
                    │  │   Ingress   │────▶│   Frontend  │                    │
                    │  │   (nginx)   │     │   (nginx)   │                    │
                    │  └─────────────┘     │   2 pods    │                    │
                    │         │            └─────────────┘                    │
                    │         │                   │                           │
                    │         ▼                   ▼                           │
                    │  ┌─────────────┐     ┌─────────────┐                    │
                    │  │    API      │────▶│    Redis    │                    │
                    │  │  (Node.js)  │     │   (cache)   │                    │
                    │  │  2-10 pods  │     │   1 pod     │                    │
                    │  └─────────────┘     └─────────────┘                    │
                    │         │                                               │
                    │         ▼                                               │
                    │  ┌─────────────┐                                        │
                    │  │ CoinGecko   │                                        │
                    │  │    API      │                                        │
                    │  └─────────────┘                                        │
                    └─────────────────────────────────────────────────────────┘
```

## ✨ Features

- **Real-time Bitcoin Price** - Fetches live BTC prices from CoinGecko API
- **Multi-currency Support** - USD, EUR, GBP prices displayed
- **24h Change Tracking** - Shows price change over last 24 hours
- **Market Sentiment** - Fear & Greed index visualization
- **Saylor's Wisdom** - Random quotes from Michael Saylor's 21 Rules of Bitcoin
- **Redis Caching** - 60-second cache to reduce API calls
- **Horizontal Pod Autoscaling** - Scales based on CPU/memory usage
- **Health Checks** - Liveness and readiness probes for all services

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Web Server | Nginx |
| API | Node.js + Express |
| Cache | Redis |
| Container | Docker |
| Orchestration | Kubernetes |
| Autoscaling | HPA (Horizontal Pod Autoscaler) |

## 🚀 Quick Start

### Prerequisites

- Docker
- Kubernetes cluster (minikube, kind, Docker Desktop, or cloud provider)
- kubectl configured

### Option 1: Deploy with Pre-built Images

```bash
# Clone the repository
git clone https://github.com/rishabhpr/k8s-bitcoin-tracker.git
cd k8s-bitcoin-tracker

# Deploy to Kubernetes
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Access the application
kubectl port-forward svc/btc-frontend 8080:80 -n bitcoin-tracker
# Open http://localhost:8080
```

### Option 2: Build and Deploy

```bash
# Build Docker images
chmod +x scripts/build.sh
./scripts/build.sh

# Deploy
./scripts/deploy.sh
```

## 📁 Project Structure

```
k8s-bitcoin-tracker/
├── api/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js           # Express API server
├── frontend/
│   ├── Dockerfile
│   ├── index.html          # Single-page frontend
│   └── nginx.conf          # Nginx configuration
├── k8s/
│   ├── 00-namespace.yaml   # Kubernetes namespace
│   ├── 01-configmap.yaml   # Configuration
│   ├── 02-redis.yaml       # Redis deployment + service
│   ├── 03-api.yaml         # API deployment + service
│   ├── 04-frontend.yaml    # Frontend deployment + service
│   ├── 05-ingress.yaml     # Ingress rules
│   └── 06-hpa.yaml         # Horizontal Pod Autoscaler
├── scripts/
│   ├── build.sh            # Build Docker images
│   └── deploy.sh           # Deploy to Kubernetes
└── README.md
```

## 📊 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check endpoint |
| `GET /api/price` | Get current Bitcoin price |
| `GET /api/sentiment` | Get market sentiment (Fear & Greed) |
| `GET /api/wisdom` | Get random Saylor wisdom quote |

## 🔧 Configuration

Environment variables (via ConfigMap):

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://redis:6379` | Redis connection URL |
| `CACHE_TTL` | `60` | Cache time-to-live in seconds |
| `API_PORT` | `3000` | API server port |

## 📈 Scaling

The API deployment uses Horizontal Pod Autoscaler (HPA):

- **Min replicas**: 2
- **Max replicas**: 10
- **Scale up**: When CPU > 70% or Memory > 80%
- **Scale down**: Gradual (50% every 60 seconds)

Check scaling status:
```bash
kubectl get hpa -n bitcoin-tracker
```

## 🧹 Cleanup

Remove all resources:
```bash
kubectl delete namespace bitcoin-tracker
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

MIT License - feel free to use this project for learning and experimentation.

## 🙏 Acknowledgments

- Bitcoin price data from [CoinGecko API](https://www.coingecko.com/en/api)
- Inspired by Michael Saylor's [21 Rules of Bitcoin](https://btcprague.com/michael-saylors-keynote-21-rules-of-bitcoin/)
- Built with ❤️ and ₿itcoin

---

**Stack sats. Stay humble.** 🍊
