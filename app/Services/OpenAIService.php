<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class OpenAIService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = env('OPENAI_API_KEY');
    }

    public function getChatbotResponse($userMessage)
    {
        try {
            $response = $this->client->post('https://api.openai.com/v1/chat/completions', [
                'json' => [
                    'model' => 'gpt-3.5-turbo',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a professional customer support chatbot for a boarding house. Your responses should be polite and helpful.'],
                        ['role' => 'user', 'content' => $userMessage]
                    ],
                ],
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ]
            ]);

            $body = json_decode($response->getBody(), true);
            return $body['choices'][0]['message']['content'];
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('OpenAI API error: ' . $e->getMessage());
            return 'Sorry, there was an error processing your request. Please try again later.';
        }
    }
}
