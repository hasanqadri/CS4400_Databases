<?php 
header('Access-Control-Allow-Origin: *');  
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

if (isset($_REQUEST['user']) && isset($_REQUEST['pass'])) {
    $user = $_REQUEST['user'];
    $pass = $_REQUEST['pass'];
    $sql = "SELECT * from users WHERE username = '$user' AND password = '$pass'";
    
    //The query returns a result if it has been found, or false
    $result=mysqli_query($conn, $sql);
    if ($result->num_rows > 0) { 
        $row = $result->fetch_row();
        $data = array();
        $data['user'] = $row[0];
        $data['pass'] = $row[1];
        $data['realname'] = $row[2];
        $data['address'] = $row[3];
        $data['email'] = $row[4];
        $data['banned'] = $row[5];
        $data['type'] = $row[6];
        $data['title'] = $row[7];
        echo jsonp_encode($data, null);
    } else {
        echo 0;
    }
} else {
    echo 0;;
}


$conn->close();

?>