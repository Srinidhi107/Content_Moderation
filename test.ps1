$url = "https://content-moderation-b943.onrender.com/api/auth/signup"
$body = @{
    username = "testuser" + (Get-Random -Minimum 100 -Maximum 999)
    email = "test" + (Get-Random -Minimum 100 -Maximum 999) + "@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json"
    Write-Host "Success:"
    Write-Host $response.StatusCode
    Write-Host $response.Content
} catch {
    Write-Host "Error:"
    Write-Host $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Host $reader.ReadToEnd()
}
