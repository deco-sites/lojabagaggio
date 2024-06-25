import { MINICART_FORM_ID } from "../../constants.ts";

export interface Props {
  coupon?: string;
}

function Coupon({ coupon }: Props) {
  return (
    <div class="flex justify-between items-center px-4">
      <span class="text-sm">Cupom de desconto</span>

      <div class="join">
        <input
          form={MINICART_FORM_ID}
          name="coupon"
          class="input join-item"
          type="text"
          value={coupon ?? ""}
          placeholder={"Cupom"}
        />
        <button
          form={MINICART_FORM_ID}
          class="btn join-item"
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
