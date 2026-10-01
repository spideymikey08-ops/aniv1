<?php
// Aniya - Agricultural Navigation and Yield Activity Tracker
header('Content-Type: application/json; charset=utf-8');

// Allow the frontend to be opened from a local development server such as
// VS Code Live Server while the PHP API is served by XAMPP/Apache.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$host = 'localhost';
$db   = 'aniya_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success'=>false, 'message'=>'Database connection failed. Start XAMPP MySQL and import aniyatrack.sql.']);
    exit;
}

function input(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (is_array($data)) return $data;
    return $_POST ?: [];
}

function json_ok($data = []): void {
    echo json_encode(array_merge(['success'=>true], $data));
    exit;
}

function json_error(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['success'=>false, 'message'=>$message]);
    exit;
}

function required(array $data, string $key): string {
    $value = trim((string)($data[$key] ?? ''));
    if ($value === '') json_error("Missing required field: $key");
    return $value;
}
