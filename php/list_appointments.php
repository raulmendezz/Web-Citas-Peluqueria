<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $usuario = $_GET['usuario'];
    $stmt = $conn->prepare("SELECT id, fecha, hora FROM citas WHERE usuario = ? ORDER BY fecha, hora");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    $citas = [];
    while ($row = $result->fetch_assoc()) {
        $citas[] = $row;
    }
    echo json_encode(['success' => true, 'citas' => $citas]);
    $stmt->close();
}
?>