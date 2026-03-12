<?php
session_start();
header('Content-Type: application/json');

if (empty($_SESSION['usuario'])) { echo json_encode(['ok'=>false,'error'=>'No autenticado']); exit; }

include __DIR__ . '/db.php';

$body = json_decode(file_get_contents('php://input'), true);
$dia  = intval($body['dia'] ?? -1);
$hora = $conn->real_escape_string($body['hora'] ?? '');
$user = $_SESSION['usuario'];

if ($dia < 0 || $dia > 4 || $hora === '') {
    echo json_encode(['ok'=>false,'error'=>'Datos inválidos']); exit;
}

// Comprobar si el slot ya está ocupado
$stmt = $conn->prepare('SELECT id FROM citas WHERE dia=? AND hora=?');
$stmt->bind_param('is', $dia, $hora);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['ok'=>false,'error'=>'Ese hueco ya está ocupado']); exit;
}

// Comprobar que el usuario no tiene ya una cita
$stmt2 = $conn->prepare('SELECT id FROM citas WHERE usuario=?');
$stmt2->bind_param('s', $user);
$stmt2->execute();
if ($stmt2->get_result()->num_rows > 0) {
    echo json_encode(['ok'=>false,'error'=>'Ya tienes una cita reservada esta semana']); exit;
}

$stmt3 = $conn->prepare('INSERT INTO citas (usuario, dia, hora) VALUES (?,?,?)');
$stmt3->bind_param('sis', $user, $dia, $hora);
$stmt3->execute();
echo json_encode(['ok'=>true]);
