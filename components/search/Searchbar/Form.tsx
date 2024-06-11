/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */

import { Suggestion } from "apps/commerce/types.ts";
import { scriptAsDataURI } from "apps/utils/dataURI.ts";
import { asResolved, Resolved } from "deco/mod.ts";
import {
  SEARCHBAR_INPUT_FORM_ID,
  SEARCHBAR_POPUP_ID,
} from "../../../constants.ts";
import { useId } from "../../../sdk/useId.ts";
import { useComponent } from "../../../sections/Component.tsx";
import Icon from "../../ui/Icon.tsx";
import { Props as SuggestionProps } from "./Suggestions.tsx";

// When user clicks on the search button, navigate it to
export const ACTION = "/s";
// Querystring param used when navigating the user
export const NAME = "q";

export interface SearchbarProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;

  /** @description Loader to run when suggesting new elements */
  loader: Resolved<Suggestion | null>;
}

const script = (formId: string, name: string, popupId: string) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const input = form?.elements.namedItem(name) as HTMLInputElement | null;
  form?.addEventListener("submit", () => {
    const search_term = input?.value;
    if (search_term) {
      globalThis.window.DECO.events.dispatch({
        name: "search",
        params: { search_term },
      });
    }
  });

  // Keyboard event listeners
  addEventListener("keydown", (e: KeyboardEvent) => {
    const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;

    // Open Searchbar on meta+k
    if (e.metaKey === true && isK) {
      const input = document.getElementById(popupId) as
        | HTMLInputElement
        | null;

      if (input) {
        input.checked = true;

        document.getElementById(formId)?.focus();
      }
    }
  });
};

const Suggestions = import.meta.resolve("./Suggestions.tsx");

export default function Searchbar(
  { placeholder = "What are you looking for?", loader }: SearchbarProps,
) {
  const slot = useId();

  return (
    <div class="w-full gap-8">
      <form
        id={SEARCHBAR_INPUT_FORM_ID}
        action={ACTION}
        class="flex pl-4 pr-2 justify-between join rounded-none sm:rounded-full border-y-[1px] sm:border-[1px] border-base-200 w-full sm:w-[480px] h-[42px] relative"
      >
        <input
          tabIndex={0}
          class="w-full text-xs border-none outline-none"
          name={NAME}
          placeholder={placeholder}
          autocomplete="off"
          hx-target={`#${slot}`}
          hx-post={loader && useComponent<SuggestionProps>(Suggestions, {
            loader: asResolved(loader),
          })}
          hx-trigger={`input changed delay:300ms, ${NAME}`}
          hx-indicator={`#${SEARCHBAR_INPUT_FORM_ID}`}
          hx-swap="innerHTML"
        />
        <button
          type="submit"
          class=""
          aria-label="Search"
          for={SEARCHBAR_INPUT_FORM_ID}
          tabIndex={-1}
        >
          <Icon
            class="inline text-primary"
            id="MagnifyingGlass"
            size={24}
            strokeWidth={0.01}
          />
        </button>
      </form>

      {/* Suggestions slot */}
      <div id={slot} class="absolute" />

      {/* Send search events as the user types */}
      <script
        type="module"
        src={scriptAsDataURI(
          script,
          SEARCHBAR_INPUT_FORM_ID,
          NAME,
          SEARCHBAR_POPUP_ID,
        )}
      />
    </div>
  );
}
