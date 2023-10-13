
<?php

if (isset($_GET['archivo'])) {
    $archivo = $_GET['archivo'];

    if ($_GET['accion'] == 'Guardar') {
        file_put_contents($archivo, $_GET['texto']);
    } 
}

if (isset($_GET['archivo'])) {
    $archivo = $_GET['archivo'];
    $texto = file_get_contents($archivo);
} else {
    $archivo = '';
    $texto = '';
}


?>

<h1>Editar archivo de texto</h1>
<form >
    <label for="">Nombre del Archivo: </label>
    <input type="text" name="archivo" value="">
    <br>
    <textarea name="texto"></textarea>
    <br>
    <br>
    <input type="submit" value="Guardar" name="accion">
    <input type="submit" value="Cargar" name="accion">
</form>