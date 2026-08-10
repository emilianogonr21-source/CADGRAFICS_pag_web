#Requires -Version 5.1
<#
.SYNOPSIS
  Extrae <style> y <script> inline a assets/css y assets/js, y actualiza el HTML.
  No toca pages/brevo (emails necesitan CSS inline).
#>
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet(
    'index',
    'aviso-privacidad',
    'home-adobe',
    'acrobat-studio',
    'creative-cloud',
    'home-autodesk',
    'aec-collection',
    'home-chaos',
    'home-hp',
    'all'
  )]
  [string]$Page
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $Root 'index.html'))) {
  $Root = (Get-Location).Path
}

$Catalog = @{
  'index' = @{
    Html = 'index.html'
    Css  = 'assets\css\index.css'
    Js   = 'assets\js\index.js'
    CssHref = 'assets/css/index.css'
    JsSrc   = 'assets/js/index.js'
    JsAttrs = 'nonce="REEMPLAZAR_DESDE_SERVIDOR"'
  }
  'aviso-privacidad' = @{
    Html = 'aviso-privacidad.html'
    Css  = 'assets\css\aviso-privacidad.css'
    Js   = 'assets\js\aviso-privacidad.js'
    CssHref = 'assets/css/aviso-privacidad.css'
    JsSrc   = 'assets/js/aviso-privacidad.js'
    JsAttrs = 'nonce="REEMPLAZAR_DESDE_SERVIDOR"'
  }
  'home-adobe' = @{
    Html = 'pages\adobe\home-adobe.html'
    Css  = 'assets\css\adobe\home-adobe.css'
    Js   = 'assets\js\adobe\home-adobe.js'
    CssHref = '../../assets/css/adobe/home-adobe.css'
    JsSrc   = '../../assets/js/adobe/home-adobe.js'
    JsAttrs = 'nonce="REEMPLAZAR_DESDE_SERVIDOR"'
  }
  'acrobat-studio' = @{
    Html = 'pages\adobe\acrobat-studio.html'
    Css  = 'assets\css\adobe\acrobat-studio.css'
    Js   = 'assets\js\adobe\acrobat-studio.js'
    CssHref = '../../assets/css/adobe/acrobat-studio.css'
    JsSrc   = '../../assets/js/adobe/acrobat-studio.js'
    JsAttrs = ''
  }
  'creative-cloud' = @{
    Html = 'pages\adobe\creative-cloud.html'
    Css  = 'assets\css\adobe\creative-cloud.css'
    Js   = 'assets\js\adobe\creative-cloud.js'
    CssHref = '../../assets/css/adobe/creative-cloud.css'
    JsSrc   = '../../assets/js/adobe/creative-cloud.js'
    JsAttrs = ''
  }
  'home-autodesk' = @{
    Html = 'pages\autodesk\home-autodesk.html'
    Css  = 'assets\css\autodesk\home-autodesk.css'
    Js   = 'assets\js\autodesk\home-autodesk.js'
    CssHref = '../../assets/css/autodesk/home-autodesk.css'
    JsSrc   = '../../assets/js/autodesk/home-autodesk.js'
    JsAttrs = 'defer'
  }
  'aec-collection' = @{
    Html = 'pages\autodesk\aec-collection.html'
    Css  = 'assets\css\autodesk\aec-collection.css'
    Js   = 'assets\js\autodesk\aec-collection.js'
    CssHref = '../../assets/css/autodesk/aec-collection.css'
    JsSrc   = '../../assets/js/autodesk/aec-collection.js'
    JsAttrs = ''
  }
  'home-chaos' = @{
    Html = 'pages\chaos\home-chaos.html'
    Css  = 'assets\css\chaos\home-chaos.css'
    Js   = 'assets\js\chaos\home-chaos.js'
    CssHref = '../../assets/css/chaos/home-chaos.css'
    JsSrc   = '../../assets/js/chaos/home-chaos.js'
    JsAttrs = ''
  }
  'home-hp' = @{
    Html = 'pages\hp\home-hp.html'
    Css  = 'assets\css\hp\home-hp.css'
    Js   = 'assets\js\hp\home-hp.js'
    CssHref = '../../assets/css/hp/home-hp.css'
    JsSrc   = '../../assets/js/hp/home-hp.js'
    JsAttrs = ''
  }
}

function Get-Utf8NoBom {
  New-Object System.Text.UTF8Encoding $false
}

function Extract-PageAssets {
  param([hashtable]$Cfg)

  $htmlPath = Join-Path $Root $Cfg.Html
  if (-not (Test-Path $htmlPath)) {
    throw "No existe: $htmlPath"
  }

  $content = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)

  # Ya extrado?
  if ($content -match [regex]::Escape($Cfg.CssHref) -and $content -notmatch '(?is)<style\b') {
    Write-Host "SKIP (ya tiene CSS externo): $($Cfg.Html)"
    return
  }

  # ---- CSS ----
  $styleRegex = [regex]::new('(?is)<style\b[^>]*>(.*?)</style>')
  $styleMatches = $styleRegex.Matches($content)
  if ($styleMatches.Count -eq 0) {
    Write-Host "WARN: sin <style> en $($Cfg.Html)"
  } else {
    $cssParts = foreach ($m in $styleMatches) { $m.Groups[1].Value.Trim() }
    $cssBody = ($cssParts -join "`r`n`r`n") + "`r`n"

    $cssPath = Join-Path $Root $Cfg.Css
    $cssDir = Split-Path $cssPath -Parent
    if (-not (Test-Path $cssDir)) {
      New-Item -ItemType Directory -Force -Path $cssDir | Out-Null
    }
    [System.IO.File]::WriteAllText($cssPath, $cssBody, (Get-Utf8NoBom))

    $content = $styleRegex.Replace($content, '')
    $link = "<link rel=`"stylesheet`" href=`"$($Cfg.CssHref)`">"
    if ($content -match '(?i)</head>') {
      $content = [regex]::Replace($content, '(?i)</head>', "  $link`r`n</head>", 1)
    } else {
      throw "No se encontro </head> en $($Cfg.Html)"
    }
  }

  # ---- JS (solo scripts ejecutables) ----
  $scriptRegex = [regex]::new('(?is)<script(\s[^>]*)?>(.*?)</script>')
  $allScripts = $scriptRegex.Matches($content)
  $jsParts = New-Object System.Collections.Generic.List[string]
  $toRemove = New-Object System.Collections.Generic.List[string]

  foreach ($m in $allScripts) {
    $attrs = if ($m.Groups[1].Success) { $m.Groups[1].Value } else { '' }
    $body = $m.Groups[2].Value
    if ($attrs -match '(?i)application/ld\+json') { continue }
    if ($attrs -match '(?i)\bsrc\s*=') { continue }
    if ([string]::IsNullOrWhiteSpace($body)) { continue }
    $jsParts.Add($body.Trim()) | Out-Null
    $toRemove.Add($m.Value) | Out-Null
  }

  if ($jsParts.Count -gt 0) {
    $jsBody = ($jsParts -join "`r`n`r`n") + "`r`n"
    $jsPath = Join-Path $Root $Cfg.Js
    $jsDir = Split-Path $jsPath -Parent
    if (-not (Test-Path $jsDir)) {
      New-Item -ItemType Directory -Force -Path $jsDir | Out-Null
    }
    [System.IO.File]::WriteAllText($jsPath, $jsBody, (Get-Utf8NoBom))

    foreach ($block in $toRemove) {
      $content = $content.Replace($block, '')
    }

    $attrStr = if ($Cfg.JsAttrs) { ' ' + $Cfg.JsAttrs } else { '' }
    $scriptTag = "<script$attrStr src=`"$($Cfg.JsSrc)`"></script>"
    if ($content -match '(?i)</body>') {
      $content = [regex]::Replace($content, '(?i)</body>', "  $scriptTag`r`n</body>", 1)
    } else {
      throw "No se encontro </body> en $($Cfg.Html)"
    }
  }

  # Limpieza de lineas en blanco excesivas en head
  $content = [regex]::Replace($content, "(`r`n){3,}", "`r`n`r`n")

  [System.IO.File]::WriteAllText($htmlPath, $content, (Get-Utf8NoBom))

  $cssOk = Test-Path (Join-Path $Root $Cfg.Css)
  $jsOk = if ($jsParts.Count -gt 0) { Test-Path (Join-Path $Root $Cfg.Js) } else { $true }
  Write-Host ("OK: {0} | css={1} ({2:N1} KB) | js_blocks={3} js_file={4}" -f `
    $Cfg.Html, $cssOk, ((Get-Item (Join-Path $Root $Cfg.Css)).Length / 1KB), $jsParts.Count, $jsOk)
}

$targets = if ($Page -eq 'all') { $Catalog.Keys | Sort-Object } else { @($Page) }

foreach ($key in $targets) {
  Extract-PageAssets -Cfg $Catalog[$key]
}

Write-Host "`nListo."
