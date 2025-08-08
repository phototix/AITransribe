<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

$session_id = $data['session_id'] ?? '';
$language = $data['language'] ?? 'en';
$last_id = $data['last_id'] ?? 0;
$limit = 5;

try {
    $stmt = $pdo->prepare("
        SELECT * FROM translations 
        WHERE session_id = ? 
        AND target_lang = ?
        AND id > ?
        ORDER BY timestamp DESC
        LIMIT 5
    ");
    $stmt->execute([$session_id, $language, $last_id]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'history' => $history
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>