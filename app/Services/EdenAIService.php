<?php
namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class EdenAIService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = env('EDEN_AI_API_KEY');  // Set your Eden AI key in .env file
    }

    public function getChatbotResponse($userMessage)
    {
        try {
            $response = $this->client->post('https://api.edenai.run/v1/pretrained/models/gpt3', [
                'json' => [
                    'model' => 'openai-gpt3', // or another model you want to use
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a customer support chatbot for a boarding house. Answer questions politely and helpfully.'],
                        ['role' => 'user', 'content' => $userMessage]
                    ],
                ],  
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ]
            ]);

            $body = json_decode($response->getBody(), true);
            return $body['choices'][0]['message']['content']; // Adjust based on the response format of Eden AI
        } catch (\Exception $e) {
            Log::error('Eden AI error: ' . $e->getMessage());
            return 'Sorry, there was an error processing your request. Please try again later.';
        }
    }
}
