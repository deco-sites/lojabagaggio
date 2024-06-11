import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Header from "../../components/ui/SectionHeader.tsx";
import { clx } from "../../sdk/clx.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  srcMobile?: ImageWidget;
  mobileWidth?: number;
  mobileHeight?: number;
  srcDesktop?: ImageWidget;
  desktopWidth?: number;
  desktopHeight?: number;
  /**
   * @description Image alt text
   */
  alt: string;
  /**
   * @description Adicione um link
   */
  href: string;
}

export type BorderRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export interface Props {
  hideMobile?: boolean;
  hideDesktop?: boolean;
  title?: string;
  description?: string;
  banners?: Banner[];
  layout?: {
    /**
     * @description Aplique borda a sua imagem
     */
    borderRadius?: {
      /** @default none */
      mobile?: BorderRadius;
      /** @default none */
      desktop?: BorderRadius;
    };
  };
}

const RADIUS: Record<string, Record<BorderRadius, string>> = {
  mobile: {
    "none": "rounded-none",
    "sm": "rounded-sm",
    "md": "rounded-md",
    "lg": "rounded-lg",
    "xl": "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    "full": "rounded-full",
  },
  desktop: {
    "none": "sm:rounded-none",
    "sm": "sm:rounded-sm",
    "md": "sm:rounded-md",
    "lg": "sm:rounded-lg",
    "xl": "sm:rounded-xl",
    "2xl": "sm:rounded-2xl",
    "3xl": "sm:rounded-3xl",
    "full": "sm:rounded-full",
  },
};

const DEFAULT_PROPS: Props = {
  "banners": [
    {
      "srcMobile":
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/b531631b-8523-4feb-ac37-5112873abad2",
      "srcDesktop":
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/b531631b-8523-4feb-ac37-5112873abad2",
      "alt": "Fashion",
      "href": "/",
    },
    {
      "alt": "Fashion",
      "href": "/",
      "srcMobile":
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/1125d938-89ff-4aae-a354-63d4241394a6",
      "srcDesktop":
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/1125d938-89ff-4aae-a354-63d4241394a6",
    },
    {
      "srcMobile":
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/dd1e2acb-ff80-49f9-8f56-1deac3b7a42d",
      "srcDesktop":
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/dd1e2acb-ff80-49f9-8f56-1deac3b7a42d",
      "href": "/",
      "alt": "Fashion",
    },
    {
      "srcMobile":
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/0b85ba2d-48b1-4f5b-b619-7f4a7f50b455",
      "srcDesktop":
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/0b85ba2d-48b1-4f5b-b619-7f4a7f50b455",
      "alt": "Fashion",
      "href": "/",
    },
  ],
  "layout": {
    "borderRadius": {
      "mobile": "3xl",
      "desktop": "2xl",
    },
  },
};

function Banner(
  props: Banner & {
    borderRadius?: {
      /** @default none */
      mobile?: BorderRadius;
      /** @default none */
      desktop?: BorderRadius;
    };
  },
) {
  const {
    borderRadius,
    srcMobile,
    srcDesktop,
    alt,
    mobileHeight,
    mobileWidth,
    desktopHeight,
    desktopWidth,
  } = props;
  const radiusDesktop = RADIUS.desktop[borderRadius?.desktop ?? "none"];
  const radiusMobile = RADIUS.mobile[borderRadius?.desktop ?? "none"];

  if (!srcMobile && !srcDesktop) {
    return null;
  }

  return (
    <a
      href={props.href}
      class={`block overflow-hidden ${radiusDesktop} ${radiusMobile}`}
    >
      <Picture>
        {srcMobile && (
          <Source
            width={mobileWidth || 190}
            height={mobileHeight || 190}
            media="(max-width: 767px)"
            src={srcMobile}
          />
        )}
        {srcDesktop && (
          <Source
            width={desktopWidth || 640}
            height={desktopHeight || 420}
            media="(min-width: 768px)"
            src={srcDesktop}
          />
        )}
        <img
          width={640}
          class="w-full h-full object-cover"
          src={srcMobile || srcDesktop}
          alt={alt}
          decoding="async"
          loading="lazy"
        />
      </Picture>
    </a>
  );
}

export default function Gallery(props: Props) {
  const { title, description, banners } = {
    ...DEFAULT_PROPS,
    ...props,
  };

  if (!banners?.length) return null;

  return (
    <section
      class={clx(
        "container px-4 py-6 flex flex-col gap-8 lg:gap-10 lg:py-10 lg:px-0",
        props.hideMobile && "hidden",
        props.hideDesktop ? "sm:hidden" : "sm:flex",
      )}
    >
      <Header
        title={title}
        description={description}
        alignment={"left"}
      />
      <ul
        class={clx(
          banners?.length === 2 && "grid sm:grid-cols-2 gap-2",
          (banners?.length === 3 || banners?.length === 6) &&
            "grid sm:grid-cols-3 gap-2",
          "items-end",
        )}
      >
        {banners?.map((banner) => (
          <li class="">
            <Banner {...banner} borderRadius={props.layout?.borderRadius} />
          </li>
        ))}
      </ul>
    </section>
  );
}
