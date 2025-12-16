<?php
// ================= LOAD ENV FILE =================
$env = parse_ini_file(__DIR__ . "/../.env");

$host = $env["DB_HOST"];
$user = $env["DB_USER"];
$pass = $env["DB_PASS"];
$db   = $env["DB_NAME"];

// ================= CONNECT TO MYSQL =================
$conn = new mysqli($host, $user, $pass, $db);

// ================= CHECK CONNECTION =================
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
