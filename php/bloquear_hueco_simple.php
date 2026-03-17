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
$dia = intval($data['dia'] ?? 0);
$hora = $data['hora'] ?? '';

if ($dia < 0 || $dia > 6 || !$hora) {
    echo json_encode(['ok' => false, 'error' => 'Datos inválidos']);
    exit;
}

// Verificar que no exista
$check = $conn->query("SELECT id FROM citas WHERE dia=$dia AND hora='$hora'");
if ($check->num_rows > 0) {
    echo json_encode(['ok' => false, 'error' => 'Este hueco ya está ocupado']);
    exit;
}

// Insertar bloqueo
$admin = $conn->real_escape_string($_SESSION['usuario']);
$sql = "INSERT INTO citas (dia, hora, usuario, estado, bloqueado_por, fecha_bloqueo) 
        VALUES ($dia, '$hora', NULL, 'bloqueado', '$admin', NOW())";

if ($conn->query($sql)) {
    echo json_encode(['ok' => true, 'id' => $conn->insert_id]);
} else {
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $conn->error]);
}
?>
