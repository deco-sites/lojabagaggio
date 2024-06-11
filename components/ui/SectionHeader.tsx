import { clx } from "../../sdk/clx.ts";

export interface Props {
  title?: string;
  description?: string;
  alignment?: "center" | "left";
  colorReverse?: boolean;
}

function Header({ title, description, colorReverse, alignment }: Props) {
  if (!title && !description) {
    return null;
  }

  return (
    <div
      class={clx(
        `flex flex-col gap-2`,
        alignment === "left" ? "text-left" : "text-center",
      )}
    >
      {title && (
        <h2
          class={clx(
            "sm:text-2xl",
            colorReverse ? "text-primary-content" : "text-base-content",
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <h3
          class={clx(
            "leading-6 font-light lg:leading-8 lg:text-2xl",
            colorReverse ? "text-primary-content" : "text-base-content",
          )}
        >
          {description}
        </h3>
      )}
    </div>
  );
}

export default Header;
