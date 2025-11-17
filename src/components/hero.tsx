import { parse, stringify } from "cliptabular";
import { useMemo, useState } from "react";

import type { LineEndingMode } from "@/routes";

import { links } from "@/config/links";
import { useHeroSearch } from "@/hooks/use-tabularize-search";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const {
    customEmpty,
    delimiterInput,
    emptyMode,
    emptyOutput,
    lineEndingMode,
    optionsPanel,
    padRows,
    raw,
    setCustomEmpty,
    setDelimiterInput,
    setEmptyMode,
    setEmptyOutput,
    setLineEndingMode,
    setOptionsPanel,
    setPadRows,
    setRaw,
    setSkipEmptyCells,
    setSkipEmptyRows,
    setTrim,
    setView,
    skipEmptyCells,
    skipEmptyRows,
    trim,
    view,
  } = useHeroSearch();

  const delimiter = useMemo(() => {
    return delimiterInput === String.raw`\t` ? "\t" : delimiterInput;
  }, [delimiterInput]);

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

  const lineEnding =
    lineEndingMode === "lf" ? "\n" : lineEndingMode === "cr" ? "\r" : "\r\n";

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">tabularize</h1>
        <p className="text-sm text-base-content/70">
          Paste data from Excel, Sheets, or CSV. tabularize uses{" "}
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

              <div className="flex items-center gap-2">
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

                <button
                  className="dsy-btn dsy-btn-ghost dsy-btn-sm"
                  disabled={!parsed}
                  onClick={async () => {
                    if (!parsed) return;

                    try {
                      const text = stringify(parsed, {
                        // @ts-expect-error -- cliptabular types need updating
                        delimiter,
                        emptyOutput,
                        emptyValue: effectiveEmptyValue,
                        lineEnding,
                      });

                      await navigator.clipboard.writeText(text);
                      setCopied(true);
                      globalThis.setTimeout(() => {
                        setCopied(false);
                      }, 1500);
                    } catch {
                      // Swallow for now; could add toast/logging later
                    }
                  }}
                  type="button"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Options strip */}
            <div className="border-b border-base-content/10 px-4 py-3 text-xs">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="dsy-label text-[11px] tracking-wide uppercase opacity-70">
                  Options
                </span>
                <div className="dsy-join">
                  <button
                    className={`dsy-btn dsy-join-item dsy-btn-xs ${
                      optionsPanel === "parse"
                        ? "dsy-btn-active"
                        : "dsy-btn-ghost"
                    }`}
                    onClick={() => {
                      setOptionsPanel("parse");
                    }}
                    type="button"
                  >
                    Parse
                  </button>
                  <button
                    className={`dsy-btn dsy-join-item dsy-btn-xs ${
                      optionsPanel === "stringify"
                        ? "dsy-btn-active"
                        : "dsy-btn-ghost"
                    }`}
                    onClick={() => {
                      setOptionsPanel("stringify");
                    }}
                    type="button"
                  >
                    Stringify
                  </button>
                </div>
              </div>

              {/* Shared empty value controls */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="dsy-label tracking-wide capitalize">
                  empty value
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
                  />
                  <span>custom</span>
                </label>
                {emptyMode === "custom" ? (
                  <input
                    className="dsy-input dsy-input-xs w-20 font-mono"
                    onChange={(event) => {
                      setCustomEmpty(event.target.value);
                    }}
                    placeholder="N/A"
                    type="text"
                    value={customEmpty}
                  />
                ) : null}
              </div>

              {/* Panel-specific options */}
              <div className="min-h-28">
                {optionsPanel === "parse" ? (
                  <div className="flex flex-col gap-3">
                    {/* pad rows */}
                    <label className="inline-flex cursor-pointer items-center gap-2 capitalize">
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

                    {/* skip empty rows */}
                    <label className="inline-flex cursor-pointer items-center gap-2 capitalize">
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

                    {/* skip empty cells */}
                    <label className="inline-flex cursor-pointer items-center gap-2 capitalize">
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

                    {/* trim */}
                    <label className="inline-flex cursor-pointer items-center gap-2 capitalize">
                      <input
                        checked={trim}
                        className="dsy-checkbox dsy-checkbox-xs"
                        onChange={(event) => {
                          setTrim(event.target.checked);
                        }}
                        type="checkbox"
                      />
                      <span>trim whitespace</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* delimiter */}
                    <label className="inline-flex items-center gap-2 capitalize">
                      <span className="text-xs opacity-70">delimiter</span>
                      <input
                        className="dsy-input dsy-input-xs w-16 font-mono"
                        onChange={(event) => {
                          setDelimiterInput(event.target.value);
                        }}
                        placeholder="\t"
                        type="text"
                        value={delimiterInput}
                      />
                    </label>

                    {/* line ending */}
                    <label className="inline-flex items-center gap-2 capitalize">
                      <span className="text-xs opacity-70">line ending</span>
                      <select
                        className="dsy-select dsy-select-xs font-mono"
                        onChange={(event) => {
                          setLineEndingMode(
                            event.target.value as LineEndingMode,
                          );
                        }}
                        value={lineEndingMode}
                      >
                        <option value="lf">\n</option>
                        <option value="cr">\r</option>
                        <option value="crlf">\r\n</option>
                      </select>
                    </label>

                    {/* empty output */}
                    <label className="inline-flex items-center gap-2 capitalize">
                      <span className="text-xs opacity-70">empty output</span>
                      <input
                        className="dsy-input dsy-input-xs w-20 font-mono"
                        onChange={(event) => {
                          setEmptyOutput(event.target.value);
                        }}
                        placeholder='""'
                        type="text"
                        value={emptyOutput}
                      />
                    </label>
                  </div>
                )}
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
                  <div className="h-64 overflow-auto bg-base-100 text-base-content">
                    <table className="dsy-table-pin-rows dsy-table dsy-table-zebra dsy-table-xs">
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
