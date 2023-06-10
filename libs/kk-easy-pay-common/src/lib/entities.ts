export interface LeistungsPaket {
  nr: number;
  description: string;
  /**
   * In cents
   */
  price: number;
}

export interface InvoiceEntry {
  id: number;
  paket: LeistungsPaket;
  amount: number;
}

export interface Invoice {
  id: number;
  firstName: string;
  lastName: string;
  insuranceNumber: string;
  birthday: string;
  month: number;
  year: number;
  entries: InvoiceEntry[];
}
