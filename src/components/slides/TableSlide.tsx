import { Component, For, Show, createSignal } from "solid-js";
import { EDHRecCardData } from "../../repo/edhrecRepo";
import {
  SortingState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { Cost, Popularity, Salt } from "../../model/stat";
import { colorLerp, highColor, lowColor, toCSSColor } from "../../util";
import { FaSolidSortUp, FaSolidSortDown, FaSolidSort } from "solid-icons/fa";

const TableSlide: Component<{ cardData: EDHRecCardData[] }> = (props) => {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [cardURL, setCardURL] = createSignal<string | null>(null);

  const table = createSolidTable({
    get data() {
      return props.cardData;
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
          <div
            style={{
              color: toCSSColor(
                colorLerp(
                  lowColor,
                  highColor,
                  (props.getValue() - Salt.range[0]) /
                    (Salt.range[1] - Salt.range[0])
                )
              ),
            }}
          >
            {Salt.display(props.getValue())}
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Cost (USD)",
        cell: (props) => (
          <div
            style={{
              color: toCSSColor(
                colorLerp(
                  lowColor,
                  highColor,
                  (props.getValue() - Cost.range[0]) /
                    (Cost.range[1] - Cost.range[0])
                )
              ),
            }}
          >
            {Cost.display(props.getValue())}
          </div>
        ),
      },
      {
        accessorKey: "popularity",
        header: "Popularity",
        cell: (props) => (
          <div
            style={{
              color: toCSSColor(
                colorLerp(
                  lowColor,
                  highColor,
                  (props.getValue() - Popularity.range[0]) /
                    (Popularity.range[1] - Popularity.range[0])
                )
              ),
            }}
          >
            {Popularity.display(props.getValue())}
          </div>
        ),
      },
    ],
    state: {
      get sorting() {
        return sorting();
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div class="snap-center bg-base-100 min-h-screen flex flex-col space-y-8 p-8">
      <h1 class="text-6xl text-accent-content text-center">
        Take a look for yourself
      </h1>
      <div class="container flex flex-1">
        <div class="w-full basis-1/3 h-full aspect-[5/7] rounded-2xl bg-clip-content hidden md:block bg-neutral-300 overflow-clip mr-4">
          <Show when={cardURL()}>
            <img
              class="object-contain w-full h-full"
              src={cardURL() as string}
            />
          </Show>
        </div>
        <div class="w-full relative overflow-clip">
          <div class="absolute top-0 bottom-0 left-0 right-0 overflow-scroll overscroll-contain -my-[1px]">
            <table class="table mb-0 table-xs table-pin-rows">
              <thead>
                <For each={table.getHeaderGroups()}>
                  {(headerGroup) => (
                    <tr class="bg-base-200">
                      <For each={headerGroup.headers}>
                        {(header) => (
                          <td>
                            <Show when={!header.isPlaceholder}>
                              <div class="flex items-center space-x-2">
                                <div>
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </div>
                                <Show when={header.column.getCanSort()}>
                                  <button
                                    class="btn btn-square btn-xs btn-ghost"
                                    onClick={header.column.getToggleSortingHandler()}
                                  >
                                    {
                                      {
                                        asc: <FaSolidSortUp />,
                                        desc: <FaSolidSortDown />,
                                        false: <FaSolidSort />,
                                      }[header.column.getIsSorted() as string]
                                    }
                                  </button>
                                </Show>
                              </div>
                            </Show>
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </thead>
              <tbody>
                <For each={table.getRowModel().rows}>
                  {(row) => (
                    <tr
                      class="hover"
                      onMouseEnter={() => {
                        setCardURL(row.original.imageURI.toString());
                      }}
                    >
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <td>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
              <tfoot>
                <tr class="bg-base-200">
                  <td colSpan={4}>Total: {props.cardData.length}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSlide;
