import type { ImageWidget } from "apps/admin/widgets.ts";
import PoweredByDeco from "apps/website/components/PoweredByDeco.tsx";
import FooterItems from "../../components/footer/FooterItems.tsx";
import Logo from "../../components/footer/Logo.tsx";
import Social from "../../components/footer/Social.tsx";
import { clx } from "../../sdk/clx.ts";

export type Item = {
  label: string;
  href: string;
};

export type Section = {
  label: string;
  items: Item[];
};

export interface SocialItem {
  label:
    | "Discord"
    | "Facebook"
    | "Instagram"
    | "Linkedin"
    | "Tiktok"
    | "Twitter";
  link: string;
}

export interface NewsletterForm {
  placeholder?: string;
  buttonText?: string;
  /** @format html */
  helpText?: string;
}

export interface Layout {
  hide?: {
    logo?: boolean;
    newsletter?: boolean;
    sectionLinks?: boolean;
    socialLinks?: boolean;
    paymentMethods?: boolean;
    mobileApps?: boolean;
    regionOptions?: boolean;
    extraLinks?: boolean;
    backToTheTop?: boolean;
  };
}

export interface Props {
  logo?: {
    image: ImageWidget;
    description?: string;
  };
  newsletter?: {
    title?: string;
    /** @format textarea */
    description?: string;
    form?: NewsletterForm;
  };
  sections?: Section[];
  social?: {
    title?: string;
    items: SocialItem[];
  };
  /** @format rich-text */
  extraInfo?: string;
  /** @format rich-text */
  generalConditions?: string;
  /** @format rich-text */
  address?: string;
  layout?: Layout;
}

function Footer({
  logo,
  sections = [{
    "label": "Sobre",
    "items": [
      {
        "href": "/quem-somos",
        "label": "Quem somos",
      },
      {
        "href": "/termos-de-uso",
        "label": "Termos de uso",
      },
      {
        "href": "/trabalhe-conosco",
        "label": "Trabalhe conosco",
      },
    ],
  }, {
    "label": "Atendimento",
    "items": [
      {
        "href": "/centraldeatendimento",
        "label": "Central de atendimento",
      },
      {
        "href": "/whatsapp",
        "label": "Fale conosco pelo WhatsApp",
      },
      {
        "href": "/trocaedevolucao",
        "label": "Troca e devolução",
      },
    ],
  }],
  social = {
    title: "Redes sociais",
    items: [{ label: "Instagram", link: "/" }, { label: "Tiktok", link: "/" }],
  },
  layout = {
    hide: {
      logo: false,
      newsletter: false,
      sectionLinks: false,
      socialLinks: false,
    },
  },
  extraInfo,
  generalConditions,
  address,
}: Props) {
  const _logo = layout?.hide?.logo ? <></> : <Logo logo={logo} />;
  const _sectionLinks = layout?.hide?.sectionLinks ? <></> : (
    <FooterItems
      sections={sections}
    />
  );
  const _social = layout?.hide?.socialLinks
    ? <></>
    : <Social content={social} vertical={false} />;

  return (
    <footer
      class={clx(
        "w-full flex flex-col justify-between pt-10 gap-10",
        "bg-secondary text-base-300",
      )}
    >
      <div class="lg:container mx-4 sm:mx-6 lg:mx-auto">
        <div class="flex flex-col gap-10">
          <div class="flex flex-col lg:flex-row gap-10 lg:gap-8 lg:justify-between">
            <div class="flex items-start gap-6 sm:w-2/5">
              {_logo}
              <div class="flex flex-col gap-6">
                <p class="text-sm">
                  {logo?.description}
                </p>
                {_social}
              </div>
            </div>
            {_sectionLinks}
            <div class="flex flex-col md:flex-row lg:flex-col gap-5 lg:gap-5 lg:w-1/5">
              <div class="flex flex-col gap-10 lg:gap-10">
                {extraInfo && (
                  <div class="text-sm">
                    <p dangerouslySetInnerHTML={{ __html: extraInfo }}></p>
                  </div>
                )}
                <PoweredByDeco />
              </div>
            </div>
          </div>
          {generalConditions && (
            <div class="text-xs">
              <p dangerouslySetInnerHTML={{ __html: generalConditions }}></p>
            </div>
          )}
        </div>
      </div>
      {address && (
        <div class="w-full bg-neutral-content">
          <div class="container flex justify-center text-[10px] py-6 px-4">
            <p dangerouslySetInnerHTML={{ __html: address }}></p>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
