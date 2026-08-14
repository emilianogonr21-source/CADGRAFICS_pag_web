# Extrae CSS y JS inline de las páginas HTML al patrón Dell:
#   assets/css/{carpeta}/{archivo}.css
#   assets/js/{carpeta}/{archivo}.js
# Uso: powershell -File tools/extract-assets.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  $root = Get-Location
}

$jobs = @(
  @{ Html = 'index.html'; Folder = 'index'; Name = 'index'; Prefix = 'assets' },
  @{ Html = 'aviso-privacidad.html'; Folder = 'aviso-privacidad'; Name = 'aviso-privacidad'; Prefix = 'assets' },
  @{ Html = 'pages/adobe/home-adobe.html'; Folder = 'adobe'; Name = 'home-adobe'; Prefix = '../../assets' },
  @{ Html = 'pages/adobe/creative-cloud.html'; Folder = 'adobe'; Name = 'creative-cloud'; Prefix = '../../assets' },
  @{ Html = 'pages/adobe/acrobat-studio.html'; Folder = 'adobe'; Name = 'acrobat-studio'; Prefix = '../../assets' },
  @{ Html = 'pages/autodesk/home-autodesk.html'; Folder = 'autodesk'; Name = 'home-autodesk'; Prefix = '../../assets' },
  @{ Html = 'pages/autodesk/aec-collection.html'; Folder = 'autodesk'; Name = 'aec-collection'; Prefix = '../../assets' },
  @{ Html = 'pages/chaos/home-chaos.html'; Folder = 'chaos'; Name = 'home-chaos'; Prefix = '../../assets' },
  @{ Html = 'pages/hp/home-hp.html'; Folder = 'hp'; Name = 'home-hp'; Prefix = '../../assets' }
)

function Get-Utf8NoBom([string]$path) {
  $bytes = [System.IO.File]::ReadAllBytes($path)
  # Strip BOM if present
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    return [System.Text.Encoding]::UTF8.GetString($bytes, 3, $bytes.Length - 3)
  }
  return [System.Text.Encoding]::UTF8.GetString($bytes)
}

function Set-Utf8NoBom([string]$path, [string]$content) {
  $dir = Split-Path -Parent $path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($path, $content, $utf8)
}

foreach ($job in $jobs) {
  $htmlPath = Join-Path $root $job.Html
  if (-not (Test-Path $htmlPath)) {
    Write-Host "SKIP missing: $($job.Html)"
    continue
  }

  $html = Get-Utf8NoBom $htmlPath

  # Skip if already externalized (has our css link and no style tag)
  $cssRel = "$($job.Prefix)/css/$($job.Folder)/$($job.Name).css"
  $jsRel = "$($job.Prefix)/js/$($job.Folder)/$($job.Name).js"
  if ($html -match [regex]::Escape($cssRel) -and $html -notmatch '(?is)<style\b') {
    Write-Host "ALREADY DONE: $($job.Html)"
    continue
  }

  # --- Extract CSS ---
  $styleMatches = [regex]::Matches($html, '(?is)<style\b[^>]*>(.*?)</style>')
  if ($styleMatches.Count -eq 0) {
    Write-Host "NO STYLE: $($job.Html)"
  } else {
    $cssParts = @()
    foreach ($m in $styleMatches) {
      $cssParts += $m.Groups[1].Value.Trim("`r", "`n")
    }
    $cssHeader = @"
/*
  Estilos de $($job.Html)
  Generado al separar CSS del HTML (mismo patrón que Dell).
  Edita este archivo para cambiar la apariencia de la página.
*/

"@
    $cssContent = $cssHeader + ($cssParts -join "`r`n`r`n")
    $cssPath = Join-Path $root "assets/css/$($job.Folder)/$($job.Name).css"
    Set-Utf8NoBom $cssPath $cssContent

    # Replace first style with link; remove remaining styles
    $linkTag = "    <link rel=`"stylesheet`" href=`"$cssRel`">"
    $replaced = $false
    $html = [regex]::Replace($html, '(?is)\s*<style\b[^>]*>.*?</style>', {
      param($match)
      if (-not $replaced) {
        $replaced = $true
        return "`r`n$linkTag"
      }
      return ''
    })
  }

  # --- Extract JS (skip JSON-LD and external src) ---
  $scriptMatches = [regex]::Matches($html, '(?is)<script(\b[^>]*)>(.*?)</script>')
  $jsParts = @()
  $jsNonce = $null
  $indicesToRemove = @()

  for ($i = 0; $i -lt $scriptMatches.Count; $i++) {
    $m = $scriptMatches[$i]
    $attrs = $m.Groups[1].Value
    $body = $m.Groups[2].Value

    if ($attrs -match '(?i)\bsrc\s*=') { continue }
    if ($attrs -match '(?i)type\s*=\s*["'']application/ld\+json["'']') { continue }
    if ([string]::IsNullOrWhiteSpace($body)) { continue }

    if ($attrs -match '(?i)nonce\s*=\s*["'']([^"'']+)["'']') {
      $jsNonce = $Matches[1]
    }

    $jsParts += $body.Trim("`r", "`n")
    $indicesToRemove += $i
  }

  if ($jsParts.Count -gt 0) {
    $jsHeader = @"
/*
  Comportamiento de $($job.Html)
  Generado al separar JS del HTML (mismo patrón que Dell).
  Edita este archivo para cambiar menús, formularios y animaciones.
*/

"@
    $jsContent = $jsHeader + ($jsParts -join "`r`n`r`n")
    $jsPath = Join-Path $root "assets/js/$($job.Folder)/$($job.Name).js"
    Set-Utf8NoBom $jsPath $jsContent

    # Remove extracted script tags from last to first (preserve indices)
    $toRemove = @()
    foreach ($i in $indicesToRemove) {
      $toRemove += $scriptMatches[$i].Value
    }
    foreach ($block in $toRemove) {
      $pos = $html.LastIndexOf($block)
      if ($pos -ge 0) {
        $html = $html.Remove($pos, $block.Length)
      }
    }

    $nonceAttr = if ($jsNonce) { " nonce=`"$jsNonce`"" } else { '' }
    $scriptTag = "    <script src=`"$jsRel`"$nonceAttr></script>"

    # Insert before </body>
    if ($html -match '(?i)</body>') {
      $html = [regex]::Replace($html, '(?i)</body>', "$scriptTag`r`n</body>", 1)
    } else {
      $html += "`r`n$scriptTag`r`n"
    }
  }

  # Clean excessive blank lines around head/body end
  $html = [regex]::Replace($html, "(\r?\n){3,}", "`r`n`r`n")

  Set-Utf8NoBom $htmlPath $html
  Write-Host "OK: $($job.Html) -> css/$($job.Folder)/$($job.Name).css + js/$($job.Folder)/$($job.Name).js"
}

Write-Host "Done."
