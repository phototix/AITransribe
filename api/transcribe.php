<?php
header('Content-Type: application/json');
require_once 'db_connect.php';
require_once 'openai_helper.php';

$data = json_decode(file_get_contents('php://input'), true);

$session_id = $data['session_id'] ?? '';
$text = $data['text'] ?? '';
$language = $data['language'] ?? 'en';
$timestamp = date('Y-m-d H:i:s');

try {
    // Save to database
    $stmt = $pdo->prepare("INSERT INTO transcripts (session_id, text, language, timestamp) VALUES (?, ?, ?, ?)");
    $stmt->execute([$session_id, $text, $language, $timestamp]);
    
    // Also save to a text file for backup
    $filename = "../transcripts/session_{$session_id}.txt";
    file_put_contents($filename, "[{$timestamp}] {$text}\n", FILE_APPEND);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>