import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useCallback } from "../../sdk/useCallback.ts";
import { useId } from "../../sdk/useId.ts";

const script = (delta: number) => {
  event!.stopPropagation();
  const button = event!.currentTarget as HTMLButtonElement;
  const input = button.parentElement
    ?.querySelector<HTMLInputElement>('input[type="number"]')!;
  const min = Number(input.min) || -Infinity;
  const max = Number(input.max) || Infinity;
  input.value = `${Math.min(Math.max(input.valueAsNumber + delta, min), max)}`;
  input.dispatchEvent(new Event("change", { bubbles: true }));
};

function QuantitySelector(
  { id = useId(), ...props }: JSX.IntrinsicElements["input"],
) {
  return (
    <div class="join border rounded-none w-full h-8">
      <button
        type="button"
        class="btn btn-square btn-ghost min-h-[30px] h-[30px]"
        hx-on:click={useCallback(script, -1)}
      >
        -
      </button>
      <div
        data-tip={`Quantity must be between ${props.min} and ${props.max}`}
        class={clx(
          "flex-grow join-item",
          "flex justify-center items-center",
          "has-[:invalid]:tooltip has-[:invalid]:tooltip-error has-[:invalid]:tooltip-open has-[:invalid]:tooltip-bottom",
        )}
      >
        <input
          id={id}
          class={clx(
            "input text-center [appearance:textfield] flex-grow",
            "invalid:input-error h-[30px] text-xs font-bold",
          )}
          inputMode="numeric"
          type="number"
          {...props}
        />
      </div>
      <button
        type="button"
        class="btn btn-square btn-ghost min-h-[30px] h-[30px]"
        hx-on:click={useCallback(script, 1)}
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
