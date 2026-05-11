$headers = @{
    "Authorization" = "Bearer rnd_N6Vp0NNbz7P0b4ng1qUGs9RaJajm"
    "Content-Type" = "application/json"
}

$body = @"
{
  "envVars": [
    {"key": "MONGODB_URI", "value": "mongodb+srv://pixelperfect050_db_user:PixelPerfect050@cluster0.4v6flij.mongodb.net/?appName=Cluster0"},
    {"key": "JWT_SECRET", "value": "artflow_studio_jwt_secret_2024_xK9mP2"},
    {"key": "DEFAULT_ADMIN_PASSWORD", "value": "admin123"},
    {"key": "CLIENT_URL", "value": "https://artflow-live.vercel.app"},
    {"key": "NODE_ENV", "value": "production"}
  ]
}
"@

Invoke-RestMethod -Method PATCH -Uri "https://api.render.com/v1/services/srv-d80ror7avr4c73aq5pl0" -Headers $headers -Body $body