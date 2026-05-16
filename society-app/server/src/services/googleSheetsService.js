const axios = require('axios');
const Society = require('../models/Society');
const User = require('../models/User');
const Flat = require('../models/Flat');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Fund = require('../models/Fund');
const FundPayment = require('../models/FundPayment');
const Block = require('../models/Block');

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK;

class GoogleSheetsService {
  constructor() {
    this.axios = axios;
  }

  async callGoogleScript(action, data) {
    try {
      const response = await this.axios.post(WEBHOOK_URL, { action, ...data }, {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error(`[GoogleSheets] Error in ${action}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async createSheetForSociety(societyId) {
    try {
      const society = await Society.findById(societyId);
      if (!society) {
        throw new Error('Society not found');
      }

      const result = await this.callGoogleScript('createSheet', {
        societyId: societyId.toString(),
        societyName: society.name
      });

      if (result.success) {
        await Society.findByIdAndUpdate(societyId, {
          googleSheetId: result.spreadsheetId,
          googleSheetUrl: result.spreadsheetUrl,
          googleFolderUrl: result.folderUrl,
          sheetCreatedAt: new Date()
        });

        await this.syncAllData(societyId);
        
        console.log(`[GoogleSheets] Sheet created for society: ${society.name}`);
        return result;
      }

      throw new Error(result.error || 'Failed to create sheet');
    } catch (error) {
      console.error('[GoogleSheets] createSheetForSociety error:', error.message);
      throw error;
    }
  }

  async syncAllData(societyId) {
    try {
      const society = await Society.findById(societyId);
      if (!society || !society.googleSheetId) {
        throw new Error('Society or Google Sheet not found');
      }

      const spreadsheetId = society.googleSheetId;

      await Promise.all([
        this.syncMembers(spreadsheetId, societyId),
        this.syncFlats(spreadsheetId, societyId),
        this.syncPayments(spreadsheetId, societyId),
        this.syncExpenses(spreadsheetId, societyId),
        this.syncFunds(spreadsheetId, societyId),
        this.syncMaintenance(spreadsheetId, societyId)
      ]);

      console.log(`[GoogleSheets] All data synced for society: ${societyId}`);
      return { success: true };
    } catch (error) {
      console.error('[GoogleSheets] syncAllData error:', error.message);
      throw error;
    }
  }

  async syncMembers(spreadsheetId, societyId) {
    try {
      const members = await User.find({ societyId })
        .select('name email phone role status createdAt')
        .populate({
          path: 'flatId',
          select: 'number',
          populate: { path: 'blockId', select: 'name' }
        });

      const formattedMembers = members.map(m => ({
        _id: m._id.toString(),
        name: m.name,
        email: m.email,
        phone: m.phone,
        role: m.role,
        status: m.status,
        flatNumber: m.flatId?.number || '',
        residentType: m.residentType || '',
        createdAt: m.createdAt
      }));

      return await this.callGoogleScript('syncMembers', {
        spreadsheetId,
        members: formattedMembers
      });
    } catch (error) {
      console.error('[GoogleSheets] syncMembers error:', error.message);
    }
  }

  async syncFlats(spreadsheetId, societyId) {
    try {
      const flats = await Flat.find({ societyId })
        .populate('blockId', 'name');

      const formattedFlats = flats.map(f => ({
        _id: f._id.toString(),
        number: f.number,
        blockName: f.blockId?.name || '',
        floor: f.floor,
        type: f.type,
        area: f.area,
        ownerName: f.ownerName,
        ownerPhone: f.ownerPhone,
        ownerEmail: f.ownerEmail,
        tenantName: f.tenantName,
        tenantPhone: f.tenantPhone,
        isOccupied: f.isOccupied,
        currentMonthStatus: f.currentMonthStatus
      }));

      return await this.callGoogleScript('syncFlats', {
        spreadsheetId,
        flats: formattedFlats
      });
    } catch (error) {
      console.error('[GoogleSheets] syncFlats error:', error.message);
    }
  }

  async syncPayments(spreadsheetId, societyId) {
    try {
      const payments = await Payment.find({ societyId })
        .populate({
          path: 'flatId',
          select: 'number',
          populate: { path: 'blockId', select: 'name' }
        })
        .sort({ year: -1, month: -1 })
        .limit(500);

      const formattedPayments = payments.map(p => ({
        _id: p._id.toString(),
        flatNumber: p.flatId?.number || '',
        month: p.month,
        year: p.year,
        amount: p.amount,
        paidAmount: p.paidAmount,
        lateFee: p.lateFee,
        status: p.status,
        paidDate: p.paidDate,
        paymentMethod: p.paymentMethod,
        transactionId: p.transactionId,
        receiptNumber: p.receiptNumber,
        notes: p.notes
      }));

      return await this.callGoogleScript('syncPayments', {
        spreadsheetId,
        payments: formattedPayments
      });
    } catch (error) {
      console.error('[GoogleSheets] syncPayments error:', error.message);
    }
  }

  async syncMaintenance(spreadsheetId, societyId) {
    try {
      const payments = await Payment.find({ societyId })
        .populate('flatId', 'number')
        .sort({ year: -1, month: -1 })
        .limit(500);

      const formattedMaintenance = payments.map(p => ({
        _id: p._id.toString(),
        flatNumber: p.flatId?.number || '',
        month: p.month,
        year: p.year,
        amount: p.amount,
        paidAmount: p.paidAmount,
        dueDate: p.dueDate,
        status: p.status
      }));

      return await this.callGoogleScript('syncMaintenance', {
        spreadsheetId,
        maintenance: formattedMaintenance
      });
    } catch (error) {
      console.error('[GoogleSheets] syncMaintenance error:', error.message);
    }
  }

  async syncExpenses(spreadsheetId, societyId) {
    try {
      const expenses = await Expense.find({ societyId })
        .populate('blockId', 'name')
        .populate('addedBy', 'name')
        .sort({ date: -1 })
        .limit(500);

      const formattedExpenses = expenses.map(e => ({
        _id: e._id.toString(),
        category: e.category,
        description: e.description,
        amount: e.amount,
        date: e.date,
        blockName: e.blockId?.name || '',
        vendor: e.vendor,
        receipt: e.receipt,
        addedByName: e.addedBy?.name || '',
        createdAt: e.createdAt
      }));

      return await this.callGoogleScript('syncExpenses', {
        spreadsheetId,
        expenses: formattedExpenses
      });
    } catch (error) {
      console.error('[GoogleSheets] syncExpenses error:', error.message);
    }
  }

  async syncFunds(spreadsheetId, societyId) {
    try {
      const funds = await Fund.find({ societyId })
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .limit(200);

      const formattedFunds = funds.map(f => ({
        _id: f._id.toString(),
        name: f.name,
        category: f.category,
        description: f.description,
        amountPerFlat: f.amountPerFlat,
        totalTarget: f.totalTarget,
        totalCollected: f.totalCollected,
        dueDate: f.dueDate,
        applicableTo: f.applicableTo,
        status: f.status,
        createdAt: f.createdAt
      }));

      return await this.callGoogleScript('syncFunds', {
        spreadsheetId,
        funds: formattedFunds
      });
    } catch (error) {
      console.error('[GoogleSheets] syncFunds error:', error.message);
    }
  }

  async addSingleRow(spreadsheetId, sheetName, rowData) {
    return await this.callGoogleScript('addRow', {
      spreadsheetId,
      sheetName,
      rowData
    });
  }

  async updateSingleRow(spreadsheetId, sheetName, rowNumber, rowData) {
    return await this.callGoogleScript('updateRow', {
      spreadsheetId,
      sheetName,
      rowNumber,
      rowData
    });
  }

  async deleteSingleRow(spreadsheetId, sheetName, rowNumber) {
    return await this.callGoogleScript('deleteRow', {
      spreadsheetId,
      sheetName,
      rowNumber
    });
  }

  async getSheetInfo(societyId) {
    try {
      const society = await Society.findById(societyId);
      if (!society || !society.googleSheetId) {
        return { success: false, error: 'Sheet not found' };
      }

      return await this.callGoogleScript('getSheetInfo', {
        spreadsheetId: society.googleSheetId
      });
    } catch (error) {
      console.error('[GoogleSheets] getSheetInfo error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async exportToPDF(societyId, sheetName) {
    try {
      const society = await Society.findById(societyId);
      if (!society || !society.googleSheetId) {
        throw new Error('Sheet not found');
      }

      return await this.callGoogleScript('exportPDF', {
        spreadsheetId: society.googleSheetId,
        sheetName
      });
    } catch (error) {
      console.error('[GoogleSheets] exportToPDF error:', error.message);
      throw error;
    }
  }

  async exportToExcel(societyId) {
    try {
      const society = await Society.findById(societyId);
      if (!society || !society.googleSheetId) {
        throw new Error('Sheet not found');
      }

      return await this.callGoogleScript('exportExcel', {
        spreadsheetId: society.googleSheetId
      });
    } catch (error) {
      console.error('[GoogleSheets] exportToExcel error:', error.message);
      throw error;
    }
  }

  async syncOnEvent(societyId, eventType, data) {
    try {
      const society = await Society.findById(societyId);
      if (!society || !society.googleSheetId) {
        return;
      }

      const spreadsheetId = society.googleSheetId;

      switch (eventType) {
        case 'member_added':
        case 'member_updated':
          await this.syncMembers(spreadsheetId, societyId);
          break;
        case 'flat_added':
        case 'flat_updated':
          await this.syncFlats(spreadsheetId, societyId);
          break;
        case 'payment_recorded':
        case 'payment_updated':
          await this.syncPayments(spreadsheetId, societyId);
          await this.syncMaintenance(spreadsheetId, societyId);
          break;
        case 'expense_added':
        case 'expense_updated':
        case 'expense_deleted':
          await this.syncExpenses(spreadsheetId, societyId);
          break;
        case 'fund_created':
        case 'fund_updated':
        case 'fund_payment_approved':
          await this.syncFunds(spreadsheetId, societyId);
          break;
        default:
          await this.syncAllData(societyId);
      }

      console.log(`[GoogleSheets] Synced ${eventType} for society ${societyId}`);
    } catch (error) {
      console.error('[GoogleSheets] syncOnEvent error:', error.message);
    }
  }

  async generateMonthlyReport(societyId, month, year) {
    try {
      const society = await Society.findById(societyId);
      if (!society || !society.googleSheetId) {
        throw new Error('Sheet not found');
      }

      const payments = await Payment.find({ societyId, month, year });
      const expenses = await Expense.find({ 
        societyId, 
        date: { 
          $gte: new Date(year, month - 1, 1), 
          $lte: new Date(year, month, 0) 
        } 
      });
      const funds = await Fund.find({ societyId, status: 'active' });

      const totalMaintenanceBilled = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const totalMaintenanceCollected = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      const totalFundsCollected = funds.reduce((sum, f) => sum + (f.totalCollected || 0), 0);

      return {
        month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        year,
        totalMaintenanceBilled,
        totalMaintenanceCollected,
        outstanding: totalMaintenanceBilled - totalMaintenanceCollected,
        totalExpenses,
        totalFundsCollected,
        netBalance: totalMaintenanceCollected - totalExpenses,
        memberCount: await User.countDocuments({ societyId, status: 'approved' }),
        flatCount: await Flat.countDocuments({ societyId })
      };
    } catch (error) {
      console.error('[GoogleSheets] generateMonthlyReport error:', error.message);
      throw error;
    }
  }
}

const googleSheetsService = new GoogleSheetsService();

module.exports = googleSheetsService;