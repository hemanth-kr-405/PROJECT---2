# Simple Windows PowerShell Static Web Server
$port = 3000
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Server running at $prefix"
    Write-Host "Serving files from: $PSScriptRoot"
} catch {
    Write-Host "Failed to start server on port ${port}: $_"
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".wasm" = "application/wasm"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = "index.html" }

        # Check for API database endpoints
        if ($relPath -eq "api/db") {
            $dbPath = Join-Path $PSScriptRoot "database/db.json"
            
            # Ensure database directory exists
            $dbDir = Split-Path $dbPath
            if (!(Test-Path $dbDir)) {
                New-Item -ItemType Directory -Path $dbDir | Out-Null
            }

            # Initialize empty database file if it doesn't exist
            if (!(Test-Path $dbPath)) {
                $defaultDb = @{
                    studentPasswords = @{}
                    facultyPasswords = @{}
                    facultyCustomData = @{}
                    studentProfiles = @{}
                    chats = @()
                }
                $defaultDb | ConvertTo-Json -Depth 10 | Out-File -FilePath $dbPath -Encoding utf8
            }

            if ($request.HttpMethod -eq "GET") {
                $response.ContentType = "application/json; charset=utf-8"
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $bytes = [System.IO.File]::ReadAllBytes($dbPath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            elseif ($request.HttpMethod -eq "POST" -or $request.HttpMethod -eq "PUT") {
                # Read POST body
                $reader = New-Object System.IO.StreamReader($request.InputStream)
                $body = $reader.ReadToEnd()
                $reader.Close()

                # Validate and save JSON
                try {
                    $null = ConvertFrom-Json $body
                    [System.IO.File]::WriteAllText($dbPath, $body, [System.Text.Encoding]::UTF8)

                    $response.StatusCode = 200
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.Headers.Add("Access-Control-Allow-Origin", "*")
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes('{"status":"success"}')
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } catch {
                    $response.StatusCode = 400
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.Headers.Add("Access-Control-Allow-Origin", "*")
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes('{"status":"error","message":"Invalid JSON"}')
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            elseif ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
            }
            $response.Close()
            continue
        }

        $localPath = Join-Path $PSScriptRoot $relPath

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $mime = $mimeTypes[$ext]
            if ($null -eq $mime) { $mime = "application/octet-stream" }

            $response.ContentType = $mime
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    } catch {
        # Continue loop on aborted client request
    }
}
