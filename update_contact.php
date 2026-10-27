<?php

header("Content-Type: application/json");

require "db.php";

$id = intval($_POST["id"] ?? 0);
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$address = trim($_POST["address"] ?? "");

if ($id <= 0 || $name === "") {

    echo json_encode([
        "success" => false,
        "message" => "Invalid contact information."
    ]);

    exit;
}

$stmt = $conn->prepare(
    "UPDATE contacts
     SET name = ?, email = ?, phone = ?, address = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "ssssi",
    $name,
    $email,
    $phone,
    $address,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Contact updated successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update contact."
    ]);

}

$stmt->close();
$conn->close();

?>