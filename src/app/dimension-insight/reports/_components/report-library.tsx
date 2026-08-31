"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REPORTS, type ReportDefinition } from "@/data/dimension-insight/content";
import { formatDate, formatNumber } from "@/data/dimension-insight/format";
import type { DataTableFeatures } from "@/lib/data-table-features";

import { DimensionInsightDataTable } from "../../_components/data-table";
import { StatusPill } from "../../_components/ui-blocks";

const STATUS_TONE = {
  Published: "positive",
  Draft: "warning",
  Scheduled: "info",
  Archived: "neutral",
} as const;

const CATEGORIES = [
  "All categories",
  "Executive",
  "Finance",
  "Sales",
  "Customers",
  "Operations",
  "Marketing",
  "Workforce",
];
const STATUSES = ["All statuses", "Published", "Draft", "Scheduled", "Archived"];

export function ReportLibrary() {
  const router = useRouter();
  const [category, setCategory] = React.useState("All categories");
  const [status, setStatus] = React.useState("All statuses");

  const rows = React.useMemo(
    () =>
      REPORTS.filter((report) => category === "All categories" || report.category === category).filter(
        (report) => status === "All statuses" || report.status === status,
      ),
    [category, status],
  );

  const columns = React.useMemo<ColumnDef<DataTableFeatures, ReportDefinition>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Report",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <Link
              href={`/dimension-insight/reports/${row.original.id}`}
              className="font-medium hover:underline"
              onClick={(event) => event.stopPropagation()}
            >
              {row.original.name}
            </Link>
            <span className="max-w-md truncate text-muted-foreground text-xs">{row.original.description}</span>
          </div>
        ),
      },
      { id: "category", accessorKey: "category", header: "Category" },
      { id: "owner", accessorKey: "owner", header: "Owner" },
      {
        id: "updated",
        accessorKey: "updated",
        header: "Updated",
        cell: ({ row }) => <span className="tabular-nums">{formatDate(row.original.updated)}</span>,
      },
      {
        id: "views",
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => <div className="text-right tabular-nums">{formatNumber(row.original.views)}</div>,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusPill status={row.original.status} tone={STATUS_TONE[row.original.status]} />,
      },
    ],
    [],
  );

  return (
    <DimensionInsightDataTable
      data={rows}
      columns={columns}
      pageSize={10}
      searchPlaceholder="Search reports, owners, categories"
      onRowClick={(report) => router.push(`/dimension-insight/reports/${report.id}`)}
      toolbar={
        <>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger size="sm" className="w-44" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger size="sm" className="w-40" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
    />
  );
}
