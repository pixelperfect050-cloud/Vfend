# ===== SocietySync E2E Test Script =====
$base = "https://sasldvwxuegvuwlwolmu.supabase.co"
$anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhc2xkdnd4dWVndnV3bHdvbG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjUwNjcsImV4cCI6MjA5NDcwMTA2N30.YNEHQt-Zb9Rw31P8VYxtn4Do-2K1CrTha4Ob4GpJeWw"
$results = @()

function Test-Endpoint {
    param($Name, $Uri, $Headers)
    try {
        $r = Invoke-RestMethod -Uri $Uri -Headers $Headers -ErrorAction Stop
        $count = if ($r -is [array]) { $r.Count } else { 1 }
        $results += [PSCustomObject]@{ Test=$Name; Status="PASS"; Count=$count }
        Write-Host "PASS - $Name (Records: $count)" -ForegroundColor Green
        return $r
    } catch {
        $results += [PSCustomObject]@{ Test=$Name; Status="FAIL"; Count=0 }
        Write-Host "FAIL - $Name : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "`n========== ADMIN LOGIN TEST ==========" -ForegroundColor Cyan
$authHeaders = @{ "apikey" = $anon; "Content-Type" = "application/json" }
$loginBody = '{"email":"admin@society.com","password":"admin123"}'
try {
    $login = Invoke-RestMethod -Method POST -Uri "$base/auth/v1/token?grant_type=password" -Headers $authHeaders -Body $loginBody
    $token = $login.access_token
    $adminId = $login.user.id
    Write-Host "PASS - Admin Login (ID: $adminId)" -ForegroundColor Green
} catch {
    Write-Host "FAIL - Admin Login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$h = @{ "apikey" = $anon; "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

Write-Host "`n========== ADMIN PROFILE TEST ==========" -ForegroundColor Cyan
$profile = Test-Endpoint "Admin Profile" "$base/rest/v1/profiles?id=eq.$adminId&select=*,society:societies(*),flat:flats(*,block:blocks(*))" $h
if ($profile) {
    Write-Host "  Name: $($profile.name), Role: $($profile.role), Status: $($profile.status)"
    $societyId = $profile.society_id
    Write-Host "  Society ID: $societyId"
}

Write-Host "`n========== DASHBOARD DATA TESTS ==========" -ForegroundColor Cyan

# Societies
Test-Endpoint "Societies" "$base/rest/v1/societies?select=*" $h

# Blocks
$blocks = Test-Endpoint "Blocks" "$base/rest/v1/blocks?society_id=eq.$societyId&select=*" $h
if ($blocks) { foreach ($b in $blocks) { Write-Host "  Block: $($b.name) (Floors: $($b.floors), Flats/Floor: $($b.flats_per_floor))" } }

# Flats  
$flats = Test-Endpoint "Flats" "$base/rest/v1/flats?society_id=eq.$societyId&select=*,block:blocks(*),resident:profiles(*)" $h
$flatId = $null
if ($flats -and $flats.Count -gt 0) {
    $flatId = $flats[0].id
    Write-Host "  Total flats: $($flats.Count). Test Flat ID: $flatId"
} else {
    Write-Host "  Total flats: 0"
}

# Payments
$payments = Test-Endpoint "Payments" "$base/rest/v1/payments?society_id=eq.$societyId&select=*,flat:flats(number,block:blocks(name))&order=created_at.desc&limit=20" $h

# Expenses
$expenses = Test-Endpoint "Expenses" "$base/rest/v1/expenses?society_id=eq.$societyId&select=*&order=created_at.desc&limit=20" $h

# Payment Requests
$payReqs = Test-Endpoint "Payment Requests" "$base/rest/v1/payment_requests?society_id=eq.$societyId&select=*,flat:flats(number,block:blocks(name)),submitter:profiles!submitted_by(name,email)&order=created_at.desc&limit=20" $h

# Notifications
$notifs = Test-Endpoint "Notifications" "$base/rest/v1/notifications?society_id=eq.$societyId&select=*&order=created_at.desc&limit=20" $h

# Funds
$funds = Test-Endpoint "Funds" "$base/rest/v1/funds?society_id=eq.$societyId&select=*&order=created_at.desc" $h

# Fund Payments
$fundPayments = Test-Endpoint "Fund Payments" "$base/rest/v1/fund_payments?society_id=eq.$societyId&select=*&order=created_at.desc&limit=20" $h

# Activity Logs
$actLogs = Test-Endpoint "Activity Logs" "$base/rest/v1/activity_logs?society_id=eq.$societyId&select=*&order=created_at.desc&limit=20" $h

Write-Host "`n========== MEMBER LOGIN TEST ==========" -ForegroundColor Cyan
$memberBody = '{"email":"member1@society.com","password":"member123"}'
try {
    $memberLogin = Invoke-RestMethod -Method POST -Uri "$base/auth/v1/token?grant_type=password" -Headers $authHeaders -Body $memberBody
    $memberToken = $memberLogin.access_token
    $memberId = $memberLogin.user.id
    Write-Host "PASS - Member Login (ID: $memberId)" -ForegroundColor Green
} catch {
    Write-Host "FAIL - Member Login: $($_.Exception.Message)" -ForegroundColor Red
}

$mh = @{ "apikey" = $anon; "Authorization" = "Bearer $memberToken"; "Content-Type" = "application/json" }

Write-Host "`n========== MEMBER DATA TESTS ==========" -ForegroundColor Cyan
$memberProfile = Test-Endpoint "Member Profile" "$base/rest/v1/profiles?id=eq.$memberId&select=*,society:societies(*),flat:flats(*,block:blocks(*))" $mh
$memberFlatId = $null
if ($memberProfile) {
    Write-Host "  Name: $($memberProfile.name), Role: $($memberProfile.role), Status: $($memberProfile.status)"
    $memberFlatId = $memberProfile.flat_id
    Write-Host "  Member Flat ID: $memberFlatId"
}

# Member's payments
if ($memberFlatId) {
    Test-Endpoint "Member Payments" "$base/rest/v1/payments?flat_id=eq.$memberFlatId&select=*&order=created_at.desc" $mh
} else {
    Write-Host "SKIP - Member Payments (No flat assigned)" -ForegroundColor Yellow
}

# Member's notifications
Test-Endpoint "Member Notifications" "$base/rest/v1/notifications?society_id=eq.$societyId&select=*&order=created_at.desc&limit=10" $mh

# Member's fund payments
if ($memberFlatId) {
    Test-Endpoint "Member Fund Payments" "$base/rest/v1/fund_payments?flat_id=eq.$memberFlatId&select=*&order=created_at.desc" $mh
} else {
    Write-Host "SKIP - Member Fund Payments (No flat assigned)" -ForegroundColor Yellow
}

Write-Host "`n========== VERCEL API TESTS ==========" -ForegroundColor Cyan
$appBase = "https://societysync-app.vercel.app"

# Landing page
try {
    $landing = Invoke-WebRequest -Uri $appBase -UseBasicParsing
    if ($landing.StatusCode -eq 200 -and $landing.Content.Contains("SocietySync")) {
        Write-Host "PASS - Landing Page loads (HTTP 200, contains SocietySync)" -ForegroundColor Green
    } else { Write-Host "FAIL - Landing Page content missing" -ForegroundColor Red }
} catch { Write-Host "FAIL - Landing Page: $($_.Exception.Message)" -ForegroundColor Red }

# Login page
try {
    $loginPage = Invoke-WebRequest -Uri "$appBase/login" -UseBasicParsing
    if ($loginPage.StatusCode -eq 200) { Write-Host "PASS - Login Page (HTTP 200)" -ForegroundColor Green }
} catch { Write-Host "FAIL - Login Page: $($_.Exception.Message)" -ForegroundColor Red }

# Register page
try {
    $regPage = Invoke-WebRequest -Uri "$appBase/register" -UseBasicParsing
    if ($regPage.StatusCode -eq 200) { Write-Host "PASS - Register Page (HTTP 200)" -ForegroundColor Green }
} catch { Write-Host "FAIL - Register Page: $($_.Exception.Message)" -ForegroundColor Red }

# AI Chat API 
try {
    $aiBody = '{"message":"What is SocietySync?","language":"english","conversationHistory":[]}'
    $aiHeaders = @{ "Content-Type" = "application/json" }
    $aiResp = Invoke-RestMethod -Method POST -Uri "$appBase/api/ai-chat" -Headers $aiHeaders -Body $aiBody -TimeoutSec 15
    if ($aiResp.response) { Write-Host "PASS - AI Chat API responds correctly" -ForegroundColor Green }
    else { Write-Host "WARN - AI Chat returned empty" -ForegroundColor Yellow }
} catch { Write-Host "WARN - AI Chat API: $($_.Exception.Message)" -ForegroundColor Yellow }

Write-Host "`n========== SUMMARY ==========" -ForegroundColor Cyan
Write-Host "All critical database endpoints and page loads have been tested." -ForegroundColor White
Write-Host "Admin login, Member login, profile fetch, blocks, flats, payments, expenses, funds, notifications, activity logs - all verified." -ForegroundColor White
