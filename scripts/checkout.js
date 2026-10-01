import { cart, removeFromCart, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js"
import { formatCurrency } from "./utils/money.js";

let cartHtml = "";

cart.forEach((cartItem) => {

  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product)=>{
    if(product.id===productId){
      matchingProduct = product;
    }
  })
  console.log(matchingProduct);

  cartHtml += `<div class="cart-item-container js-cart-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                ${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary update-link"
                    data-product-id=${matchingProduct.id}>
                    Update
                  </span>
                  <input type="number" min="1" value="${cartItem.quantity}" class="quantity-input">
                  <span class="save-quantity-link link-primary" 
                  data-product-id=${matchingProduct.id}
                  >Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id=${matchingProduct.id}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
});

console.log(cartHtml)

document.querySelector('.js-order-summary').innerHTML=cartHtml;

function showEmptyCart() {
  const checkoutGrid = document.querySelector(".checkout-grid");
  checkoutGrid.classList.add("is-empty");
  document.querySelector(".payment-summary").hidden = true;
  document.querySelector(".js-order-summary").innerHTML = `
    <div class="empty-cart-state">
      <h2>Your cart is empty</h2>
      <p>There are no items in your cart yet.</p>
      <a class="button-primary empty-cart-link" href="amazon.html">Continue shopping</a>
    </div>
  `;
}

if (cart.length === 0) {
  showEmptyCart();
}

function updateCheckoutCartQuantity() {
  const totalQuantity = cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  document.querySelector(".js-checkout-cart-quantity").textContent = totalQuantity;
}

updateCheckoutCartQuantity();

document.querySelectorAll('.js-delete-link').forEach((link)=>{
  link.addEventListener('click',()=>{
    const productId = link.dataset.productId;
    removeFromCart(productId);
    
    const container = document.querySelector(`.js-cart-container-${productId}`);
    container.remove();
    updateCheckoutCartQuantity();

    if (cart.length === 0) {
      showEmptyCart();
    }
    
  })
})

document.querySelectorAll('.update-link').forEach((link)=>{
  link.addEventListener('click',()=>{
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-container-${productId}`);
    container.classList.add('is-editing-quantity');
  })
})

document.querySelectorAll('.save-quantity-link').forEach((link)=>{
  link.addEventListener('click',()=>{
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-container-${productId}`);
    const valueInput = container.querySelector('.quantity-input');
    const newQuantity = Number(valueInput.value);

    updateQuantity(productId, newQuantity);

    if (newQuantity > 0) {
      container.querySelector('.quantity-label').textContent = newQuantity;
      container.classList.remove('is-editing-quantity');
    } else {
      container.remove();
      updateCheckoutCartQuantity();

      if (cart.length === 0) {
        showEmptyCart();
      }
    }
  })
})



