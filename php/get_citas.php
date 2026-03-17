<?php
session_start();
header('Content-Type: application/json');

if (empty($_SESSION['usuario'])) { http_response_code(401); echo '[]'; exit; }

include __DIR__ . '/db.php';

// Auto-reset semanal
$weekFile = __DIR__ . '/../tmp/week.txt';
if (!is_dir(dirname($weekFile))) mkdir(dirname($weekFile), 0755, true);
$currentWeek = date('oW'); // año+semana ISO
$lastWeek = @file_get_contents($weekFile);
if ($lastWeek !== $currentWeek) {
    $conn->query('DELETE FROM citas');
    file_put_contents($weekFile, $currentWeek);
}

// ← CORREGIDO: Agregar 'estado' a la consulta
$result = $conn->query('SELECT id, usuario, dia, hora, estado FROM citas ORDER BY dia, hora');
$citas = [];
while ($row = $result->fetch_assoc()) {
    $citas[] = $row;
}
echo json_encode($citas);
?>
