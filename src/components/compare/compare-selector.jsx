import { useEffect, useRef, useState } from "react";
import { COMPARE_BODIES } from "../../data/celestial-bodies";

/**
 * One lightweight searchable picker for both compare viewports.
 * It opens to the left of the Fit to View button, with no initial result list.
 */
export function CompareSelector({
  side,
  anchorRect,
  currentBody,
  onSelect,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase("en-US");
  const matches = normalizedQuery
    ? Object.values(COMPARE_BODIES).filter((body) =>
        body.name.toLocaleLowerCase("en-US").includes(normalizedQuery),
      )
    : [];

  // Desktop: keep the search next to the existing Fit to View control,
  // without moving the header buttons. On narrow screens open below the control.
  const viewportWidth =
    typeof window === "undefined" ? 1440 : window.innerWidth;
  const viewportHeight =
    typeof window === "undefined" ? 900 : window.innerHeight;
  const width = Math.min(328, viewportWidth - 24);
  const fitsLeftOfFitButton = Boolean(
    anchorRect && anchorRect.left - width - 10 >= 12,
  );
  const left = !anchorRect
    ? Math.max(12, (viewportWidth - width) / 2)
    : fitsLeftOfFitButton
      ? anchorRect.left - width - 10
      : Math.min(Math.max(12, anchorRect.left), viewportWidth - width - 12);
  const top = !anchorRect
    ? 88
    : fitsLeftOfFitButton
      ? anchorRect.top
      : anchorRect.bottom + 8;
  const maxHeight = Math.max(72, viewportHeight - top - 12);

  return (
    <div className="fixed inset-0 z-40" role="presentation">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-label={`Choose ${side} celestial body`}
        className="absolute flex flex-col overflow-hidden rounded-md border border-white/15 bg-[#06070a] font-serif text-white shadow-[0_10px_24px_rgba(0,0,0,0.4)]"
        style={{ left, top, width, maxHeight }}
      >
        <div
          className={`flex h-8 shrink-0 items-center gap-2.5 px-3.5 sm:h-9 ${normalizedQuery ? "border-b border-white/10" : ""}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4 shrink-0 text-white/50"
          >
            <circle cx="10.8" cy="10.8" r="6.7" />
            <path d="m16 16 5 5" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search celestial bodies..."
            aria-label={`Search for ${side} celestial body`}
            autoComplete="off"
            className="min-w-0 flex-1 appearance-none bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />

          <button
            type="button"
            onClick={query ? () => setQuery("") : onClose}
            aria-label={query ? "Clear search" : "Close selection"}
            title={query ? "Clear search" : "Close"}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-lg leading-none text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            ×
          </button>
        </div>

        {normalizedQuery && (
          <div className="space-scroll min-h-0 max-h-[280px] overflow-y-auto py-1">
            {matches.length === 0 ? (
              <p className="px-3.5 py-3 text-sm text-white/45">
                No results found.
              </p>
            ) : (
              matches.map((body) => {
                const selected = currentBody === body.name;
                return (
                  <button
                    key={body.name}
                    type="button"
                    onClick={() => onSelect(body.name)}
                    aria-current={selected ? "true" : undefined}
                    className="block w-full px-3.5 py-2.5 text-left text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:text-white focus-visible:outline-none"
                  >
                    <span>{body.name}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompareSelector;
