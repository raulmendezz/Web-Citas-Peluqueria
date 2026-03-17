<?php
session_start();
header('Content-Type: application/json');

// Archivo de diagnóstico para debugging
$diagnostico = [];

// 1. Verificar sesión
$diagnostico['sesion'] = [
    'usuario' => $_SESSION['usuario'] ?? 'NO LOGUEADO',
    'tipo_usuario' => $_SESSION['tipo_usuario'] ?? 'N/A'
];

// 2. Verificar conexión a BD
try {
    include __DIR__ . '/db.php';
    $diagnostico['bd_conectada'] = true;
} catch (Exception $e) {
    $diagnostico['bd_conectada'] = false;
    $diagnostico['bd_error'] = $e->getMessage();
    echo json_encode($diagnostico);
    exit;
}

// 3. Verificar tabla citas
$result = $conn->query("DESCRIBE citas");
if ($result) {
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
    $diagnostico['columnas_citas'] = $columns;
    
    // Verificar si existen las columnas necesarias
    $diagnostico['falta_estado'] = !in_array('estado', $columns);
    $diagnostico['falta_bloqueado_por'] = !in_array('bloqueado_por', $columns);
    $diagnostico['falta_fecha_bloqueo'] = !in_array('fecha_bloqueo', $columns);
} else {
    $diagnostico['tabla_citas_error'] = $conn->error;
}

// 4. Ver últimas citas bloqueadas
$result = $conn->query("SELECT id, dia, hora, estado, bloqueado_por FROM citas WHERE estado = 'bloqueado' ORDER BY id DESC LIMIT 5");
if ($result) {
    $bloqueadas = [];
    while ($row = $result->fetch_assoc()) {
        $bloqueadas[] = $row;
    }
    $diagnostico['ultimas_bloqueadas'] = $bloqueadas;
} else {
    $diagnostico['error_bloqueadas'] = $conn->error;
}

// 5. Intentar insertar un test
if ($diagnostico['falta_estado'] === false) {
    $test_dia = 0;
    $test_hora = '09:00';
    $test_admin = 'test_admin_' . time();
    
    $query = "INSERT INTO citas (dia, hora, usuario, estado, bloqueado_por, fecha_bloqueo) 
              VALUES (?, ?, NULL, 'bloqueado', ?, NOW())";
    $stmt = $conn->prepare($query);
    
    if ($stmt) {
        $stmt->bind_param('iss', $test_dia, $test_hora, $test_admin);
        if ($stmt->execute()) {
            $diagnostico['test_insert'] = 'OK - ID: ' . $stmt->insert_id;
            // Eliminar el test
            $conn->query("DELETE FROM citas WHERE id = " . $stmt->insert_id);
        } else {
            $diagnostico['test_insert'] = 'ERROR: ' . $stmt->error;
        }
    } else {
        $diagnostico['test_insert'] = 'ERROR PREPARE: ' . $conn->error;
    }
}

echo json_encode($diagnostico, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
