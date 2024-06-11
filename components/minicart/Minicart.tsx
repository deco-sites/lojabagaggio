import { AnalyticsEvent } from "apps/commerce/types.ts";
import { scriptAsDataURI } from "apps/utils/dataURI.ts";
import {
  MINICART_CONTAINER_ID,
  MINICART_DRAWER_ID,
  MINICART_FORM_ID,
} from "../../constants.ts";
import { useSubmitCart } from "../../sdk/cart.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import CartItem, { Item } from "./Item.tsx";

export interface Minicart {
  original: Record<string, unknown>;
  data: {
    items: Item[];
    total: number;
    subtotal: number;
    discounts: number;
    coupon?: string;
  };
  options: {
    enableCoupon?: boolean;
    freeShippingTarget: number;
    checkoutHref: string;
    locale: string;
    currency: string;
  };
}

const onLoad = (id: string) => {
  globalThis.window.STOREFRONT ||= { SEEN: new WeakMap(), CART: null };
  const storefront = globalThis.window.STOREFRONT;
  const container = document.getElementById(id) as HTMLDivElement | null;

  // Write cart form quantities to AddToCartButton
  function writeQuantitiesToAddToCart() {
    document.querySelectorAll<HTMLElement>(
      "[data-add-to-cart][data-product-id]",
    )
      .forEach((node) => {
        const productId = node.getAttribute("data-product-id");
        const input = node.querySelector<HTMLInputElement>(
          'input[type="number"]',
        );
        const checkbox = node.querySelector<HTMLInputElement>(
          'input[type="checkbox"]',
        );

        if (!productId || !input || !checkbox) {
          return;
        }

        const quantity = container?.querySelector<HTMLInputElement>(
          `[data-item-id="${productId}"] input[type="number"]`,
        )?.valueAsNumber;

        if (typeof quantity === "number") {
          input.value = quantity.toString();
          checkbox.checked = quantity > 0;
        } else {
          input.value = "0";
          checkbox.checked = false;
        }
      });
  }

  function exposeCartToWindow() {
    const input = container?.querySelector<HTMLInputElement>(
      'input[name="original"]',
    );

    if (!input) {
      return;
    }

    storefront.CART = JSON.parse(decodeURIComponent(input.value));
  }

  function adjustQuantities() {
    // cart items
    const items = container?.querySelectorAll("[data-item-id]");

    // Set minicart items count on header
    const count = items?.length ?? 0;
    const counter = document.querySelector("[data-minicart-items-count]");
    counter?.classList.remove("after:hidden");
    counter?.setAttribute(
      "data-minicart-items-count",
      count > 9 ? "9+" : count.toString(),
    );
  }

  writeQuantitiesToAddToCart();
  exposeCartToWindow();
  adjustQuantities();
};

function Cart({
  cart: {
    original,
    data: {
      items,
      total,
      coupon,
    },
    options: {
      locale,
      currency,
      checkoutHref,
    },
  },
}: { cart: Minicart }) {
  const count = items.length;

  const beginCheckoutEvent = useSendEvent({
    on: "click",
    event: {
      name: "begin_checkout",
      params: { coupon, currency, value: total, items },
    },
  });

  const viewCartEvent = useSendEvent<AnalyticsEvent>({
    on: "view",
    event: {
      name: "view_cart",
      params: { currency, value: total, items },
    },
  });

  return (
    <div
      {...viewCartEvent}
      class="flex flex-col flex-grow justify-center items-center overflow-hidden w-full"
    >
      {count === 0
        ? (
          <div class="flex flex-col gap-6">
            <span class="font-medium text-2xl">Sua sacola está vazia</span>
            <label
              for={MINICART_DRAWER_ID}
              class="btn btn-outline no-animation"
            >
              Escolher produtos
            </label>
          </div>
        )
        : (
          <>
            {/* Cart Items */}
            <form
              id={MINICART_FORM_ID}
              class="contents"
              hx-sync="this:replace"
              hx-disabled-elt="this"
              hx-trigger="submit, change delay:300ms"
              hx-target={`#${MINICART_CONTAINER_ID}`}
              hx-indicator={`#${MINICART_CONTAINER_ID}`}
              hx-post={useSubmitCart()}
              hx-swap="innerHTML"
            >
              <ul
                role="list"
                class="px-6 flex-grow overflow-y-auto flex flex-col gap-6 w-full"
              >
                {items.map((item, index) => (
                  <li>
                    <CartItem
                      item={item}
                      index={index}
                      locale={locale}
                      currency={currency}
                    />
                  </li>
                ))}
              </ul>

              {/* This contains the original platform cart. Integrations usually use this value */}
              <input
                type="hidden"
                name="original"
                value={encodeURIComponent(JSON.stringify(original))}
              />
            </form>

            {/* Cart Footer */}
            <footer class="w-full bg-neutral-content">
              {/* Total */}
              <div class="pt-4 flex flex-col justify-start items-end gap-2 mx-4">
                <div class="flex justify-between items-center w-full text-primary font-bold ">
                  <span>Total</span>
                  <output form={MINICART_FORM_ID} class="text-xl">
                    {formatPrice(total, currency, locale)}
                  </output>
                </div>
                <span class="text-xs text-base-300">
                  ∗ Os custos de transporte serão calculados ao selecionar o
                  método de envio.
                </span>
              </div>

              <div class="p-4">
                <a
                  {...beginCheckoutEvent}
                  data-deco="buy-button"
                  class="btn btn-primary w-full no-animation"
                  href={checkoutHref}
                >
                  <span class="[.htmx-request_&]:hidden">Finalizar pedido</span>
                  <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
                </a>
              </div>
            </footer>
          </>
        )}

      <script defer src={scriptAsDataURI(onLoad, MINICART_CONTAINER_ID)} />
    </div>
  );
}

export default Cart;
