<?php
include 'php/db.php';

// Reiniciar agenda cada semana
$now = new DateTime();
$week = $now->format('W');

// Guardar semana actual en archivo temporal
$weekFile = __DIR__ . '/tmp/week.txt';
$lastWeek = @file_get_contents($weekFile);
if ($lastWeek !== $week) {
    // Nueva semana: borrar todas las citas
    $conn->query('DELETE FROM citas');
    file_put_contents($weekFile, $week);
}

// Obtener citas actuales
$citas = [];
$result = $conn->query('SELECT * FROM citas ORDER BY fecha, hora');
while ($row = $result->fetch_assoc()) {
    $citas[] = $row;
}

// Mostrar agenda semanal
$days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
$startHour = 9;
$endHour = 23;

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Agenda semanal</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h2>Agenda semanal (se reinicia cada semana)</h2>
    <table border="1">
        <thead>
            <tr>
                <th>Hora</th>
<?php foreach ($days as $d): ?>
                <th><?= $d ?></th>
<?php endforeach; ?>
            </tr>
        </thead>
        <tbody>
<?php
for ($h = $startHour; $h < $endHour; $h++) {
    foreach ([":00", ":30"] as $min) {
        echo '<tr>';
        $hora = str_pad($h, 2, '0', STR_PAD_LEFT) . $min;
        echo '<th>' . $hora . '</th>';
        for ($d = 0; $d < 7; $d++) {
            $found = null;
            foreach ($citas as $c) {
                if ($c['dia'] == $d && $c['hora'] == $hora) {
                    $found = $c;
                    break;
                }
            }
            if ($found) {
                echo '<td>' . htmlspecialchars($found['nombre']) . '</td>';
            } else {
                echo '<td>Libre</td>';
            }
        }
        echo '</tr>';
    }
}
?>
        </tbody>
    </table>
    <form method="post" action="">
        <h3>Crear cita</h3>
        <label>Nombre: <input name="nombre" required></label>
        <label>Día:
            <select name="dia">
<?php foreach ($days as $i => $d): ?>
                <option value="<?= $i ?>"><?= $d ?></option>
<?php endforeach; ?>
            </select>
        </label>
        <label>Hora:
            <select name="hora">
<?php
for ($h = $startHour; $h < $endHour; $h++) {
    foreach ([":00", ":30"] as $min) {
        $hora = str_pad($h, 2, '0', STR_PAD_LEFT) . $min;
        echo '<option value="' . $hora . '">' . $hora . '</option>';
    }
}
?>
            </select>
        </label>
        <button type="submit">Crear cita</button>
    </form>
<?php
// Crear cita
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['nombre'], $_POST['dia'], $_POST['hora'])) {
    $nombre = $conn->real_escape_string($_POST['nombre']);
    $dia = intval($_POST['dia']);
    $hora = $conn->real_escape_string($_POST['hora']);
    // Verificar si está libre
    $res = $conn->query("SELECT id FROM citas WHERE dia=$dia AND hora='$hora'");
    if ($res->num_rows > 0) {
        echo '<p style="color:red">Ese hueco ya está ocupado.</p>';
    } else {
        $conn->query("INSERT INTO citas (nombre, dia, hora) VALUES ('$nombre', $dia, '$hora')");
        echo '<p style="color:green">Cita creada correctamente.</p>';
        echo '<meta http-equiv="refresh" content="1">'; // Recargar para mostrar
    }
}
?>
</body>
</html>
