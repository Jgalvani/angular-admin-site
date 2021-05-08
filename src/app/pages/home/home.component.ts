import { Component } from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';

import { Product } from 'src/app/models/product';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public data: any[] = [];
  private productSubscription: SubscriptionLike | undefined;

  constructor(
    private productsService: ProductsService,
    private modalService: ModalService,
  ) {
    this.productSubscription = this.productsService.productObs
    .subscribe((products: Product[]) => this.data = products);
  }

  openActionProductModal(product: Product) {
    this.modalService.openActionProductModal(product.id);
  }

  openAddProductModal() {
    this.modalService.openAddProductModal(true);
  }

}
