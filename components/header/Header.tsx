import type { ImageWidget } from "apps/admin/widgets.ts";
import type { Person, SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "deco/hooks/useDevice.ts";
import { useSection } from "deco/hooks/useSection.ts";
import {
  MINICART_CONTAINER_ID,
  MINICART_DRAWER_ID,
  NAVBAR_HEIGHT,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import Minicart, { type Minicart as IMinicart } from "../minicart/Minicart.tsx";
import Searchbar, { SearchbarProps } from "../search/Searchbar/Form.tsx";
import Drawer from "../ui/Drawer.tsx";
import Icon from "../ui/Icon.tsx";
import Alert, { type Alert as AlertType } from "./Alert.tsx";
import Bag from "./Bag.tsx";
import Login from "./Login.tsx";
import Menu from "./Menu.tsx";
import NavItem from "./NavItem.tsx";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}

export interface SectionProps {
  alerts?: AlertType[];

  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[] | null;

  /**
   * @title Searchbar
   * @description Searchbar configuration
   */
  searchbar: SearchbarProps;

  /** @title Logo */
  logo?: Logo;

  minicart?: IMinicart;

  user?: Person | null;

  variant?: "preview" | "full" | "menu";

  contentBefore?: {
    show: boolean;
    bg: Color;
    image: ImageWidget;
    text: Text;
    link: string;
  };

  isShow: boolean;
}
/** @format rich-text */
type Text = string;

/** @format color */
type Color = string;

type Props = Omit<SectionProps, "alert" | "loading"> & {
  variant: "preview" | "full";
};

function Desktop(
  { logo, searchbar, user, variant, navItems, isShow }: Props & {
    isShow: boolean;
  },
) {
  const items = navItems ?? [];
  return (
    <>
      <div class="flex flex-col w-full px-6 items-center ">
        <div class="w-9/10">
          <div class=" flex justify-between items-center py-3">
            <div class="flex justify-between items-center gap-8">
              <div class="flex justify-center py-2">
                {logo && (
                  <a href="/" aria-label="Store logo" class="lg:w-45">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width || 62}
                      height={logo.height || 62}
                      class="w-full"
                    />
                  </a>
                )}
              </div>
            </div>
            <div class="flex items-center w-full">
              <Searchbar {...searchbar} />
            </div>
            <div class="flex-none flex items-center justify-end gap-2 col-span-1">
              <Login user={user} variant={variant} />

              <a
                class="rounded-full no-animation btn-square btn-ghost flex items-center justify-center"
                href="/wishlist"
              >
                <Icon
                  class="text-lightGray"
                  id="Heart"
                  width={24}
                  height={24}
                  strokeWidth={1}
                />
              </a>

              <div class="flex items-center text-xs font-thin">
                <Bag />
              </div>
            </div>
          </div>

          <div
            class="flex w-full"
            hx-get={useSection({ props: { isShow: true } })}
            hx-trigger="mouseenter once"
            hx-target="#header"
            hx-swap="outerHTML"
          >
            <ul
              class={`flex items-center justify-between w-full `}
            >
              {items.map((item) => <NavItem item={item} isShow={isShow} />)}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function Mobile(
  { logo, searchbar, user, variant }: Props,
) {
  return (
    <div>
      <Drawer
        id={SIDEMENU_DRAWER_ID}
        aside={
          <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
            <div
              id={SIDEMENU_CONTAINER_ID}
              class="h-full flex items-center justify-center"
              style={{ minWidth: "100vw" }}
            >
              <span class="loading loading-spinner" />
            </div>
          </Drawer.Aside>
        }
      />

      <div
        style={{ height: NAVBAR_HEIGHT }}
        class="flex justify-between items-center w-full px-4 gap-2"
      >
        <div class="flex justify-between items-center gap-2">
          <label
            for={SIDEMENU_DRAWER_ID}
            class="btn btn-circle md:btn-sm btn-xs btn-ghost"
            aria-label="open menu"
            hx-target={`#${SIDEMENU_CONTAINER_ID}`}
            hx-swap="outerHTML"
            hx-trigger="mouseenter"
            hx-get={useSection({ props: { variant: "menu" } })}
          >
            <Icon id="menu" size={20} strokeWidth={0.01} class="text-primary" />
          </label>

          {logo && (
            <a
              href="/"
              class="flex-grow inline-flex items-center justify-center"
              style={{ minHeight: NAVBAR_HEIGHT }}
              aria-label="Store logo"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 100}
                height={logo.height || 13}
              />
            </a>
          )}
        </div>

        <div class="flex justify-end gap-1">
          <Login user={user} variant={variant} />
          <Bag />
        </div>
      </div>
      <Searchbar {...searchbar} />
    </div>
  );
}

function Header({
  alerts = [],
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  contentBefore,
  ...props
}: Props) {
  const device = useDevice();

  return (
    <header
      class="h-[155px] sm:h-[186px]"
      // Refetch the header in two situations
      // 1. When the window is resized so we have a gracefull Developer Experience
      // 2. When the user changes tab, so we can update the minicart badge when the user comes back
      hx-trigger="resize from:window, visibilitychange[document.visibilityState === 'visible'] from:document"
      hx-get={useSection()}
      hx-target="closest section"
      hx-swap="outerHTML"
      id="header"
    >
      {/* Minicart Drawer */}
      <Drawer
        id={MINICART_DRAWER_ID}
        class="drawer-end z-50"
        aside={
          <Drawer.Aside title="Meu carrinho" drawer={MINICART_DRAWER_ID}>
            <div
              id={MINICART_CONTAINER_ID}
              style={{
                minWidth: "calc(min(100vw, 425px))",
                maxWidth: "425px",
              }}
              class={clx(
                "h-full flex flex-col bg-base-100 items-center justify-center overflow-auto",
                "[.htmx-request&]:pointer-events-none [.htmx-request&]:opacity-60 [.htmx-request&]:cursor-wait transition-opacity duration-300",
              )}
            >
              {props.variant === "full" && props.minicart && (
                <Minicart cart={props.minicart} />
              )}
            </div>
          </Drawer.Aside>
        }
      />

      <div class="bg-base-100 fixed w-full z-40">
        {alerts.length > 0 && <Alert alerts={alerts} />}
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} />}
      </div>
    </header>
  );
}

export function LoadingFallback(props: SectionProps) {
  return <Header {...props} variant="preview" />;
}

export default function Section(props: SectionProps) {
  if (props.variant === "menu") {
    return <Menu navItems={props.navItems ?? []} />;
  }

  return <Header {...props} variant="full" />;
}
