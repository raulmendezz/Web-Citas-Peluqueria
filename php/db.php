<?php
// Conexión a la base de datos MySQL
$host = 'localhost';
$db = 'webCitas'; // Cambia por el nombre real de tu base de datos
$user = 'root'; // Cambia por tu usuario
$pass = ''; // Cambia por tu contraseña

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}
?>