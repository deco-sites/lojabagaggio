import { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { scriptAsDataURI } from "apps/utils/dataURI.ts";
import { JSX } from "preact";
import { MINICART_CONTAINER_ID, MINICART_FORM_ID } from "../../constants.ts";
import { useAddToCart } from "../../sdk/cart.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import { useCallback } from "../../sdk/useCallback.ts";

export interface Props extends JSX.HTMLAttributes<HTMLLabelElement> {
  product: Product;
  price: number;
  listPrice: number;
  seller: string;

  class?: string;
}

// Write current values to cart form
const onChange = (productId: string, cartFormId: string) => {
  const cartInput = document.getElementById(cartFormId)
    ?.querySelector<HTMLInputElement>(
      `[data-item-id="${productId}"] input[type="number"]`,
    );

  if (!cartInput) {
    return;
  }

  const input = event!.currentTarget as HTMLInputElement;
  const checkbox = input.closest("[data-add-to-cart]")!
    .querySelector<HTMLInputElement>('input[type="number"]')!;

  cartInput.value = input.value;
  cartInput.dispatchEvent(new Event("change", { bubbles: true }));
  checkbox.checked = Number(input.value) > 0;
};

// Copy cart form values into AddToCartButton
const onLoad = (productId: string, cartFormId: string) => {
  const cartInput = document.getElementById(cartFormId)
    ?.querySelector<HTMLInputElement>(
      `[data-item-id="${productId}"] input[type="number"]`,
    );

  if (!cartInput) {
    return;
  }

  document.querySelectorAll<HTMLInputElement>(
    `[data-add-to-cart][data-product-id="${productId}"]`,
  ).forEach((container) => {
    const checkbox = container.querySelector<HTMLInputElement>(
      `input[type="checkbox"]`,
    )!;
    const quantity = container.querySelector<HTMLInputElement>(
      `input[type="number"]`,
    )!;

    quantity.value = cartInput.value;
    checkbox.checked = true;
  });
};

const onClick = () => {
  const label = event?.currentTarget as HTMLLabelElement;
  const checkbox = label.parentElement?.querySelector<HTMLInputElement>(
    'input[type="checkbox"]',
  );
  const input = label.parentElement?.querySelector<HTMLInputElement>(
    'input[type="number"]',
  );
  if (input) {
    input.value = "1";
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
  if (checkbox) {
    checkbox.checked = true;
  }
};

function AddToCartButton(
  { product, price, listPrice, seller, class: _class }: Props,
) {
  const platform = usePlatform();
  const id = useId();
  const item = mapProductToAnalyticsItem({ product, price, listPrice });
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;
  const addToCartEvent = useSendEvent({
    on: "click",
    event: { name: "add_to_cart", params: { items: [item] } },
  });

  const props = platform === "vtex"
    ? { seller, productID }
    : platform === "shopify"
    ? { lines: { merchandiseId: productID } }
    : platform === "vnda"
    ? {
      quantity: 1,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    }
    : platform === "wake"
    ? {
      productVariantId: Number(productID),
      quantity: 1,
    }
    : platform === "nuvemshop"
    ? {
      quantity: 1,
      itemId: Number(productGroupID),
      add_to_cart_enhanced: "1",
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    }
    : platform === "linx"
    ? {
      ProductID: productGroupID,
      SkuID: productID,
      Quantity: 1,
    }
    : null;

  if (!props) {
    return null;
  }

  return (
    <div
      class="flex"
      data-add-to-cart
      data-product-id={productID}
    >
      <input type="checkbox" id={id} class="hidden peer" />

      <label
        {...addToCartEvent}
        for={id}
        class={clx(
          "btn no-animation",
          "peer-checked:hidden w-full !h-8 !min-h-8",
          "bg-primary text-white border-primary hover:bg-secondary-content hover:border-secondary-content",
          _class,
        )}
        hx-disabled-elt="this"
        hx-indicator={`#${MINICART_CONTAINER_ID}`}
        hx-target={`#${MINICART_CONTAINER_ID}`}
        // deno-lint-ignore no-explicit-any
        hx-post={useAddToCart(props as any)}
        hx-swap="innerHTML"
        hx-on:click={useCallback(onClick)}
      >
        COMPRAR
      </label>

      <div class="hidden peer-checked:inline flex-grow">
        <QuantitySelector
          value={1}
          min={0}
          max={100}
          hx-on:change={useCallback(onChange, productID, MINICART_FORM_ID)}
        />
      </div>
      <script
        defer
        src={scriptAsDataURI(onLoad, productID, MINICART_FORM_ID)}
      />
    </div>
  );
}

export default AddToCartButton;
