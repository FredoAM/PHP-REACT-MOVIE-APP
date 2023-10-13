<?php


include("db.php");


header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the comment data from the request body
    $favoriteData = json_decode(file_get_contents('php://input'), true);
    
  
      // Prepare and execute the SQL statement to insert the comment into the database
      $stmt = $conn->prepare('DELETE FROM favorites WHERE favorite_id = ? AND user_id = ?');
      $stmt->bind_param('ss', $favoriteData['favorite_id'], $favoriteData['user_id']);
      $stmt->execute();
  
      // Return a success response
      http_response_code(200);
      echo json_encode(['message' => 'Favorite deleted successfully']);
      exit;
  }


  $conn->close();
?>

