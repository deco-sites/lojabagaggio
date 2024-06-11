import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import AddToCartButton from "./AddToCartButton.tsx";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;
}

const WIDTH = 118;
const HEIGHT = 118;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
}: Props) {
  const {
    url,
    image: images,
    offers,
    isVariantOf,
  } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front] = images ?? [];
  const { listPrice, price, seller = "1" } = useOffer(offers);
  const relativeUrl = relative(url);
  const aspectRatio = `${WIDTH} / ${HEIGHT}`;

  {/* Add click event to dataLayer */}
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [
          mapProductToAnalyticsItem({
            product,
            price,
            listPrice,
            index,
          }),
        ],
      },
    },
  });

  const isSuggestion = itemListName === "Suggestions";

  return (
    <div class={clx(isSuggestion ? "" : "px-2 min-h-[232px]")}>
      <div
        {...event}
        data-deco="view-product"
        class={clx(
          "card card-compact group w-full h-full bg-white",
          "lg:border lg:border-transparent",
          isSuggestion ? "" : "p-2 lg:p-4",
        )}
      >
        <div
          class={clx(
            "flex",
            isSuggestion
              ? "flex-row border-[1px] border-[#dedede] rounded p-2"
              : "flex-col gap-2",
          )}
        >
          <div
            class={clx(
              !isSuggestion && "w-full",
              "min-w-1/5 w-1/5 flex justify-center",
            )}
          >
            <figure
              class={clx(
                "relative overflow-hidden flex justify-center",
                !isSuggestion ? "w-[118px] h-[118px]" : "w-[50px] h-[50px]",
              )}
              style={{ aspectRatio }}
            >
              {/* Product Images */}
              <a
                href={relativeUrl}
                aria-label="view product"
                class={clx(
                  "absolute top-0 left-0",
                  "grid grid-cols-1 grid-rows-1",
                  !isSuggestion && "w-full",
                )}
              >
                <Image
                  src={front.url!}
                  alt={front.alternateName}
                  width={WIDTH}
                  height={HEIGHT}
                  style={{ aspectRatio }}
                  class={clx(
                    "bg-base-100",
                    "object-cover",
                    "rounded",
                    isSuggestion ? "w-[50px] h-[50px]" : "w-[118px] h-[118px]",
                  )}
                  sizes="(max-width: 640px) 50vw, 20vw"
                  preload={preload}
                  loading={preload ? "eager" : "lazy"}
                  decoding="async"
                />
              </a>
            </figure>
          </div>

          {/* Name/Description */}
          <div class="flex flex-col">
            <h3
              class="text-sm overflow-ellipsis overflow-hidden h-10"
              style={{
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                display: "-webkit-box",
              }}
              dangerouslySetInnerHTML={{ __html: title ?? "" }}
            />
            {isSuggestion && (
              <div class="h-6">
                {listPrice && price && listPrice !== price && (
                  <span class="text-error border-error border-[1px] text-[10px] p-[3px] font-semibold">
                    {Math.round(((listPrice - price) / listPrice) * 100)}% off
                  </span>
                )}
              </div>
            )}
            {isSuggestion && (
              <div class="flex flex-col items-start font-light">
                <span class="line-through text-xs h-4">
                  {listPrice !== price &&
                    formatPrice(listPrice, offers?.priceCurrency)}
                </span>
                <span class="font-bold text-primary text-lg">
                  {formatPrice(price, offers?.priceCurrency)}
                </span>
              </div>
            )}
          </div>

          {!isSuggestion && (
            <div class="h-6">
              {listPrice && price && listPrice !== price && (
                <span class="text-error border-error border-[1px] text-[10px] p-[3px] font-semibold">
                  {Math.round(((listPrice - price) / listPrice) * 100)}% off
                </span>
              )}
            </div>
          )}

          {/* Price from/to */}
          {!isSuggestion && (
            <div class="flex flex-col items-start font-light">
              <span class="line-through text-xs h-4">
                {listPrice !== price &&
                  formatPrice(listPrice, offers?.priceCurrency)}
              </span>
              <span class="font-bold text-primary text-lg">
                {formatPrice(price, offers?.priceCurrency)}
              </span>
            </div>
          )}

          {price && listPrice && (
            <div class={clx(isSuggestion && "min-w-[33%] w-1/3")}>
              <AddToCartButton
                product={product}
                price={price}
                listPrice={listPrice}
                seller={seller}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
