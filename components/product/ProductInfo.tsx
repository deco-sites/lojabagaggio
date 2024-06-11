import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import ShippingSimulationForm from "../shipping/Form.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";

interface Props {
  page: ProductDetailsPage | null;
}

function ProductInfo({ page }: Props) {
  const platform = usePlatform();
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, gtin, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const {
    price = 0,
    listPrice,
    seller = "1",
    availability,
  } = useOffer(offers);
  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [mapProductToAnalyticsItem({
          product,
          breadcrumbList: breadcrumb,
          price,
          listPrice,
        })],
      },
    },
  });

  return (
    <div {...viewItemEvent} class="flex flex-col px-4" id={id}>
      {/* Code and name */}
      <div class="mt-4 sm:mt-8">
        <div>
          {gtin && <span class="text-xs text-base-300">{gtin}</span>}
        </div>
        <h1>
          <span class="text-base-300 text-2xl capitalize">{title}</span>
        </h1>
      </div>
      {/* Prices */}
      <div class="mt-4">
        <div class="flex flex-col gap-2">
          {(listPrice ?? 0) > price && (
            <span class="line-through text-base-300 text-base">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-bold text-2xl text-primary">
            {formatPrice(price, offers?.priceCurrency)}
          </span>
        </div>
      </div>
      {/* Sku Selector */}
      <div class="mt-4 sm:mt-6">
        <ProductSelector product={product} />
      </div>
      {/* Add to Cart and Favorites button */}
      <div class="mt-4 sm:mt-10 flex flex-col gap-2">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              {price && listPrice && (
                <AddToCartButton
                  listPrice={listPrice}
                  product={product}
                  seller={seller}
                  price={price}
                  class="btn-primary"
                />
              )}
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>
      {/* Shipping Simulation */}
      <div class="mt-8">
        {platform === "vtex" && (
          <ShippingSimulationForm
            items={[{
              id: Number(product.sku),
              quantity: 1,
              seller: seller,
            }]}
          />
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
