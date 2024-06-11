import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useSection } from "deco/hooks/useSection.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Header from "../../components/ui/SectionHeader.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { clx } from "../../sdk/clx.ts";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

/** @titleBy title */
interface Tab {
  title: string;
  image?: ImageWidget;
  products: Product[] | null;
}

export interface Props {
  tabs: Tab[];
  title?: string;
  description?: string;
  layout?: {
    headerAlignment?: "center" | "left";
    headerfontSize?: "Normal" | "Large";
  };

  /** @hide */
  tabIndex?: number;
}

function TabbedProductShelf({
  tabs,
  title,
  description,
  layout,
  tabIndex,
}: Props) {
  const id = useId();
  const ti = typeof tabIndex === "number"
    ? Math.min(Math.max(tabIndex, 0), tabs.length)
    : 0;
  const { products, image } = tabs[ti];
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products?.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...(useOffer(product.offers)),
          })
        ) ?? [],
      },
    },
  });

  return (
    <div class="w-full container  py-8 flex flex-col gap-8 lg:gap-12 lg:py-10">
      <Header
        title={title || ""}
        description={description || ""}
        alignment={layout?.headerAlignment || "center"}
      />

      <div class="flex justify-between w-full">
        {tabs.map((tab, index) => (
          <button
            class={clx(index === ti && "border-b-[2px] border-primary")}
            hx-get={useSection({ props: { tabIndex: index } })}
            hx-swap="outerHTML"
            hx-target="closest section"
          >
            <span class="px-6">{tab.title}</span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
          </button>
        ))}
      </div>

      {!products?.length
        ? <div class="flex justify-center items-center">No Products found</div>
        : (
          <div class="container grid grid-cols-[20%_1fr] gap-4">
            <div>
              {image && <Image src={image} width={240} height={330} />}
            </div>
            <div
              id={id}
              class="grid"
              {...viewItemListEvent}
            >
              <Slider class="carousel carousel-center sm:carousel-end col-span-full">
                {products.map((product, index) => (
                  <Slider.Item
                    index={index}
                    class="carousel-item w-1/2 sm:w-1/5"
                  >
                    <ProductCard
                      product={product}
                      itemListName={title}
                      index={index}
                    />
                  </Slider.Item>
                ))}
              </Slider>

              <>
                <div class="hidden relative z-10 col-start-1 row-start-3">
                  <Slider.PrevButton class="btn btn-circle btn-outline absolute right-1/2 bg-base-100">
                    <Icon
                      size={24}
                      id="ChevronRight"
                      strokeWidth={3}
                      class="rotate-180"
                    />
                  </Slider.PrevButton>
                </div>
                <div class="hidden relative z-10 col-start-3 row-start-3">
                  <Slider.NextButton class="btn btn-circle btn-outline absolute left-1/2 bg-base-100">
                    <Icon size={24} id="ChevronRight" strokeWidth={3} />
                  </Slider.NextButton>
                </div>
              </>
              <Slider.JS rootId={id} />
            </div>
          </div>
        )}
    </div>
  );
}

export default TabbedProductShelf;
