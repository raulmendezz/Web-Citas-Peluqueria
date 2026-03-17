<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

// Verificar admin
if (!isset($_SESSION['usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(['ok' => false, 'error' => 'No tienes permisos']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['ok' => false, 'error' => 'ID inválido']);
    exit;
}

// Eliminar solo si está bloqueado
$sql = "DELETE FROM citas WHERE id=$id AND estado='bloqueado'";

if ($conn->query($sql)) {
    if ($conn->affected_rows > 0) {
        echo json_encode(['ok' => true]);
    } else {
        echo json_encode(['ok' => false, 'error' => 'No se encontró o no está bloqueado']);
    }
} else {
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $conn->error]);
}
?>
