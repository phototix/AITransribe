<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

try {
    switch ($action) {
        case 'add':
            $session_id = $data['session_id'] ?? '';
            $term = $data['term'] ?? '';
            $actionType = $data['action'] ?? '';
            $replacement = $data['replacement'] ?? null;
            $weight = $data['weight'] ?? 1.0;

            $stmt = $pdo->prepare("
                INSERT INTO glossary_terms 
                (session_id, term, action, replacement, weight) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$session_id, $term, $actionType, $replacement, $weight]);
            
            echo json_encode(['success' => true]);
            break;

        case 'list':
            $session_id = $data['session_id'] ?? '';
            $stmt = $pdo->prepare("SELECT * FROM glossary_terms WHERE session_id = ?");
            $stmt->execute([$session_id]);
            $terms = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'terms' => $terms
            ]);
            break;

        case 'delete':
            $term_id = $data['term_id'] ?? '';
            $stmt = $pdo->prepare("DELETE FROM glossary_terms WHERE id = ?");
            $stmt->execute([$term_id]);
            
            echo json_encode(['success' => true]);
            break;

        default:
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action'
            ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>