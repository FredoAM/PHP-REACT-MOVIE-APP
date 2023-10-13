<?php
include("db.php");

header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Origin: *');

if (isset($_POST["correo"])) {
    $correo = $_POST["correo"];
    $password = $_POST["password"];
    $sql = "SELECT * FROM usuarios WHERE correo = ?";
    $stmt = mysqli_stmt_init($conn);
    if (mysqli_stmt_prepare($stmt, $sql)) {
        mysqli_stmt_bind_param($stmt, "s", $correo);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_array($result, MYSQLI_ASSOC);
        if ($user && password_verify($password, $user["password"])) {
            $_SESSION["user"] = $user;
            echo json_encode($_SESSION["user"]); // send the JSON back to the client
        } else {
            echo json_encode(["error" => "Invalid email or password"]);
        }
    }
}
?>


      
    
