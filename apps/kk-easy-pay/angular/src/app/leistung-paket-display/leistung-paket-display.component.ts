import { Component, Input } from '@angular/core';
import { LeistungsPaket } from '@pct/kk-easy-pay-common';

@Component({
  selector: 'pct-leistung-paket-display',
  templateUrl: './leistung-paket-display.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LeistungPaketDisplayComponent {
  @Input() paket: LeistungsPaket = {
    nr: 1,
    description: 'Test Descr',
    price: 123,
  };

  get priceEuro() {
    return (this.paket.price / 100).toFixed(2) + '€';
  }
}
