<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

$session_id = uniqid();
$title = $data['title'] ?? '';
$openai_key = $data['openai_key'] ?? '';
$model = $data['model'] ?? 'gpt-3.5-turbo';
$created_at = date('Y-m-d H:i:s');

try {
    $stmt = $pdo->prepare("INSERT INTO sessions (id, title, openai_key, model, created_at) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$session_id, $title, $openai_key, $model, $created_at]);
    
    echo json_encode([
        'success' => true,
        'session_id' => $session_id
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>