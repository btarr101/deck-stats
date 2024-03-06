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
  Link,
  Popover,
  Paper,
  Typography,
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
import { Cost, Popularity, Salt } from "../model/stat";
import { Color, colorLerp, highColor, lowColor, toCSSColor } from "../util";

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
        cell: (props) => {
          const [anchorEl, setAnchorEl] = createSignal<Element | null>(null);

          const handlePopoverOpen = (event: { currentTarget: Element }) => {
            setAnchorEl(event.currentTarget);
          };

          const handlePopoverClose = () => {
            setAnchorEl(null);
          };

          const open = () => Boolean(anchorEl());

          return (
            <Box>
              <Chip
                aria-owns={open() ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                onClick={() =>
                  window.open(props.row.original.imageURI.toString())
                }
                label={props.getValue()}
              />
              <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: "none" }}
                open={open()}
                onClose={handlePopoverClose}
                anchorEl={anchorEl()}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                disableScrollLock
                disableRestoreFocus
              >
                <img
                  src={props.row.original.imageURI.toString()}
                  height={300}
                />
              </Popover>
            </Box>
          );
        },
      },
      {
        accessorKey: "salt",
        header: "Saltiness (0 - 4)",
        cell: (props) => (
          <Chip
            sx={{
              backgroundColor: toCSSColor(
                colorLerp(
                  lowColor,
                  highColor,
                  (props.getValue() - Salt.range[0]) /
                    (Salt.range[1] - Salt.range[0])
                )
              ),
            }}
            label={Salt.display(props.getValue())}
          />
        ),
      },
      {
        accessorKey: "price",
        header: "Cost (USD)",
        cell: (props) => (
          <Chip
            sx={{
              backgroundColor: toCSSColor(
                colorLerp(
                  lowColor,
                  highColor,
                  (props.getValue() - Cost.range[0]) /
                    (Cost.range[1] - Cost.range[0])
                )
              ),
            }}
            label={Cost.display(props.getValue())}
          />
        ),
      },
      {
        accessorKey: "popularity",
        header: "Popularity",
        cell: (props) => (
          <Chip
            sx={{
              backgroundColor: toCSSColor(
                colorLerp(
                  lowColor,
                  highColor,
                  (props.getValue() - Popularity.range[0]) /
                    (Popularity.range[1] - Popularity.range[0])
                )
              ),
            }}
            label={Popularity.display(props.getValue())}
          />
        ),
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
          <TableCell colSpan={4} align="center">
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
