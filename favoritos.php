<?php
// Assuming you have established a database connection
include("db.php");

header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Origin: *');



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve the favorite data from the request body
  $favoriteData = json_decode(file_get_contents('php://input'), true);
  $movieId = $favoriteData['movie_id'];
  $userId = $favoriteData['user_id'];
  $mediaType = $favoriteData['media_type'];

  // Check if the movie_id already exists for the given user_id
  $stmt = $conn->prepare('SELECT * FROM favorites WHERE movie_id = ? AND user_id = ? AND media_type = ?');
  $stmt->bind_param('sss', $movieId, $userId, $mediaType);
  $stmt->execute();
  $result = $stmt->get_result();
  $existingFavorite = $result->fetch_assoc();

  if ($existingFavorite) {
    // The movie_id already exists, return an error message
    //http_response_code(400);
    echo json_encode(['error' => 'Movie already added as favorite']);
    exit;

  } else {
    // The movie_id doesn't exist, save it to the favorites table
    $stmt = $conn->prepare('INSERT INTO favorites (movie_id, user_id , media_type) VALUES (?,?,?)');
    $stmt->bind_param('sss', $movieId, $userId, $mediaType);
    $stmt->execute();

    // Return a success response
    http_response_code(200);
    echo json_encode(['message' => 'Favorite saved successfully']);
    exit;
  }
}


// Handle GET request to fetch comments for a movie
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve the movie ID from the request URL
    $userId = $_GET['userId'];

    // Prepare and execute the SQL statement to fetch comments for the given movie ID
    $stmt = $conn->prepare('SELECT * FROM favorites WHERE user_id = ?');
    $stmt->bind_param('s', $userId);
    $stmt->execute();

    // Fetch the comments from the database
    $result = $stmt->get_result();
    $favorites = $result->fetch_all(MYSQLI_ASSOC);

    // Return the comments as JSON response
    http_response_code(200);
    echo json_encode(['favorites' => $favorites]);
    exit;
}
// Close the database connection

$conn->close();
?>

