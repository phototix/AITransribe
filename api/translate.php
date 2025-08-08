<?php
header('Content-Type: application/json');
require_once 'db_connect.php';
require_once 'openai_helper.php';

$data = json_decode(file_get_contents('php://input'), true);

$session_id = $data['session_id'] ?? '';
$language = $data['language'] ?? 'en';
$last_id = $data['last_id'] ?? '';
$last_update = $data['last_update'] ?? date('Y-m-d').' 00:00:00';

try {
    // Get the latest transcript
    $stmt = $pdo->prepare("SELECT * FROM transcripts WHERE session_id = ? ORDER BY timestamp DESC LIMIT 1");
    $stmt->execute([$session_id]);
    $transcript = $stmt->fetch(PDO::FETCH_ASSOC);

    if($last_id<>$transcript['id']){
        if ($transcript) {
            // Get OpenAI key for this session
            $stmt = $pdo->prepare("SELECT openai_key, model FROM sessions WHERE id = ?");
            $stmt->execute([$session_id]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($session) {
                // Translate using OpenAI
                $translation = translateWithOpenAI(
                    $session['openai_key'],
                    $session['model'],
                    $transcript['text'],
                    $transcript['language'],
                    $language
                );
                
                if ($translation) {
                    // Save translation
                    $stmt = $pdo->prepare("INSERT INTO translations (session_id, original_text, translated_text, source_lang, target_lang, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
                    $stmt->execute([
                        $session_id,
                        $transcript['text'],
                        $translation,
                        $transcript['language'],
                        $language,
                        $transcript['timestamp']
                    ]);
                    
                    echo json_encode([
                        'success' => true,
                        'transcript_id' => $transcript['id'],
                        'translation' => [
                            'text' => $translation,
                            'timestamp' => $transcript['timestamp'],
                        ]
                    ]);
                    exit;
                }
            }
        }
    }
    
    // No new content
    echo json_encode([
        'success' => true,
        'translation' => null
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()."SELECT * FROM transcripts WHERE session_id = '$session_id' AND timestamp > '".$last_update."' ORDER BY timestamp DESC LIMIT 1"
    ]);
}

function translateWithOpenAI($api_key, $model, $text, $source_lang, $target_lang) {
    $prompt = "*Note: If both same, just output the source text instead. Translate the following text from {$source_lang} to {$target_lang}:\n\n{$text}. ";
    
    $response = openaiRequest($api_key, $model, $prompt);
    
    return $response['choices'][0]['message']['content'] ?? null;
}
?>