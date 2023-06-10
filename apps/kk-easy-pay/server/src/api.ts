import { Knex } from 'knex';
import { AppDbService } from './db';
import * as express from 'express';
import { Invoice } from '@pct/kk-easy-pay-common';

export class ApiHandlers {
  constructor(private knex: Knex) {}

  async handleListPakete(_req: express.Request, res: express.Response) {
    const pakete = await this.knex.transaction(async (trx) => {
      return new AppDbService(trx).loadPakete();
    });

    res.json(pakete);
  }

  async handleListInvoices(_req: express.Request, res: express.Response) {
    const entries = await this.knex.transaction(async (trx) => {
      return new AppDbService(trx).loadInvoices();
    });

    res.json(entries);
  }

  async handleCreateInvoice(_req: express.Request, res: express.Response) {
    const invoice: Invoice = _req.body;
    const invoices = await this.knex.transaction(async (trx) => {
      return new AppDbService(trx).createInvoice(invoice);
    });
    res.json(invoices);
  }

  // This call must only have public functions that have exactly the two req and res parameters!
  // private helper functions are allowed!
}
