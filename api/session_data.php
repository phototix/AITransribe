<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

try {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("SELECT * FROM sessions ORDER BY created_at DESC");
            $sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'sessions' => $sessions
            ]);
            break;
            
        case 'get':
            $session_id = $data['session_id'] ?? '';
            $stmt = $pdo->prepare("SELECT * FROM sessions WHERE id = ?");
            $stmt->execute([$session_id]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($session) {
                echo json_encode([
                    'success' => true,
                    'session' => $session
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'error' => 'Session not found'
                ]);
            }
            break;
            
        case 'set_status':
            $session_id = $data['session_id'] ?? '';
            $active = $data['active'] ?? false;
            
            $stmt = $pdo->prepare("UPDATE sessions SET active = ? WHERE id = ?");
            $stmt->execute([$active, $session_id]);
            
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