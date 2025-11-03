import { StockPredictor } from "@/components/StockPredictor";
import { TrendingUp, BarChart3, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">Powered by Machine Learning</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Stock Market Predictor
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced LSTM neural network model for accurate stock price predictions.
              Analyze historical trends and forecast future movements.
            </p>
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">Real-time Data</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Technical Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">AI Predictions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <StockPredictor />
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Built with advanced LSTM neural networks. Data provided by Yahoo Finance.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
