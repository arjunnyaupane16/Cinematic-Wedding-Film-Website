param(
  [Parameter(Mandatory = $true)]
  [string]$SourceDir,

  [Parameter(Mandatory = $false)]
  [string]$MapFile
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-FullPath([string]$p) {
  return (Resolve-Path -LiteralPath $p).Path
}

$root = Split-Path -Parent $PSScriptRoot
$publicImages = Join-Path $root "public\\images"

if (-not (Test-Path -LiteralPath $SourceDir)) {
  throw "SourceDir not found: $SourceDir"
}

if (-not (Test-Path -LiteralPath $publicImages)) {
  throw "public\\images not found: $publicImages"
}

$SourceDir = Resolve-FullPath $SourceDir
$publicImages = Resolve-FullPath $publicImages

$targets = @(
  "black-rose-hero.jpg",
  "car-exterior-1.jpg",
  "car-front.jpg",
  "car-grille.jpg",
  "car-interior.jpg",
  "car-rear.jpg",
  "car-top.jpg",
  "car-wheel.jpg"
)

$supported = @("*.jpg", "*.jpeg", "*.png", "*.webp")
$photos = @()
foreach ($glob in $supported) {
  $photos += Get-ChildItem -LiteralPath $SourceDir -Filter $glob -File -ErrorAction SilentlyContinue
}

if ($photos.Count -lt $targets.Count) {
  $need = $targets.Count
  $have = $photos.Count
  throw "Not enough photos in SourceDir. Need >= $need images (jpg/jpeg/png/webp), found $have."
}

# Deterministic order: name then lastwrite
$photos = $photos | Sort-Object Name, LastWriteTime

function Get-PhotoByLeafName([string]$leaf) {
  $match = $photos | Where-Object { $_.Name -ieq $leaf } | Select-Object -First 1
  if ($null -ne $match) { return $match.FullName }
  return $null
}

function Get-PhotoByContains([string]$needle) {
  if ([string]::IsNullOrWhiteSpace($needle)) { return $null }
  $match = $photos | Where-Object { $_.Name -imatch [Regex]::Escape($needle) } | Select-Object -First 1
  if ($null -ne $match) { return $match.FullName }
  return $null
}

$used = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)

function Pick-Unique([string]$candidate) {
  if ([string]::IsNullOrWhiteSpace($candidate)) { return $null }
  if ($used.Contains($candidate)) { return $null }
  $used.Add($candidate) | Out-Null
  return $candidate
}

$mapping = $null
if ($MapFile) {
  if (-not (Test-Path -LiteralPath $MapFile)) {
    throw "MapFile not found: $MapFile"
  }
  $MapFile = Resolve-FullPath $MapFile
  $raw = Get-Content -LiteralPath $MapFile -Raw
  $mapping = $raw | ConvertFrom-Json
}

Write-Host "Applying wedding photos from:`n  $SourceDir"
Write-Host "To public images folder:`n  $publicImages"
Write-Host ""

for ($i = 0; $i -lt $targets.Count; $i++) {
  $target = $targets[$i]
  $src = $null

  # 1) MapFile (explicit), values are filenames inside SourceDir
  if ($mapping -and ($mapping.PSObject.Properties.Name -contains $target)) {
    $desired = [string]$mapping.$target
    if (-not [string]::IsNullOrWhiteSpace($desired)) {
      $candidate = Join-Path $SourceDir $desired
      if (Test-Path -LiteralPath $candidate) {
        $src = Pick-Unique((Resolve-FullPath $candidate))
      } else {
        throw "MapFile references missing file: $desired (for $target)"
      }
    }
  }

  # 2) If user already named photos exactly like targets, match them
  if (-not $src) {
    $src = Pick-Unique((Get-PhotoByLeafName $target))
  }

  # 3) Heuristic match: look for keywords (hero, story, ceremony, venue, gallery, rsvp)
  if (-not $src) {
    $needle = switch -Regex ($target) {
      '^black-rose-hero\.jpg$' { 'hero' ; break }
      '^car-exterior-1\.jpg$'  { 'story' ; break }
      '^car-grille\.jpg$'      { 'ceremony' ; break }
      '^car-interior\.jpg$'    { 'venue' ; break }
      '^car-front\.jpg$'       { 'celebration' ; break }
      '^car-wheel\.jpg$'       { 'gallery' ; break }
      '^car-top\.jpg$'         { 'portrait' ; break }
      '^car-rear\.jpg$'        { 'invite' ; break }
      default { $null }
    }
    $src = Pick-Unique((Get-PhotoByContains $needle))
  }

  # 4) Fallback: next unused sequential photo
  if (-not $src) {
    foreach ($p in $photos) {
      $candidate = $p.FullName
      if (-not $used.Contains($candidate)) {
        $src = Pick-Unique($candidate)
        break
      }
    }
  }

  if (-not $src) {
    throw "Could not pick a unique source photo for $target. Provide more photos or a MapFile."
  }

  $dst = Join-Path $publicImages $target
  Copy-Item -LiteralPath $src -Destination $dst -Force
  Write-Host ("{0,-18} <= {1}" -f $target, (Split-Path -Leaf $src))
}

Write-Host ""
Write-Host "Done. Restart dev server if images are cached (Ctrl+C then: npm run dev)."
