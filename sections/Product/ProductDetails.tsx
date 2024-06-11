import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery/ImageSlider.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import { clx } from "../../sdk/clx.ts";
import NotFound from "../../sections/Product/NotFound.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import { useDevice } from "deco/hooks/useDevice.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function ProductDetails({ page }: Props) {
  if (!page) {
    return <NotFound />;
  }

  const device = useDevice();

  return (
    <div class="bg-white">
      <div
        class={clx(
          "container grid bg-white",
          "grid-cols-1 gap-2 py-0",
          "sm:grid-cols-5 sm:gap-6 sm:py-6",
        )}
      >
        <div class="sm:col-span-5">
          <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
        </div>
        <div class="sm:col-span-3">
          <ImageGallerySlider page={page} device={device} />
        </div>
        <div class="sm:col-span-2">
          <ProductInfo page={page} />
        </div>
        {page.product.description && (
          <div class="sm:col-span-5">
            <div
              class="text-xs sm:text-sm mx-4 sm:ml-2 mt-2 mb-4"
              dangerouslySetInnerHTML={{ __html: page.product.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingFallback() {
  return (
    <div
      style={{ height: "710px" }}
      class="w-full flex justify-center items-center bg-white"
    >
      <span class="loading loading-spinner" />
    </div>
  );
}
