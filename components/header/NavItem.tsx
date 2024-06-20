import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

import { HEADER_HEIGHT, HEADER_HEIGHT_SHOW_ALERT } from "../../constants.ts";

function NavItem(
  { item, isShow }: { item: SiteNavigationElement; isShow?: boolean },
) {
  const { url, name, children } = item;
  const hasImage = item?.image?.[0];
  return (
    <li
      class={`group flex !mb-0 hover:border-primary border-transparent border-solid border-b-4
        items-center`}
    >
      <a href={url} class="py-2 ">
        <span
          class={`${
            (name?.toUpperCase() === "OUTLET")
              ? "text-primaryContent font-bold"
              : "text-lightGray font-normal "
          } uppercase text-15 font-roboto`}
        >
          {name}
        </span>
      </a>

      {/* <div class="w-full h-2 hover:bg-primary"></div> */}

      {children && children.length > 0 &&
        (
          <div
            class="fixed hidden mt-8 hover:flex group-hover:flex bg-base-100 z-50 items-start  justify-center gap-6  w-screen  "
            style={{
              top: "0px",
              left: "0px",
              marginTop: isShow ? HEADER_HEIGHT_SHOW_ALERT : HEADER_HEIGHT,
            }}
          >
            <div class=" w-[86%]  max-w-[1920px] flex items-start  justify-between ">
              <ul
                class={`flex items-start justify-between  pr-8 pt-4 gap-6 ${
                  hasImage ? "w-1/2" : "w-full"
                } `}
              >
                {children.map((node, index) => (
                  <li key={index} class="flex flex-col">
                    {node.name && (
                      <a
                        class="n1-custom-style-navbar ![text-shadow:_0_0_0px_#fff] mb-4"
                        href={node.url}
                      >
                        <span class=" text-graphite text-xl font-titillium font-bold">
                          {node.name}
                        </span>
                      </a>
                    )}

                    <ul class="mt-4 lg:mt-0 gap-4 flex flex-col">
                      {node.children?.map((leaf) => (
                        <li>
                          <a
                            class="![text-shadow:_0_0_0px_#fff] w-full leading-6 capitalize font-normal text-base  font-titillium text-graphite whitespace-nowrap"
                            href={leaf.url}
                          >
                            <span class="">{leaf.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <div class="flex w-auto items-center justify-center gap-6">
                {item?.image && item.image.map((image) => (
                  image?.url && (
                    <a href={image.contentUrl} class="w-full" alt={image.name}>
                      <Image
                        className="pt-6"
                        src={image.url}
                        alt={image.alternateName}
                        width={720}
                        height={224}
                        loading="lazy"
                        class="w-full  min-w-2/4xl"
                      />
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
    </li>
  );
}

export default NavItem;
