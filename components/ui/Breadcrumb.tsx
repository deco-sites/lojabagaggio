import type { BreadcrumbList } from "apps/commerce/types.ts";
import { relative } from "../../sdk/url.ts";
import { clx } from "../../sdk/clx.ts";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement].filter((
    { name, item },
  ) => name && item);

  return (
    <div class="breadcrumbs">
      <ul>
        {items
          .map((item, index) => (
            <li>
              <a
                class={clx(
                  "block text-[13px] rounded-full text-base-300",
                  "bg-primary-content py-[2px] px-2",
                  items.length - 1 === index &&
                    "text-primary font-semibold capitalize",
                )}
                href={relative(item.item)}
              >
                {item.name}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Breadcrumb;
