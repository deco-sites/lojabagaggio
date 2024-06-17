import { useScript } from "apps/utils/useScript.ts";
import { MINICART_DRAWER_ID } from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";

const onLoad = (id: string) =>
  window.STOREFRONT.CART.subscribe((sdk) => {
    const script = document.getElementById(id);
    const counter = script?.closest("span");
    const count = sdk.getCart()?.items.length ?? 0;

    // Set minicart items count on header
    if (count === 0) {
      counter?.classList.add("after:hidden");
    } else {
      counter?.classList.remove("after:hidden");
    }

    counter?.setAttribute(
      "data-count",
      count > 9 ? "9+" : count.toString(),
    );
  });

function Bag() {
  const id = useId();

  return (
    <>
      <label
        class="indicator"
        for={MINICART_DRAWER_ID}
        aria-label="open cart"
      >
        <span
          id={id}
          class={clx(
            "text-lightGray",
            "after:hidden after:indicator-item after:badge after:badge-secondary after:font-semibold after:bg-primaryContent after:w-6 after:h-6 after:border-none after:text-xs after:text-white after:badge-sm after:content-[attr(data-count)]",
          )}
        >
          <Icon id="bag" size={28} strokeWidth={2} />
        </span>
      </label>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </>
  );
}

export default Bag;
