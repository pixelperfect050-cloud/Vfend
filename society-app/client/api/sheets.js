import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Create Supabase client that respects request authorization
function getSupabaseClient(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxycpBqrh3loOZiw3nc9G204WTdlIe2pPfQlXrRHeJPgvvyvhvw42LO5Sw7PijZHvVB_A/exec';

async function callGoogleScript(action, data) {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data })
    });
    if (!res.ok) throw new Error(`Google Apps Script returned status ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`[GoogleSheets] Webhook error in ${action}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Helpers for syncing data
async function syncMembers(client, spreadsheetId, societyId) {
  const { data: members } = await client.from('profiles')
    .select('*, flat:flats(number)')
    .eq('society_id', societyId);
  const formattedMembers = (members || []).map(m => ({
    _id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    role: m.role,
    status: m.status,
    flatNumber: m.flat?.number || '',
    residentType: m.resident_type || '',
    createdAt: m.created_at
  }));
  return await callGoogleScript('syncMembers', { spreadsheetId, members: formattedMembers });
}

async function syncFlats(client, spreadsheetId, societyId) {
  const { data: flats } = await client.from('flats')
    .select('*, block:blocks(name)')
    .eq('society_id', societyId);
  const formattedFlats = (flats || []).map(f => ({
    _id: f.id,
    number: f.number,
    blockName: f.block?.name || '',
    floor: f.floor,
    type: f.type,
    area: f.area,
    ownerName: f.owner_name,
    ownerPhone: f.owner_phone,
    ownerEmail: f.owner_email,
    tenantName: f.tenant_name,
    tenantPhone: f.tenant_phone,
    isOccupied: f.is_occupied,
    currentMonthStatus: f.current_month_status
  }));
  return await callGoogleScript('syncFlats', { spreadsheetId, flats: formattedFlats });
}

async function syncPayments(client, spreadsheetId, societyId) {
  const { data: payments } = await client.from('payments')
    .select('*, flat:flats(number)')
    .eq('society_id', societyId)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(500);
  const formattedPayments = (payments || []).map(p => ({
    _id: p.id,
    flatNumber: p.flat?.number || '',
    month: p.month,
    year: p.year,
    amount: p.amount,
    paidAmount: p.paid_amount,
    lateFee: p.late_fee,
    status: p.status,
    paidDate: p.paid_date,
    paymentMethod: p.payment_method,
    transactionId: p.transaction_id,
    receiptNumber: p.receipt_number,
    notes: p.notes
  }));
  return await callGoogleScript('syncPayments', { spreadsheetId, payments: formattedPayments });
}

async function syncMaintenance(client, spreadsheetId, societyId) {
  const { data: payments } = await client.from('payments')
    .select('*, flat:flats(number)')
    .eq('society_id', societyId)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(500);
  const formattedMaintenance = (payments || []).map(p => ({
    _id: p.id,
    flatNumber: p.flat?.number || '',
    month: p.month,
    year: p.year,
    amount: p.amount,
    paidAmount: p.paid_amount,
    dueDate: p.due_date,
    status: p.status
  }));
  return await callGoogleScript('syncMaintenance', { spreadsheetId, maintenance: formattedMaintenance });
}

async function syncExpenses(client, spreadsheetId, societyId) {
  const { data: expenses } = await client.from('expenses')
    .select('*, block:blocks(name), profile:profiles!added_by(name)')
    .eq('society_id', societyId)
    .order('date', { ascending: false })
    .limit(500);
  const formattedExpenses = (expenses || []).map(e => ({
    _id: e.id,
    category: e.category,
    description: e.description,
    amount: e.amount,
    date: e.date,
    blockName: e.block?.name || '',
    vendor: e.vendor,
    receipt: e.receipt || '',
    addedByName: e.profile?.name || '',
    createdAt: e.created_at
  }));
  return await callGoogleScript('syncExpenses', { spreadsheetId, expenses: formattedExpenses });
}

async function syncFunds(client, spreadsheetId, societyId) {
  const { data: funds } = await client.from('funds')
    .select('*, profile:profiles!created_by(name)')
    .eq('society_id', societyId)
    .order('created_at', { ascending: false })
    .limit(200);
  const formattedFunds = (funds || []).map(f => ({
    _id: f.id,
    name: f.name,
    category: f.category,
    description: f.description,
    amountPerFlat: f.amount_per_flat,
    totalTarget: f.total_target,
    totalCollected: f.total_collected,
    dueDate: f.due_date,
    applicableTo: f.applicable_to,
    status: f.status,
    createdAt: f.created_at
  }));
  return await callGoogleScript('syncFunds', { spreadsheetId, funds: formattedFunds });
}

async function syncAllData(client, societyId, spreadsheetId) {
  await Promise.all([
    syncMembers(client, spreadsheetId, societyId),
    syncFlats(client, spreadsheetId, societyId),
    syncPayments(client, spreadsheetId, societyId),
    syncExpenses(client, spreadsheetId, societyId),
    syncFunds(client, spreadsheetId, societyId),
    syncMaintenance(client, spreadsheetId, societyId)
  ]);
}

export default async function handler(req, res) {
  const { method, query } = req;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const client = getSupabaseClient(req);

  try {
    const { data: { user }, error: userErr } = token 
      ? await client.auth.getUser(token) 
      : await client.auth.getUser();
    if (userErr || !user) {
      console.error('GoogleSheets Auth Error:', userErr);
      return res.status(401).json({ error: 'Unauthorized', details: userErr?.message });
    }

    const { data: profile } = await client.from('profiles').select('role, society_id').eq('id', user.id).single();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    const societyId = profile.society_id;

    // Route logic
    const path = query.path || '';

    if (method === 'GET' && path === 'status') {
      const { data: society, error } = await client.from('societies').select('*').eq('id', societyId).single();
      if (error || !society) {
        return res.status(404).json({ error: 'Society not found' });
      }
      return res.status(200).json({
        sheetEnabled: society.sheet_enabled || false,
        googleSheetId: society.google_sheet_id || '',
        googleSheetUrl: society.google_sheet_url || '',
        googleFolderUrl: society.google_folder_url || '',
        sheetCreatedAt: society.sheet_created_at || null,
        lastSyncedAt: society.last_synced_at || null
      });
    }

    // Admin permissions check for all write/admin actions
    if (profile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permissions required' });
    }

    if (method === 'POST' && path === 'create-sheet') {
      const { data: society } = await client.from('societies').select('name').eq('id', societyId).single();
      const result = await callGoogleScript('createSheet', {
        societyId: societyId,
        societyName: society.name
      });

      if (result.success) {
        await client.from('societies').update({
          google_sheet_id: result.spreadsheetId,
          google_sheet_url: result.spreadsheetUrl,
          google_folder_url: result.folderUrl,
          sheet_created_at: new Date().toISOString(),
          sheet_enabled: true,
          last_synced_at: new Date().toISOString()
        }).eq('id', societyId);

        await syncAllData(client, societyId, result.spreadsheetId);
      }
      return res.status(200).json(result);
    }

    if (method === 'POST' && path === 'sync') {
      const { data: society } = await client.from('societies').select('google_sheet_id').eq('id', societyId).single();
      if (!society || !society.google_sheet_id) {
        return res.status(400).json({ error: 'Google Sheet not initialized' });
      }

      await syncAllData(client, societyId, society.google_sheet_id);
      await client.from('societies').update({
        last_synced_at: new Date().toISOString()
      }).eq('id', societyId);

      return res.status(200).json({ success: true, message: 'All data synced successfully' });
    }

    if (method === 'GET' && path === 'info') {
      const { data: society } = await client.from('societies').select('google_sheet_id').eq('id', societyId).single();
      if (!society || !society.google_sheet_id) {
        return res.status(400).json({ error: 'Google Sheet not initialized' });
      }
      const result = await callGoogleScript('getSheetInfo', { spreadsheetId: society.google_sheet_id });
      return res.status(200).json(result);
    }

    if (method === 'POST' && path === 'export/excel') {
      const { data: society } = await client.from('societies').select('google_sheet_id').eq('id', societyId).single();
      if (!society || !society.google_sheet_id) {
        return res.status(400).json({ error: 'Google Sheet not initialized' });
      }
      const result = await callGoogleScript('exportExcel', { spreadsheetId: society.google_sheet_id });
      return res.status(200).json(result);
    }

    if (method === 'POST' && path === 'export/pdf') {
      const { sheetName } = req.body;
      if (!sheetName) return res.status(400).json({ error: 'Sheet name is required' });

      const { data: society } = await client.from('societies').select('google_sheet_id').eq('id', societyId).single();
      if (!society || !society.google_sheet_id) {
        return res.status(400).json({ error: 'Google Sheet not initialized' });
      }
      const result = await callGoogleScript('exportPDF', { spreadsheetId: society.google_sheet_id, sheetName });
      return res.status(200).json(result);
    }

    if (method === 'GET' && path.startsWith('report/')) {
      // e.g. report/5/2026
      const parts = path.split('/');
      const month = parseInt(parts[1]);
      const year = parseInt(parts[2]);

      // Calculate monthly metrics
      const { data: payments } = await client.from('payments')
        .select('amount, paid_amount')
        .eq('society_id', societyId)
        .eq('month', month)
        .eq('year', year);

      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      const { data: expenses } = await client.from('expenses')
        .select('amount')
        .eq('society_id', societyId)
        .gte('date', startDate)
        .lte('date', endDate);

      const { data: funds } = await client.from('funds')
        .select('total_collected')
        .eq('society_id', societyId)
        .eq('status', 'active');

      const { count: memberCount } = await client.from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('society_id', societyId)
        .eq('status', 'approved');

      const { count: flatCount } = await client.from('flats')
        .select('*', { count: 'exact', head: true })
        .eq('society_id', societyId);

      const totalMaintenanceBilled = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
      const totalMaintenanceCollected = (payments || []).reduce((sum, p) => sum + (p.paid_amount || 0), 0);
      const totalExpenses = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);
      const totalFundsCollected = (funds || []).reduce((sum, f) => sum + (f.total_collected || 0), 0);

      return res.status(200).json({
        month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        year,
        totalMaintenanceBilled,
        totalMaintenanceCollected,
        outstanding: totalMaintenanceBilled - totalMaintenanceCollected,
        totalExpenses,
        totalFundsCollected,
        netBalance: totalMaintenanceCollected - totalExpenses,
        memberCount: memberCount || 0,
        flatCount: flatCount || 0
      });
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  } catch (error) {
    console.error('[sheets API error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
