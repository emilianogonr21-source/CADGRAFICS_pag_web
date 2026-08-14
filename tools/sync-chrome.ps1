# Sincroniza WhatsApp flotante y cookie banner desde shared/partials
# No toca headers (CTA Contáctanos varía por página).

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$waPartial = Get-Content (Join-Path $root 'shared\partials\whatsapp-float.html') -Raw
$cookiePartial = Get-Content (Join-Path $root 'shared\partials\cookie-banner.html') -Raw

$defaultWaText = 'Hola%20Cadgrafics%2C%20vi%20el%20sitio%20y%20quiero%20informaci%C3%B3n'
$waHtml = $waPartial -replace '\{\{WA_TEXT\}\}', $defaultWaText
# strip HTML comments from partial for injection
$waHtml = ($waHtml -split "`n" | Where-Object { $_ -notmatch '^\s*<!--' -and $_ -notmatch '^\s*-->' -and $_ -notmatch 'Partial:' -and $_ -notmatch 'Placeholders:' -and $_ -notmatch 'Uso:' }) -join "`n"
$cookieHtml = ($cookiePartial -split "`n" | Where-Object { $_ -notmatch '^\s*<!--' -and $_ -notmatch '^\s*-->' -and $_ -notmatch 'Partial:' -and $_ -notmatch 'Requiere' }) -join "`n"

Write-Host "Partials listos. Este script documenta la fuente de verdad;"
Write-Host "WhatsApp default text: $defaultWaText"
Write-Host "Cookie partial length: $($cookieHtml.Length)"
Write-Host "Edita shared/partials y propaga a mano o amplía este script con reemplazos por página."
