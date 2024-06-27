/**
 * TODO: support other platforms. Currently only for VTEX
 */
import { AppContext } from "apps/vtex/mod.ts";
import type { SKU, Sla } from "apps/vtex/utils/types.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import { formatPrice } from "../../../sdk/format.ts";
import { MINICART_FORM_ID } from "../../../constants.ts";

export interface Props {
  items: SKU[];
}

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  try {
    const result = await ctx.invoke.vtex.actions.cart.simulation({
      items: props.items,
      postalCode: `${form.get("postalCode") ?? ""}`,
      country: "BRA",
    });

    return { result };
  } catch {
    return { result: null };
  }
}

export default function Results({ result }: ComponentProps<typeof action>) {
  const methods = result?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  const minPriceMethod = methods.reduce((min, method) => {
    return method.price < min.price ? method : min;
  }, methods[0]);

  console.log(minPriceMethod.price, "valor");

  if (!minPriceMethod.price) {
    return (
      <div class="p-2" form={MINICART_FORM_ID}>
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <div class="w-full flex justify-between p-4 font-roboto font-base text-[#777] font-semibold">
      <span>FRETE</span>
      <span form={MINICART_FORM_ID} class="">
        {formatPrice(minPriceMethod.price / 100, "BRL", "pt-BR")}
      </span>
    </div>
  );
}
