<?php
session_start();
include __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../register.html');
    exit;
}

$usuario = trim($_POST['usuario'] ?? '');
$pass    = $_POST['contraseña'] ?? '';

if ($usuario === '' || $pass === '') {
    header('Location: ../register.html?error=Rellena+todos+los+campos');
    exit;
}
if (strlen($pass) < 4) {
    header('Location: ../register.html?error=La+contraseña+debe+tener+al+menos+4+caracteres');
    exit;
}

// Comprobar si ya existe
$stmt = $conn->prepare('SELECT id FROM usuarios WHERE usuario = ?');
$stmt->bind_param('s', $usuario);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    header('Location: ../register.html?error=Ese+nombre+de+usuario+ya+existe');
    exit;
}

$hash = password_hash($pass, PASSWORD_BCRYPT);
$rol  = 'user'; // Los registros siempre son usuarios normales

$stmt2 = $conn->prepare('INSERT INTO usuarios (usuario, contraseña, tipo_usuario) VALUES (?, ?, ?)');
$stmt2->bind_param('sss', $usuario, $hash, $rol);
$stmt2->execute();

// Auto-login tras registro
$_SESSION['usuario'] = $usuario;
$_SESSION['rol']     = $rol;
$_SESSION['user_id'] = $conn->insert_id;

header('Location: ../schedule.html');
exit;
