<?php
require 'jsonwrapper.php';
header('Access-Control-Allow-Origin: *');  
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

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
    $lat = $request->lat;
    $lng = $request->lng;
    $source = $request->source;
    $condition = $request->condition;
    $sql = "INSERT INTO sourceReports (username, latitude, longitude, type, cond)
        VALUES ('$user','$lat','$lng','$source','$condition')";


    //The query returns a result if it has been found, or false
    $result=mysqli_query($conn, $sql);
    if ($result) { 
        echo "Successfully updated";
    } else {
         echo "Failed to update";
    }

} else {
    echo "did not get post data";
}

$conn->close();

?>