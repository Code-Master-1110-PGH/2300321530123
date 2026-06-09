$envFile = Join-Path $PSScriptRoot '..\.env'
$raw = Get-Content $envFile -Raw
$m = [regex]::Match($raw, 'ACCESS_TOKEN=(.+?)\r?\n[A-Z_]+=','Singleline')
if(-not $m.Success) { $m = [regex]::Match($raw, 'ACCESS_TOKEN=(.+)$','Singleline') }
$token = $m.Groups[1].Value
$tokenClean = ($token -replace '\s','')
$evidenceDir = Join-Path $PSScriptRoot '..\evidence'
if(-not (Test-Path -Path $evidenceDir)) { New-Item -ItemType Directory -Path $evidenceDir | Out-Null }
$body = @{ stack='backend'; level='info'; package='handler'; message='test message from automation' } | ConvertTo-Json

# Use Invoke-WebRequest to capture status and content
try {
  $web = Invoke-WebRequest -Uri 'http://localhost:5000/api/logs' -Method Post -Headers @{ Authorization = "Bearer $tokenClean"; 'Content-Type' = 'application/json' } -Body $body -UseBasicParsing -ErrorAction Stop
} catch {
  $web = $_.ErrorRecord.InvocationInfo.ExtraData.Response
}

$outFile = Join-Path $evidenceDir 'log_response.txt'
if ($null -ne $web) {
  "Status: $($web.StatusCode) $($web.StatusDescription)" | Out-File -FilePath $outFile -Encoding utf8
  $web.Content | Out-File -FilePath $outFile -Append -Encoding utf8
  Write-Output "Saved to $outFile"
  Write-Output "Response status: $($web.StatusCode) $($web.StatusDescription)"
  Write-Output "Content:"
  Write-Output $web.Content
} else {
  "No response captured" | Out-File -FilePath $outFile -Encoding utf8
  Write-Output "No response captured"
}
