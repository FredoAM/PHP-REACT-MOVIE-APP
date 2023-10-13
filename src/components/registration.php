<?php
include("db.php");

header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Origin: *');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

if (isset($_POST["usuario"])) {
    $usuario = $_POST["usuario"];
    $correo = $_POST["correo"];
    $password = $_POST["password"];
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Check if the username or email is already registered
    $checkQuery = "SELECT * FROM usuarios WHERE usuario = ? OR correo = ?";
    $stmt = mysqli_stmt_init($conn);
    if (mysqli_stmt_prepare($stmt, $checkQuery)) {
        mysqli_stmt_bind_param($stmt, "ss", $usuario, $correo);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);
        $rowCount = mysqli_stmt_num_rows($stmt);
        if ($rowCount > 0) {
            echo "Username or email already registered";
            return;
        } else {
            // Insert the new user into the database
            $sql = "INSERT INTO `usuarios` (`usuario`, `correo`, `password`) VALUES (?, ?, ?)";
            $stmt = mysqli_stmt_init($conn);
            $prepareStmt = mysqli_stmt_prepare($stmt, $sql);
            if ($prepareStmt) {
                mysqli_stmt_bind_param($stmt, "sss", $usuario, $correo, $passwordHash);
                mysqli_stmt_execute($stmt);
                echo "You are registered successfully";
            } else {
                echo mysqli_error($conn);
            }
        }
    }
}
?>
