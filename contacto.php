<?php
/**
 * Recibe el formulario del sitio y lo entrega a marketing@.
 * El destinatario está fijo: los datos del visitante nunca eligen a quién se escribe.
 * Solo entran las etiquetas de la lista. Si no se puede contar intentos, se rechaza.
 */
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

const RECIPIENT = 'marketing@cadgrafics.com.mx';
const ALLOWED_ORIGINS = [
    'https://cadgrafics.com.mx',
    'https://www.cadgrafics.com.mx',
];
const ALLOWED_FIELDS = [
    'Me interesa',
    'Nombre',
    'Empresa',
    'Correo',
    'Celular',
    'Región',
    'Industria',
    'Etapa',
    'Página',
    'Dirección de la página',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'Aceptó aviso de privacidad',
];
const ALLOWED_REGIONS = ['CDMX y centro', 'Occidente', 'Norte', 'Sur y sureste'];
const ALLOWED_STAGES = [
    'Explorando, quiere una recomendación',
    'Quiere una demo',
    'Quiere una cotización',
];
const ALLOWED_PAGE_HOSTS = ['cadgrafics.com.mx', 'www.cadgrafics.com.mx'];
const MAX_HITS = 5;
const WINDOW_SECONDS = 3600;

function respond(int $status, bool $ok): void
{
    if ($status === 405) {
        header('Allow: POST');
    }
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

function starts_with(string $value, string $prefix): bool
{
    return strncmp($value, $prefix, strlen($prefix)) === 0;
}

/** Carpeta escribible para el conteo. Primero el temporal del sistema; si el hosting lo bloquea, private/. */
function rate_dir(): string
{
    $candidates = [
        sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'cadgrafics-contact',
        __DIR__ . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'ratelimit',
    ];
    foreach ($candidates as $dir) {
        if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
            continue;
        }
        if (is_dir($dir) && is_writable($dir)) {
            return $dir;
        }
    }
    return '';
}

/**
 * true = bloquear. Si no hay dónde contar, también se bloquea.
 */
function too_many_requests(): bool
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    $dir = rate_dir();
    if ($ip === '' || $dir === '') {
        return true;
    }
    $fh = fopen($dir . DIRECTORY_SEPARATOR . hash('sha256', $ip), 'c+');
    if ($fh === false) {
        return true;
    }
    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        return true;
    }
    $now = time();
    $hits = [];
    foreach (explode(',', (string) stream_get_contents($fh)) as $stamp) {
        $stamp = (int) $stamp;
        if ($stamp > $now - WINDOW_SECONDS) {
            $hits[] = $stamp;
        }
    }
    $blocked = count($hits) >= MAX_HITS;
    if (!$blocked) {
        $hits[] = $now;
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, implode(',', $hits));
        fflush($fh);
    }
    flock($fh, LOCK_UN);
    fclose($fh);
    return $blocked;
}

function page_on_site(string $url): string
{
    $parts = parse_url($url);
    if (!is_array($parts)) {
        return '';
    }
    $scheme = strtolower((string) ($parts['scheme'] ?? ''));
    $host = strtolower((string) ($parts['host'] ?? ''));
    if ($scheme !== 'https' || !in_array($host, ALLOWED_PAGE_HOSTS, true)) {
        return '';
    }
    return $url;
}

/** Copia local solo cuando el correo no sale. private/ no es accesible por HTTP. */
function store_failed_lead(string $body): void
{
    $dir = __DIR__ . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'leads';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return;
    }
    $file = $dir . DIRECTORY_SEPARATOR . 'failed.log';
    $fh = fopen($file, 'ab');
    if ($fh === false) {
        return;
    }
    if (flock($fh, LOCK_EX)) {
        fwrite($fh, "----\n" . gmdate('c') . "\n" . $body . "\n");
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    @chmod($file, 0600);
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

$email = clip((string) ($data['Correo'] ?? ''), 120);
$phone = substr(preg_replace('/\D+/', '', (string) ($data['Celular'] ?? '')) ?? '', -10);
$name = clip((string) ($data['Nombre'] ?? ''), 120);
$company = clip((string) ($data['Empresa'] ?? ''), 160);
$interest = clip((string) ($data['Me interesa'] ?? ''), 160);
$region = clip((string) ($data['Región'] ?? ''), 40);
$consent = clip((string) ($data['Aceptó aviso de privacidad'] ?? ''), 80);

if (
    !filter_var($email, FILTER_VALIDATE_EMAIL)
    || strlen($phone) !== 10
    || $name === ''
    || $company === ''
    || $interest === ''
    || !in_array($region, ALLOWED_REGIONS, true)
    || !starts_with($consent, 'Sí')
) {
    respond(400, false);
}

$lines = [];
foreach (ALLOWED_FIELDS as $label) {
    if (!array_key_exists($label, $data) || !is_scalar($data[$label])) {
        continue;
    }
    if ($label === 'Celular') {
        $lines[] = $label . ': ' . $phone;
        continue;
    }
    if ($label === 'Región') {
        $lines[] = $label . ': ' . $region;
        continue;
    }
    if ($label === 'Etapa') {
        $stage = clip((string) $data[$label], 80);
        if (in_array($stage, ALLOWED_STAGES, true)) {
            $lines[] = $label . ': ' . $stage;
        }
        continue;
    }
    if ($label === 'Dirección de la página') {
        $pageUrl = page_on_site(clip((string) $data[$label], 300));
        if ($pageUrl !== '') {
            $lines[] = $label . ': ' . $pageUrl;
        }
        continue;
    }
    $clean = clip((string) $data[$label], $label === 'Página' ? 80 : 160);
    if ($clean !== '') {
        $lines[] = $label . ': ' . $clean;
    }
}

if ($lines === []) {
    respond(400, false);
}

$page = clip((string) ($data['Página'] ?? ''), 80);
$subject = 'Nuevo contacto web';
if ($page !== '') {
    $subject .= ' · ' . $page;
}
$subject .= ' · ' . $interest;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= 'From: Cadgrafics <' . RECIPIENT . ">\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";

$body = implode("\n", $lines);
$sent = mail(RECIPIENT, $encodedSubject, $body, $headers);
if (!$sent) {
    store_failed_lead($body);
}
respond($sent ? 200 : 502, $sent);
