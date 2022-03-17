<?php
header("Access-Control-Allow-Origin: https://codeccoop.org");
header("Content-Type: application/json");
header("Cache-Control: no-cache, must-revalidate");

$data = array(
	"name" => filter_var($_POST["name"], FILTER_SANITIZE_STRING),
	"email" => filter_var($_POST["email"], FILTER_SANITIZE_EMAIL),
	"subject" => filter_var($_POST["subject"], FILTER_SANITIZE_STRING),
	"message" => filter_var($_POST["message"], FILTER_SANITIZE_STRING),
	"terms" => filter_var($_POST["terms"], FILTER_SANITIZE_NUMBER_INT),
	"subscription" => filter_var($_POST["subscription"], FILTER_SANITIZE_NUMBER_INT),
);

$to = "hola@codeccoop.org";
$subject = $data["subject"];

$body = "De: " . $data["name"] . "\r\n";
# $body .= "Termes i condicions: <b>" . ($data["terms"] == 1 ? "D'acord" : "Desacord") . "</b><br/>\r\n";
# $body .= "Subscripció: " . ($data["subscription"] == 1 ? "D'acord" : "Desacord") . "\r\n";
$body .= "Missatge: \r\n\r\n" . $data["message"] . "\r\n";

$header = "From:" . $data["email"] . " \r\n";
# $header .= "Cc:@somedomain.com \r\n";
$header .= "MIME-Version: 1.0\r\n";
$header .= "Content-type: text/plain\r\n";

$retval = mail($to, $subject, $body, $header);

if ($retval == true) {
	echo "{";
		echo '"success": true';
    echo "}";
} else {
	echo "{";
		echo '"success": false';
	echo "}";
}
?>
