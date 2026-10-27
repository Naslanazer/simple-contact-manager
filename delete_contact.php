<?php

header("Content-Type: application/json");

require "db.php";

$id = intval($_POST["id"] ?? 0);

if ($id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid contact ID."
    ]);

    exit;
}

$stmt = $conn->prepare(
    "DELETE FROM contacts WHERE id = ?"
);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Contact deleted successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete contact."
    ]);

}

$stmt->close();
$conn->close();

?>