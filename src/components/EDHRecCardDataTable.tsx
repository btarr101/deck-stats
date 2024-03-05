import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Box,
  Button,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Chip,
} from "@suid/material";
import {
  Component,
  JSXElement,
  createSignal,
  children,
  For,
  Show,
} from "solid-js";
import { EDHRecCardData } from "../repo/edhrecRepo";
import {
  SortingState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import {
  ArrowDownward,
  ArrowUpward,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
  SwapVert,
} from "@suid/icons-material";
import { aboutDecimalPlaces } from "../util";

const EDHRecCardDataTable: Component<{ data: EDHRecCardData[] }> = (props) => {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const table = createSolidTable({
    get data() {
      return props.data;
    },
    columns: [
      {
        accessorKey: "name",
        header: "Card Name",
      },
      {
        accessorKey: "salt",
        header: "Saltiness (0 - 4)",
        cell: (props) => (
          <Chip
            color="warning" //todo: COLORS
            label={aboutDecimalPlaces(props.getValue(), 2)}
          />
        ),
      },
      {
        accessorKey: "price",
        header: "Cost (USD)",
        cell: (props) => aboutDecimalPlaces(props.getValue(), 2),
      },
      {
        accessorKey: "popularity",
        header: "Popularity (%)",
        cell: (props) => aboutDecimalPlaces(props.getValue(), 2),
      },
    ],
    state: {
      get sorting() {
        return sorting();
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <Table stickyHeader={true} sx={{ tableLayout: "fixed" }}>
      <TableHead>
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <TableRow>
              <For each={headerGroup.headers}>
                {(header) => (
                  <TableCell>
                    <Show when={!header.isPlaceholder}>
                      <Stack
                        direction="row"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <Show when={header.column.getCanSort()}>
                          <IconButton
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {
                              {
                                asc: <ArrowUpward />,
                                desc: <ArrowDownward />,
                                false: <SwapVert />,
                              }[header.column.getIsSorted() as string]
                            }
                          </IconButton>
                        </Show>
                      </Stack>
                    </Show>
                  </TableCell>
                )}
              </For>
            </TableRow>
          )}
        </For>
      </TableHead>
      <TableBody>
        <For each={table.getRowModel().rows}>
          {(row) => (
            <TableRow>
              <For each={row.getVisibleCells()}>
                {(cell) => (
                  <TableCell
                    sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )}
              </For>
            </TableRow>
          )}
        </For>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} align="center">
            <Button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <FirstPage />
            </Button>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <NavigateBefore />
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <NavigateNext />
            </Button>
            <Button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <LastPage />
            </Button>
            <Select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 25, 50, 100].map((pageSize) => (
                <MenuItem value={pageSize}>{pageSize}</MenuItem>
              ))}
            </Select>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default EDHRecCardDataTable;
