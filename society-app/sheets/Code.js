const FOLDER_NAME = 'SocietySync Backups';
const TAB_HEADERS = {
  'Members': ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Flat', 'Resident Type', 'Joined Date'],
  'Flats': ['ID', 'Flat No', 'Block', 'Floor', 'Type', 'Area', 'Owner Name', 'Owner Phone', 'Owner Email', 'Tenant Name', 'Tenant Phone', 'Occupied', 'Current Status'],
  'Payments': ['ID', 'Flat No', 'Month', 'Year', 'Amount', 'Paid Amount', 'Late Fee', 'Status', 'Paid Date', 'Payment Method', 'Transaction ID', 'Receipt No', 'Notes'],
  'Maintenance': ['ID', 'Flat No', 'Month', 'Year', 'Bill Amount', 'Paid Amount', 'Due Date', 'Status', 'Last Updated'],
  'Expenses': ['ID', 'Category', 'Description', 'Amount', 'Date', 'Block', 'Vendor', 'Receipt', 'Added By', 'Created At'],
  'Funds': ['ID', 'Name', 'Category', 'Description', 'Amount Per Flat', 'Total Target', 'Collected', 'Due Date', 'Applicable To', 'Status', 'Created At']
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // Automatic fallback routing for lead form submissions without an explicit action
    if (!action && (data.mobile || data.phone)) {
      return addDemoLead(data);
    }

    switch(action) {
      case 'addDemoLead':
        return addDemoLead(data);
      case 'createSheet':
        return createSheetForSociety(data);
      case 'createMasterSheet':
        return createMasterSheet(data);
      case 'syncMembers':
        return syncMembers(data);
      case 'syncFlats':
        return syncFlats(data);
      case 'syncPayments':
        return syncPayments(data);
      case 'syncMaintenance':
        return syncMaintenance(data);
      case 'syncExpenses':
        return syncExpenses(data);
      case 'syncFunds':
        return syncFunds(data);
      case 'addRow':
        return addRow(data);
      case 'updateRow':
        return updateRow(data);
      case 'deleteRow':
        return deleteRow(data);
      case 'getSheetInfo':
        return getSheetInfo(data);
      case 'exportPDF':
        return exportToPDF(data);
      case 'exportExcel':
        return exportToExcel(data);
      default:
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unknown action' })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function createSheetForSociety(data) {
  try {
    const { societyId, societyName } = data;
    const sheetName = `${societyName} - SocietySync`;
    
    let folder;
    const folders = DriveApp.getFoldersByName(FOLDER_NAME);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(FOLDER_NAME);
    }

    const spreadsheet = SpreadsheetApp.create(sheetName);
    const file = DriveApp.getFileById(spreadsheet.getId());
    folder.addFile(file);
    
    const ss = SpreadsheetApp.openById(spreadsheet.getId());
    
    Object.keys(TAB_HEADERS).forEach(tabName => {
      let sheet = ss.getSheetByName(tabName);
      if (!sheet) {
        sheet = ss.insertSheet(tabName);
      }
      sheet.getRange(1, 1, 1, TAB_HEADERS[tabName].length).setValues([TAB_HEADERS[tabName]]);
      sheet.getRange(1, 1, 1, TAB_HEADERS[tabName].length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    });

    const dashboardSheet = ss.getSheetByName('Dashboard') || ss.insertSheet('Dashboard');
    setupDashboard(ss, societyName);

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      spreadsheetId: spreadsheet.getId(),
      spreadsheetUrl: spreadsheet.getUrl(),
      folderUrl: folder.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function createMasterSheet(data) {
  try {
    const { societies } = data;
    const masterSheetName = 'SocietySync - Master Directory';
    
    let folder;
    const folders = DriveApp.getFoldersByName(FOLDER_NAME);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(FOLDER_NAME);
    }
    
    let masterSpreadsheet;
    const files = folder.getFilesByName(masterSheetName);
    if (files.hasNext()) {
      masterSpreadsheet = SpreadsheetApp.openById(files.next().getId());
    } else {
      masterSpreadsheet = SpreadsheetApp.create(masterSheetName);
      let file = DriveApp.getFileById(masterSpreadsheet.getId());
      folder.addFile(file);
    }
    
    const sheet = masterSpreadsheet.getActiveSheet();
    sheet.setName('All Societies');
    sheet.clear();
    
    // Auto-create Demo Leads tab alongside Master Directory
    let demoLeadsSheet = masterSpreadsheet.getSheetByName('Demo Leads');
    if (!demoLeadsSheet) {
      demoLeadsSheet = masterSpreadsheet.insertSheet('Demo Leads');
      const headersList = ['Name', 'Mobile', 'Society Name', 'Number of Flats', 'City', 'Preferred Demo Time', 'Source', 'Booked At'];
      demoLeadsSheet.appendRow(headersList);
      demoLeadsSheet.getRange(1, 1, 1, headersList.length).setFontWeight('bold');
      demoLeadsSheet.getRange(1, 1, 1, headersList.length).setBackground('#f3f4f6');
      demoLeadsSheet.setFrozenRows(1);
      demoLeadsSheet.autoResizeColumns(1, 8);
    }
    
    sheet.getRange('A1:F1').merge();
    sheet.getRange('A1').setValue('SocietySync - Master Directory');
    sheet.getRange('A1').setFontSize(16);
    sheet.getRange('A1').setFontWeight('bold');
    sheet.getRange('A1').setHorizontalAlignment('center');
    sheet.getRange('A1').setBackground('#4f46e5');
    sheet.getRange('A1').setFontColor('#ffffff');
    
    sheet.getRange('A2:F2').merge();
    sheet.getRange('A2').setValue('Generated on: ' + new Date().toLocaleString());
    sheet.getRange('A2').setFontSize(10);
    sheet.getRange('A2').setFontColor('#6b7280');
    sheet.getRange('A2').setHorizontalAlignment('center');
    
    const headers = ['Society Name', 'Sheet Backup Link', 'Total Members', 'Total Flats', 'Total Payments', 'Last Backup'];
    sheet.getRange('A4:F4').setValues([headers]);
    sheet.getRange('A4:F4').setFontWeight('bold');
    sheet.getRange('A4:F4').setBackground('#f3f4f6');
    sheet.getRange('A4:F4').setFontColor('#1f2937');
    sheet.getRange('A4:F4').setBorder(true, true, true, true, true, true);
    
    const rows = societies.map(function(s) {
      return [
        s.name,
        '=HYPERLINK("' + s.sheetUrl + '", "Open Sheet ↗")',
        s.memberCount,
        s.flatCount,
        s.paymentCount,
        s.lastSync
      ];
    });
    
    if (rows.length > 0) {
      sheet.getRange(5, 1, rows.length, 6).setValues(rows);
      sheet.getRange(5, 1, rows.length, 6).setBorder(true, true, true, true, true, true);
      sheet.getRange(5, 2, rows.length, 1).setFontColor('#2563eb').setFontLine('underline');
    }
    
    sheet.setFrozenRows(4);
    sheet.autoResizeColumns(1, 6);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      spreadsheetId: masterSpreadsheet.getId(),
      spreadsheetUrl: masterSpreadsheet.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function setupDashboard(ss, societyName) {
  const dashboard = ss.getSheetByName('Dashboard') || ss.insertSheet('Dashboard');
  
  dashboard.clear();
  
  dashboard.getRange('A1:D1').merge();
  dashboard.getRange('A1').setValue(`${societyName} - Dashboard`);
  dashboard.getRange('A1').setFontSize(18);
  dashboard.getRange('A1').setFontWeight('bold');
  dashboard.getRange('A1').setHorizontalAlignment('center');
  
  const headers = ['Metric', 'Value', 'Last Updated'];
  dashboard.getRange('A3:C3').setValues([headers]);
  dashboard.getRange('A3:C3').setFontWeight('bold');
  
  const metrics = [
    ['Total Members', '=COUNTA(Members!A:A)-1', new Date().toLocaleString()],
    ['Total Flats', '=COUNTA(Flats!A:A)-1', new Date().toLocaleString()],
    ['Total Payments', '=COUNTA(Payments!A:A)-1', new Date().toLocaleString()],
    ['Total Expenses', '=COUNTA(Expenses!A:A)-1', new Date().toLocaleString()],
    ['Total Funds', '=COUNTA(Funds!A:A)-1', new Date().toLocaleString()],
    ['Maintenance Due', '=SUM(Maintenance!D:D)-SUM(Maintenance!E:E)', new Date().toLocaleString()],
    ['Total Funds Collected', '=SUM(Funds!G:G)', new Date().toLocaleString()]
  ];
  
  metrics.forEach((row, i) => {
    dashboard.getRange(`A${i+4}:C${i+4}`).setValues([row]);
  });
  
  dashboard.setColumnWidth(1, 150);
  dashboard.setColumnWidth(2, 120);
  dashboard.setColumnWidth(3, 150);
}

function syncMembers(data) {
  try {
    const { spreadsheetId, members } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName('Members') || ss.insertSheet('Members');
    
    clearSheetData(sheet);
    
    if (members.length === 0) return ContentService.createTextOutput(JSON.stringify({ success: true, count: 0 })).setMimeType(ContentService.MimeType.JSON);
    
    const rows = members.map(m => [
      m._id || '',
      m.name || '',
      m.email || '',
      m.phone || '',
      m.role || '',
      m.status || '',
      m.flatNumber || '',
      m.residentType || '',
      m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''
    ]);
    
    sheet.getRange(2, 1, rows.length, 9).setValues(rows);
    formatSheet(sheet, 9);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, count: rows.length })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function syncFlats(data) {
  try {
    const { spreadsheetId, flats } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName('Flats') || ss.insertSheet('Flats');
    
    clearSheetData(sheet);
    
    if (flats.length === 0) return ContentService.createTextOutput(JSON.stringify({ success: true, count: 0 })).setMimeType(ContentService.MimeType.JSON);
    
    const rows = flats.map(f => [
      f._id || '',
      f.number || '',
      f.blockName || '',
      f.floor || '',
      f.type || '',
      f.area || '',
      f.ownerName || '',
      f.ownerPhone || '',
      f.ownerEmail || '',
      f.tenantName || '',
      f.tenantPhone || '',
      f.isOccupied ? 'Yes' : 'No',
      f.currentMonthStatus || ''
    ]);
    
    sheet.getRange(2, 1, rows.length, 13).setValues(rows);
    formatSheet(sheet, 13);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, count: rows.length })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function syncPayments(data) {
  try {
    const { spreadsheetId, payments } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName('Payments') || ss.insertSheet('Payments');
    
    clearSheetData(sheet);
    
    if (payments.length === 0) return ContentService.createTextOutput(JSON.stringify({ success: true, count: 0 })).setMimeType(ContentService.MimeType.JSON);
    
    const rows = payments.map(p => [
      p._id || '',
      p.flatNumber || '',
      p.month || '',
      p.year || '',
      p.amount || 0,
      p.paidAmount || 0,
      p.lateFee || 0,
      p.status || '',
      p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '',
      p.paymentMethod || '',
      p.transactionId || '',
      p.receiptNumber || '',
      p.notes || ''
    ]);
    
    sheet.getRange(2, 1, rows.length, 13).setValues(rows);
    formatSheet(sheet, 13);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, count: rows.length })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function syncMaintenance(data) {
  try {
    const { spreadsheetId, maintenance } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName('Maintenance') || ss.insertSheet('Maintenance');
    
    clearSheetData(sheet);
    
    if (maintenance.length === 0) return ContentService.createTextOutput(JSON.stringify({ success: true, count: 0 })).setMimeType(ContentService.MimeType.JSON);
    
    const rows = maintenance.map(m => [
      m._id || '',
      m.flatNumber || '',
      m.month || '',
      m.year || '',
      m.amount || 0,
      m.paidAmount || 0,
      m.dueDate ? new Date(m.dueDate).toLocaleDateString() : '',
      m.status || '',
      new Date().toLocaleString()
    ]);
    
    sheet.getRange(2, 1, rows.length, 9).setValues(rows);
    formatSheet(sheet, 9);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, count: rows.length })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function syncExpenses(data) {
  try {
    const { spreadsheetId, expenses } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName('Expenses') || ss.insertSheet('Expenses');
    
    clearSheetData(sheet);
    
    if (expenses.length === 0) return ContentService.createTextOutput(JSON.stringify({ success: true, count: 0 })).setMimeType(ContentService.MimeType.JSON);
    
    const rows = expenses.map(e => [
      e._id || '',
      e.category || '',
      e.description || '',
      e.amount || 0,
      e.date ? new Date(e.date).toLocaleDateString() : '',
      e.blockName || '',
      e.vendor || '',
      e.receipt || '',
      e.addedByName || '',
      e.createdAt ? new Date(e.createdAt).toLocaleString() : ''
    ]);
    
    sheet.getRange(2, 1, rows.length, 10).setValues(rows);
    formatSheet(sheet, 10);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, count: rows.length })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function syncFunds(data) {
  try {
    const { spreadsheetId, funds } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName('Funds') || ss.insertSheet('Funds');
    
    clearSheetData(sheet);
    
    if (funds.length === 0) return ContentService.createTextOutput(JSON.stringify({ success: true, count: 0 })).setMimeType(ContentService.MimeType.JSON);
    
    const rows = funds.map(f => [
      f._id || '',
      f.name || '',
      f.category || '',
      f.description || '',
      f.amountPerFlat || 0,
      f.totalTarget || 0,
      f.totalCollected || 0,
      f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '',
      f.applicableTo || '',
      f.status || '',
      f.createdAt ? new Date(f.createdAt).toLocaleString() : ''
    ]);
    
    sheet.getRange(2, 1, rows.length, 11).setValues(rows);
    formatSheet(sheet, 11);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, count: rows.length })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function addRow(data) {
  try {
    const { spreadsheetId, sheetName, rowData } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, row: lastRow + 1 })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function updateRow(data) {
  try {
    const { spreadsheetId, sheetName, rowNumber, rowData } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' })).setMimeType(ContentService.MimeType.JSON);
    }
    
    sheet.getRange(rowNumber, 1, 1, rowData.length).setValues([rowData]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function deleteRow(data) {
  try {
    const { spreadsheetId, sheetName, rowNumber } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' })).setMimeType(ContentService.MimeType.JSON);
    }
    
    sheet.deleteRow(rowNumber);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetInfo(data) {
  try {
    const { spreadsheetId } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    
    const info = {
      name: ss.getName(),
      sheets: ss.getSheets().map(s => s.getName()),
      lastModified: ss.getLastUpdated()
    };
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, info })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function exportToPDF(data) {
  try {
    const { spreadsheetId, sheetName } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const blob = ss.getAs('application/pdf').setName(`${sheetName}_${new Date().toISOString().split('T')[0]}.pdf`);
    const folder = DriveApp.getFoldersByName(FOLDER_NAME).next();
    const file = folder.createFile(blob);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, url: file.getUrl() })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function exportToExcel(data) {
  try {
    const { spreadsheetId } = data;
    const ss = SpreadsheetApp.openById(spreadsheetId);
    
    const blob = ss.getAs('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').setName(`${ss.getName()}_${new Date().toISOString().split('T')[0]}.xlsx`);
    const folder = DriveApp.getFoldersByName(FOLDER_NAME).next();
    const file = folder.createFile(blob);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, url: file.getUrl() })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function clearSheetData(sheet) {
  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }
}

function formatSheet(sheet, numColumns) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, numColumns).setBorder(true, true, true, true, true, true);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, numColumns);
  }
}

function doGet() {
  return ContentService.createTextOutput('SocietySync Google Sheets Backup System is running').setMimeType(ContentService.MimeType.TEXT);
}

function addDemoLead(data) {
  try {
    let folder;
    const folders = DriveApp.getFoldersByName(FOLDER_NAME);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(FOLDER_NAME);
    }
      
    let masterSpreadsheet;
    const files = folder.getFilesByName('SocietySync - Master Directory');
    if (files.hasNext()) {
      masterSpreadsheet = SpreadsheetApp.openById(files.next().getId());
    } else {
      masterSpreadsheet = SpreadsheetApp.create('SocietySync - Master Directory');
      let file = DriveApp.getFileById(masterSpreadsheet.getId());
      folder.addFile(file);
    }
    
    let sheet = masterSpreadsheet.getSheetByName('Demo Leads');
    if (!sheet) {
      sheet = masterSpreadsheet.insertSheet('Demo Leads');
      const headers = ['Name', 'Mobile', 'Society Name', 'Number of Flats', 'City', 'Preferred Demo Time', 'Source', 'Booked At'];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#f3f4f6');
      sheet.setFrozenRows(1);
    }
    
    sheet.appendRow([
      data.name || '',
      data.mobile || '',
      data.societyName || '',
      data.numberOfFlats || 0,
      data.city || '',
      data.preferredDemoTime || '',
      data.source || '',
      data.bookedAt || new Date().toLocaleString()
    ]);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 8);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Lead added successfully to Google Sheet!' })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}