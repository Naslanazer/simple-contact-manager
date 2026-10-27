<?php

header("Content-Type: application/json");

require "db.php";

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$address = trim($_POST["address"] ?? "");

if ($name === "") {

    echo json_encode([
        "success" => false,
        "message" => "Name is required."
    ]);

    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO contacts (name, email, phone, address)
     VALUES (?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssss",
    $name,
    $email,
    $phone,
    $address
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Contact added successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add contact."
    ]);

}

$stmt->close();
$conn->close();

?>