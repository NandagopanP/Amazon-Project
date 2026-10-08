import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import { loadFromStorage, cart } from "../../data/cart.js";

describe('test suite: renderOrderSummary', () => {

  const productid1= "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productid2= "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-checkout-cart-quantity"></div>
      <div class="payment-summary"></div>`;

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{
      productId: productid1,
      quantity: 2,
      deliveryOptionId: "1"
    }, {
      productId: productid2,
      quantity: 1,
      deliveryOptionId: "2"
    }]));
    spyOn(localStorage, 'setItem');
    loadFromStorage();
    renderOrderSummary();
  });

  it('displays the cart',()=>{
    expect(document.querySelectorAll('.cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-quantity-${productid1}`).innerText).toContain('Quantity: 2');
    expect(document.querySelector(`.js-product-quantity-${productid2}`).innerText).toContain('Quantity: 1');
  });

  it('removes a product',()=>{
    document.querySelector(`.js-delete-link-${productid1}`).click();

    expect(document.querySelector(`.js-cart-container-${productid1}`)).toBeNull();
    expect(document.querySelector(`.js-cart-container-${productid2}`)).not.toBeNull();
    expect(document.querySelector('.js-checkout-cart-quantity').textContent).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productid2);
  });
});