const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const googleSheetsService = require('../services/googleSheetsService');

router.post('/create-sheet', auth, adminOnly, async (req, res) => {
  try {
    const societyId = req.user.societyId?._id || req.user.societyId;
    
    if (!societyId) {
      return res.status(400).json({ message: 'Society not found for user' });
    }

    const result = await googleSheetsService.createSheetForSociety(societyId);

    if (result.success) {
      await require('../models/Society').findByIdAndUpdate(societyId, {
        sheetEnabled: true,
        lastSyncedAt: new Date()
      });
    }

    res.json(result);
  } catch (error) {
    console.error('[GoogleSheets] create-sheet error:', error);
    res.status(500).json({ message: 'Failed to create sheet', error: error.message });
  }
});

router.post('/sync', auth, adminOnly, async (req, res) => {
  try {
    const societyId = req.user.societyId?._id || req.user.societyId;
    
    if (!societyId) {
      return res.status(400).json({ message: 'Society not found for user' });
    }

    const result = await googleSheetsService.syncAllData(societyId);

    await require('../models/Society').findByIdAndUpdate(societyId, {
      lastSyncedAt: new Date()
    });

    res.json({ success: true, message: 'All data synced successfully' });
  } catch (error) {
    console.error('[GoogleSheets] sync error:', error);
    res.status(500).json({ message: 'Sync failed', error: error.message });
  }
});

router.get('/status', auth, async (req, res) => {
  try {
    const societyId = req.user.societyId?._id || req.user.societyId;
    
    if (!societyId) {
      return res.status(400).json({ message: 'Society not found for user' });
    }

    const Society = require('../models/Society');
    const society = await Society.findById(societyId);

    res.json({
      sheetEnabled: society.sheetEnabled || false,
      googleSheetId: society.googleSheetId || '',
      googleSheetUrl: society.googleSheetUrl || '',
      googleFolderUrl: society.googleFolderUrl || '',
      sheetCreatedAt: society.sheetCreatedAt || null,
      lastSyncedAt: society.lastSyncedAt || null
    });
  } catch (error) {
    console.error('[GoogleSheets] status error:', error);
    res.status(500).json({ message: 'Failed to get status', error: error.message });
  }
});

router.get('/info', auth, adminOnly, async (req, res) => {
  try {
    const societyId = req.user.societyId?._id || req.user.societyId;
    
    if (!societyId) {
      return res.status(400).json({ message: 'Society not found for user' });
    }

    const result = await googleSheetsService.getSheetInfo(societyId);
    res.json(result);
  } catch (error) {
    console.error('[GoogleSheets] info error:', error);
    res.status(500).json({ message: 'Failed to get sheet info', error: error.message });
  }
});

router.post('/export/pdf', auth, adminOnly, async (req, res) => {
  try {
    const { sheetName } = req.body;
    const societyId = req.user.societyId?._id || req.user.societyId;

    if (!sheetName) {
      return res.status(400).json({ message: 'Sheet name is required' });
    }

    const result = await googleSheetsService.exportToPDF(societyId, sheetName);
    res.json(result);
  } catch (error) {
    console.error('[GoogleSheets] export pdf error:', error);
    res.status(500).json({ message: 'Failed to export PDF', error: error.message });
  }
});

router.post('/export/excel', auth, adminOnly, async (req, res) => {
  try {
    const societyId = req.user.societyId?._id || req.user.societyId;

    const result = await googleSheetsService.exportToExcel(societyId);
    res.json(result);
  } catch (error) {
    console.error('[GoogleSheets] export excel error:', error);
    res.status(500).json({ message: 'Failed to export Excel', error: error.message });
  }
});

router.get('/report/:month/:year', auth, adminOnly, async (req, res) => {
  try {
    const { month, year } = req.params;
    const societyId = req.user.societyId?._id || req.user.societyId;

    const report = await googleSheetsService.generateMonthlyReport(
      societyId, 
      parseInt(month), 
      parseInt(year)
    );

    res.json(report);
  } catch (error) {
    console.error('[GoogleSheets] report error:', error);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
});

router.post('/enable-existing', auth, adminOnly, async (req, res) => {
  try {
    const Society = require('../models/Society');
    const societiesWithoutSheet = await Society.find({
      $or: [
        { googleSheetId: { $exists: false } },
        { googleSheetId: '' },
        { sheetEnabled: false }
      ]
    });

    const results = [];
    for (const society of societiesWithoutSheet) {
      try {
        const result = await googleSheetsService.createSheetForSociety(society._id);
        results.push({
          societyId: society._id,
          societyName: society.name,
          success: result.success,
          error: result.error || null
        });
      } catch (err) {
        results.push({
          societyId: society._id,
          societyName: society.name,
          success: false,
          error: err.message
        });
      }
    }

    res.json({
      total: societiesWithoutSheet.length,
      results
    });
  } catch (error) {
    console.error('[GoogleSheets] enable-existing error:', error);
    res.status(500).json({ message: 'Failed to enable sheets', error: error.message });
  }
});

module.exports = router;