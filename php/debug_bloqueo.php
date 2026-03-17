<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

// Simular que somos admin
$_SESSION['usuario'] = 'test_admin';
$_SESSION['tipo_usuario'] = 'admin';

$debug = [];

// 1. Verificar sesión
$debug['sesion'] = $_SESSION;

// 2. Datos que recibiríamos
$data = ['dia' => 0, 'hora' => '09:00'];
$debug['datos_entrada'] = $data;

$dia = intval($data['dia']);
$hora = $data['hora'];

// 3. Verificar que no exista
$check = $conn->query("SELECT id FROM citas WHERE dia=$dia AND hora='$hora'");
$debug['existe_ya'] = $check->num_rows > 0;

if (!$debug['existe_ya']) {
    // 4. Intentar insertar
    $admin = $conn->real_escape_string($_SESSION['usuario']);
    $sql = "INSERT INTO citas (dia, hora, usuario, estado, bloqueado_por, fecha_bloqueo) 
            VALUES ($dia, '$hora', NULL, 'bloqueado', '$admin', NOW())";
    
    $debug['sql'] = $sql;
    $debug['insert_result'] = $conn->query($sql) ? 'OK' : 'ERROR: ' . $conn->error;
    $debug['insert_id'] = $conn->insert_id;
    
    // 5. Verificar que se insertó
    $check2 = $conn->query("SELECT * FROM citas WHERE dia=$dia AND hora='$hora'");
    $debug['cita_insertada'] = $check2->fetch_assoc();
}

// 6. Ver todas las citas bloqueadas
$result = $conn->query("SELECT id, dia, hora, usuario, estado, bloqueado_por FROM citas WHERE estado='bloqueado'");
$bloqueadas = [];
while ($row = $result->fetch_assoc()) {
    $bloqueadas[] = $row;
}
$debug['todas_bloqueadas'] = $bloqueadas;

// 7. Ver cómo se vería en get_citas
$result2 = $conn->query("SELECT id, usuario, dia, hora, estado FROM citas ORDER BY dia, hora");
$citas = [];
while ($row = $result2->fetch_assoc()) {
    $citas[] = $row;
}
$debug['como_se_veria_en_get_citas'] = $citas;

echo json_encode($debug, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
