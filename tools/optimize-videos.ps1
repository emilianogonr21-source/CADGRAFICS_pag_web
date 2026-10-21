# Optimiza MP4 del sitio para web (H.264, máx. 1280px, sin audio, faststart).
# Requiere FFmpeg portable en tools/_ffmpeg (no se publica).
# Siempre comprime desde el original guardado en tools/_video-originals, así que se puede volver a ejecutar sin perder calidad.
#
# Uso (desde la raíz):
#   powershell -ExecutionPolicy Bypass -File tools/optimize-videos.ps1

# Calidad por video (CRF: más alto = archivo más ligero). Los de fondo van detrás de un velo oscuro o en un marco
# pequeño y toleran más compresión; los que se ven con controles (demos) conservan más detalle.
$Crf = @{
  'video-home-autodesk.mp4'            = 30  # fondo del hero de Autodesk, bajo velo oscuro
  'video-home-adobe.mp4'               = 29  # marco del hero de Adobe
  'creative-cloud.mp4'                 = 29  # marco del hero de Creative Cloud
  'video-acrobat-studio.mp4'           = 28  # marco del hero de Acrobat Studio
  'video-agenda-demo.mp4'              = 26  # demo con controles
  'video-landing-cc-adobe-express.mp4' = 26  # demo con controles
}
$DefaultCrf = 28

# Ancho máximo por video. Los tres de fondo se ven en un marco de ~600 px o bajo velo oscuro:
# a 960 px pesan la mitad y en pantalla se ven igual que a 1280 px.
$MaxWidth = @{
  'video-home-autodesk.mp4' = 960
  'video-home-adobe.mp4'    = 960
  'creative-cloud.mp4'      = 960
}
$DefaultMaxWidth = 1280

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$VideoRoot = Join-Path $Root 'assets\video'
$OriginalsRoot = Join-Path $Root 'tools\_video-originals'
$ff = Get-ChildItem -Path (Join-Path $Root 'tools\_ffmpeg') -Recurse -Filter ffmpeg.exe -ErrorAction SilentlyContinue |
  Select-Object -First 1 -ExpandProperty FullName
if (-not $ff) {
  throw 'No se encontró ffmpeg.exe. Descarga el build essentials en tools/_ffmpeg'
}

$videos = Get-ChildItem -Path $VideoRoot -Recurse -Filter *.mp4 |
  Where-Object { $_.Name -notlike '*.webtmp.mp4' -and $_.Name -notlike '*.web.mp4' }

foreach ($src in $videos) {
  $relativePath = $src.FullName.Substring($VideoRoot.Length).TrimStart('\')
  $backup = Join-Path $OriginalsRoot $relativePath
  $source = if (Test-Path $backup) { $backup } else { $src.FullName }
  $before = (Get-Item $source).Length
  $tmp = "$($src.FullName).webtmp.mp4"
  $quality = if ($Crf.ContainsKey($src.Name)) { $Crf[$src.Name] } else { $DefaultCrf }
  $width = if ($MaxWidth.ContainsKey($src.Name)) { $MaxWidth[$src.Name] } else { $DefaultMaxWidth }
  Write-Output ("COMPRESSING {0:N1} MB  CRF {1}  max {2}px  {3}" -f ($before / 1MB), $quality, $width, $src.FullName.Replace($Root + '\', ''))
  & $ff -y -hide_banner -loglevel error -i $source `
    -vf "scale='min($width,iw)':-2" `
    -c:v libx264 -preset slow -crf $quality -pix_fmt yuv420p -profile:v high -level 4.0 `
    -an -movflags +faststart `
    $tmp
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmp)) {
    Write-Output "FAIL $($src.Name)"
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    continue
  }
  $after = (Get-Item $tmp).Length
  if ($after -ge $before) {
    Write-Output ("KEEP original {0:N1} MB" -f ($before / 1MB))
    Remove-Item $tmp -Force
    if (Test-Path $backup) { Copy-Item $backup $src.FullName -Force }
  } else {
    if (-not (Test-Path $backup)) {
      $backupDirectory = Split-Path -Parent $backup
      New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null
      Copy-Item $src.FullName $backup
    }
    Move-Item -Force $tmp $src.FullName
    Write-Output ("OK {0:N1} -> {1:N1} MB" -f ($before / 1MB), ($after / 1MB))
  }
}
Write-Output 'done'
