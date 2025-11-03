import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { API_CONFIG, fetchStockData, predictStock } from "@/lib/api";
import { StockChart } from "./StockChart";
import { PredictionChart } from "./PredictionChart";
import { MovingAverageChart } from "./MovingAverageChart";

export const StockPredictor = () => {
  const [stockSymbol, setStockSymbol] = useState("GOOG");
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const { toast } = useToast();

  const handlePredict = async () => {
    if (!stockSymbol.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      toast({
        title: "Fetching Stock Data",
        description: `Getting historical data for ${stockSymbol}...`,
      });

      let historicalData;
      let predictions;
      let note;

      // Use standalone backend or Lovable Cloud based on configuration
      if (API_CONFIG.useStandalone) {
        // Standalone Node.js backend
        const stockResponse = await fetchStockData(
          stockSymbol,
          '2012-01-01',
          new Date().toISOString().split('T')[0]
        );
        historicalData = stockResponse.data;

        toast({
          title: "Generating Predictions",
          description: "Running ML model...",
        });

        const predictionResponse = await predictStock(stockSymbol, historicalData);
        predictions = predictionResponse.predictions;
        note = predictionResponse.note;

      } else {
        // Lovable Cloud (Supabase edge functions)
        const { data: stockResponse, error: stockError } = await supabase.functions.invoke('fetch-stock-data', {
          body: {
            symbol: stockSymbol,
            startDate: '2012-01-01',
            endDate: new Date().toISOString().split('T')[0]
          }
        });

        if (stockError || !stockResponse) {
          throw new Error(stockError?.message || 'Failed to fetch stock data');
        }

        historicalData = stockResponse.data;

        if (!historicalData || historicalData.length === 0) {
          throw new Error('No data available for this stock symbol');
        }

        toast({
          title: "Generating Predictions",
          description: "Running ML model...",
        });

        const { data: predictionResponse, error: predictionError } = await supabase.functions.invoke('predict-stock', {
          body: {
            symbol: stockSymbol,
            stockData: historicalData
          }
        });

        if (predictionError) {
          throw new Error(predictionError.message);
        }

        predictions = predictionResponse.predictions;
        note = predictionResponse.note;
      }

      // Format data for charts
      const formattedData = {
        symbol: stockSymbol,
        dates: historicalData.map((d: any) => d.date),
        prices: historicalData.map((d: any) => d.close),
        predictions: predictions.map((p: any) => p.predicted),
        actualPrices: predictions.map((p: any) => p.actual),
      };

      setStockData(formattedData);

      toast({
        title: "Success",
        description: note || "Stock analysis complete!",
      });
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch stock data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stock-symbol" className="text-foreground">
              Stock Symbol
            </Label>
            <div className="flex gap-2">
              <Input
                id="stock-symbol"
                placeholder="Enter stock symbol (e.g., GOOG, AAPL)"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                className="bg-input border-border"
                onKeyDown={(e) => e.key === "Enter" && handlePredict()}
              />
              <Button
                onClick={handlePredict}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <div className="animate-spin">⏳</div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="ml-2">Analyze</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {stockData && (
        <>
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              Price vs Moving Averages
            </h3>
            <MovingAverageChart data={stockData} />
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Historical Price Data
            </h3>
            <StockChart data={stockData} />
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Prediction Results
            </h3>
            <PredictionChart data={stockData} />
          </Card>
        </>
      )}
    </div>
  );
};
