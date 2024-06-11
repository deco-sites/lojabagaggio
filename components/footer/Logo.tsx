import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  logo?: {
    image: ImageWidget;
    description?: string;
  };
}

export default function Logo({ logo }: Props) {
  return (
    <>
      {logo?.image && (
        <Image
          loading="lazy"
          src={logo?.image}
          alt={logo?.description}
          width={75}
          height={75}
        />
      )}
    </>
  );
}
