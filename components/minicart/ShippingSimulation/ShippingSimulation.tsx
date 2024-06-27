import type { SKU } from "apps/vtex/utils/types.ts";
import { useComponent } from "../../../sections/Component.tsx";


export interface Props {
  items: SKU[];
}

export default function ShippingSimulation({ items }: Props) {
  return (
    <>
      <div class="flex justify-between items-center px-4 mb-5">
        <div class="flex flex-col">
          <span class="font-medium  text-xs text-graphite uppercase font-roboto">
            Calcular o frete
          </span>
        </div>
        <div class="join max-w-[222px] ml-3 w-full">
          <input
            type="text"
            class="input join-item border focus:outline-none  !border-warning w-full max-w-36 !h-10 rounded-l-lg font-roboto  text-xs  text-graphite"
            placeholder="Seu cep aqui"
            name="postalCode"
            maxLength={8}
            size={8}
          />
          <button
            hx-target={`#ResultShipping`}
            hx-swap="innerHTML"
            hx-sync="this:replace"
            hx-trigger="click, change delay:300ms "
            hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
              items,
            })}
            name="action"
            class="btn join-item min-h-10  !hover:brightness-90 !h-10 bg-warning border border-warning cursor-pointer !w-[97px] text-sm text-white rounded-r-lg"
          >
            <span class="[.htmx-request_&]:hidden inline">Calcular</span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
          </button>
        </div>
      </div>
    </>
  );
}
