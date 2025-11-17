import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useCallback, useMemo } from "react";

import type {
  EmptyValueMode,
  LineEndingMode,
  OptionsPanel,
  SearchParams,
  ViewMode,
} from "@/routes";

export function useHeroSearch() {
  const navigate = useNavigate({ from: "/" });
  const search = useSearch({ from: "/" });

  const setSearch = useCallback(
    (updater: (prev: SearchParams) => SearchParams) => {
      void navigate({
        replace: true,
        search: (prev) => updater(prev as SearchParams),
        to: ".",
      });
    },
    [navigate],
  );

  const { r: rawEncoded } = search;
  const raw = useMemo(() => {
    if (!rawEncoded) return "";
    const decompressed = decompressFromEncodedURIComponent(rawEncoded);

    return typeof decompressed === "string" ? decompressed : "";
  }, [rawEncoded]);

  const setRaw = useCallback(
    (value: string) => {
      const compressed = value ? compressToEncodedURIComponent(value) : "";

      setSearch((prev) => ({ ...prev, r: compressed }));
    },
    [setSearch],
  );

  const { v: view } = search;
  const setView = useCallback(
    (value: ViewMode) => {
      setSearch((prev) => ({ ...prev, v: value }));
    },
    [setSearch],
  );

  const { em: emptyMode } = search;
  const setEmptyMode = useCallback(
    (value: EmptyValueMode) => {
      setSearch((prev) => ({ ...prev, em: value }));
    },
    [setSearch],
  );

  const { ce: customEmpty } = search;
  const setCustomEmpty = useCallback(
    (value: string) => {
      setSearch((prev) => ({ ...prev, ce: value }));
    },
    [setSearch],
  );

  const { ser: skipEmptyRows } = search;
  const setSkipEmptyRows = useCallback(
    (value: boolean) => {
      setSearch((prev) => ({ ...prev, ser: value }));
    },
    [setSearch],
  );

  const { sec: skipEmptyCells } = search;
  const setSkipEmptyCells = useCallback(
    (value: boolean) => {
      setSearch((prev) => ({ ...prev, sec: value }));
    },
    [setSearch],
  );

  const { pr: padRows } = search;
  const setPadRows = useCallback(
    (value: boolean) => {
      setSearch((prev) => ({ ...prev, pr: value }));
    },
    [setSearch],
  );

  const { t: trim } = search;
  const setTrim = useCallback(
    (value: boolean) => {
      setSearch((prev) => ({ ...prev, t: value }));
    },
    [setSearch],
  );

  const { op: optionsPanel } = search;
  const setOptionsPanel = useCallback(
    (value: OptionsPanel) => {
      setSearch((prev) => ({ ...prev, op: value }));
    },
    [setSearch],
  );

  const { d: delimiterInput } = search;
  const setDelimiterInput = useCallback(
    (value: string) => {
      setSearch((prev) => ({ ...prev, d: value }));
    },
    [setSearch],
  );

  const { le: lineEndingMode } = search;
  const setLineEndingMode = useCallback(
    (value: LineEndingMode) => {
      setSearch((prev) => ({ ...prev, le: value }));
    },
    [setSearch],
  );

  const { eo: emptyOutput } = search;
  const setEmptyOutput = useCallback(
    (value: string) => {
      setSearch((prev) => ({ ...prev, eo: value }));
    },
    [setSearch],
  );

  return {
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
  };
}
