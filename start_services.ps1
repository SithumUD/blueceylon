Write-Host "Cleaning and Starting Blue Ceylon Microservices..." -ForegroundColor Cyan

# Start API Gateway
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\Users\sithu\Videos\blue-ceylon\services\api-gateway; mvn clean spring-boot:run`""
Write-Host "Launched API Gateway..."

# Start Auth Service
Start-Process powershell -ArgumentList "-NoExit -Command `"cd c:\Users\sithu\Videos\blue-ceylon\services\auth-service; mvn clean spring-boot:run`""
Write-Host "Launched Auth Service..."

Write-Host "All services are booting up in separate windows!" -ForegroundColor Green
