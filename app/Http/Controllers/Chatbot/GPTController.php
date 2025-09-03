<?php

namespace App\Http\Controllers\Chatbot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\{Bed, Room, Building, Feature};

class GPTController extends Controller
{
    public function handleQuery(Request $request)
    {
        $query = $request->input('query'); // User query from React frontend

        // Fetch seller data based on the query (e.g., from the Seller, Bed, Room tables)
        $sellerData = $this->getSellerData(); // This should pull data from your database

        // Create the GPT input based on the seller data
        $gptInput = $this->prepareGPTInput($query, $sellerData);

        // Call GPT API to get the response
        $gptResponse = $this->callGPT($gptInput);

        return response()->json([
            'response' => $gptResponse,
        ]);
    }

    // Function to fetch relevant seller data (customize based on your data structure)
    private function getSellerData()
    {
        // Example of how to fetch data (make it as detailed as necessary)
        $beds = Bed::all(); // Fetch all beds data
        $rooms = Room::all(); // Fetch all rooms data
        $buildings = Building::all(); // Fetch building data
        $features = Feature::all();
        // Combine or filter this data as needed before sending to GPT
        return compact('beds', 'rooms', 'buildings');
    }

    // Prepare input to send to GPT based on the query and seller data
    private function prepareGPTInput($query, $sellerData)
    {
        // Create a context or prompt based on the data and query
        return "Answer the following query based on the seller's data (Beds, Rooms, Buildings, etc.):\n" .
            "Query: {$query}\n" .
            "Seller Data: " . json_encode($sellerData);
    }

    // Function to call GPT API
    private function callGPT($input)
    {
        $apiKey = env('OPEN_AI_API_KEY'); // Store API key securely in .env

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
        ])->post('https://api.openai.com/v1/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant for answering queries about the seller\'s products.'],
                ['role' => 'user', 'content' => $input],
            ],
            'max_tokens' => 150, // Adjust based on needs
        ]);

        return $response->json()['choices'][0]['message']['content'] ?? 'No response from GPT';
    }
    
}
