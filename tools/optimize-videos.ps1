# Optimiza MP4 del sitio para web (H.264, máx. 1280px, sin audio, faststart).
# Requiere FFmpeg portable en tools/_ffmpeg (no se publica).
#
# Uso (desde la raíz):
#   powershell -ExecutionPolicy Bypass -File tools/optimize-videos.ps1

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$ff = Get-ChildItem -Path (Join-Path $Root 'tools\_ffmpeg') -Recurse -Filter ffmpeg.exe -ErrorAction SilentlyContinue |
  Select-Object -First 1 -ExpandProperty FullName
if (-not $ff) {
  throw 'No se encontró ffmpeg.exe. Descarga el build essentials en tools/_ffmpeg'
}

$videos = Get-ChildItem -Path (Join-Path $Root 'assets\video') -Recurse -Filter *.mp4 |
  Where-Object { $_.Name -notlike '*.webtmp.mp4' -and $_.Name -notlike '*.web.mp4' }

foreach ($src in $videos) {
  $before = $src.Length
  $tmp = "$($src.FullName).webtmp.mp4"
  Write-Output ("COMPRESSING {0:N1} MB  {1}" -f ($before / 1MB), $src.FullName.Replace($Root + '\', ''))
  & $ff -y -hide_banner -loglevel error -i $src.FullName `
    -vf "scale='min(1280,iw)':-2" `
    -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p `
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
  } else {
    Move-Item -Force $tmp $src.FullName
    Write-Output ("OK {0:N1} -> {1:N1} MB" -f ($before / 1MB), ($after / 1MB))
  }
}
Write-Output 'done'
