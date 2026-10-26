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
const ALLOWED_REGIONS = ['CDMX y centro', 'Norte', 'Sur y sureste'];
const ALLOWED_STAGES = [
    'Explorando, quiere una recomendación',
    'Quiere una demo',
    'Quiere una cotización',
];
const ALLOWED_PAGE_HOSTS = ['cadgrafics.com.mx', 'www.cadgrafics.com.mx'];
const MAX_HITS = 5;
const WINDOW_SECONDS = 3600;
const LEAD_KEEP_SECONDS = 2592000;
/** IP públicas de un proxy, solo si el hosting las documenta. Vacío = no adivinar. */
const TRUSTED_PROXIES = [];
const STAGE_FROM_KEY = [
    'descubrir' => 'Explorando, quiere una recomendación',
    'evaluar' => 'Quiere una demo',
    'cotizar' => 'Quiere una cotización',
];

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

/** Texto seguro. Un arreglo o un objeto no se convierte: en PHP 8 eso lanza TypeError. */
function field_string($value): string
{
    if (is_string($value) || is_int($value) || is_float($value)) {
        return (string) $value;
    }
    return '';
}

function is_trusted_proxy(string $ip): bool
{
    if ($ip === '') {
        return false;
    }
    if (in_array($ip, TRUSTED_PROXIES, true)) {
        return true;
    }
    if (filter_var($ip, FILTER_VALIDATE_IP) === false) {
        return false;
    }
    return filter_var(
        $ip,
        FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    ) === false;
}

/**
 * IP del visitante. REMOTE_ADDR si llega directo.
 * Si quien conecta es un proxy de red privada, o una IP listada en TRUSTED_PROXIES,
 * se usa la primera IP pública de X-Forwarded-For desde la derecha.
 * Un visitante no puede elegir su IP: su cabecera se ignora.
 */
function client_ip(): string
{
    $remote = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    if (!is_trusted_proxy($remote)) {
        return $remote;
    }
    $forwarded = array_reverse(array_map('trim', explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''))));
    foreach ($forwarded as $candidate) {
        if (filter_var($candidate, FILTER_VALIDATE_IP) === false || is_trusted_proxy($candidate)) {
            continue;
        }
        return $candidate;
    }
    return $remote;
}

function same_site_request(): bool
{
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '') {
        return in_array($origin, ALLOWED_ORIGINS, true);
    }
    return page_on_site(clip((string) ($_SERVER['HTTP_REFERER'] ?? ''), 300)) !== '';
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
    $ip = client_ip();
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

/** Quita copias con más de 30 días. Un bloque sin fecha se conserva. */
function prune_failed_leads(string $raw): string
{
    $cutoff = time() - LEAD_KEEP_SECONDS;
    $chunks = preg_split("/(?:\r\n|\n)?----(?:\r\n|\n)/", $raw) ?: [];
    $kept = '';
    foreach ($chunks as $chunk) {
        $chunk = trim($chunk);
        if ($chunk === '') {
            continue;
        }
        $first = strtok($chunk, "\r\n");
        $stamp = strtotime((string) $first);
        if ($stamp !== false && $stamp < $cutoff) {
            continue;
        }
        $kept .= "----\n" . $chunk . "\n";
    }
    return $kept;
}

/** Copia local solo cuando el correo no sale. private/ no es accesible por HTTP. Se borra a los 30 días. */
function store_failed_lead(string $body): void
{
    $dir = __DIR__ . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'leads';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return;
    }
    $file = $dir . DIRECTORY_SEPARATOR . 'failed.log';
    $fh = fopen($file, 'c+');
    if ($fh === false) {
        return;
    }
    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        return;
    }
    $kept = prune_failed_leads((string) stream_get_contents($fh));
    $kept .= "----\n" . gmdate('c') . "\n" . $body . "\n";
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, $kept);
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
    @chmod($file, 0600);
}

function request_data(): array
{
    $contentType = (string) ($_SERVER['CONTENT_TYPE'] ?? '');
    if (stripos($contentType, 'application/json') === 0) {
        $raw = file_get_contents('php://input', false, null, 0, 20000);
        $decoded = json_decode($raw === false ? '' : $raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    $posted = [];
    foreach ($_POST as $key => $value) {
        $posted[$key] = field_string($value);
    }
    $map = [
        'interes' => 'Me interesa',
        'nombre' => 'Nombre',
        'empresa' => 'Empresa',
        'email' => 'Correo',
        'celular' => 'Celular',
        'region' => 'Región',
        'industria' => 'Industria',
        'utm_source' => 'utm_source',
        'utm_medium' => 'utm_medium',
        'utm_campaign' => 'utm_campaign',
    ];
    $data = [];
    foreach ($map as $from => $to) {
        if (($posted[$from] ?? '') !== '') {
            $data[$to] = $posted[$from];
        }
    }
    $stageKey = $posted['etapa'] ?? '';
    if (isset(STAGE_FROM_KEY[$stageKey])) {
        $data['Etapa'] = STAGE_FROM_KEY[$stageKey];
    }
    if (($posted['consentimiento'] ?? '') !== '') {
        $data['Aceptó aviso de privacidad'] = 'Sí, ' . gmdate('c');
    }
    $data['_honey'] = $posted['_honey'] ?? '';
    return $data;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false);
}

if (!same_site_request()) {
    respond(403, false);
}

if (too_many_requests()) {
    respond(429, false);
}

$data = request_data();
if ($data === []) {
    respond(400, false);
}

if (trim(field_string($data['_honey'] ?? '')) !== '') {
    respond(200, true);
}

if (field_string($data['Dirección de la página'] ?? '') === '') {
    $fromReferer = page_on_site(clip((string) ($_SERVER['HTTP_REFERER'] ?? ''), 300));
    if ($fromReferer !== '') {
        $data['Dirección de la página'] = $fromReferer;
    }
}

$email = clip(field_string($data['Correo'] ?? ''), 120);
$phone = substr(preg_replace('/\D+/', '', field_string($data['Celular'] ?? '')) ?? '', -10);
$name = clip(field_string($data['Nombre'] ?? ''), 120);
$company = clip(field_string($data['Empresa'] ?? ''), 160);
$interest = clip(field_string($data['Me interesa'] ?? ''), 160);
$region = clip(field_string($data['Región'] ?? ''), 40);
$consent = clip(field_string($data['Aceptó aviso de privacidad'] ?? ''), 80);

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
    if (!array_key_exists($label, $data)) {
        continue;
    }
    $value = field_string($data[$label]);
    if ($label === 'Celular') {
        $lines[] = $label . ': ' . $phone;
        continue;
    }
    if ($label === 'Región') {
        $lines[] = $label . ': ' . $region;
        continue;
    }
    if ($label === 'Etapa') {
        $stage = clip($value, 80);
        if (in_array($stage, ALLOWED_STAGES, true)) {
            $lines[] = $label . ': ' . $stage;
        }
        continue;
    }
    if ($label === 'Dirección de la página') {
        $pageUrl = page_on_site(clip($value, 300));
        if ($pageUrl !== '') {
            $lines[] = $label . ': ' . $pageUrl;
        }
        continue;
    }
    $clean = clip($value, $label === 'Página' ? 80 : 160);
    if ($clean !== '') {
        $lines[] = $label . ': ' . $clean;
    }
}

if ($lines === []) {
    respond(400, false);
}

$page = clip(field_string($data['Página'] ?? ''), 80);
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
