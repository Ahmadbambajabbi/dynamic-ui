import React, { ReactNode, useState } from "react";
import TableTopContent from "./TableTopContent";
import { ColumnType, DynamicTablePropsType } from "./types";
import PaginationController from "./PaginationController";
import Chip from "./Chip";
import { getNestedValue, handlePropsDynamic } from "./helpers/helpers";

const DynamicTable = <T extends Record<string, any>>({
  items,
  columns,
  topContent,
  topContentOptions,
  usePagination,
  pagination,
  emptyContent,
  isLoading,
  loadingContent,
  tableName,
  tBodyTrProps,
  tHeadTrProps,
  tBodyProps,
  tHeadProps,
}: DynamicTablePropsType<T>) => {
  const [openDropdowns, setOpenDropdowns] = useState<any>({});

  const toggleDropdown = (index: number) => {
    setOpenDropdowns((prevState: any) => {
      const newState: any = {};
      newState[index] = !prevState[index];
      return newState;
    });
  };

  function generateDynamicLink(href: string, item: any): string {
    const regex = /\[([^\]]+)\]/g;
    return href.replace(regex, (_, key) => {
      const keys = key.split(".");
      let value = item;
      for (let k of keys) {
        value = value && value[k];
      }
      return value || "";
    });
  }

  function handleJoined(column: ColumnType<keyof T & string>, item: T) {
    const joinedValues = column?.join?.map((path: string) => {
      return getNestedValue<T>(item, path) || "";
    });
    return joinedValues?.join(" ")?.trim();
  }
  function renderValue(column: ColumnType<keyof T & string>, item: T) {
    if (Array.isArray(column.join)) {
      if (column.useChip) {
        return (
          <>
            <Chip className={column?.chipOptions?.className} item={item} />{" "}
            {handleJoined(column, item)}
          </>
        );
      }
      return handleJoined(column, item);
    } else {
      const value = getNestedValue(item, column.accessor);
      if (column.useDate) {
        if (column.useChip) {
          return (
            <>
              <Chip className={column?.chipOptions?.className} item={item} />{" "}
              {new Date(value).toLocaleString()}
            </>
          );
        }
        return new Date(value).toLocaleString();
      } else {
        if (column.useChip) {
          return (
            <>
              <Chip className={column?.chipOptions?.className} item={item} />{" "}
              {value}
            </>
          );
        }
        return value;
      }
    }
  }

  async function handleOptionChnage(
    value: string,
    apiLink: string,
    onAftterFetch?: (value: any) => {}
  ) {
    try {
      const res: any = await fetch(apiLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      if (onAftterFetch) {
        onAftterFetch(res);
      }
    } catch (error) {
      console.log({ error });
    }
  }

  function renderTopContent(topContent?: ReactNode) {
    if (typeof topContent === "undefined") {
      return (
        <TableTopContent
          addButton={topContentOptions?.addButton}
          searchInput={topContentOptions?.searchInput}
          moreComponents={topContentOptions?.moreComponents}
        />
      );
    } else {
      return topContent;
    }
  }

  function handleAction(
    column: ColumnType<keyof T & string>,
    _colIndex: number,
    item: T,
    index: number
  ) {
    if (column?.actionOptions?.useOptions) {
      return (
        <td
          {...(column?.normalProps?.td
            ? {
                ...handlePropsDynamic(column.normalProps.td, item),
                ...(column.normalProps.td?.className
                  ? {
                      className: `${column.normalProps?.td?.className} px-2 py-4 font-medium text-gray-900 whitespace-nowrap relative `,
                    }
                  : {
                      className:
                        "px-2 py-4 font-medium text-gray-900 whitespace-nowrap relative ",
                    }),
              }
            : {
                className:
                  "px-2 py-4 font-medium text-gray-900 whitespace-nowrap relative",
              })}
        >
          <button
            id="apple-imac-27-dropdown-button"
            data-dropdown-toggle="apple-imac-27-dropdown"
            className="inline-flex items-center p-0.5 text-sm font-medium  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
            type="button"
            onClick={() => toggleDropdown(index)}
          >
            {column.actionOptions.optionText ? (
              column.actionOptions.optionText
            ) : (
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            )}
          </button>
          <div
            id="apple-imac-27-dropdown"
            className={`${
              !openDropdowns[index] && "hidden"
            } z-50 overflow-visible w-44 absolute  right-[5%]  top-full bg-white rounded divide-y divide-gray-100 shadow`}
          >
            <ul
              className="py-1 text-sm text-gray-700 "
              aria-labelledby="apple-imac-27-dropdown-button"
            >
              {column?.actionOptions?.options?.map((ActionOptions) => {
                if (ActionOptions.useLink) {
                  const href = generateDynamicLink(
                    ActionOptions?.linkOptions?.href
                      ? ActionOptions?.linkOptions?.href
                      : "",
                    item
                  );
                  return (
                    <li>
                      <a
                        href={href}
                        className="block py-2 px-4 hover:bg-gray-100"
                      >
                        {ActionOptions.componenet}
                      </a>
                    </li>
                  );
                }
                return (
                  <li
                    onClick={() => {
                      if (ActionOptions?.onClick) {
                        ActionOptions?.onClick(item);
                      }
                    }}
                  >
                    <span className="block py-2 px-4 hover:bg-gray-100">
                      {ActionOptions.componenet}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </td>
      );
    }
    return (
      <td
        onClick={() => {
          if (column?.actionOptions?.onClick) {
            column?.actionOptions?.onClick(item);
          }
        }}
        {...(column?.normalProps?.td
          ? {
              ...handlePropsDynamic(column.normalProps.td, item),
              ...(column.normalProps.td?.className
                ? {
                    className: `${column.normalProps?.td?.className} px-2 py-4 font-medium text-gray-900 whitespace-nowrap`,
                  }
                : {
                    className: "px-4 py-3 flex items-center justify-end",
                  }),
            }
          : {
              className: "px-4 py-3 flex items-center justify-end",
            })}
      >
        {column?.actionOptions?.component}
      </td>
    );
  }

  function celValue(
    column: ColumnType<keyof T & string>,
    colIndex: number,
    item: T,
    index: number
  ) {
    if (column.useOption) {
      return (
        <td
          {...(column?.normalProps?.td
            ? {
                ...handlePropsDynamic(column.normalProps.td, item),
                ...(column.normalProps.td?.className
                  ? {
                      className: `${column.normalProps?.td?.className} px-2 py-4 font-medium text-gray-900 whitespace-nowrap`,
                    }
                  : {
                      className:
                        "px-2 py-4 font-medium text-gray-900 whitespace-nowrap",
                    }),
              }
            : {
                className:
                  "px-2 py-4 font-medium text-gray-900 whitespace-nowrap",
              })}
          key={colIndex}
          scope="row"
        >
          {column?.optionOptions?.apiLink ? (
            <select
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                handleOptionChnage(
                  event.target.value,
                  column?.optionOptions?.apiLink
                    ? column?.optionOptions?.apiLink
                    : "",
                  column?.optionOptions?.onAftterFetch
                    ? (column?.optionOptions?.onAftterFetch as (
                        value: any
                      ) => {})
                    : (_value: any) => ({})
                );
              }}
            >
              {column?.optionOptions?.data?.map((value: string) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          ) : (
            <select
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                if (column?.optionOptions?.onChange) {
                  column.optionOptions.onChange(event.target.value);
                }
              }}
            >
              {column?.optionOptions?.data?.map((value: string) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          )}
        </td>
      );
    }
    if (column.useLink) {
      const href = generateDynamicLink(
        column?.linkOptions?.href ? column?.linkOptions?.href : "",
        item
      );
      return (
        <td
          {...(column?.normalProps?.td
            ? {
                ...handlePropsDynamic(column.normalProps.td, item),
                ...(column.normalProps.td?.className
                  ? {
                      className: `${column.normalProps?.td?.className} px-2 py-4 font-medium text-gray-900 whitespace-nowrap`,
                    }
                  : {
                      className:
                        "px-2 py-4 font-medium text-gray-900 whitespace-nowrap",
                    }),
              }
            : {
                className:
                  "px-2 py-4 font-medium text-gray-900 whitespace-nowrap",
              })}
          key={colIndex}
          scope="row"
        >
          <a className="hover:underline  inline-flex" href={href}>
            {renderValue(column, item)}
          </a>
        </td>
      );
    }
    if (column.useAction) {
      return handleAction(column, colIndex, item, index);
    }
    return (
      <td
        {...(column?.normalProps?.td
          ? {
              ...handlePropsDynamic(column.normalProps.td, item),
              ...(column.normalProps?.td?.className
                ? {
                    className: `${column.normalProps?.td?.className} px-2 py-4 font-medium text-gray-900 whitespace-nowrap`,
                  }
                : {
                    className:
                      "px-2 py-4 font-medium text-gray-900 whitespace-nowrap",
                  }),
            }
          : {
              className:
                "px-2 py-4 font-medium text-gray-900 whitespace-nowrap",
            })}
        key={colIndex}
        scope="row"
      >
        {renderValue(column, item)}
      </td>
    );
  }

  function findTrueContion(column: ColumnType<keyof T & string>, item: T) {
    const findTrueColumn = column?.condtions?.find((condi) => {
      if (typeof condi.condtion === "boolean") {
        return condi.condtion === true;
      }
      if (Array.isArray(condi.condtion.compare)) {
        const [getFirstValue, getSecondValue] = condi.condtion.compare;
        const firstValue = getNestedValue(
          item,
          getFirstValue ? getFirstValue : ""
        );
        let secondValue = getSecondValue;
        if (getSecondValue?.startsWith("[")) {
          secondValue = getSecondValue.slice(1, -1);
          secondValue = getNestedValue(item, secondValue);
        }
        if (secondValue !== undefined) {
          return firstValue === secondValue;
        }
        return (
          firstValue !== undefined &&
          firstValue !== null &&
          firstValue !== "" &&
          firstValue !== "undefined"
        );
      }
      return false;
    });
    return findTrueColumn;
  }

  return (
    <div className="shadow-md !overflow-x-auto scrollbar-hide sm:rounded-lg">
      {renderTopContent(topContent)}
      <div className="overflow-x-auto max-h-96 min-h-40 h-full z-50">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead
            {...(tHeadProps
              ? {
                  ...tHeadProps,
                  ...(tHeadProps?.className
                    ? {
                        className: `${tHeadProps?.className} text-xs text-gray-700 uppercase bg-gray-50`,
                      }
                    : {
                        className: "text-xs text-gray-700 uppercase bg-gray-50",
                      }),
                }
              : { className: "text-xs text-gray-700 uppercase bg-gray-50" })}
          >
            <tr
              {...(tHeadTrProps
                ? {
                    ...tHeadTrProps,
                    ...(tHeadTrProps?.className
                      ? {
                          className: `${tHeadTrProps?.className} h-fit`,
                        }
                      : { className: "h-fit" }),
                  }
                : { className: "h-fit" })}
            >
              {columns.map((column: ColumnType<keyof T & string>, index) => {
                if (column?.showIf === undefined || column.showIf === true) {
                  return (
                    <th
                      {...((column.normalProps?.th
                        ? {
                            ...column.normalProps?.th,
                            ...(column.normalProps?.th?.className
                              ? {
                                  className: `${column.normalProps?.th?.className} px-2 py-3`,
                                }
                              : { className: "px-2 py-3" }),
                          }
                        : { className: "px-2 py-3" }) as any)}
                      key={index}
                      scope="col"
                    >
                      {column?.rename || column?.columnName}
                    </th>
                  );
                }
                return null;
              })}
            </tr>
          </thead>
          <tbody {...tBodyProps}>
            {!isLoading &&
              items.map((item, index) => (
                <tr
                  key={index}
                  {...(tBodyTrProps
                    ? {
                        ...tBodyTrProps,
                        ...(tBodyTrProps?.className
                          ? {
                              className: `${tBodyTrProps?.className} odd:bg-white even:bg-gray-50 border-b`,
                            }
                          : {
                              className:
                                "odd:bg-white even:bg-gray-50 border-b",
                            }),
                      }
                    : {
                        className: "odd:bg-white even:bg-gray-50 border-b",
                      })}
                >
                  {Array.isArray(columns) &&
                    columns.map(
                      (column: ColumnType<keyof T & string>, colIndex) => {
                        if (
                          column?.showIf === undefined ||
                          column.showIf === true
                        ) {
                          if (column.useCondition) {
                            const findTrueColumn = findTrueContion(
                              column,
                              item
                            );
                            if (findTrueColumn?.redner) {
                              return celValue(
                                findTrueColumn?.redner as any,
                                colIndex,
                                item,
                                index
                              );
                            } else {
                              return "";
                            }
                          } else {
                            return celValue(column, colIndex, item, index);
                          }
                        }
                        return null;
                      }
                    )}
                </tr>
              ))}
          </tbody>
        </table>
        {isLoading && (
          <div className="w-full h-[10rem] text-gray-500 flex flex-col items-center justify-center">
            {loadingContent ? loadingContent : "loading..."}
          </div>
        )}
        {!items.length && !isLoading && (
          <div className="w-full h-[10rem] text-gray-500 flex flex-col items-center justify-center">
            {emptyContent
              ? emptyContent
              : `No ${tableName ? tableName : "Date"} Added `}
          </div>
        )}
      </div>
      {usePagination && pagination && (
        <PaginationController pagination={pagination} />
      )}
    </div>
  );
};

export default DynamicTable;
