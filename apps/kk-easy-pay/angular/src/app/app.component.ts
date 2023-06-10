import { Component, OnInit } from '@angular/core';
import { EntryService } from './entry.service';

@Component({
  selector: 'pct-root',
  templateUrl: './app.component.html',
  styles: [''],
})
export class AppComponent implements OnInit {
  title = 'kk-easy-pay-angular';

  constructor(private entry: EntryService) {}

  async ngOnInit() {
    const pakete = await this.entry.listPakete();
    // const invoices = await this.entry.listInvoices();

    console.log(pakete);
    // console.log(invoices);

    // TODO as a first demo show how to build a basic page that shows the entries
  }
}
