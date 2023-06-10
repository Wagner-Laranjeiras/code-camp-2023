import { knex, Knex } from 'knex';
import { LeistungsPaket, InvoiceEntry, Invoice } from '@pct/kk-easy-pay-common';
import pg from 'pg';

if (pg.types == null) {
  console.log(
    'The import of pg is only a hint for the bundler so it knows we need pg'
  );
}

export async function initKnex() {
  const host = '127.0.0.1';
  const user = 'dev';
  const database = 'dev';
  const password = 'dev';
  const port = 6543;

  const knexConfig = {
    client: 'pg',
    connection: {
      host,
      user,
      database,
      password,
      port,
    },
  };

  const result = knex(knexConfig);

  const testQueryResult = await result.raw('SELECT 1');
  if (testQueryResult.rowCount !== 1 || testQueryResult.rows.length !== 1) {
    throw new Error('Test query on database failed, is your postgres up?');
  } else {
    console.log(
      `knex pool setup completed for postgresql://${
        knexConfig.connection.user
      }@${knexConfig.connection.host}:${knexConfig.connection.port ?? '5432'}/${
        knexConfig.connection.database
      }  !`
    );
  }

  return result;
}

export const APP_TABLES = {
  LEISTUNGS_PAKET: 'leistungs_paket',
  INVOICE_ENTRY: 'invoice_entry',
  INVOICE: 'invoice',
};

interface InvoiceRow {
  id: number;
  first_name: string;
  last_name: string;
  insurance_number: string;
  birthday: string;
  month: number;
  year: number;
}

interface InvoiceEntryRow {
  invoice_id: number;
  leistungspaket_nr: number;
  amount: number;
}

export class AppDbService {
  constructor(private trx: Knex.Transaction) {}

  async loadPakete() {
    const rows = await this.trx<LeistungsPaket>(APP_TABLES.LEISTUNGS_PAKET);
    return rows;
  }

  async loadInvoice() {
    const entryRows = await this.trx<InvoiceEntryRow>(APP_TABLES.INVOICE_ENTRY);
    const invoiceRows = await this.trx<InvoiceRow>(APP_TABLES.INVOICE);
    const leistungsPaketRows = await this.trx<LeistungsPaket>(
      APP_TABLES.LEISTUNGS_PAKET
    );
    const invoices: Invoice[] = invoiceRows.map((invoiceRow) => ({
      firstName: invoiceRow.first_name,
      lastName: invoiceRow.last_name,
      birthday: invoiceRow.birthday,
      id: invoiceRow.id,
      insuranceNumber: invoiceRow.insurance_number,
      month: invoiceRow.month,
      year: invoiceRow.year,
      entries: entryRows
        .filter((entryRow) => entryRow.invoice_id === invoiceRow.id)
        .map(
          (entryRow): InvoiceEntry => ({
            amount: entryRow.amount,
            id: entryRow.invoice_id,
            paket: leistungsPaketRows.find(
              (leistungsPaketRow) =>
                leistungsPaketRow.nr === entryRow.leistungspaket_nr
            ),
          })
        ),
    }));

    return invoices;
  }

  async createInvoice(invoice: Invoice) {
    return { method: 'POST', body: JSON.stringify({}) };
  }
}
