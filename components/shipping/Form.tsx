import type { SKU } from "apps/vtex/utils/types.ts";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../../sections/Component.tsx";
import Icon from "../ui/Icon.tsx";

export interface Props {
  items: SKU[];
}

export default function Form({ items }: Props) {
  const slot = useId();

  return (
    <div>
      <div class="flex flex-col sm:flex-row justify-between items-center gap-2 mb-2">
        <div class="flex flex-row items-center gap-1">
          <Icon id="truck" size={32} class="text-primary h-6" />
          <span class="text-xs">
            Valor e prazo de entrega
          </span>
        </div>

        <form
          class="join w-full sm:w-auto"
          hx-target={`#${slot}`}
          hx-swap="innerHTML"
          hx-sync="this:replace"
          hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
            items,
          })}
        >
          <input
            as="input"
            type="text"
            class="input input-bordered join-item text-sm w-full sm:w-[126px] font-bold"
            placeholder="Cep aqui"
            name="postalCode"
            maxLength={8}
            size={8}
          />
          <button
            type="submit"
            class="btn join-item no-animation bg-primary text-white border-primary"
          >
            <span class="[.htmx-request_&]:hidden inline">BUSCAR</span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
          </button>
        </form>
      </div>
      <div id={slot} />
    </div>
  );
}
