$baseDir = "c:\Users\sithu\Videos\blue-ceylon\services\catalog-service\src\main\java\com\blueceylon\catalog_service\domain\model"

# 1. Remove from Hotel and TourAgency
$filesToRemove = @("Hotel.java", "TourAgency.java")
foreach ($file in $filesToRemove) {
    $path = Join-Path $baseDir $file
    $content = Get-Content $path -Raw
    $content = $content -replace '(?m)^\s*@SQLDelete[^\n]*\n', ''
    $content = $content -replace '(?m)^\s*@SQLRestriction[^\n]*\n', ''
    
    # Check if imports need to be removed (optional, but good practice)
    $content = $content -replace '(?m)^\s*import org\.hibernate\.annotations\.SQLDelete;\n', ''
    $content = $content -replace '(?m)^\s*import org\.hibernate\.annotations\.SQLRestriction;\n', ''

    Set-Content -Path $path -Value $content -Encoding UTF8
    Write-Host "Removed SQLDelete/SQLRestriction from $file"
}

# 2. Add to all entities that have @Table(name = "...")
$allFiles = Get-ChildItem -Path $baseDir -File -Filter "*.java"
foreach ($file in $allFiles) {
    # Skip TourPackage as it already has them, and skip BaseModel/Hotel/TourAgency
    if ($file.Name -eq "TourPackage.java" -or $file.Name -eq "BaseModel.java" -or $file.Name -eq "Hotel.java" -or $file.Name -eq "TourAgency.java") {
        continue
    }

    $path = $file.FullName
    $content = Get-Content $path -Raw
    
    # Extract table name
    if ($content -match '@Table\(name = "([^"]+)"') {
        $tableName = $matches[1]
        
        if (-not ($content -match '@SQLDelete')) {
            # Add imports if they don't exist
            if (-not ($content -match 'import org\.hibernate\.annotations\.SQLDelete;')) {
                $content = $content -replace '(?s)(package .*?;)', "`$1`n`nimport org.hibernate.annotations.SQLDelete;`nimport org.hibernate.annotations.SQLRestriction;"
            }
            
            # Inject annotations right before public class
            $injection = "@SQLDelete(sql = `"UPDATE $tableName SET deleted_at = NOW() WHERE id = ?`")`n@SQLRestriction(`"deleted_at IS NULL`")`npublic class "
            $content = $content -replace 'public class ', $injection
            
            Set-Content -Path $path -Value $content -Encoding UTF8
            Write-Host "Added SQLDelete/SQLRestriction to $($file.Name) with table $tableName"
        }
    }
}
