import { cart } from "../../data/cart.js";
import { productGet } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { priceCentsFormat } from "../utils/priceItem.js";

export function paymentRender() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = productGet(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.getDeliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTax = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTax * 0.1;
  const totalCents = totalBeforeTax + taxCents;

  const paymentSummaryHTML = `
            <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${priceCentsFormat(
              productPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${priceCentsFormat(
              shippingPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${priceCentsFormat(
              totalBeforeTax
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${priceCentsFormat(
              taxCents
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${priceCentsFormat(
              totalCents
            )}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
}
