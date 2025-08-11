<?php
function getBlockedTerms($session_id) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT term FROM blocked_terms WHERE session_id = ?");
        $stmt->execute([$session_id]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    } catch (PDOException $e) {
        error_log("Blocked terms error: " . $e->getMessage());
        return [];
    }
}

function applyBlockList($text, $blockedTerms) {
    if (empty($blockedTerms)) return $text;
    
    // Create regex pattern (case insensitive, whole words only)
    $pattern = '/\b(' . implode('|', array_map('preg_quote', $blockedTerms)) . ')\b/i';
    
    return preg_replace($pattern, '[REDACTED]', $text);
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