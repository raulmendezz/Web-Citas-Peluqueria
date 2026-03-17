<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

// Verificar que está logueado
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autorizado']);
    exit;
}

// Verificar que es admin
if ($_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Solo admin puede desbloquear huecos']);
    exit;
}

// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['ok' => false, 'error' => 'Falta id']);
    exit;
}

$id = (int)$data['id'];

// Conectar a BD
include 'db.php';

// Verificar que existe y está bloqueado
$result = $conn->query("SELECT estado FROM citas WHERE id=$id");
if ($result->num_rows === 0) {
    echo json_encode(['ok' => false, 'error' => 'Cita no encontrada']);
    exit;
}

$row = $result->fetch_assoc();
if ($row['estado'] !== 'bloqueado') {
    echo json_encode(['ok' => false, 'error' => 'Esta cita no está bloqueada']);
    exit;
}

// Eliminar la cita bloqueada
$conn->query("DELETE FROM citas WHERE id=$id");

if ($conn->error) {
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $conn->error]);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Hueco desbloqueado']);
?>
