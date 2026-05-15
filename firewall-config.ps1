param(
    [string]$Mode = "block",
    [string[]]$AllowedApps = @(),
    [string[]]$AllowedPorts = @(),
    [switch]$Reset
)

$ErrorActionPreference = "Stop"

function Get-FirewallRules {
    Get-NetFirewallRule | Where-Object { $_.DisplayName -like "Anti*Outbound*" }
}

function Remove-ExistingRules {
    $rules = Get-FirewallRules
    if ($rules) {
        Write-Host "Removing existing Anti firewall rules..." -ForegroundColor Yellow
        foreach ($rule in $rules) {
            Remove-NetFirewallRule -Name $rule.Name -ErrorAction SilentlyContinue
        }
    }
}

function New-BlockAllOutboundRule {
    Write-Host "Creating default block rule for all outbound..." -ForegroundColor Cyan
    New-NetFirewallRule -DisplayName "Anti-Block-All-Outbound" `
        -Direction Outbound `
        -Action Block `
        -Enabled True `
        -Profile Any `
        -Description "Blocks all outbound connections by default" | Out-Null
}

function New-AllowAppRule {
    param([string]$AppPath)
    $appName = Split-Path $AppPath -Leaf
    Write-Host "Allowing outbound for: $appName" -ForegroundColor Green
    New-NetFirewallRule -DisplayName "Anti-Allow-$appName" `
        -Direction Outbound `
        -Action Allow `
        -Enabled True `
        -Program $AppPath `
        -Profile Any `
        -Description "Explicitly allows outbound for $appName" | Out-Null
}

function New-AllowPortRule {
    param([string]$Port)
    Write-Host "Allowing outbound port: $Port" -ForegroundColor Green
    New-NetFirewallRule -DisplayName "Anti-Allow-Port-$Port" `
        -Direction Outbound `
        -Action Allow `
        -Enabled True `
        -LocalPort $Port `
        -Protocol TCP `
        -Profile Any `
        -Description "Explicitly allows outbound on port $Port" | Out-Null
}

if ($Reset) {
    Write-Host "Resetting firewall configuration..." -ForegroundColor Yellow
    Remove-ExistingRules
    Write-Host "Done. All outbound connections are now allowed." -ForegroundColor Green
    exit 0
}

if ($Mode -ne "block") {
    Write-Host "Invalid mode. Use 'block' or -Reset to restore." -ForegroundColor Red
    exit 1
}

Remove-ExistingRules
New-BlockAllOutboundRule

foreach ($app in $AllowedApps) {
    if (Test-Path $app) {
        New-AllowAppRule -AppPath $app
    } else {
        Write-Host "Warning: App not found: $app" -ForegroundColor Yellow
    }
}

foreach ($port in $AllowedPorts) {
    if ($port -match '^\d+$') {
        New-AllowPortRule -Port $port
    } else {
        Write-Host "Warning: Invalid port: $port" -ForegroundColor Yellow
    }
}

$rules = Get-FirewallRules
Write-Host "`nFirewall configuration complete. Active rules:" -ForegroundColor Cyan
$rules | Format-Table DisplayName, Direction, Action, Enabled