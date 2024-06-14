import type { ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "deco/hooks/useDevice.ts";
import { useSection } from "deco/hooks/useSection.ts";
import {
  HEADER_HEIGHT,
  NAVBAR_HEIGHT,
  SEARCHBAR_DRAWER_ID,
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

const Desktop = (
  { navItems, logo, searchbar }: Props,
) => (
  <>
    <div className="flex flex-col w-full px-6 items-center">
      <div className="w-full flex justify-between items-center py-3">
        <div className="flex justify-between items-center py-3">
          {logo && (
            <a href="/" aria-label="Store logo">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 100}
                height={logo.height || 23}
              />
            </a>
          )}
        </div>

        <div className="flex items-center w-full">
          <Searchbar {...searchbar} />
        </div>

        <div className="flex-none flex items-center justify-end gap-2 col-span-1">
          <Login />
          <a
            className="btn btn-sm btn-ghost font-thin no-animation"
            href="/wishlist"
            aria-label="Wishlist"
          >
            <Icon id="Heart" size={24} strokeWidth={0.4} />
          </a>

          <div className="flex items-center text-xs font-thin">
            <Bag />
          </div>
        </div>
      </div>

      <div className="lex w-full">
        <ul className="flex gap-6 col-span-1 justify-start">
          {navItems?.slice(0, 4).map((item) => <NavItem key={item.url} item={item} />)}
        </ul>
      </div>
    </div>
  </>
);

const Mobile = ({ logo, searchbar }: Props) => (
  <>
    <Drawer
      id={SEARCHBAR_DRAWER_ID}
      aside={
        <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID}>
          <div className="w-screen overflow-y-auto">
            <Searchbar {...searchbar} />
          </div>
        </Drawer.Aside>
      }
    />
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
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
      style={{ height: NAVBAR_HEIGHT }}
      className="grid grid-cols-3 justify-between items-center border-b border-base-200 w-full px-6 pb-6 gap-2"
    >
      <label
        htmlFor={SIDEMENU_DRAWER_ID}
        className="btn btn-circle md:btn-sm btn-xs btn-ghost"
        aria-label="open menu"
        hx-target={`#${SIDEMENU_CONTAINER_ID}`}
        hx-swap="outerHTML"
        hx-trigger="click once"
        hx-get={useSection({ props: { variant: "menu" } })}
      >
        <Icon id="Bars3" size={20} strokeWidth={0.01} />
      </label>
      {logo && (
        <a
          href="/"
          className="flex-grow inline-flex items-center justify-center"
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

      <div className="flex justify-end gap-1">
        <label
          htmlFor={SEARCHBAR_DRAWER_ID}
          className="btn btn-circle btn-sm btn-ghost"
          aria-label="search icon button"
        >
          <Icon id="MagnifyingGlass" size={20} strokeWidth={0.1} />
        </label>
        <Bag />
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
}: Props) {
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
          : <Mobile logo={logo} {...props} />}
      </div>
    </header>
  );
}

export default function Section({ variant, ...props }: SectionProps) {
  if (variant === "menu") {
    return <Menu navItems={props.navItems ?? []} />;
  }

  return <Header {...props} />;
}
