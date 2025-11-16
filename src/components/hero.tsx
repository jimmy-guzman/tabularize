import { parse } from "cliptabular";
import { useMemo, useState } from "react";

import { links } from "@/config/links";

type ViewMode = "json" | "table";
type EmptyValueMode = "custom" | "empty" | "null";

export function Hero() {
  const [raw, setRaw] = useState("");
  const [view, setView] = useState<ViewMode>("table");

  const [emptyMode, setEmptyMode] = useState<EmptyValueMode>("null");
  const [customEmpty, setCustomEmpty] = useState("N/A");
  const [skipEmptyRows, setSkipEmptyRows] = useState(false);
  const [skipEmptyCells, setSkipEmptyCells] = useState(false);
  const [padRows, setPadRows] = useState(false);
  const [trim, setTrim] = useState(true);

  const effectiveEmptyValue = useMemo(() => {
    if (emptyMode === "null") return null;
    if (emptyMode === "empty") return "";

    return customEmpty;
  }, [emptyMode, customEmpty]);

  const parsed = useMemo<(null | string)[][] | null>(() => {
    const text = raw.trim();

    if (!text) return null;

    return parse(text, {
      emptyValue: effectiveEmptyValue,
      padRows,
      skipEmptyCells,
      skipEmptyRows,
      trim,
    });
  }, [raw, effectiveEmptyValue, skipEmptyRows, skipEmptyCells, padRows, trim]);

  const columnCount = useMemo(() => {
    if (!parsed || parsed.length === 0) return 0;

    return parsed.reduce((max, row) => Math.max(row.length, max), 0);
  }, [parsed]);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">tabuluralize</h1>
        <p className="text-sm text-base-content/70">
          Paste data from Excel, Sheets, or CSV. tabuluralize uses{" "}
          <a
            className="dsy-link font-mono"
            href={links.cliptabular}
            target="__blank"
          >
            cliptabular
            <span className="icon-[lucide--external-link]"></span>
          </a>{" "}
          to turn it into structured rows.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Paste area */}
        <div className="dsy-card dsy-card-border">
          <div className="dsy-card-body">
            <label className="dsy-label" htmlFor="paste-area">
              <span className="dsy-label text-xs font-medium tracking-wide uppercase">
                Paste area
              </span>
            </label>
            <textarea
              className="dsy-textarea h-full w-full resize-none font-mono text-sm dsy-textarea-md"
              id="paste-area"
              onChange={(event) => {
                setRaw(event.target.value);
              }}
              placeholder="Paste data here from Excel, Google Sheets, or a CSV file…"
              value={raw}
            />
            <p className="dsy-label text-xs text-base-content/70">
              Use <span className="dsy-kbd dsy-kbd-xs">⌘+V</span> /{" "}
              <span className="dsy-kbd dsy-kbd-xs">Ctrl+V</span> to paste from
              your clipboard.
            </p>
          </div>
        </div>

        {/* Parsed view + options */}
        <div className="dsy-card bg-neutral text-neutral-content dsy-card-border">
          <div className="dsy-card-body p-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-base-content/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="dsy-label text-xs font-medium tracking-wide uppercase opacity-70">
                  Output
                </span>
                <span className="dsy-badge dsy-badge-sm font-mono text-[10px] dsy-badge-neutral">
                  (string | null)[][]
                </span>
              </div>

              <div className="dsy-join">
                <button
                  className={`dsy-btn dsy-join-item dsy-btn-sm ${
                    view === "table" ? "dsy-btn-active" : "dsy-btn-ghost"
                  }`}
                  onClick={() => {
                    setView("table");
                  }}
                  type="button"
                >
                  table
                </button>
                <button
                  className={`dsy-btn dsy-join-item dsy-btn-sm ${
                    view === "json" ? "dsy-btn-active" : "dsy-btn-ghost"
                  }`}
                  onClick={() => {
                    setView("json");
                  }}
                  type="button"
                >
                  json
                </button>
              </div>
            </div>

            {/* Options strip */}
            <div className="flex flex-wrap items-center gap-3 border-b border-base-content/10 px-4 py-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="dsy-label text-[11px] tracking-wide uppercase opacity-70">
                  empty cells
                </span>
                <label className="inline-flex cursor-pointer items-center gap-1">
                  <input
                    checked={emptyMode === "null"}
                    className="dsy-radio dsy-radio-xs"
                    name="empty-mode"
                    onChange={() => {
                      setEmptyMode("null");
                    }}
                    type="radio"
                    value="null"
                  />
                  <span>null</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-1">
                  <input
                    checked={emptyMode === "empty"}
                    className="dsy-radio dsy-radio-xs"
                    name="empty-mode"
                    onChange={() => {
                      setEmptyMode("empty");
                    }}
                    type="radio"
                    value="empty"
                  />
                  <span>""</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-1">
                  <input
                    checked={emptyMode === "custom"}
                    className="dsy-radio dsy-radio-xs"
                    name="empty-mode"
                    onChange={() => {
                      setEmptyMode("custom");
                    }}
                    type="radio"
                    value="custom"
                  />
                  <span>custom</span>
                </label>
                {emptyMode === "custom" ? (
                  <input
                    className="dsy-input dsy-input-xs w-20"
                    onChange={(event) => {
                      setCustomEmpty(event.target.value);
                    }}
                    placeholder="N/A"
                    type="text"
                    value={customEmpty}
                  />
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-1">
                  <input
                    checked={padRows}
                    className="dsy-checkbox dsy-checkbox-xs"
                    onChange={(event) => {
                      setPadRows(event.target.checked);
                    }}
                    type="checkbox"
                  />
                  <span>pad rows</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-1">
                  <input
                    checked={skipEmptyRows}
                    className="dsy-checkbox dsy-checkbox-xs"
                    onChange={(event) => {
                      setSkipEmptyRows(event.target.checked);
                    }}
                    type="checkbox"
                  />
                  <span>skip empty rows</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-1">
                  <input
                    checked={skipEmptyCells}
                    className="dsy-checkbox dsy-checkbox-xs"
                    onChange={(event) => {
                      setSkipEmptyCells(event.target.checked);
                    }}
                    type="checkbox"
                  />
                  <span>skip empty cells</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-1">
                  <input
                    checked={trim}
                    className="dsy-checkbox dsy-checkbox-xs"
                    onChange={(event) => {
                      setTrim(event.target.checked);
                    }}
                    type="checkbox"
                  />
                  <span>trim</span>
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              {parsed ? (
                view === "json" ? (
                  <pre className="h-64 overflow-auto text-xs leading-relaxed">
                    {JSON.stringify(parsed, null, 2)}
                  </pre>
                ) : (
                  <div className="h-64 overflow-auto">
                    <table className="dsy-table-pin-rows not-prose dsy-table dsy-table-zebra dsy-table-xs">
                      <thead>
                        <tr>
                          {Array.from({ length: columnCount }).map(
                            (_, colIndex) => {
                              const headerCell = parsed[0]?.[colIndex] ?? "";

                              return (
                                <th
                                  // eslint-disable-next-line react-x/no-array-index-key -- OK for demo
                                  key={colIndex}
                                >
                                  {headerCell || (
                                    <span className="opacity-30"> </span>
                                  )}
                                </th>
                              );
                            },
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.slice(1).map((row, rowIndex) => {
                          return (
                            <tr
                              // eslint-disable-next-line react-x/no-array-index-key -- OK for demo
                              key={rowIndex}
                            >
                              {Array.from({ length: columnCount }).map(
                                (_, colIndex) => {
                                  const cell = row[colIndex] as
                                    | null
                                    | string
                                    | undefined;

                                  return (
                                    <td
                                      // eslint-disable-next-line react-x/no-array-index-key -- OK for demo
                                      key={colIndex}
                                    >
                                      {cell ?? ""}
                                    </td>
                                  );
                                },
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="flex h-64 dsy-skeleton items-center justify-center text-xs opacity-50">
                  Parsed output will appear here after you paste some data.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
