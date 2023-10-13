<?php
// Assuming you have established a database connection
include("db.php");

header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Origin: *');

// Handle POST request to save an image
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve the image data from the request body
  $imageData = json_decode(file_get_contents('php://input'), true);

  // Prepare and execute the SQL statement to update the image in the usuarios table
  $stmt1 = $conn->prepare('UPDATE `usuarios` SET `image` = ? WHERE `ID` = ?');
  $stmt1->bind_param('ss', $imageData['image'], $imageData['userId']);
  $stmt1->execute();

  // Prepare and execute the SQL statement to update the image in the comments table
  $stmt2 = $conn->prepare('UPDATE `comments` SET `image` = ? WHERE `user_id` = ?');
  $stmt2->bind_param('ss', $imageData['image'], $imageData['userId']);
  $stmt2->execute();

  // Return a success response
  http_response_code(200);
  echo json_encode(['message' => 'Image updated successfully']);
  exit;
}

// Handle GET request to fetch the image from the db
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve the user ID from the request URL
    $userId = $_GET['userId'];

    // Prepare and execute the SQL statement to fetch image for the given user ID
    $stmt = $conn->prepare('SELECT * FROM usuarios WHERE ID = ?');
    $stmt->bind_param('s', $userId);
    $stmt->execute();

    // Fetch the image from the database
    $result = $stmt->get_result();
    $image = $result->fetch_all(MYSQLI_ASSOC);

    // Return the image as JSON response
    http_response_code(200);
    echo json_encode(['image' => $image]);
    exit;
}
// Close the database connection
$conn->close();
?>

