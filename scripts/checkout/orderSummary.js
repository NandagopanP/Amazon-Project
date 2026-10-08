import { cart } from "../../data/cart-class.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary(){
  let cartHtml = "";

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartHtml += `<div class="cart-item-container js-cart-container-${matchingProduct.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProduct.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                  </div>
                  <div class="product-quantity js-product-quantity-${matchingProduct.id}">
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
                    <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id=${matchingProduct.id}>
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHtml(matchingProduct, deliveryOption.id)}
                </div>
              </div>
            </div>`;
  });

  function deliveryOptionsHtml(matchingProduct, selectedDeliveryOptionId) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString = deliveryOption.priceCents === 0 ? "FREE Shipping" : `$${(deliveryOption.priceCents / 100).toFixed(2)} - Shipping`;

      const isChecked = deliveryOption.id === selectedDeliveryOptionId;

      html+= `<div class="delivery-option">
                      <input type="radio"
                      ${isChecked ? "checked" : ""}
                        class="delivery-option-input"
                        value="${deliveryOption.id}"
                        data-product-id="${matchingProduct.id}"
                        name="delivery-option-${matchingProduct.id}">
                      <div>
                        <div class="delivery-option-date">
                          ${dateString}
                        </div>
                        <div class="delivery-option-price">
                          ${priceString}
                        </div>
                      </div>
                    </div>`;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartHtml;

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

  if (cart.cartItems.length === 0) {
    showEmptyCart();
  }

  function updateCheckoutCartQuantity() {
    const totalQuantity = cart.cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0,
    );
    document.querySelector(".js-checkout-cart-quantity").textContent =
      totalQuantity;
  }

  updateCheckoutCartQuantity();

  document.querySelectorAll(".delivery-option-input").forEach((input) => {
    input.addEventListener("change", () => {
      const productId = input.dataset.productId;
      const deliveryOptionId = input.value;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);

      const container = document.querySelector(`.js-cart-container-${productId}`);
      container.remove();
      renderPaymentSummary();
      updateCheckoutCartQuantity();

      if (cart.cartItems.length === 0) {
        showEmptyCart();
      }
    });
  });

  document.querySelectorAll(".update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-container-${productId}`);
      container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-container-${productId}`);
      const valueInput = container.querySelector(".quantity-input");
      const newQuantity = Number(valueInput.value);
      cart.updateQuantity(productId, newQuantity);
      renderOrderSummary();
      renderPaymentSummary();
      updateCheckoutCartQuantity();

      if (newQuantity > 0) {
        container.querySelector(".quantity-label").textContent = newQuantity;
        container.classList.remove("is-editing-quantity");
      } else {
        container.remove();

        if (cart.cartItems.length === 0) {
          showEmptyCart();
        }
      }
    });
  });
}
