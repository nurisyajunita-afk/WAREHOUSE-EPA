<?php
// api/items.php - CRUD for items
require_once __DIR__ . '/config.php';
$pdo = db();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT id, code, name, category, type, classification, movement, stock, min_stock AS minStock, status, description FROM items ORDER BY id ASC");
        $rows = $stmt->fetchAll();
        respond(['items' => $rows]);
        break;

    case 'POST':
        $data = json_input();
        $required = ['code','name','category','type','classification','movement','stock','minStock','status'];
        foreach ($required as $f) {
            if (!isset($data[$f])) respond(['error' => 'VALIDATION_ERROR', 'message' => "Missing field: $f"], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO items (code,name,category,type,classification,movement,stock,min_stock,status,description) VALUES (?,?,?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $data['code'], $data['name'], $data['category'], $data['type'],
            $data['classification'], $data['movement'], (int)$data['stock'], (int)$data['minStock'],
            $data['status'], isset($data['description']) ? $data['description'] : null
        ]);
        $id = (int)$pdo->lastInsertId();
        $row = $pdo->query("SELECT id, code, name, category, type, classification, movement, stock, min_stock AS minStock, status, description FROM items WHERE id=".$id)->fetch();
        respond(['item' => $row], 201);
        break;

    case 'PUT':
        // Expect ?id= in query string
        if (!isset($_GET['id'])) respond(['error' => 'MISSING_ID'], 400);
        $id = (int)$_GET['id'];
        $data = json_input();
        $stmt = $pdo->prepare("UPDATE items SET code=?, name=?, category=?, type=?, classification=?, movement=?, stock=?, min_stock=?, status=?, description=? WHERE id=?");
        $stmt->execute([
            $data['code'], $data['name'], $data['category'], $data['type'], $data['classification'], $data['movement'],
            (int)$data['stock'], (int)$data['minStock'], $data['status'], isset($data['description']) ? $data['description'] : null, $id
        ]);
        $row = $pdo->query("SELECT id, code, name, category, type, classification, movement, stock, min_stock AS minStock, status, description FROM items WHERE id=".$id)->fetch();
        respond(['item' => $row]);
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) respond(['error' => 'MISSING_ID'], 400);
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM items WHERE id=?");
        $stmt->execute([$id]);
        respond(['deleted' => true]);
        break;

    default:
        respond(['error' => 'METHOD_NOT_ALLOWED'], 405);
}
