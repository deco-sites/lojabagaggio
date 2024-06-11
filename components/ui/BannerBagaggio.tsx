import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";
import { clx } from "../../sdk/clx.ts";
import Slider from "./Slider.tsx";

export interface Card {
  image: ImageWidget;
  alt: string;
  action?: {
    href: string;
    title: string;
    label: string;
  };
}

export interface Props {
  cards: Card[];
  /** @format html */
  title?: string;
  layout?: {
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5 | 6;
      desktop?: 1 | 2 | 3 | 4 | 5 | 6;
    };
    headerAlignment?: "center" | "left";
    headerfontSize?: "Normal" | "Large" | "Small";
    showArrows?: boolean;
  };
}

export default function BannerBagaggioCarousel(
  { cards, title, layout, device }: Props & { device?: string },
) {
  const id = useId();

  const slideDesktop = {
    1: "md:w-full",
    2: "md:w-1/2",
    3: "md:w-1/3",
    4: "md:w-1/4",
    5: "md:w-1/5",
    6: "md:w-1/6",
  };

  const slideMobile = {
    1: "w-full",
    2: "w-1/2",
    3: "w-1/3",
    4: "w-1/4",
    5: "w-1/5",
    6: "w-1/6",
  };

  return (
    <div class="w-full">
      <div class="w-full text-center">
        <div
          class={`flex flex-col gap-2 ${
            layout?.headerAlignment === "left"
              ? "text-left lg:pl-20 uppercase"
              : "text-center"
          }`}
        >
          {title &&
            (
              <h2
                class={clx(
                  "text-3xl  lg:text-4xl font-bold  text-primary pb-8",
                )}
              >
                {title}
              </h2>
            )}
        </div>
        <div
          id={id}
          class={clx(
            "grid ",
            (layout?.showArrows && device === "desktop") &&
              "grid-cols-[48px_1fr_48px] sm:grid-cols-[70px_1fr_70px] grid-rows-[1fr_48px_1fr_64px]",
            "px-0 w-full",
          )}
        >
          <Slider class="carousel sm:carousel-end col-span-full row-span-full">
            {cards?.map((card, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item lg:flex lg:justify-center",
                  slideDesktop[layout?.numberOfSliders?.desktop ?? 3],
                  slideMobile[layout?.numberOfSliders?.mobile ?? 1],
                )}
              >
                <a
                  href={card.action?.href}
                  label={card.action?.label}
                  title={card.action?.title}
                  class="flex flex-col text-center items-center w-full  max-w-36 lg:max-w-48"
                >
                  <div class="w-full ">
                    <Image
                      width={190}
                      height={190}
                      src={card.image}
                      alt={card.alt}
                      class="w-full max-w-48 h-full max-h-48 object-cover"
                      fetchPriority="auto"
                      loading={`lazy`}
                    />
                  </div>
                  <div class="w-full">
                    <h3 class="underline text-primary w-50 text-sm uppercase m-auto lg:text-base  w-20  lg:w-44 text-center">
                      {card.action?.title}
                    </h3>
                  </div>
                </a>
              </Slider.Item>
            ))}
          </Slider>

          {/** Dots */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @property --dot-progress {
              syntax: '<percentage>';
              inherits: false;
              initial-value: 0%;
            }
            `,
            }}
          />
        </div>
      </div>
    </div>
  );
}
