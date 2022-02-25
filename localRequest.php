<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");
  $rest_json = file_get_contents("php://input");
  $_POST = json_decode($rest_json, true);
  $errors = array();

  if (empty($_POST['first'])) {
    $firstName = '%20';
  } else {
    $firstName = $_POST['first'];
  }
  $type = $_POST['type'];
  $lastName = $_POST['last'];

  // $apiUrl = "https://localhost:5001/api/$type/$firstName/$lastName";


$cURLConnection = curl_init();
curl_setopt($cURLConnection, CURLOPT_URL, $apiUrl);
curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($cURLConnection, CURLOPT_FAILONERROR,true);


$apiResponse = curl_exec($cURLConnection);
if (curl_errno($cURLConnection)) {
    print "Error: " . curl_error($apiResponse);
} else {
  print_r(($apiResponse));
}
curl_close($cURLConnection);

?>
