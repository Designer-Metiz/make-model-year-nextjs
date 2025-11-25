# Cleanup script for Next.js development server
# This script kills any running Node processes, cleans the .next directory, and starts the dev server

Write-Host "🧹 Cleaning up Next.js development environment..." -ForegroundColor Cyan

# Kill any running Node processes
Write-Host "`n1. Stopping any running Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Kill processes on ports 3000 and 3001
Write-Host "2. Clearing ports 3000 and 3001..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($port3000) {
    $pid = ($port3000 | Select-Object -First 1).OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Killed process on port 3000" -ForegroundColor Green
}

if ($port3001) {
    $pid = ($port3001 | Select-Object -First 1).OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Killed process on port 3001" -ForegroundColor Green
}

# Remove lock file and clean .next directory
Write-Host "3. Removing lock files and cleaning cache directories..." -ForegroundColor Yellow
if (Test-Path ".next\dev\lock") {
    Remove-Item ".next\dev\lock" -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Lock file removed" -ForegroundColor Green
}

if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ .next directory cleaned" -ForegroundColor Green
}

if (Test-Path ".turbo") {
    Remove-Item ".turbo" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ .turbo directory cleaned" -ForegroundColor Green
}

Start-Sleep -Seconds 1

Write-Host "`n✅ Cleanup complete! Starting development server...`n" -ForegroundColor Green

# Start the dev server
npm run dev

