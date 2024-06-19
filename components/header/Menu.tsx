import Icon from "../../components/ui/Icon.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
export interface Props {
  navItems: SiteNavigationElement[];
}

function MenuItem(
  { item, isParent }: { item: SiteNavigationElement; isParent?: boolean },
) {
  const hasChildren = item.children && item.children.length > 0;
  const hasOutlet = item.name?.toLowerCase() === "outlet";
  const style = hasOutlet ? "text-primary uppercase" : "text-graphite";

  return (
    <div
      className={`${
        (hasChildren || isParent)
          ? "collapse collapse-arrow !rounded-none"
          : "collapse-title !p-0 !text-sm flex items-center justify-between min-h-6 font-titillium"
      }`}
    >
      {hasChildren || isParent
        ? (
          <>
            {item.name && isParent
              ? (
                <>
                  <input type="checkbox" className="h-12 !min-h-12" />
                  <div
                    className={`collapse-title collapse-arrow font-roboto font-semibold !h-12   text-graphite lowercase !p-0 !min-h-12 !text-base flex items-center justify-between`}
                  >
                    <span className={`first-letter:capitalize ${style}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="collapse-content !p-0 border-t border-base-200">
                    {hasChildren
                      ? (
                        <>
                          <ul className="flex flex-col gap-4 ml-6 my-4">
                            {isParent && (
                              <li className=" hover:text-">
                                <a
                                  className="text-graphite text-sm font-titillium"
                                  href={item.url}
                                >
                                  Ver todos
                                </a>
                              </li>
                            )}
                            {item.children?.map((node, index) => (
                              <li key={`${node.name}-${index}`}>
                                <MenuItem item={node} />
                              </li>
                            ))}
                          </ul>
                        </>
                      )
                      : (
                        <>
                          <a
                            href={item.url}
                            className="py-4 ml-6 block w-full"
                            alt={item.name}
                          >
                            <span className="text-sm font-titillium font-normal text-graphite w-fulll">
                              Saiba mais
                            </span>
                          </a>
                        </>
                      )}
                  </div>
                </>
              )
              : (
                <div className="">
                  <ul className="flex flex-col gap-4 ">
                    {item.children?.map((node, index) => (
                      <li key={`${node.name}-${index}`} className={``}>
                        <MenuItem item={node} />
                      </li>
                    ))}
                    {isParent && (
                      <li className="grid place-content-center w-64 mt-4 mx-auto bg-warning">
                        <a
                          className="py-2 px-4 text-white font-semibold"
                          href={item.url}
                        >
                          Ver todos
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
          </>
        )
        : (
          <>
            <a href={item.url} className="" alt={item.name}>
              <span className="text-sm font-titillium font-normal text-graphite">
                {item.name}
              </span>
            </a>
          </>
        )}
    </div>
  );
}

function Menu({ navItems }: Props) {
  return (
    <div
      class="flex flex-col h-full overflow-y-auto bg-[#00514308]"
      style={{ minWidth: "100vw" }}
    >
      <ul class="px-4 flex-grow flex flex-col divide-y divide-base-200 ">
        {navItems.map((item) => (
          <li>
            <MenuItem item={item} isParent={true} />
          </li>
        ))}
      </ul>

      <ul class="flex flex-col pt-10 px-4 pb-7 gap-9">
        <li>
          <a
            class="flex gap-3 items-center py-1 font-roboto  font-medium font-xs  text-[#23212b]  "
            href="/wishlist"
          >
            <Icon id="wishlist" size={18} strokeWidth={2} />
            <span class="text-xs">Meus favoritos</span>
          </a>
        </li>
        <li>
          <a
            class="flex  gap-3 items-center py-1 font-roboto  font-medium font-xs  text-[#23212b] "
            href="/account"
          >
            <Icon id="bag" size={18} strokeWidth={2} />
            <span class="text-xs">Meus pedidos</span>
          </a>
        </li>
        <li>
          <a
            class="flex gap-3 items-center py-1 font-roboto  font-medium font-xs  text-[#23212b] "
            href="https://www.deco.cx"
          >
            <Icon id="Blog" size={18} strokeWidth={2} />
            <span class="text-xs">Blog</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
