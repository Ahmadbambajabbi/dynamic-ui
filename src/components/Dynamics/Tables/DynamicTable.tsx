import React, { ReactNode } from "react";
// import axios from "axios"
import TableTopContent from "./TableTopContent";
import { ColumnType, DynamicTablePropsType, } from "./types";

const DynamicTable = <T extends Record<string, any>>({
  items,
  columns,
  topContent,
  topContentOptions,
  actions,
  actionColumName,
}: DynamicTablePropsType<T>) => {
  function getNestedValue(obj: T, path: string): any {
    const keys = path?.split(".");
    return keys?.reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function generateDynamicLink(href: string, item:any): string {
    const regex = /\[([^\]]+)\]/g;
    return href.replace(regex, (_, key) => {
      const keys = key.split('.');
      let value = item;
      for (let k of keys) {
        value = value && value[k];
      }
      return value || '';
    });
  }
  

  function handleJoined(column: ColumnType<keyof T & string>, item: T) {
    const joinedValues = column?.join?.map((path: string) => {
      return getNestedValue(item, path) || ""; 
    });
    return joinedValues?.join(" ")?.trim();
  }
  function renderValue(column: ColumnType<keyof T & string>, item: T) {
    if(Array.isArray(column.join)) {
      return handleJoined(column, item)
    } else {
      const value = getNestedValue(item, column.accessor)
      if(column.useDate){
        return new Date(value).toLocaleString()
      } else{ 
        return value
      }
    }
  }

  async function handleOptionChnage(value: string, apiLink: string) {
    try {
      //  await axios.put(apiLink, { value });
      console.log({apiLink, value})
    } catch (error) {
      console.log({ error });
    }
  }

  function renderTopContent(topContent?: ReactNode) {
    if (typeof topContent === "undefined") {
      return (
        <TableTopContent
          setAddModelOpen={topContentOptions?.setOpenAddModal}
          addButton={topContentOptions?.addButton}
          searchInput={topContentOptions?.searchInput}
        />
      );
    } else {
      return topContent;
    }
  }

  function celValue(column: ColumnType<keyof T & string> | any, colIndex: number, item: T) {
    if (column.useOption) {
      return (
        <th
          key={colIndex}
          scope="row"
          className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
        >
          {column.optionOptions.apiLink ? (
            <select
              onChange={(
                event: React.ChangeEvent<HTMLSelectElement>
              ) => {
                handleOptionChnage(
                  event.target.value,
                  column.optionOptions.apiLink
                );
              }}
            >
              {column.optionOptions.data.map((value: string) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          ) : (
            <select
              onChange={(
                event: React.ChangeEvent<HTMLSelectElement>
              ) => {
                if (column.optionOptions.onChange) {
                  column.optionOptions.onChange(
                    event.target.value
                  );
                }
              }}
            >
              {column.optionOptions.data.map((value: string) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          )}
        </th>
      );
    }
    if (column.useLink) {
      const href = generateDynamicLink(column.linkOptions.href, item)
      return (
        <th
          key={colIndex}
          scope="row"
          className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
        >
          <a
            className="hover:underline  inline-flex"
            href={href}
          >
            {renderValue(column, item)}
          </a>
        </th>
      );
    }
    return (
      <th
        key={colIndex}
        scope="row"
        className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        {renderValue(column, item)}
      </th>
    );
  }

  function findTrueContion(column: ColumnType<keyof T & string>, item: T) {
    const findTrueColumn = column?.condtions?.find(condi => {
      if (typeof condi.condtion === "boolean") {
        return condi.condtion === true;
      }
      if (Array.isArray(condi.condtion.compare)) {
        const [firstValue, secondValue] = condi.condtion.compare.map(path => getNestedValue(item, path));
        if (secondValue !== undefined) {
          return firstValue === secondValue;
        }
        return firstValue !== undefined && firstValue !== null && firstValue !== "" && firstValue !== "undefined";
      }
      return false;
    });
    return findTrueColumn
  }

  return (
    <div className="relative shadow-md !overflow-x-auto scrollbar-hide sm:rounded-lg">
      {renderTopContent(topContent)}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr className="h-fit">
            {columns.map((column: any, index) => {
              if(column?.showIf === undefined || column.showIf === true) {
                  return(
                    <th key={index} scope="col" className="px-2 py-3">
                    {column?.rename || column?.columnName}
                  </th>
                  )
              }
              return null
              })}
            {actionColumName && (
              <th scope="col" className="px-2 py-3">
                {actionColumName || "Actions"}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="odd:bg-white even:bg-gray-50 border-b h-full"
            >
              {Array.isArray(columns) &&
                columns.map((column: any, colIndex) => {
                  if(column?.showIf === undefined || column.showIf === true) {
                    if(column.useCondition) {
                        const findTrueColumn = findTrueContion(column, item)
                        if(findTrueColumn?.redner) {
                          return celValue(findTrueColumn?.redner, colIndex, item)
                        } else {
                          return ""
                        }                   
                    }else {
                    return  celValue(column, colIndex, item)
                    }
                  }
                  return null
                })}
              {Array.isArray(actions) && (
                <th
                  scope="row"
                  className="px-2 flex items-center gap-x-3 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {actions?.map((action, colIndex) => (
                    <span onClick={() => {
                      if(action?.onClick){
                        action?.onClick(item)
                      }
                    }} key={colIndex}>
                      {action.component}
                    </span>
                  ))}
                </th>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
