import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="Bell" />
   */
  id: string;
  size?: number;
}

function CategoryIcon(
  { id, strokeWidth = 16, size, width, height, ...otherProps }: Props,
) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
      strokeWidth={strokeWidth}
    >
      <use href={asset(`/category.svg#${id}`)} />
    </svg>
  );
}

export default CategoryIcon;
