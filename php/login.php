<?php
session_start();
include __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../index.html');
    exit;
}

$usuario = trim($_POST['usuario'] ?? '');
$pass    = $_POST['contraseña'] ?? '';

if ($usuario === '' || $pass === '') {
    header('Location: ../index.html?error=Rellena+todos+los+campos');
    exit;
}

$stmt = $conn->prepare('SELECT id, usuario, contraseña, tipo_usuario FROM usuarios WHERE usuario = ?');
$stmt->bind_param('s', $usuario);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();

if (!$row || !password_verify($pass, $row['contraseña'])) {
    header('Location: ../index.html?error=Usuario+o+contraseña+incorrectos');
    exit;
}

$_SESSION['usuario']  = $row['usuario'];
$_SESSION['rol']      = $row['tipo_usuario'];
$_SESSION['user_id']  = $row['id'];

header('Location: ../schedule.html');
exit;
