<?php
header("Content-Type: application/json");

// ================= LOAD DATABASE =================
require_once "../config/database.php";

// ================= READ JSON INPUT =================
$data = json_decode(file_get_contents("php://input"), true);

// ================= VALIDATION =================
if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received"
    ]);
    exit;
}

if (empty($data["cart"])) {
    echo json_encode([
        "success" => false,
        "message" => "Cart is empty"
    ]);
    exit;
}

// ================= SANITIZE INPUT =================
$fullName = $conn->real_escape_string($data["name"]);
$email    = $conn->real_escape_string($data["email"]);
$phone    = $conn->real_escape_string($data["phone"]);
$address  = $conn->real_escape_string($data["address"]);

$paymentMethod = $conn->real_escape_string($data["paymentMethod"]);

// ================= CALCULATE TOTAL =================
$totalAmount = 0;
foreach ($data["cart"] as $item) {
    $price = floatval($item["price"]);
    $qty   = intval($item["quantity"]);
    $totalAmount += $price * $qty;
}

// ================= PAYMENT STATUS =================
$paymentStatus = ($paymentMethod === "Paystack")
    ? "Pending"
    : "Pay on Delivery";

// ================= PREPARE CART JSON =================
$cartItems = json_encode($data["cart"]);

// ================= INSERT ORDER =================
$sql = "INSERT INTO orders 
(
  full_name, email, phone, address, cart_items,
  total_amount, payment_method, payment_status
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssssdss",
    $fullName,
    $email,
    $phone,
    $address,
    $cartItems,
    $totalAmount,
    $paymentMethod,
    $paymentStatus
);

// ================= EXECUTE =================
if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Order saved successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}

$stmt->close();
$conn->close();
