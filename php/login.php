<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $contraseña = $_POST['contraseña'];

    $stmt = $conn->prepare("SELECT contraseña, tipo_usuario FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hash, $tipo_usuario);
        $stmt->fetch();
        if (password_verify($contraseña, $hash)) {
            // Login correcto: redirigir a la agenda
            header('Location: ../schedule.html');
            exit;
        } else {
            // Error: volver al login con mensaje en la misma página
            header('Location: ../index.html?error=Usuario%20o%20contrase%C3%B1a%20incorrectos');
            exit;
        }
    } else {
        // Usuario no encontrado: mismo mensaje genérico
        header('Location: ../index.html?error=Usuario%20o%20contrase%C3%B1a%20incorrectos');
        exit;
    }
    $stmt->close();
}
?>