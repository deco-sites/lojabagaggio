import { ImageWidget } from "apps/admin/widgets.ts";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import FormFirstPurchase from "./formFirstPurchase.tsx";

export interface inforCard {
  title: string;
  description?: string;
  link?: string;
  image?: ImageWidget;
  activeForm?: boolean;
}

export interface TopAlert {
  backgroundColor?: string;
  alerts?: inforCard[];
  interval?: number;
}

export interface Props {
  alert: TopAlert;
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
}

function Dots({ alert }: Props) {
  const { alerts } = alert;
  const interval = alert.interval ? alert.interval : 5;
  return (
    <>
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
      <ul class="carousel justify-center col-span-full gap-1 z-10 row-start-4">
        {alerts?.map((_, index) => (
          <li class="carousel-item">
            <Slider.Dot index={index}>
              <div class="py-5">
                <div
                  class="w-[10px] sm:w-[10px] h-[10px]  rounded-full group-disabled:animate-progress bg-gradient-to-r from-base-100 from-[length:var(--dot-progress)] to-[#a9a9a9] to-[length:var(--dot-progress)]"
                  style={{ animationDuration: `${interval}s` }}
                />
              </div>
            </Slider.Dot>
          </li>
        ))}
      </ul>
    </>
  );
}

function Alert({ alert, isShow }: Props & { isShow?: boolean }) {
  const id = useId();

  const { backgroundColor, alerts } = alert;
  const interval = alert.interval ? alert.interval : 5;
  return (
    <div style={{ background: backgroundColor }} class="w-full">
      <div
        id={id}
        class="relative flex flex-col py-3"
      >
        <Slider class="carousel carousel-center w-screen gap-6">
          {alerts &&
            alerts.map((alert, index) => (
              <Slider.Item index={index} class="carousel-item w-full">
                <div class="flex flex-col items-center justify-center w-[80%] m-auto ">
                  <a
                    href=""
                    class={`${
                      alert.link ? "cursor-pointer" : "pointer-events-none"
                    }`}
                  >
                    <span class="text-base font-semibold tracking-wide  font-roboto text-white flex justify-center items-center w-screen">
                      {alert.title}
                    </span>
                  </a>
                  
                  {isShow && alert.activeForm && <FormFirstPurchase />}

                  {alert.description && isShow && (
                    <span class="text-sm text-white font-roboto font-normal pt-1 flex justify-center items-center text-center">
                      {alert.description}
                    </span>
                  )}
                </div>
              </Slider.Item>
            ))}
        </Slider>

        {isShow
          ? (
            <label
              class="absolute top-5  right-[10%] lg:right-[36%]  text-white font-medium cursor-pointer"
              hx-target="#header"
              hx-swap="outerHTML"
              hx-trigger="click once"
              hx-get={useSection({ props: { isShow: false } })}
            >
              <Icon id="ChevronUp" size={24} stroke-width={24} />
            </label>
          )
          : (
            <label
              class="absolute top-3 right-[10%] lg:right-[36%]  text-white  font-medium cursor-pointer"
              hx-target="#header"
              hx-swap="outerHTML"
              hx-trigger="click once"
              hx-get={useSection({ props: { isShow: true } })}
            >
              <Icon id="ChevronDown" size={24} stroke-width={24} />
            </label>
          )}

        {isShow && <Dots alert={alert} />}

        <Slider.JS rootId={id} interval={interval && interval * 1e3} />
      </div>
    </div>
  );
}

export default Alert;
