<?php
// Assuming you have established a database connection

include("db.php");

header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Origin: *');

// Handle POST request to save a comment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve the user data from the request body
  $userData = json_decode(file_get_contents('php://input'), true);
  

    // Prepare and execute the SQL statement to update the user info into the database
    $stmt = $conn->prepare('UPDATE `usuarios` SET `usuario`= ? , `website`= ?,`github`= ? ,`twitter`= ? ,`instagram`= ? ,`facebook`= ? WHERE `ID` = ?');
    $stmt->bind_param('sssssss', $userData['usuario'], $userData['website'], $userData['github'], $userData['twitter'] , $userData['instagram'] , $userData['facebook'] ,$userData['ID'] );
    $stmt->execute();

    // Return a success response
    http_response_code(200);
    echo json_encode(['message' => 'User upadated successfully']);
    exit;
}

// Handle GET request to fetch comments for a movie
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve the movie ID from the request URL
    $userId = $_GET['userId'];

    // Prepare and execute the SQL statement to fetch comments for the given movie ID
    $stmt = $conn->prepare('SELECT * FROM usuarios WHERE ID = ?');
    $stmt->bind_param('s', $userId);
    $stmt->execute();

    // Fetch the comments from the database
    $result = $stmt->get_result();
    $userInfo = $result->fetch_all(MYSQLI_ASSOC);

    // Return the comments as JSON response
    http_response_code(200);
    echo json_encode(['userInfo' => $userInfo]);
    exit;
}
// Close the database connection
$conn->close();
?>

