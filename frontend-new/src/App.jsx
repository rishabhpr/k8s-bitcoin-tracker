import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Progress } from './components/ui/progress.jsx'
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  Server, 
  Database, 
  Globe, 
  Zap,
  RefreshCw,
  Shield,
  Box,
  Layers,
  Activity
} from 'lucide-react'
import './App.css'

const API_URL = ''

function App() {
  const [price, setPrice] = useState(null)
  const [sentiment, setSentiment] = useState(null)
  const [wisdom, setWisdom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = async () => {
    try {
      const [priceRes, sentimentRes, wisdomRes] = await Promise.all([
        fetch(`${API_URL}/api/price`),
        fetch(`${API_URL}/api/sentiment`),
        fetch(`${API_URL}/api/wisdom`)
      ])
      
      setPrice(await priceRes.json())
      setSentiment(await sentimentRes.json())
      setWisdom(await wisdomRes.json())
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (value, currency = '$') => {
    return currency + value?.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })
  }

  const getSentimentColor = (index) => {
    if (index < 25) return 'from-red-500 to-red-600'
    if (index < 45) return 'from-orange-500 to-orange-600'
    if (index < 55) return 'from-yellow-500 to-yellow-600'
    if (index < 75) return 'from-lime-500 to-lime-600'
    return 'from-green-500 to-green-600'
  }

  // K8s cluster visualization data
  const k8sCluster = {
    namespace: 'bitcoin-tracker',
    pods: [
      { name: 'btc-api-7d9f8', status: 'Running', cpu: 45, memory: 62, restarts: 0 },
      { name: 'btc-api-3k2j1', status: 'Running', cpu: 38, memory: 58, restarts: 0 },
      { name: 'btc-frontend-x9k2', status: 'Running', cpu: 12, memory: 24, restarts: 0 },
      { name: 'btc-frontend-m4n7', status: 'Running', cpu: 15, memory: 28, restarts: 0 },
      { name: 'redis-master-0', status: 'Running', cpu: 8, memory: 45, restarts: 0 },
    ],
    services: [
      { name: 'btc-api', type: 'ClusterIP', port: 3000, endpoints: 2 },
      { name: 'btc-frontend', type: 'LoadBalancer', port: 80, endpoints: 2 },
      { name: 'redis', type: 'ClusterIP', port: 6379, endpoints: 1 },
    ],
    hpa: { current: 2, min: 2, max: 10, cpu: 42 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-bitcoin/10 px-6 py-3 rounded-full border border-bitcoin/20">
            <Bitcoin className="w-8 h-8 text-bitcoin float" />
            <span className="text-2xl font-bold bg-gradient-to-r from-bitcoin to-yellow-400 bg-clip-text text-transparent">
              Bitcoin Tracker
            </span>
          </div>
          <p className="text-slate-400">Real-time price tracking powered by Kubernetes</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge variant="outline" className="gap-1">
              <Box className="w-3 h-3" /> Kubernetes
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Database className="w-3 h-3" /> Redis Cache
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Zap className="w-3 h-3" /> Auto-scaling
            </Badge>
          </div>
        </header>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Price Card */}
          <Card className="md:col-span-2 bg-slate-900/50 border-slate-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-bitcoin/5 to-transparent" />
            <CardHeader className="relative">
              <CardDescription className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Bitcoin Price
              </CardDescription>
              <CardTitle className="text-5xl font-bold text-white">
                {loading ? '---' : formatPrice(price?.usd)}
              </CardTitle>
              {price && (
                <div className={`flex items-center gap-2 ${price.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {price.change_24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="text-lg font-semibold">
                    {price.change_24h >= 0 ? '+' : ''}{price.change_24h?.toFixed(2)}% (24h)
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-sm">EUR</p>
                  <p className="text-xl font-bold text-white">{loading ? '---' : formatPrice(price?.eur, '€')}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-sm">GBP</p>
                  <p className="text-xl font-bold text-white">{loading ? '---' : formatPrice(price?.gbp, '£')}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-sm">Market Cap</p>
                  <p className="text-xl font-bold text-white">
                    {loading ? '---' : '$' + (price?.market_cap / 1e12).toFixed(2) + 'T'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${price?.cached ? 'bg-blue-400' : 'bg-green-400'}`} />
                  {price?.cached ? 'From Redis cache' : 'Fresh from API'}
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  {lastUpdate?.toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardDescription>Market Sentiment</CardDescription>
              <CardTitle className="text-2xl">{sentiment?.sentiment || 'Loading...'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-white rounded-md shadow-lg transition-all duration-500 border-2 border-slate-900"
                  style={{ left: `calc(${sentiment?.index || 50}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Extreme Fear</span>
                <span>Extreme Greed</span>
              </div>
              <div className="text-center">
                <span className={`text-4xl font-bold bg-gradient-to-r ${getSentimentColor(sentiment?.index)} bg-clip-text text-transparent`}>
                  {sentiment?.index || '--'}
                </span>
                <span className="text-slate-400 text-sm"> / 100</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saylor Wisdom */}
        <Card className="bg-gradient-to-r from-bitcoin to-orange-600 border-0 text-black">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <p className="text-2xl font-medium italic leading-relaxed">
                  "{wisdom?.rule || 'Loading wisdom...'}"
                </p>
                <p className="mt-4 text-sm opacity-75">— {wisdom?.source}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kubernetes Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Kubernetes Cluster</h2>
            <Badge variant="success">Healthy</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pods Status */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Box className="w-5 h-5 text-blue-400" />
                  Pods ({k8sCluster.pods.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {k8sCluster.pods.map((pod, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-mono text-sm text-slate-300">{pod.name}</span>
                      </div>
                      <Badge variant="success" className="text-xs">{pod.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>CPU</span>
                          <span>{pod.cpu}%</span>
                        </div>
                        <Progress value={pod.cpu} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Memory</span>
                          <span>{pod.memory}%</span>
                        </div>
                        <Progress value={pod.memory} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Services & HPA */}
            <div className="space-y-6">
              {/* Services */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Server className="w-5 h-5 text-purple-400" />
                    Services ({k8sCluster.services.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {k8sCluster.services.map((svc, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-slate-400" />
                          <span className="font-mono text-sm">{svc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{svc.type}</Badge>
                          <span className="text-xs text-slate-400">:{svc.port}</span>
                          <span className="text-xs text-green-400">({svc.endpoints} endpoints)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* HPA */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-green-400" />
                    Horizontal Pod Autoscaler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Current Replicas</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{k8sCluster.hpa.current}</span>
                        <span className="text-slate-400 text-sm">/ {k8sCluster.hpa.max}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Scale Range</span>
                        <span>{k8sCluster.hpa.min} - {k8sCluster.hpa.max} pods</span>
                      </div>
                      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                          style={{ width: `${(k8sCluster.hpa.current / k8sCluster.hpa.max) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">CPU Target</span>
                        <span className="text-slate-300">{k8sCluster.hpa.cpu}% / 70%</span>
                      </div>
                      <Progress value={(k8sCluster.hpa.cpu / 70) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-800/30 rounded-xl p-6 font-mono text-sm">
              <pre className="text-slate-300 overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                         Kubernetes Cluster                               │
│                                                                          │
│   ┌─────────────┐                                                       │
│   │   Ingress   │──────────────────┐                                    │
│   │   (nginx)   │                  │                                    │
│   └─────────────┘                  ▼                                    │
│         │                ┌─────────────────┐                            │
│         │                │    Frontend     │                            │
│         ▼                │  (nginx, 2 pods)│                            │
│   ┌───────────┐          └─────────────────┘                            │
│   │    API    │                  │                                      │
│   │ (Node.js) │◀─────────────────┘                                      │
│   │ 2-10 pods │                                                         │
│   └───────────┘                                                         │
│         │                                                               │
│         ▼                                                               │
│   ┌───────────┐          ┌─────────────────┐                            │
│   │   Redis   │          │       HPA       │                            │
│   │  (cache)  │          │  (autoscaling)  │                            │
│   └───────────┘          └─────────────────┘                            │
│         │                                                               │
│         ▼                                                               │
│   ┌───────────┐                                                         │
│   │ CoinGecko │  (external API)                                         │
│   └───────────┘                                                         │
└─────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-slate-400 text-sm space-y-2">
          <p>Built with ❤️ and ₿itcoin by <a href="https://github.com/rishabhpr" className="text-bitcoin hover:underline">Rishabh</a></p>
          <p>Kubernetes Demo • Node.js + Redis + React + shadcn/ui</p>
        </footer>
      </div>
    </div>
  )
}

export default App
