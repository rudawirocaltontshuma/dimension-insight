"use client";

import * as React from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { formatCurrency, formatNumber, formatPercent, formatSigned } from "@/data/dimension-insight/format";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { cn } from "@/lib/utils";

import { DimensionInsightDataTable } from "./data-table";
import { StatusPill } from "./ui-blocks";

export type QuickRow = Record<string, string | number>;

export type QuickFormat = "text" | "currency" | "compactCurrency" | "number" | "percent" | "signed" | "status";

export interface QuickColumn {
  key: string;
  header: string;
  format?: QuickFormat;
  align?: "left" | "right";
  /** Maps a status value to a pill tone. */
  tones?: Record<string, "positive" | "warning" | "negative" | "neutral" | "info">;
}

function renderValue(value: string | number, column: QuickColumn) {
  switch (column.format) {
    case "currency":
      return formatCurrency(Number(value));
    case "compactCurrency":
      return formatCurrency(Number(value), { compact: true });
    case "number":
      return formatNumber(Number(value));
    case "percent":
      return formatPercent(Number(value));
    case "signed":
      return (
        <span
          className={cn(
            Number(value) > 0 && "text-emerald-600 dark:text-emerald-400",
            Number(value) < 0 && "text-rose-600 dark:text-rose-400",
          )}
        >
          {formatSigned(Number(value))}
        </span>
      );
    case "status":
      return <StatusPill status={String(value)} tone={column.tones?.[String(value)] ?? "neutral"} />;
    default:
      return String(value);
  }
}

export function QuickTable({
  rows,
  columns,
  searchPlaceholder,
  pageSize = 10,
  showSearch = true,
  showColumnToggle = true,
  toolbar,
}: {
  rows: QuickRow[];
  columns: QuickColumn[];
  searchPlaceholder?: string;
  pageSize?: number;
  showSearch?: boolean;
  showColumnToggle?: boolean;
  toolbar?: React.ReactNode;
}) {
  const tableColumns = React.useMemo<ColumnDef<DataTableFeatures, QuickRow>[]>(
    () =>
      columns.map((column) => ({
        id: column.key,
        accessorKey: column.key,
        header: column.header,
        enableSorting: true,
        enableHiding: true,
        cell: ({ row }) => {
          const value = row.original[column.key];
          const numeric = column.format && column.format !== "text" && column.format !== "status";
          return (
            <div className={cn(numeric || column.align === "right" ? "text-right tabular-nums" : "text-left")}>
              {renderValue(value ?? "", column)}
            </div>
          );
        },
      })),
    [columns],
  );

  return (
    <DimensionInsightDataTable
      data={rows}
      columns={tableColumns}
      pageSize={pageSize}
      searchPlaceholder={searchPlaceholder}
      showSearch={showSearch}
      showColumnToggle={showColumnToggle}
      toolbar={toolbar}
    />
  );
}
