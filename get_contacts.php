<?php

header("Content-Type: application/json");

require "db.php";

$sql = "SELECT id, name, email, phone, address
        FROM contacts
        ORDER BY id DESC";

$result = $conn->query($sql);

$contacts = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }

}

echo json_encode($contacts);

$conn->close();

?>