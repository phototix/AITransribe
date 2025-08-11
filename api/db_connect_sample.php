<?php
date_default_timezone_set('Asia/Singapore');
$host = 'localhost';
$dbname = 'translation_system';
$username = 'root';
$password = '1234';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Create tables if they don't exist
$pdo->exec("
    CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        openai_key VARCHAR(255) NOT NULL,
        model VARCHAR(50) NOT NULL,
        active BOOLEAN DEFAULT FALSE,
        created_at DATETIME NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS transcripts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(50) NOT NULL,
        text TEXT NOT NULL,
        language VARCHAR(10) NOT NULL,
        timestamp DATETIME NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
    );
    
    CREATE TABLE IF NOT EXISTS translations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(50) NOT NULL,
        original_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        source_lang VARCHAR(10) NOT NULL,
        target_lang VARCHAR(10) NOT NULL,
        timestamp DATETIME NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
    );
");
?>