<?php
require 'jsonwrapper.php';
$servername = "waterappdb.cexfklo4msbc.us-east-1.rds.amazonaws.com";
$username = "joshzhang5";
$password = "password";

// Create connection
$conn = new mysqli($servername, $username, $password, 'WaterAppDB', 3306);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

//Isset checks to see if they exist
if (isset($_REQUEST['user']) && isset($_REQUEST['pass']))
{
    $user = $_REQUEST['user'];
    $pass = $_REQUEST['pass'];
} else {
    echo "No username and password passed";
}

$sql = "SELECT * from users WHERE username = '$user' AND password = '$pass'";

//The query returns a result if it works or false
if($result=mysqli_query($conn, $sql)) { 
    $row = $result->fetch_row();
    $data = array();
    $data['username'] = $row[0];
    $data['password'] = $row[1];
    $data['realname'] = $row[2];
    $data['address'] = $row[3];
    $data['email'] = $row[4];
    $data['banned'] = $row[5];
    $data['type'] = $row[6];
    $data['title'] = $row[7];
    echo jsonp_encode($data, null);

} else {echo false;}

$conn->close();

?>