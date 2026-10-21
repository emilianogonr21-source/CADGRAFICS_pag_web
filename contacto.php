<?php
/**
 * Recibe el formulario del sitio y lo entrega a marketing@.
 * El destinatario está fijo: los datos del visitante nunca eligen a quién se escribe.
 */
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const RECIPIENT = 'marketing@cadgrafics.com.mx';
const ALLOWED_ORIGINS = [
    'https://cadgrafics.com.mx',
    'https://www.cadgrafics.com.mx',
];

function respond(int $status, bool $ok): void
{
    http_response_code($status);
    echo $ok ? '{"ok":true}' : '{"ok":false}';
    exit;
}

function clip(string $value, int $max): string
{
    $value = preg_replace("/[\r\n\x00]+/u", ' ', $value) ?? '';
    $value = trim($value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

function too_many_requests(): bool
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    if ($ip === '') {
        return false;
    }
    $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'cadgrafics-contact';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false;
    }
    $file = $dir . DIRECTORY_SEPARATOR . hash('sha256', $ip);
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $raw = (string) file_get_contents($file);
        foreach (explode(',', $raw) as $stamp) {
            $stamp = (int) $stamp;
            if ($stamp > $now - 600) {
                $hits[] = $stamp;
            }
        }
    }
    if (count($hits) >= 20) {
        return true;
    }
    $hits[] = $now;
    file_put_contents($file, implode(',', $hits), LOCK_EX);
    return false;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false);
}

$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if (!in_array($origin, ALLOWED_ORIGINS, true)) {
    respond(403, false);
}

if (too_many_requests()) {
    respond(429, false);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode($raw === false ? '' : $raw, true);
if (!is_array($data)) {
    respond(400, false);
}

if (trim((string) ($data['_honey'] ?? '')) !== '') {
    respond(200, true);
}

$lines = [];
foreach ($data as $label => $value) {
    if (!is_string($label) || $label === '' || $label[0] === '_') {
        continue;
    }
    if (!is_scalar($value)) {
        continue;
    }
    $cleanLabel = clip($label, 80);
    $cleanValue = clip((string) $value, 500);
    if ($cleanLabel !== '' && $cleanValue !== '') {
        $lines[] = $cleanLabel . ': ' . $cleanValue;
    }
}

if ($lines === []) {
    respond(400, false);
}

$page = clip((string) ($data['Página'] ?? ''), 80);
$interest = clip((string) ($data['Me interesa'] ?? ''), 80);
$subject = 'Nuevo contacto web';
if ($page !== '') {
    $subject .= ' · ' . $page;
}
if ($interest !== '') {
    $subject .= ' · ' . $interest;
}
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$reply = trim((string) ($data['Correo'] ?? ''));
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= 'From: Cadgrafics <' . RECIPIENT . ">\r\n";
if (filter_var($reply, FILTER_VALIDATE_EMAIL)) {
    $headers .= 'Reply-To: ' . $reply . "\r\n";
}

$sent = mail(RECIPIENT, $encodedSubject, implode("\n", $lines), $headers);
respond($sent ? 200 : 502, $sent);
