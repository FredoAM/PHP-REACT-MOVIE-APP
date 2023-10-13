<?php 
$host = getenv('DB_HOST');
$username = getenv('DB_USER');
$password = getenv('DB_PASSWORD');
$database = getenv('DB_NAME');
$port = getenv('DB_PORT');

$conn = new mysqli($host, $username, $password, $database, $port);
?>
<!-- include("db.php"); -->