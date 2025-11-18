import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Hero } from "@/components/hero";

export type ViewMode = "json" | "table";
export type EmptyValueMode = "custom" | "empty" | "null";
export type OptionsPanel = "parse" | "stringify";
export type LineEndingMode = "cr" | "crlf" | "lf";

const searchSchema = z.object({
  ce: z.string().default("N/A"),
  d: z.string().default(String.raw`\t`),
  em: z.enum(["custom", "empty", "null"]).default("null"),
  eo: z.string().default(""),
  le: z.enum(["cr", "crlf", "lf"]).default("lf"),
  op: z.enum(["parse", "stringify"]).default("parse"),
  pr: z.coerce.boolean().default(false),
  r: z.string().default(""),
  sec: z.coerce.boolean().default(false),
  ser: z.coerce.boolean().default(false),
  t: z.coerce.boolean().default(true),
  v: z.enum(["json", "table"]).default("table"),
});

export type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/")({
  component: () => {
    return (
      <main className="grid min-h-screen place-items-center">
        <Hero />
        <footer className="dsy-footer-center dsy-footer place-self-end p-4 text-base-content/50 sm:dsy-footer-horizontal">
          <aside>
            <p>
              Built by{" "}
              <a
                className="dsy-link"
                href="https://jimmy.codes"
                rel="noopener noreferrer"
                target="_blank"
              >
                Jimmy Guzman Moreno
              </a>
              .
            </p>
          </aside>
        </footer>
      </main>
    );
  },
  validateSearch: searchSchema,
});
