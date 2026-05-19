const { Client } = require('pg');

const client = new Client({
  host: 'db.sasldvwxuegvuwlwolmu.supabase.co',
  user: 'postgres',
  password: 'SocietySync@2026#Admin',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixForeignKeys() {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase via PG client');

    const sql = `
      -- Fix payment_requests foreign keys if they do not exist
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_payment_requests_submitted_by') THEN
          ALTER TABLE payment_requests ADD CONSTRAINT fk_payment_requests_submitted_by FOREIGN KEY (submitted_by) REFERENCES profiles(id);
          RAISE NOTICE 'Added fk_payment_requests_submitted_by';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_payment_requests_reviewed_by') THEN
          ALTER TABLE payment_requests ADD CONSTRAINT fk_payment_requests_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES profiles(id);
          RAISE NOTICE 'Added fk_payment_requests_reviewed_by';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_payments_recorded_by') THEN
          ALTER TABLE payments ADD CONSTRAINT fk_payments_recorded_by FOREIGN KEY (recorded_by) REFERENCES profiles(id);
          RAISE NOTICE 'Added fk_payments_recorded_by';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_fund_payments_submitted_by') THEN
          ALTER TABLE fund_payments ADD CONSTRAINT fk_fund_payments_submitted_by FOREIGN KEY (submitted_by) REFERENCES profiles(id);
          RAISE NOTICE 'Added fk_fund_payments_submitted_by';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_fund_payments_recorded_by') THEN
          ALTER TABLE fund_payments ADD CONSTRAINT fk_fund_payments_recorded_by FOREIGN KEY (recorded_by) REFERENCES profiles(id);
          RAISE NOTICE 'Added fk_fund_payments_recorded_by';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_fund_payments_reviewed_by') THEN
          ALTER TABLE fund_payments ADD CONSTRAINT fk_fund_payments_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES profiles(id);
          RAISE NOTICE 'Added fk_fund_payments_reviewed_by';
        END IF;
      END
      $$;

      -- Reload PostgREST schema cache
      NOTIFY pgrst, 'reload schema';
    `;

    await client.query(sql);
    console.log('✅ SQL Script executed successfully. Foreign keys fixed & PostgREST cache reloaded!');
    await client.end();
    process.exit(0);
  } catch (e) {
    console.error('❌ Error executing fix:', e.message);
    await client.end();
    process.exit(1);
  }
}

fixForeignKeys();
