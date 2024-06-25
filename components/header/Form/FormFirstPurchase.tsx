import { AppContext } from "../../../apps/site.ts";
import { useComponent } from "../../../sections/Component.tsx";
import Section from "../../ui/Section.tsx";
import { SectionProps } from "deco/mod.ts";

interface NoticeProps {
  title?: string;
  description?: string;
}

export interface Props {
  empty?: NoticeProps;
  success?: NoticeProps;
  failed?: NoticeProps;

  /** @description Signup label */
  label?: string;

  /** @description Input placeholder */
  placeholder?: string;

  /** @hide true */
  status?: "success" | "failed";
}

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  const email = `${form.get("email") ?? ""}`;
  const birthDate = `${form.get("birthDate") ?? ""}`;
  const firstName = `${form.get("firstName") ?? ""}`;

  if (email && firstName && birthDate) {
    // deno-lint-ignore no-explicit-any
    await (ctx as any).invoke("vtex/actions/masterdata/createDocument.ts", {
      acronym: "DN",
      data: {
        email,
        birthDate,
        firstName,
      },
    });

    return { ...props, status: "success" };
  }

  return { ...props, status: "failed" };
}

export function loader(props: Props) {
  return { ...props, status: undefined };
}

function Notice(
  { description }: { title?: string; description?: string },
) {
  return (
    <div class="flex flex-col justify-center items-center sm:items-start">
      <span class="text-sm font-normal text-white text-center sm:text-start">
        {description}
      </span>
    </div>
  );
}

export default function FormFirstPurchase({
  success = {
    description:
      "Agora é só checar no seu e-mail o cupom que deixamos para você",
  },
  failed = {
    description:
      "Something went wrong. Please try again. If the problem persists, please contact us.",
  },
  status,
}: SectionProps<typeof loader, typeof action>) {
  if (status === "success" || status === "failed") {
    return (
      <Section.Container class="">
        <div class="p-14 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
          <Notice {...status === "success" ? success : failed} />
        </div>
      </Section.Container>
    );
  }

  return (
    <Section.Container class="">
      <div class="w-full flex flex-col justify-between max-w-[1222px] my-4">
        <form
          hx-post={useComponent(import.meta.url)}
          hx-target="this"
          hx-swap="outerHTML"
          class="w-full flex justify-between items-center gap-4"
        >
          <input
            type="text"
            placeholder={"Nome"}
            name="firstName"
            class=" rounded-[10px] bg-white border border-[#cecece] h-[46px] text-graphite px-4 w-[30%] max-w-80"
            required
          />
          <input
            type="date"
            id=""
            name="birthDate"
            class=" rounded-[10px] bg-white border border-[#cecece] h-[46px] text-graphite px-4 w-[30%] max-w-80"
            placeholder={`dd/mm/aaaa`}
            required
          />
          <input
            type="email"
            name="email"
            id=""
            class=" rounded-[10px] bg-white border border-[#cecece] h-[46px] text-graphite px-4 w-[40%] max-w-[489px]"
            placeholder="E-mail"
            required
          />
          <button
            type="submit"
            class="bg-graphite w-full max-w-[104px]  text-white btn rounded-[23px] border-transparent h-[46px] font-medium font-roboto  "
          >
            <span class="[.htmx-request_&]:hidden inline">
              Enviar
            </span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
          </button>
        </form>
      </div>
    </Section.Container>
  );
}
