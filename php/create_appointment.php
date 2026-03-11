<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fecha = $_POST['fecha'];
    $hora = $_POST['hora'];
    $usuario = $_POST['usuario'];

    $stmt = $conn->prepare("INSERT INTO citas (fecha, hora, usuario) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $fecha, $hora, $usuario);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cita creada']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al crear cita']);
    }
    $stmt->close();
}
?>