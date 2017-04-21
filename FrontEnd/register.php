<?php
header('Access-Control-Allow-Origin: *');  
require 'jsonwrapper.php';

$servername = "waterappdb.cexfklo4msbc.us-east-1.rds.amazonaws.com";
$username = "joshzhang5";
$password = "password";

// Create connection
$conn = new mysqli($servername, $username, $password, 'WaterAppDB', 3306);

$postdata = file_get_contents("php://input");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

if (isset($postdata)) {
    $request = json_decode($postdata);
    $user = $request->user;
    $pass = $request->pass;
    $type = $request->type;
    $sql = "INSERT INTO users (username, password, type) VALUES ('$user', '$pass', '$type')";
    $result=mysqli_query($conn, $sql);
    if ($result) {
        echo 1;
    } else {
        echo 0;
    }
    
} else {
    echo "did not get post data";
}

$conn->close();

?>