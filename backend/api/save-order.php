<?php
header("Content-Type: application/json");
require_once "../config/database.php";

// ================= READ INPUT =================
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data["cart"])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

// ================= SANITIZE INPUT =================
$fullName = $conn->real_escape_string($data["name"]);
$email    = $conn->real_escape_string($data["email"]);
$phone    = $conn->real_escape_string($data["phone"]);
$address  = $conn->real_escape_string($data["address"]);
$paymentMethod = $conn->real_escape_string($data["paymentMethod"]);

// ================= PAYMENT DETAILS =================
$paymentStatus = "PENDING";
$paymentReference = null;

if ($paymentMethod === "Paystack") {
    $paymentStatus = "PAID";
    $paymentReference = $conn->real_escape_string($data["paymentReference"]);
} else {
    $paymentStatus = "PAY ON DELIVERY";
}

// ================= CALCULATE TOTAL (SECURE) =================
$totalAmount = 0;
foreach ($data["cart"] as $item) {
    $totalAmount += floatval($item["price"]) * intval($item["quantity"]);
}

// ================= PREPARE CART JSON =================
$cartItems = json_encode($data["cart"]);

// ================= INSERT ORDER =================
$sql = "INSERT INTO orders
(
  full_name, email, phone, address, cart_items,
  total_amount, payment_method, payment_reference, payment_status
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssssdsss",
    $fullName,
    $email,
    $phone,
    $address,
    $cartItems,
    $totalAmount,
    $paymentMethod,
    $paymentReference,
    $paymentStatus
);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$stmt->close();
$conn->close();
