import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { relative } from "../../sdk/url.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";

interface Props {
    product: Product;
    /** Preload card image */
    preload?: boolean;

    /** @description used for analytics event */
    itemListName?: string;

    /** @description index of the product card in the list */
    index?: number;
}

const WIDTH = 64;
const HEIGHT = 64;

function ProductCardSearch({
    product,
    preload,
    itemListName,
    index,
}: Props) {
    const { url, image: images, offers, isVariantOf } = product;
    const title = isVariantOf?.name ?? product.name;
    const [front ] = images ?? [];
    
    const {
        listPrice,
        price,
    } = useOffer(offers);
    const relativeUrl = relative(url);
    const aspectRatio = `${WIDTH} / ${HEIGHT}`;

    const item = mapProductToAnalyticsItem({
        product,
        price,
        listPrice,
        index,
    });

    {/* Add click event to dataLayer */}
    const event = useSendEvent({
        on: "click",
        event: {
            name: "select_item" as const,
            params: {
                item_list_name: itemListName,
                items: [item],
            },
        },
    });

    return (
        <div
            {...event} 
            class="flex p-2 group w-full lg:p-4"
        >
            <a href={relativeUrl} aria-label="view product" class="flex gap-2 w-full hover:bg-[#E3E4E6]">
                <figure
                    class="relative overflow-hidden w-16 h-16"
                    style={{ aspectRatio }}
                >
                    {/* Wishlist button */}
                    <div
                        class={clx(
                            "absolute top-0 left-0",
                            "z-10 w-full",
                            "flex items-center justify-end",
                        )}
                    >
                    </div>

                    {/* Product Images */}
                    <div
                       
                        class={clx(
                            "absolute top-0 left-0",
                            "w-full",
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
                                "rounded w-full",
                            )}
                            preload={preload}
                            loading={preload ? "eager" : "lazy"}
                            decoding="async"
                        />
                    </div>
                </figure>

                {/* SKU Selector */}
                <div class="flex flex-col">
                    {/* Name/Description */}
                    <div class="flex flex-col">
                        <h2
                            class=" w-64 sm:w-auto text-[#979899] sm:text-[#3f3f40] lg:text-base capitalize"
                            dangerouslySetInnerHTML={{ __html: title ?? "" }}
                        />
                    </div>

                    {/* Price from/to */}
                    <div class=" hidden sm:flex flex-col  justify-end font-light font-roboto">
                        <span class="line-through text-xs text-[#979899] ">
                            {formatPrice(listPrice, offers?.priceCurrency)}
                        </span>
                        <span class="text-[#979899] text-sm ">
                            {formatPrice(price, offers?.priceCurrency)}
                        </span>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default ProductCardSearch;
