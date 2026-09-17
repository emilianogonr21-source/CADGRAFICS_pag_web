# Copia el menú oficial (shared/partials/header.html) a todas las páginas.
# Uso (desde la raíz del proyecto):
#   powershell -ExecutionPolicy Bypass -File tools/sync-header.ps1

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$PartialPath = Join-Path $Root 'shared\partials\header.html'
$templateRaw = Get-Content -Path $PartialPath -Raw -Encoding UTF8

if ($templateRaw -notmatch '(?is)<header\s+class="header"\s+id="header">.*?</header>') {
  throw 'No se encontró el bloque header en shared/partials/header.html'
}
$templateHeader = $Matches[0]

$pages = @(
  @{ Rel = 'index.html'; Active = $null },
  @{ Rel = 'pages/adobe/home-adobe.html'; Active = 'adobe' },
  @{ Rel = 'pages/adobe/acrobat-studio.html'; Active = 'adobe' },
  @{ Rel = 'pages/adobe/creative-cloud.html'; Active = 'adobe' },
  @{ Rel = 'pages/autodesk/home-autodesk.html'; Active = 'autodesk' },
  @{ Rel = 'pages/autodesk/aec-collection.html'; Active = 'autodesk' },
  @{ Rel = 'pages/chaos/home-chaos.html'; Active = 'chaos' },
  @{ Rel = 'pages/dell/home-dell.html'; Active = 'dell' },
  @{ Rel = 'pages/hp/home-hp.html'; Active = 'hp' }
)

function Render-Header {
  param([string]$PageRel, [string]$Active)

  $isRoot = ($PageRel -eq 'index.html')
  $rootPrefix = if ($isRoot) { '' } else { '../../' }
  $activeVal = ' aria-current="page"'

  $out = $templateHeader
  $map = @{
    '{{ROOT}}'            = $rootPrefix
    '{{LOGO_HREF}}'       = if ($isRoot) { '#' } else { "${rootPrefix}index.html" }
    '{{INDEX_MARCAS}}'    = if ($isRoot) { '#marcas' } else { "${rootPrefix}index.html#marcas" }
    '{{INDEX_SERVICIOS}}' = if ($isRoot) { '#servicios' } else { "${rootPrefix}index.html#servicios" }
    '{{INDEX_CASOS}}'     = if ($isRoot) { '#casos' } else { "${rootPrefix}index.html#casos" }
    '{{CONTACT_CLASSES}}' = 'textbutton-trigger'
    '{{ACTIVE_ADOBE}}'    = if ($Active -eq 'adobe') { $activeVal } else { '' }
    '{{ACTIVE_AUTODESK}}' = if ($Active -eq 'autodesk') { $activeVal } else { '' }
    '{{ACTIVE_CHAOS}}'    = if ($Active -eq 'chaos') { $activeVal } else { '' }
    '{{ACTIVE_HP}}'       = if ($Active -eq 'hp') { $activeVal } else { '' }
    '{{ACTIVE_DELL}}'     = if ($Active -eq 'dell') { $activeVal } else { '' }
  }

  foreach ($key in $map.Keys) {
    $out = $out.Replace($key, $map[$key])
  }

  if ($out -match '\{\{[A-Z_]+\}\}') {
    throw "Placeholders sin resolver en $PageRel"
  }
  return $out
}

$updated = 0
foreach ($p in $pages) {
  $path = Join-Path $Root $p.Rel
  if (-not (Test-Path $path)) {
    Write-Output "SKIP missing $($p.Rel)"
    continue
  }
  $text = Get-Content -Path $path -Raw -Encoding UTF8
  if ($text -notmatch '(?is)<header\s+class="header"\s+id="header">.*?</header>') {
    Write-Output "SKIP no header block $($p.Rel)"
    continue
  }
  $newHeader = Render-Header -PageRel $p.Rel -Active $p.Active
  $newText = [regex]::Replace(
    $text,
    '(?is)<header\s+class="header"\s+id="header">.*?</header>',
    { param($m) $newHeader },
    1
  )
  if ($newText -ne $text) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($path, $newText, $utf8NoBom)
    Write-Output "OK  updated $($p.Rel)"
    $updated++
  } else {
    Write-Output "--  already synced $($p.Rel)"
  }
}

Write-Output "done ($updated file(s) changed)"
