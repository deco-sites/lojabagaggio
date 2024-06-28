import { ImageWidget } from "apps/admin/widgets.ts";
import { clx } from "../../sdk/clx.ts";
import Slider from "./Slider.tsx";
import Icon from "./Icon.tsx";
import { useId } from "../../sdk/useId.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { AppContext } from "../../apps/site.ts";

/**@title {{{title}}} */
export interface Card {
    image: ImageWidget;
    alt: string;
    title: string;
    link: string;
}

export interface Props {
    title: string;
    cards?: Card[];
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

export default function BannerCarrouselCategory(
    { cards, title, layout, device }: Props & { device?: string },
) {
    if (!cards) return null;

    const isDesktop = device === "desktop";

    console.log(isDesktop);

    const id = useId();
    return (
        <div className="container w-full m-auto sm:max-w-[1027px] px-2 overflow-hidden">
            {title &&
                (
                    <div className="md:py-0 flex items-center w-full justify-center  mt-11 mb-5">
                        <h2 className="text-xl font-roboto capitalize leading-5 font-semibold text-graphite">
                            {title}
                        </h2>
                    </div>
                )}

            <div
                id={id}
                class={clx(
                    "grid",
                    layout?.showArrows &&
                        "grid-cols-[48px_1fr_48px]",
                    "px-0 md:px-5 w-full",
                )}
            >
                <Slider class="carousel sm:gap-0 sm:carousel-center col-span-full row-[1/5]">
                    {cards?.map((card, index) => (
                        <Slider.Item
                            index={index}
                            class={clx(
                                "carousel-item",
                                slideDesktop[
                                    layout?.numberOfSliders?.desktop ?? 3
                                ],
                                slideMobile[
                                    layout?.numberOfSliders?.mobile ?? 1
                                ],
                            )}
                        >
                            <a
                                href={card.link}
                                alt={`link ${card.alt}`}
                                class="w-full flex flex-col items-center justify-center gap-3"
                            >
                                <div>
                                    <Picture>
                                        <Source
                                            media="(max-width: 767px)"
                                            src={card.image}
                                            width={165}
                                            height={178}
                                        />
                                        <Source
                                            media="(min-width: 768px)"
                                            src={card.image}
                                            width={120}
                                            height={129}
                                        />
                                        <img
                                            class="w-[90%] sm:w-full sm:max-w-[165px] max-w-[120px]"
                                            src={card.image}
                                            alt={card.alt}
                                            decoding="async"
                                            loading="lazy"
                                        />
                                    </Picture>
                                </div>
                                <span class="text-graphite font-semibold font-roboto">
                                    {card.title}
                                </span>
                            </a>
                        </Slider.Item>
                    ))}
                </Slider>

                {layout?.showArrows && (
                    <>
                        <div class="relative block z-10 col-start-1 row-start-2">
                            <Slider.PrevButton class="absolute -left-3 -top-[14px] flex justify-center items-center mb-2 ">
                                <Icon
                                    size={65}
                                    id="BagChevronLeft"
                                    class="text-black"
                                />
                            </Slider.PrevButton>
                        </div>
                        <div class="relative block z-10 col-start-3 row-start-2">
                            <Slider.NextButton class="absolute -right-3 -top-[14px] flex justify-center items-center mb-2 ">
                                <Icon
                                    size={65}
                                    id="BagChevronRight"
                                    class=" w-[65px] text-black"
                                />
                            </Slider.NextButton>
                        </div>
                    </>
                )}

                {!isDesktop && (
                    <>
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
                        <ul class="carousel justify-center gap-4 z-10 col-span-full row-start-5 ">
                            {cards?.map((_, index) => (
                                <li
                                    class={`carousel-item   md:${
                                        ((index === 0) || (index % 4 === 0))
                                            ? ""
                                            : "hidden"
                                    } ${
                                        ((index === 0) || (index % 3 === 0))
                                            ? ""
                                            : "hidden"
                                    }`}
                                >
                                    <Slider.Dot index={index}>
                                        <div class="py-5">
                                            <div class=" w-[10px] h-[10px] md:w-[14px] md:h-[14px] sm:w-[16px] sm:h-[16px] group-disabled:bg-[#a9a9a9] rounded-full bg-transparent border border-[#a4a4a4]" />
                                        </div>
                                    </Slider.Dot>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <Slider.JS rootId={id} />
            </div>
        </div>
    );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
    return { ...props, device: ctx.device };
};
