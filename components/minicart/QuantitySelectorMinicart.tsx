import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";

function QuantitySelectorMinicart(
    { id = useId(), disabled, ...props }: JSX.IntrinsicElements["select"],
) {
    const min = Number(props.min);
    const max = Number(props.max);

    return (
        <div class="join rounded-lg border  border-primary  font-robot">
            <div
                data-tip={`Quantity must be between ${props.min} and ${props.max}`}
                class={clx(
                    "flex-grow-0 px-1  border-none !border-transparent",
                    "flex justify-center items-center",
                    "has-[:invalid]:tooltip has-[:invalid]:tooltip-error has-[:invalid]:tooltip-open has-[:invalid]:tooltip-bottom",
                )}
            >
                <select
                    id={id}
                    class={clx(
                        "select  border-none focus:outline-none !border-transparent text-center p-0 flex-grow-0",
                        "invalid:select-error",
                        "meu-select",
                    )}
                    disabled={disabled}
                    inputMode="numeric"
                    value={props.value}
                    {...props}
                >
                    {Array.from(
                        { length: Math.min(11, max - min + 1) },
                        (_, i) => {
                            const value = min + i;
                            let optionText = value === 0
                                ? `${value} - Remover`
                                : value.toString();
                            optionText = value === 10
                                ? `${value} +`
                                : optionText;

                            return (
                                <option
                                    value={value}
                                    key={value}
                                    disabled={disabled}
                                >
                                    {optionText}
                                </option>
                            );
                        },
                    )}
                </select>
            </div>
        </div>
    );
}

export default QuantitySelectorMinicart;
