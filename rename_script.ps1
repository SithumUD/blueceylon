$baseDir = "c:\Users\sithu\Videos\blue-ceylon"

# 1. Rename directory
$oldDirPath = Join-Path $baseDir "services\common-lib\src\main\java\com\ceylontrails"
$newDirPath = Join-Path $baseDir "services\common-lib\src\main\java\com\blueceylon"

if (Test-Path $oldDirPath) {
    Rename-Item -Path $oldDirPath -NewName "blueceylon" -ErrorAction SilentlyContinue
    Write-Host "Renamed directory."
}

# 2. File text replacement function
function Replace-StringInFiles {
    param (
        [string]$Path,
        [string]$SearchString,
        [string]$ReplaceString
    )
    
    Get-ChildItem -Path $Path -Recurse -File -Exclude "*.jar", "*.class", "*.ps1", ".git", ".idea" | Where-Object { $_.FullName -notmatch "\\.git\\" } | ForEach-Object {
        $filePath = $_.FullName
        # Read as UTF8
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        
        if ($content -match [regex]::Escape($SearchString)) {
            $newContent = $content -replace [regex]::Escape($SearchString), $ReplaceString
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8
            Write-Host "Updated file: $($_.Name)"
        }
    }
}

# 3. Perform replacements
Write-Host "Replacing ceylontrails -> blueceylon"
Replace-StringInFiles -Path $baseDir -SearchString "ceylontrails" -ReplaceString "blueceylon"

Write-Host "Replacing ceylon-trails -> blue-ceylon"
Replace-StringInFiles -Path $baseDir -SearchString "ceylon-trails" -ReplaceString "blue-ceylon"

Write-Host "Replacing ceylon_trails -> blue_ceylon"
Replace-StringInFiles -Path $baseDir -SearchString "ceylon_trails" -ReplaceString "blue_ceylon"

Write-Host "Replacing Ceylon Trails -> Blue Ceylon"
Replace-StringInFiles -Path $baseDir -SearchString "Ceylon Trails" -ReplaceString "Blue Ceylon"

Write-Host "Replacing CeylonTrails -> BlueCeylon"
Replace-StringInFiles -Path $baseDir -SearchString "CeylonTrails" -ReplaceString "BlueCeylon"

Write-Host "Done."
