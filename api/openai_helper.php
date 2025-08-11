<?php
function applyGlossaryRules($text, $glossaryTerms) {
    foreach ($glossaryTerms as $term) {
        switch ($term['action']) {
            case 'block':
                if (stripos($text, $term['term']) !== false) {
                    return ''; // Block the entire text if term is found
                }
                break;
                
            case 'boost':
                // Boost by repeating the term based on weight
                $boostedTerm = str_repeat($term['term'] . ' ', $term['weight']);
                $text = str_ireplace($term['term'], $boostedTerm, $text);
                break;
                
            case 'replace':
                $text = str_ireplace($term['term'], $term['replacement'], $text);
                break;
        }
    }
    return $text;
}

function openaiRequest($api_key, $model, $prompt) {
    $url = 'https://api.openai.com/v1/chat/completions';
    
    $data = [
        'model' => $model,
        'messages' => [
            [
                'role' => 'user',
                'content' => $prompt
            ]
        ],
        'temperature' => 0.7
    ];
    
    $options = [
        'http' => [
            'header' => [
                "Content-Type: application/json",
                "Authorization: Bearer {$api_key}"
            ],
            'method' => 'POST',
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    return json_decode($response, true);
}
?>