import { MINICART_FORM_ID } from "../../constants.ts";

export interface Props {
  coupon?: string;
}

function Coupon({ coupon }: Props) {
  return (
    <div class="flex justify-between items-center px-4 mb-5">
      <span class="font-medium  text-xs text-graphite uppercase font-roboto">Cupom de desconto</span>

      <div class="join max-w-[222px] ml-3">
        <input
          form={MINICART_FORM_ID}
          name="coupon"
          class="input join-item border focus:outline-none  !border-warning w-full max-w-36 !h-10 rounded-l-lg font-roboto  text-xs  text-graphite "
          type="text"
          value={coupon ?? ""}
          placeholder={"Digite seu cupom"}
        />
        <button
          form={MINICART_FORM_ID}
          class="btn join-item min-h-10  !hover:brightness-90 !h-10 bg-warning border border-warning cursor-pointer !w-[97px] text-sm text-white rounded-r-lg "
          name="action"
          value="set-coupon"
        >
          Ok
        </button>
      </div>
    </div>
  );
}

export default Coupon;
