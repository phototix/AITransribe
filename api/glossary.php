<?php
header('Content-Type: application/json');
require_once 'db_connect.php';
require_once 'openai_helper.php';

$data = json_decode(file_get_contents('php://input'), true);

switch ($data['action']) {
    case 'update_blocked':
        $session_id = $data['session_id'];
        $terms = $data['terms'];
        
        try {
            // Clear existing
            $pdo->prepare("DELETE FROM blocked_terms WHERE session_id = ?")
                ->execute([$session_id]);
            
            // Insert new
            $stmt = $pdo->prepare("INSERT INTO blocked_terms (session_id, term) VALUES (?, ?)");
            foreach ($terms as $term) {
                $stmt->execute([$session_id, trim($term)]);
            }
            
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
?>