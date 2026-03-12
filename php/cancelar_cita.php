<?php
session_start();
header('Content-Type: application/json');

if (empty($_SESSION['usuario'])) { echo json_encode(['ok'=>false,'error'=>'No autenticado']); exit; }

include __DIR__ . '/db.php';

$body = json_decode(file_get_contents('php://input'), true);
$id   = intval($body['id'] ?? 0);
$user = $_SESSION['usuario'];
$rol  = $_SESSION['rol'];

if ($id <= 0) { echo json_encode(['ok'=>false,'error'=>'ID inválido']); exit; }

// Admin puede borrar cualquiera; usuario solo la suya
if ($rol === 'admin') {
    $stmt = $conn->prepare('DELETE FROM citas WHERE id=?');
    $stmt->bind_param('i', $id);
} else {
    $stmt = $conn->prepare('DELETE FROM citas WHERE id=? AND usuario=?');
    $stmt->bind_param('is', $id, $user);
}

$stmt->execute();
if ($stmt->affected_rows > 0) {
    echo json_encode(['ok'=>true]);
} else {
    echo json_encode(['ok'=>false,'error'=>'No se pudo cancelar (¿ya no existe o no tienes permiso?)']);
}
