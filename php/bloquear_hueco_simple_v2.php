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
    echo json_encode(['ok' => false, 'error' => 'Solo admin puede bloquear huecos']);
    exit;
}

// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['dia']) || !isset($data['hora'])) {
    echo json_encode(['ok' => false, 'error' => 'Falta dia o hora']);
    exit;
}

$dia = (int)$data['dia'];
$hora = (string)$data['hora'];

// Conectar a BD
include 'db.php';

// Verificar que el hueco está libre
$result = $conn->query("SELECT id FROM citas WHERE dia=$dia AND hora='$hora'");
if ($result->num_rows > 0) {
    echo json_encode(['ok' => false, 'error' => 'Este hueco ya está ocupado']);
    exit;
}

// Crear una cita "bloqueada"
$usuario_actual = $_SESSION['usuario'];
$conn->query("INSERT INTO citas (usuario, dia, hora, estado, bloqueado_por, fecha_bloqueo) 
             VALUES ('BLOQUEADO', $dia, '$hora', 'bloqueado', '$usuario_actual', NOW())");

if ($conn->error) {
    echo json_encode(['ok' => false, 'error' => 'Error BD: ' . $conn->error]);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Hueco bloqueado']);
?>
