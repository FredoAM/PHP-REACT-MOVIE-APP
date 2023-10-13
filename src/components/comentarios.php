<?php


// Assuming you have established a database connection
include("db.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Origin: *');

// Handle POST request to save a comment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve the comment data from the request body
  $commentData = json_decode(file_get_contents('php://input'), true);
  

    // Prepare and execute the SQL statement to insert the comment into the database
    $stmt = $conn->prepare('INSERT INTO comments (movie_id, user_id, comment_text, usuario, image) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('sssss', $commentData['movie_id'], $commentData['user_id'], $commentData['comment_text'], $commentData['usuario'], $commentData['image']);
    $stmt->execute();

    // Return a success response
    http_response_code(200);
    echo json_encode(['message' => 'Comment saved successfully']);
    exit;
}

// Handle GET request to fetch comments for a movie
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve the movie ID from the request URL
    $movieId = $_GET['movieId'];

    // Prepare and execute the SQL statement to fetch comments for the given movie ID
    $stmt = $conn->prepare('SELECT * FROM comments WHERE movie_id = ?');
    $stmt->bind_param('s', $movieId);
    $stmt->execute();

    // Fetch the comments from the database
    $result = $stmt->get_result();
    $comments = $result->fetch_all(MYSQLI_ASSOC);

    // Return the comments as JSON response
    http_response_code(200);
    echo json_encode(['comments' => $comments]);
    exit;
}
// Close the database connection
$conn->close();
?>

