export type Item = {
  label: string;
  href: string;
};

export type Section = {
  label: string;
  items: Item[];
};

export default function FooterItems(
  { sections }: { sections: Section[] },
) {
  return (
    <>
      {sections.length > 0 && (
        <>
          {/* Tablet and Desktop view */}
          <ul
            class={`hidden sm:flex flex-row sm:gap-6 lg:justify-between`}
          >
            {sections.map((section) => (
              <li>
                <div class="flex flex-col gap-2">
                  <span class="font-bold text-sm">
                    {section.label}
                  </span>
                  <ul class={`flex flex-col flex-wrap text-xs`}>
                    {section.items?.map((item) => (
                      <li>
                        <a href={item.href} class="block py-1 link link-hover">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          {/* Mobile view */}
          <ul class="flex flex-col md:hidden gap-2">
            {sections.map((section) => (
              <li>
                <div class="collapse collapse-arrow ">
                  <input id={section.label} type="checkbox" class="min-h-[0]" />
                  <label
                    htmlFor={section.label}
                    class="collapse-title min-h-[0] flex gap-2 py-4"
                  >
                    <span>{section.label}</span>
                  </label>
                  <div class="collapse-content">
                    <ul
                      class={`flex flex-col gap-1 pl-5 pt-2`}
                    >
                      {section.items?.map((item) => (
                        <li>
                          <a
                            href={item.href}
                            class="block py-1 link link-hover"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
