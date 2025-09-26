<?php
// api/requests.php - CRUD for requests
require_once __DIR__ . '/config.php';
$pdo = db();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT id, request_number AS requestNumber, date, requester, division, item, quantity, reason, status FROM requests ORDER BY id DESC");
        $rows = $stmt->fetchAll();
        respond(['requests' => $rows]);
        break;

    case 'POST':
        $data = json_input();
        $required = ['requestNumber','date','requester','division','item','quantity','status'];
        foreach ($required as $f) {
            if (!isset($data[$f])) respond(['error' => 'VALIDATION_ERROR', 'message' => "Missing field: $f"], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO requests (request_number,date,requester,division,item,quantity,reason,status) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $data['requestNumber'], $data['date'], $data['requester'], $data['division'],
            $data['item'], (int)$data['quantity'], isset($data['reason']) ? $data['reason'] : null, $data['status']
        ]);
        $id = (int)$pdo->lastInsertId();
        $row = $pdo->query("SELECT id, request_number AS requestNumber, date, requester, division, item, quantity, reason, status FROM requests WHERE id=".$id)->fetch();
        respond(['request' => $row], 201);
        break;

    case 'PUT':
        // Expect ?requestNumber= in query string
        if (!isset($_GET['requestNumber'])) respond(['error' => 'MISSING_REQUEST_NUMBER'], 400);
        $requestNumber = $_GET['requestNumber'];
        $data = json_input();
        if (!isset($data['status'])) respond(['error' => 'MISSING_STATUS'], 400);
        $stmt = $pdo->prepare("UPDATE requests SET status=? WHERE request_number=?");
        $stmt->execute([$data['status'], $requestNumber]);
        $row = $pdo->prepare("SELECT id, request_number AS requestNumber, date, requester, division, item, quantity, reason, status FROM requests WHERE request_number=?");
        $row->execute([$requestNumber]);
        respond(['request' => $row->fetch()]);
        break;

    default:
        respond(['error' => 'METHOD_NOT_ALLOWED'], 405);
}
