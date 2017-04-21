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


$sql = "SELECT * from sourceReports";
//The query returns a result if it has been found, or false

$result=mysqli_query($conn, $sql);

$i = 0;
$data = array();
while ($row = $result->fetch_assoc()) {
    $rowData = array();
    $rowData['sourceReportID'] = $row['sourceReportID'];
    $rowData['username'] = $row['username'];
    $rowData['timestamp'] = $row['timestamp'];
    $rowData['latitude'] = $row['latitude'];
    $rowData['longitude'] = $row['longitude'];
    $rowData['type'] = $row['type'];
    $rowData['cond'] = $row['cond'];
    $data[$i] = $rowData;
    $i = $i + 1;
}

echo jsonp_encode($data, null);
$conn->close();

?>