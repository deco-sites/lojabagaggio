import { AppContext } from "../../apps/site.ts";
import { useComponent } from "../../sections/Component.tsx";

export async function action(req: Request, _ctx: AppContext) {
    try {
        const form = await req.formData();

        console.log(form);

        const email = `${form.get("email") ?? ""}`;
        const birthDate = `${form.get("birthDate") ?? ""}`;
        const firstName = `${form.get("firstName") ?? ""}`;

        if (email && firstName && birthDate) {
            const response = await fetch(`/api/dataentities/DN/documents/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    birthDate,
                    firstName,
                }),
            });

            if (response.ok) {
                return { status: "ok" };
            } else {
                const errorMessage = await response.text();
                console.error("Failed to submit data:", errorMessage);
                return { status: "failure", error: errorMessage };
            }
        } else {
            return { status: "failure", error: "Missing required fields" };
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return { status: "failure", error: error.message };
    }
}

export default function FormFirstPurchase() {
    return (
        <div class="w-full flex justify-between max-w-[1222px] my-4">
            <form
                hx-post={useComponent(import.meta.url)}
                hx-target="closest section"
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
    );
}
