$baseDir = "c:\Users\sithu\Videos\blue-ceylon"

Get-ChildItem -Path $baseDir -Recurse -File -Include "*.java", "*.xml", "*.yml", "*.md", "*.html" | ForEach-Object {
    $filePath = $_.FullName
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        Write-Host "Removing BOM from: $($_.Name)"
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        $text = [System.IO.File]::ReadAllText($filePath)
        [System.IO.File]::WriteAllText($filePath, $text, $utf8NoBom)
    }
}
