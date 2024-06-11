import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Header from "../../components/ui/SectionHeader.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

export interface Props {
  products: Product[] | null;
  title?: string;
  description?: string;
  layout?: {
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5;
      desktop?: 1 | 2 | 3 | 4 | 5;
    };
    headerAlignment?: "center" | "left";
    headerfontSize?: "Normal" | "Large" | "Small";
    showArrows?: boolean;
  };
}

const slideDesktop = {
  1: "md:w-full",
  2: "md:w-1/2",
  3: "md:w-1/3",
  4: "md:w-1/4",
  5: "md:w-1/5",
};

const slideMobile = {
  1: "w-full",
  2: "w-1/2",
  3: "w-1/3",
  4: "w-1/4",
  5: "w-1/5",
};

function ProductShelf({
  products,
  title,
  description,
  layout,
}: Props) {
  const id = useId();

  if (!products || products.length === 0) {
    return null;
  }

  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...(useOffer(product.offers)),
          })
        ),
      },
    },
  });

  return (
    <div
      class="w-full px-2 sm:px-0 container py-8 flex flex-col gap-6 lg:py-10"
      id={id}
    >
      <div class="flex justify-between items-center">
        <Header
          title={title || ""}
          description={description || ""}
          alignment={layout?.headerAlignment || "center"}
        />
        {layout?.showArrows && (
          <div class="flex">
            <Slider.PrevButton class="w-12 h-12 flex justify-center items-center">
              <Icon
                size={24}
                id="ChevronRight"
                strokeWidth={3}
                class="rotate-180"
              />
            </Slider.PrevButton>
            <Slider.NextButton class="w-12 h-12 flex justify-center items-center">
              <Icon size={24} id="ChevronRight" strokeWidth={3} />
            </Slider.NextButton>
          </div>
        )}
      </div>

      <div
        class={clx(
          "grid",
          layout?.showArrows && "grid-cols-[1fr]",
          "px-0 container",
        )}
        {...viewItemListEvent}
      >
        <Slider class="carousel carousel-center sm:carousel-end row-start-2 row-end-5">
          {products?.map((product, index) => (
            <Slider.Item
              index={index}
              class={clx(
                "carousel-item",
                slideDesktop[layout?.numberOfSliders?.desktop ?? 3],
                slideMobile[layout?.numberOfSliders?.mobile ?? 1],
              )}
            >
              <ProductCard
                product={product}
                itemListName={title}
                index={index}
              />
            </Slider.Item>
          ))}
        </Slider>
        <Slider.JS rootId={id} />
      </div>
    </div>
  );
}

export default ProductShelf;
