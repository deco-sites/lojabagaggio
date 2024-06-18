import type { ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "deco/hooks/useDevice.ts";
import { useSection } from "deco/hooks/useSection.ts";
import {
  HEADER_HEIGHT,
  NAVBAR_HEIGHT,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import Searchbar, { type SearchbarProps } from "../search/Searchbar/Form.tsx";
import Drawer from "../ui/Drawer.tsx";
import Icon from "../ui/Icon.tsx";
// import Modal from "../ui/Modal.tsx"; // Removido pois não está em uso
import Alert from "./Alert.tsx";
import Bag from "./Bag.tsx";
import Login from "./Login.tsx";
import Menu from "./Menu.tsx";
import NavItem from "./NavItem.tsx";
import { AppContext } from "../../apps/site.ts";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}

export interface SectionProps {
  alerts?: string[];

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

  variant?: "menu";
}

type Props = Omit<SectionProps, "alert" | "variant">;

const menu = ` <div class="flex items-center gap-1">
          <Login />
          <div class="font-roboto font-normal font-base text-warning h-10">
            <h1 class="leading-[20px]">
              <span class="">Olá, Visitante</span>
            </h1>
            <p class="leanding-[20px] h-3">
              <span class="font-bold">Entre</span> ou <span class="font-bold">cadastre-se</span>
            </p>
          </div>
        </div>`;

const Desktop = (
  { navItems, logo, searchbar }: Props,
) => (
  <>
    <div className="flex flex-col w-9/10 m-auto max-w-screen-3xl items-center">
      <div className="w-full flex justify-between items-center py-[0.7rem]">
        <div className="flex justify-between items-center py-3 w-full max-w-45">
          {logo && (
            <a href="/" aria-label="Store logo" class="w-full">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 100}
                height={logo.height || 23}
                class="w-full max-w-45"
              />
            </a>
          )}
        </div>

        <div className="flex items-center w-full">
          <Searchbar {...searchbar} />
        </div>

        <div className="flex-none flex items-center justify-end gap-6">
          <Login />
          <a
            className=" no-animation"
            href="/wishlist"
            aria-label="Wishlist"
          >
            <Icon id="wishlist" size={28} strokeWidth={0.4} />
          </a>

          <div className="flex items-center text-xs font-thin">
            <Bag />
          </div>
        </div>
      </div>

      <div className="lex w-full">
        <ul className="flex gap-4 items-center justify-between px-4">
          {navItems?.map((item) => <NavItem key={item.url} item={item} />)}
        </ul>
      </div>
    </div>
  </>
);

const Mobile = ({ logo, device, searchbar }: Props & { device?: string }) => (
  <>
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.Aside title={menu} drawer={SIDEMENU_DRAWER_ID}>
          <div class="flex justify-between items-center px-4 py-6 h-[88px]">
            <div class="flex items-center gap-1">
              <Login />
              <div class="font-roboto font-normal font-base text-warning h-10">
                <h1 class="leading-[20px]">
                  <span class="">Olá, Visitante</span>
                </h1>
                <p class="leanding-[20px] h-3">
                  <span class="font-bold">Entre</span> ou{" "}
                  <span class="font-bold">cadastre-se</span>
                </p>
              </div>
            </div>
            <label
              for={SIDEMENU_DRAWER_ID}
              aria-label="X"
              class="btn btn-ghost"
            >
              <Icon id="XMark" size={24} strokeWidth={2} />
            </label>
          </div>
          <div class="text-center bg-lightGray w-full h-9">
            <p class="font-roboto font-medium text-white text-sm py-2">
              Navegue por categoria
            </p>
          </div>
          <div
            id={SIDEMENU_CONTAINER_ID}
            className="h-full flex items-center justify-center"
            style={{ minWidth: "100vw" }}
          >
            <span className="loading loading-spinner" />
          </div>
        </Drawer.Aside>
      }
    />
    <div
      class="flex flex-col items-center justify-center w-full  px-4 pb-2 gap-2"
      style={{ height: NAVBAR_HEIGHT }}
    >
      <div className="grid grid-cols-2 justify-between items-center w-full h-14">
        <div class="flex items-center justify-around">
          <label
            htmlFor={SIDEMENU_DRAWER_ID}
            className="btn btn-circle md:btn-sm btn-xs btn-ghost mr-6 text-lightGray"
            aria-label="open menu"
            hx-target={`#${SIDEMENU_CONTAINER_ID}`}
            hx-swap="outerHTML"
            hx-trigger="click once"
            hx-get={useSection({ props: { variant: "menu" } })}
          >
            <Icon id="Bars3" size={24} strokeWidth={0.01} />
          </label>
          {logo && (
            <a
              href="/"
              className="flex-grow inline-flex items-center justify-center"
              aria-label="Store logo"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 100}
                height={logo.height || 13}
                class=" w-full max-w-32"
              />
            </a>
          )}
        </div>

        <div className="flex justify-end gap-1">
          <Bag device={device} />
        </div>
      </div>

      {/** search */}
      <div className="w-full px-1">
        <Searchbar {...searchbar} device={device} />
      </div>
    </div>
  </>
);

function Header({
  alerts = [],
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  ...props
}: Props & { device?: string }) {
  const device = useDevice();

  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      // Refetch the header in two situations
      // 1. When the window is resized so we have a gracefull Developer Experience
      // 2. When the user changes tab, so we can update the minicart badge when the user comes back
      hx-trigger="resize from:window, visibilitychange[document.visibilityState === 'visible'] from:document"
      hx-get={useSection()}
      hx-target="closest section"
      hx-swap="outerHTML"
    >
      <div className="bg-base-100 fixed w-full z-40">
        {alerts.length > 0 && <Alert alerts={alerts} />}
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} device={device} />}
      </div>
    </header>
  );
}

export default function Section(
  { variant, device, ...props }: SectionProps & { device?: string },
) {
  if (variant === "menu") {
    return <Menu navItems={props.navItems ?? []} />;
  }

  return <Header {...props} device={device} />;
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  return { ...props, device: ctx.device };
};