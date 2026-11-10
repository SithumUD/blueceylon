Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Starting Blue Ceylon Microservices..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$root = $PSScriptRoot
if (-not $root) {
    $root = Get-Location
}

# 1. Check & start Docker containers
Write-Host "`n[1/3] Ensuring Docker infrastructure is up..." -ForegroundColor Yellow
docker-compose up -d

# 2. List of backend microservices
$services = @(
    "api-gateway",
    "auth-service",
    "catalog-service",
    "booking-service",
    "payment-service",
    "notification-service"
)

Write-Host "`n[2/3] Launching backend microservices in separate windows..." -ForegroundColor Yellow
foreach ($svc in $services) {
    $svcPath = Join-Path $root "services\$svc"
    Write-Host " -> Launching $svc..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$svcPath`"; Write-Host 'Starting $svc...' -ForegroundColor Cyan; mvn spring-boot:run"
}

# 3. Launch Frontend
Write-Host "`n[3/3] Launching Frontend (Next.js)..." -ForegroundColor Yellow
$frontendPath = Join-Path $root "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$frontendPath`"; Write-Host 'Starting Frontend...' -ForegroundColor Cyan; npm run dev"

Write-Host "`nAll services have been launched in separate terminal windows!" -ForegroundColor Green
Write-Host "Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "API Gateway: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "Keycloak:    http://localhost:8180" -ForegroundColor White
Write-Host "RabbitMQ:    http://localhost:15672 (guest/guest)" -ForegroundColor White
Write-Host "pgAdmin:     http://localhost:5050" -ForegroundColor White

