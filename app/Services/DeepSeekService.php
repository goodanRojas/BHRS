<?php
namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class DeepseekService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = env('DEEPSEEK_API_KEY');  // Make sure to add this in .env
    }

    public function getChatbotResponse($userMessage)
    {
        try {
            // Example of a Deepseek API request to fetch knowledge base information
            $response = $this->client->post('https://api.deepseek.ai/v1/search', [
                'json' => [
                    'query' => $userMessage,
                    'model' => 'deepseek-model',  // Change this if you are using a different model
                    'filters' => [
                        'type' => 'customer_support'  // Filter for customer support queries
                    ]
                ],
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ]
            ]);

            $body = json_decode($response->getBody(), true);

            // Return the response from Deepseek API
            return $body['result'] ?? 'Sorry, I couldn’t find that information.';
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Deepseek API error: ' . $e->getMessage());
            return 'Sorry, there was an error processing your request. Please try again later.';
        }
    }
}
