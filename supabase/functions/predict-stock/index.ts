import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, stockData } = await req.json();
    
    if (!symbol || !stockData) {
      return new Response(
        JSON.stringify({ error: 'Stock symbol and data are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Making prediction for ${symbol} with ${stockData.length} data points`);

    // TODO: Replace this URL with your deployed Python API endpoint
    // Example: 'https://your-python-api.railway.app/predict'
    const PYTHON_API_URL = Deno.env.get('PYTHON_ML_API_URL');
    
    if (!PYTHON_API_URL) {
      console.warn('PYTHON_ML_API_URL not configured, using mock predictions');
      
      // Mock predictions for now (will be replaced with real API call)
      const predictions = stockData.map((item: any, index: number) => ({
        date: item.date,
        actual: item.close,
        predicted: item.close * (0.95 + Math.random() * 0.1), // Mock prediction
      }));

      return new Response(
        JSON.stringify({ 
          symbol, 
          predictions,
          note: 'Using mock predictions. Deploy your Python API and add PYTHON_ML_API_URL secret to get real predictions.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call your Python ML API
    const response = await fetch(PYTHON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol,
        data: stockData
      })
    });

    if (!response.ok) {
      console.error(`Python API error: ${response.status}`);
      throw new Error('Failed to get predictions from ML model');
    }

    const predictions = await response.json();
    console.log(`Successfully received predictions for ${symbol}`);

    return new Response(
      JSON.stringify({ symbol, predictions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in predict-stock:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
