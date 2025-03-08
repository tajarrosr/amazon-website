import { cart, removeItem, updateDeliveryOption } from "../../data/cart.js";
import { products, productGet } from "../../data/products.js";
import { priceCentsFormat } from "../utils/priceItem.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";

hello();
const dateToday = dayjs();
const deliveryDate = dateToday.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM D"));

export function orderSummaryRender() {
  let orderSummary = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = productGet(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateToday = dayjs();
    const deliveryDate = dateToday.add(deliveryOption.deliveryDays, "days");
    const stringDate = deliveryDate.format("dddd MMMM D");

    orderSummary += `
        <div class="cart-item-container js-cart-container-${
          matchingProduct.id
        }">
            <div class="delivery-date">
              Delivery date: ${stringDate}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${priceCentsFormat(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${
                      cartItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-quantity" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const dateToday = dayjs();
      const deliveryDate = dateToday.add(deliveryOption.deliveryDays, "days");
      const stringDate = deliveryDate.format("dddd MMMM D");
      const stringPrice =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${priceCentsFormat(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-option-delivery" data-product-id="${
          matchingProduct.id
        }" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
        ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${stringDate}
          </div>
          <div class="delivery-option-price">
            ${stringPrice} Shipping
          </div>
        </div>
      </div>
    `;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = orderSummary;
  document.querySelectorAll(".js-delete-quantity").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeItem(productId);

      const container = document.querySelector(
        `.js-cart-container-${productId}`
      );
      container.remove();
    });
  });

  document.querySelectorAll(".js-option-delivery").forEach((component) => {
    component.addEventListener("click", () => {
      const { productId, deliveryOptionId } = component.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      orderSummaryRender();
    });
  });
}
