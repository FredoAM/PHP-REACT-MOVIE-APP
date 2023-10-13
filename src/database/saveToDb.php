<?php
// Assuming you have established a database connection
include("db.php");

header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Origin: *');

// Handle POST request to save a comment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve the comment data from the request body
  $valuesData = json_decode(file_get_contents('php://input'), true);
  

    // Prepare and execute the SQL statement to insert the comment into the database
    $stmt = $conn->prepare('INSERT INTO products (`category`, `description`,  `image`, `price`, `rating`, `title`) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('sssdds', $valuesData['category'], $valuesData['description'], $valuesData['image'], $valuesData['price'], $valuesData['rating'], $valuesData['title']);
    $stmt->execute();

    // Return a success response
    http_response_code(200);
    echo json_encode(['message' => 'Data saved successfully']);
    exit;
}

// Close the database connection
$conn->close();
?>

