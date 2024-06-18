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
  const color = hasOutlet ? "text-primary" : "text-graphite";

  return (
    <div
      className={`${
        (hasChildren || isParent)
          ? "collapse collapse-arrow "
          : "collapse-title !px-0 !text-sm flex items-center justify-between"
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
                    <span className={`first-letter:capitalize ${color}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="collapse-content">
                    {hasChildren
                      ? (
                        <>
                          <ul>
                            {isParent && (
                              <li className="">
                                <a
                                  className="py-2 text-graphite text-sm font-titillium"
                                  href={item.url}
                                >
                                  Ver todos
                                </a>
                              </li>
                            )}
                            {item.children?.map((node) => (
                              <li key={node.name}>
                                <MenuItem item={node} />
                              </li>
                            ))}
                          </ul>
                        </>
                      )
                      : (
                        <>
                          <a href={item.url} className="" alt={item.name}>
                            <span className="text-sm font-titillium font-normal text-graphite">
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
                  <ul>
                    {item.children?.map((node) => (
                      <li key={node.name}>
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

      <ul class="flex flex-col py-2">
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="/wishlist"
          >
            <Icon id="wishlist" size={24} strokeWidth={2} />
            <span class="text-sm">Meus favoritos</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="/account"
          >
            <Icon id="bag" size={24} strokeWidth={2} />
            <span class="text-sm">Meus pedidos</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="Phone" size={24} strokeWidth={2} />
            <span class="text-sm">Blog</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
