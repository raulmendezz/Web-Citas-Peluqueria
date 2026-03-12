<?php
session_start();
header('Content-Type: application/json');

if (empty($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['usuario' => null]);
    exit;
}

echo json_encode([
    'usuario' => $_SESSION['usuario'],
    'rol'     => $_SESSION['rol'],
    'id'      => $_SESSION['user_id'],
]);
