import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalService } from 'src/app/services/modal/modal.service'
import { Product } from 'src/app/models/product';
import { concatMap } from 'rxjs/operators';


@Component({
  selector: 'app-action-product-modal',
  templateUrl: './action-product-modal.component.html',
  styleUrls: ['./action-product-modal.component.scss']
})
export class ActionProductModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ElementRef | undefined;

  @Input() product: Product | undefined;

  warning: boolean = false;
  isActive: boolean = false;
  canBeClosed: boolean = false;

  deleteSubscription: SubscriptionLike | undefined;
  modalSubscription: SubscriptionLike | undefined;


  constructor(
    private productsService: ProductsService,
    public modalService: ModalService,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.modalSubscription = this.modalService.actionProductModalObs
    .subscribe(
      id => {
        this.isActive = !!this.product && (id === this.product.id);
        if (this.isActive) this.openModal();
        else this.closeModal();
      }
    );
  }

  ngOnDestroy() {
    if (this.modalSubscription) this.modalSubscription.unsubscribe();
    if (this.deleteSubscription) this.deleteSubscription.unsubscribe();
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: ElementRef) {
    if (!this.isActive) return;

    const clickedInside: boolean = this.el.nativeElement.contains(targetElement);
    if (!clickedInside && this.canBeClosed) {
      this.closeModal();
      return;
    }

    this.canBeClosed = true;
  }

  private openModal() {
    if (!this.modal) return;

    this.modal.nativeElement.classList.remove('hidden');
    this.modal.nativeElement.classList.add('display');

    this.canBeClosed = false;
  }

  private closeModal() {
    if (!this.modal) return;

    this.modal.nativeElement.classList.remove('display');
    this.modal.nativeElement.classList.add('hidden');

    this.canBeClosed = false;
  }

  public delete(validation: boolean = false) {
    if (!this.product) return;

    if (!this.warning) {
      this.warning = true;
      this.canBeClosed = false;
      return;

    } else if (validation) {

      this.deleteSubscription = this.productsService.deleteProduct(this.product.id)
      .pipe(
        concatMap((product: Product) => {
          console.log('Delete product:', product);
          return this.productsService.getProducts();
        })
      ).subscribe(
        () => this.closeModal(),
        error => console.log('error:', error),
        () => console.log('complete')
      );
    }

    this.warning = false;
    this.canBeClosed = false;
  }

  public edit() {
    if (!this.product) return;

    this.closeModal();
    this.modalService.openEditProductModal(this.product);
  }
}
