# Google Apps Script - Deployment Guide

## Overview
This Google Apps Script handles automatic Google Sheet creation and data synchronization for SocietySync societies.

## Quick Deploy Steps

### 1. Create Google Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Name it "SocietySync Backup System"
4. Copy the contents of `Code.js` into the editor
5. Delete any default `appsscript.json` if created

### 2. Deploy as Web App
1. Click **Deploy** > **New deployment**
2. Select type: **Web app**
3. Configure:
   - Description: Production v1.0
   - Execute as: **Me** (your Google account)
   - Who has access: **Anyone with Google Account** (for API access)
4. Click **Deploy**
5. Copy the **Web App URL** (ending in `/exec`)

### 3. Configure Server
Add the webhook URL to your server's `.env`:
```
GOOGLE_SHEET_WEBHOOK=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. Test
Make a POST request to test:
```bash
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"doGet"}'
```

Expected response: "SocietySync Google Sheets Backup System is running"

## Features

### Auto Sheet Creation
- Creates sheets named "SocietyName - SocietySync"
- Creates folder "SocietySync Backups" in Google Drive
- Creates tabs: Members, Flats, Payments, Maintenance, Expenses, Funds, Dashboard

### Data Sync Actions
| Action | Description |
|--------|-------------|
| `createSheet` | Creates new sheet for a society |
| `syncMembers` | Syncs all members |
| `syncFlats` | Syncs all flats |
| `syncPayments` | Syncs payment records |
| `syncMaintenance` | Syncs maintenance bills |
| `syncExpenses` | Syncs expenses |
| `syncFunds` | Syncs fund data |
| `addRow` | Adds single row to sheet |
| `updateRow` | Updates existing row |
| `deleteRow` | Deletes row |
| `getSheetInfo` | Gets sheet metadata |
| `exportPDF` | Exports sheet to PDF |
| `exportExcel` | Exports entire workbook |

### Dashboard
Auto-creates a summary dashboard with:
- Total Members
- Total Flats
- Total Payments
- Total Expenses
- Total Funds
- Maintenance Due
- Total Funds Collected

## Security Notes

1. **Access Control**: The script uses "Anyone with Google Account" access to allow server-side API calls
2. **Data Isolation**: Each society gets its own separate sheet - no data mixing
3. **API Key**: Consider adding API key validation in the script for production use

## Troubleshooting

### "Permission denied" errors
- Ensure web app is deployed with "Execute as: Me"
- Ensure "Who has access" is set appropriately

### "Sheet not found" errors
- Verify the spreadsheetId is correct
- Check if sheet was deleted

### Sync failures
- Check server logs for detailed errors
- Verify network connectivity to Google APIs