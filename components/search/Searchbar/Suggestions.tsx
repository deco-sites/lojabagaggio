import { Suggestion } from "apps/commerce/types.ts";
import { Resolved } from "deco/mod.ts";
import type { AppContext } from "../../../apps/site.ts";
import { clx } from "../../../sdk/clx.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import ProductCard from "../../product/ProductCard.tsx";
import { ACTION, NAME } from "./Form.tsx";

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

  return (
    <div
      class={clx(
        !hasProducts && !hasTerms && "hidden",
        "bg-white max-w-[520px]",
      )}
    >
      <div class="flex flex-col">
        <div class="flex flex-col gap-2 p-5">
          <span
            class="text-sm"
            role="heading"
            aria-level={3}
          >
            Sugestões
          </span>
          <ul class="flex flex-col gap-1">
            {searches.map(({ term }) => (
              <li>
                {/* TODO @gimenes: use name and action from searchbar form */}
                <a
                  href={`${ACTION}?${NAME}=${term}`}
                  class="flex gap-4 items-center"
                >
                  <span
                    class="text-sm"
                    dangerouslySetInnerHTML={{ __html: term }}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div class="flex flex-col md:pt-0 gap-6 overflow-x-hidden max-h-[300px]">
          <div class="flex flex-col gap-2 px-5">
            {products.map((product, index) => (
              <ProductCard
                product={product}
                index={index}
                itemListName="Suggestions"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
