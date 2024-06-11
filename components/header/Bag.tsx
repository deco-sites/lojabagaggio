import { MINICART_DRAWER_ID } from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "../ui/Icon.tsx";

function Bag() {
  return (
    <label
      class="indicator"
      for={MINICART_DRAWER_ID}
      aria-label="open cart"
      data-deco="open-cart"
    >
      <span
        data-minicart-items-count
        class={clx(
          "btn btn-circle btn-sm btn-ghost no-animation",
          "after:hidden after:indicator-item after:badge after:badge-primary after:badge-sm after:content-[attr(data-minicart-items-count)] after:font-thin",
        )}
      >
        <Icon
          id="cart"
          size={26}
          strokeWidth={2}
          class="text-primary scale-90"
        />
      </span>
    </label>
  );
}

export default Bag;
