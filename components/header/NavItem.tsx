import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { HEADER_HEIGHT } from "../../constants.ts";
import { useSection } from "deco/hooks/useSection.ts";

function NavItem(
  { item, isShow = false }: { item: SiteNavigationElement; isShow: boolean },
) {
  const { url, name, children } = item;
  const image = item?.image?.[0];

  return (
    <li class="group flex items-center">
      <a
        href={url}
        class="py-6"
      >
        <span class="group-hover:underline text-15 font-normal text-base200 ">
          {name}
        </span>
      </a>

      {children && children.length > 0 && isShow &&
        (
          <div
            class="fixed hidden hover:flex group-hover:flex bg-base-100 z-40 items-start justify-center gap-6 border-t border-b-2 border-base-200 w-screen"
            style={{ top: "0px", left: "0px", marginTop: "150px" }}
          >
            {image?.url && (
              <Image
                class="p-6"
                src={image.url}
                alt={image.alternateName}
                width={300}
                height={332}
                loading="lazy"
              />
            )}
            <ul class="flex items-start justify-center gap-6">
              {children.map((node) => (
                <li class="p-6">
                  <a class="hover:underline" href={node.url}>
                    <span>{node.name}</span>
                  </a>

                  <ul class="flex flex-col gap-1 mt-4">
                    {node.children?.map((leaf) => (
                      <li>
                        <a class="hover:underline" href={leaf.url}>
                          <span class="text-xs">{leaf.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
    </li>
  );
}

export default NavItem;
