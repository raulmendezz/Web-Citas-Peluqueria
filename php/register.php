<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $contraseña = password_hash($_POST['contraseña'], PASSWORD_DEFAULT);
    // Forzar que cualquier registro sea siempre usuario normal
    $tipo_usuario = 'user';

    $stmt = $conn->prepare("INSERT INTO usuarios (usuario, contraseña, tipo_usuario) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $usuario, $contraseña, $tipo_usuario);

    if ($stmt->execute()) {
        // Registro correcto: redirigir a prueba.html
        header('Location: ../prueba.html');
        exit;
    } else {
        // Error: mostrar mensaje y no redirigir
        echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Error de registro</title></head><body>';
        echo '<p>Error al registrar usuario: ' . htmlspecialchars($stmt->error) . '</p>';
        echo '<p><a href="../register.html">Volver al registro</a></p>';
        echo '</body></html>';
    }
    $stmt->close();
}
?>