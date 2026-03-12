<?php
$host = 'localhost';
$db   = 'webcitas';
$user = 'root';
$pass = '';          // Cambia si tienes contraseña en MySQL

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'DB connection failed: ' . $conn->connect_error]));
}
$conn->set_charset('utf8mb4');
