import { Suggestion } from "apps/commerce/types.ts";
import { Resolved } from "deco/mod.ts";
import type { AppContext } from "../../../apps/site.ts";
import { clx } from "../../../sdk/clx.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import Icon from "../../ui/Icon.tsx";
import { ACTION, NAME } from "./Form.tsx";
import ProductCardSearch from "../../product/ProductCardSearch.tsx";

export interface Props {
  /**
   * @title Suggestions Integration
   * @todo: improve this typings ({query: string, count: number}) => Suggestions
   */
  loader: Resolved<Suggestion | null>;
}

export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;

  const form = await req.formData();
  const query = `${form.get(NAME ?? "q")}`;

  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;

  return { suggestion };
};

export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;

  const query = new URL(req.url).searchParams.get(NAME ?? "q");

  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;

  return { suggestion };
};

function Suggestions(
  { suggestion }: ComponentProps<typeof loader, typeof action>,
) {
  const { products = [], searches = [] } = suggestion ?? {};
  const hasProducts = Boolean(products.length);
  const hasTerms = Boolean(searches.length);
  const firstTerm = searches[0].term;
  const countProduct = (searches[0] as { term: string; count: number }).count;

  return (
    <div
      class={clx(
        ` w-full flex justify-center items-center`,
        !hasProducts && !hasTerms && "hidden",
      )}
    >
      <div class="gap-4 overflow-y-auto scroll-p-0 flex flex-col shadow-inner  rounded-b bg-white w-[90%]  sm:w-full max-w-[810px] h-full max-h-96 pb-[.3125rem]">
        <div class="flex flex-col gap-6 p-2">
          <ul class="flex flex-col gap-6">
            <li>
              {/* TODO @gimenes: use name and action from searchbar form */}
              <a
                href={`${ACTION}?${NAME}=${firstTerm}`}
                class="flex gap-2 items-center lg:font-base text-[#3f3f3f] sm:py-1 sm:px-5"
              >
                <span>
                  <Icon
                    id="Lupa"
                    size={20}
                    class="hidden sm:block"
                    strokeWidth={0.01}
                  />
                </span>
                <span class="block sm:hidden  text-[#979899]">
                  Buscar por:
                </span>

                <span class="block sm:hidden text-[#3f3f40]  ">
                  "{firstTerm}"
                </span>

                <span class="hidden sm:block">
                  {firstTerm}
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div class="flex flex-col pt-6 md:pt-0">
          {products.map((product, index) => (
            <div class="">
              <ProductCardSearch
                product={product}
                index={index}
                itemListName="Suggeestions"
              />
            </div>
          ))}
          <div class="w-full flex items-center justify-center lg:h-14 p-3">
            <a
              href={`${ACTION}?${NAME}=${firstTerm}`}
              class=" underline text-[#787878] text-[13px] "
            >
              Ver todos os {countProduct} produtos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
