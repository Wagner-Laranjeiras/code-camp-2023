import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeistungsPaket } from '@pct/kk-easy-pay-common';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor(private http: HttpClient) {}

  async listPakete() {
    return await firstValueFrom(
      this.http.get<LeistungsPaket[]>('/api/listpakete')
    );
  }
  async listInvoices() {
    return await firstValueFrom(
      this.http.get<LeistungsPaket[]>('/api/createinvoice')
    );
  }

  // await fetch ("/api/createinvoice", {method:"POST", body:JSON.stringify({hallo:42}), headers:{ "Content-Type": "application/json"}})
}
