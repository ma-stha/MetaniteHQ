"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV } from "./nav";

type Item = { label: string; href: string; group: string };

/**
 * Cmd+K palette. Stage 1 lists navigation only. Later stages add clients and
 * engagements by passing `extra` items from the server.
 */
export function CommandPalette({ extra = [] }: { extra?: Item[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const items = useMemo<Item[]>(
    () => [...NAV.map((n) => ({ label: n.label, href: n.href, group: "Go to" })), ...extra],
    [extra],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setQuery("");
            setIndex(0);
          }
          return !o;
        });
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function openPalette() {
    setQuery("");
    setIndex(0);
    setOpen(true);
  }

  function go(item: Item) {
    setOpen(false);
    router.push(item.href);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="flex h-9 w-72 items-center gap-2 rounded-sm border border-line bg-bg-2 px-3 text-sm text-muted hover:border-muted"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="rounded-sm border border-line bg-bg-3 px-1 text-[11px]">⌘K</kbd>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-bg/80 pt-[15vh]" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-label="Command palette"
            className="w-full max-w-lg rounded-sm border border-line bg-bg-2 shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-line px-3">
              <Search size={16} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIndex((i) => Math.min(results.length - 1, i + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIndex((i) => Math.max(0, i - 1));
                  } else if (e.key === "Enter" && results[index]) {
                    go(results[index]);
                  }
                }}
                placeholder="Type to search"
                className="h-12 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-muted"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? <li className="px-3 py-6 text-center text-sm text-muted">No matches.</li> : null}
              {results.map((item, i) => (
                <li key={item.href + item.label}>
                  <button
                    type="button"
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => go(item)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm",
                      i === index ? "bg-green-dim text-green" : "text-text",
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-muted">{item.group}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
