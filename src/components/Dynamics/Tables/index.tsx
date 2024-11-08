import React, { ReactNode } from "react";
import TableTopContent from "./TableTopContent";

type Relationship<K extends string> = K[] | any[] | { join: [] }[];

export type OptionOptions = {
  data?: string[];
  color?: "success" | "warning" | "danger";
  onChange?: (value: string) => void;
  apiLink?: string;
};

export type LinkOptionsType = {
  href?: string;
  variant?: "default" | "underline";
};

export type ColumnType<K extends string> = {
  name: K;
  rename?: string;
  className?: string;
  date?: boolean;
  join?: K[];
  useRelationship?: boolean;
  relationship?: Relationship<K | any>;
  useOption?: boolean;
  optionOptions?: OptionOptions;
  useLink?: boolean;
  linkOptions?: LinkOptionsType;
};

type ActionIconsType = {
  component?: ReactNode;
  onClick?: () => void;
};

export type ActionsType = {
  // icons: ActionIconsType;
  component?: ReactNode;
  onClick?: (data: any) => void;
};

export type TopContentAddButtonType = {
  title?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type TopContentSearhInputType = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isValid?: boolean;
  searchDelay?: number;
};

export type TopContentOptionsType = {
  setOpenAddModal?: (openAddModal: boolean) => void;
  addButton?: TopContentAddButtonType;
  searchInput?: TopContentSearhInputType;
};

type PropsType<T> = {
  topContent?: ReactNode;
  topContentOptions?: TopContentOptionsType;
  columns: ColumnType<keyof T & string>[];
  items: T[];
  actions?: ActionsType[];
  actionColumName?: string;
};

const DynamicTable = <T extends Record<string, any>>({
  items,
  columns,
  topContent,
  topContentOptions,
  actions,
  actionColumName,
}: PropsType<T>) => {
  function processRelationShip(item: any, column: any) {
    let dynamicKey = "";
    if (Array.isArray(column.relationship)) {
      return column.relationship
        .map((rela: any, index: any) => {
          if (typeof rela === "string") {
            dynamicKey = dynamicKey ? `${dynamicKey}.${rela}` : rela;
            return "";
          }
          if (rela.join && Array.isArray(rela.join)) {
            return rela.join
              .map((jo: any) => {
                const value =
                  dynamicKey !== "" &&
                  dynamicKey !== undefined &&
                  dynamicKey !== null
                    ? item[column.name]?.[
                        dynamicKey.split(".").reduce((acc: any, key: any) => {
                          return acc && acc[key], item[column.name];
                        })
                      ]?.[jo]
                    : item[column.name]?.[jo];
                return value || "__ ";
              })
              .join(" ");
          }
          const val = item[column.name]?.[dynamicKey];
          return val;
        })
        .join(" ");
    }
  }

  // Array.isArray(column.relationship) &&
  //   column.relationship.map(
  //     (rela: any) =>
  //       Array.isArray(rela.join) &&
  //       rela.join.map((jo) => (
  //         <>{`${
  //           item[column.name]?.[rela]?.[column.name]?.[jo] || "__" + " "
  //         } `}</>
  //       ))
  //   );

  function renderValue(column: ColumnType<keyof T & string>, item: T) {
    return column.useRelationship === true
      ? processRelationShip(item, column)
      : Array.isArray(column.join)
      ? column.join.map((jo) => <>{`${item[jo] || "__" + " "}`}</>)
      : column.date
      ? new Date(item[column.name]).toLocaleString()
      : item[column.name];
  }

  async function handleOptionChnage(value: string, apiLink: string) {
    try {
      // const res = await Axios.put(apiLink, { value });
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

  return (
    <div className="relative shadow-md !overflow-x-auto scrollbar-hide sm:rounded-lg">
      {renderTopContent(topContent)}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr className="h-fit">
            {columns.map((column) => (
              <th scope="col" className="px-2 py-3">
                {column?.rename || column?.name}
              </th>
            ))}
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
                columns.map((column, colIndex) => {
                  if (column.useOption) {
                    return (
                      <th
                        key={colIndex}
                        scope="row"
                        className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {column?.optionOptions?.apiLink ? (
                          <select
                            onChange={(
                              event: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                              handleOptionChnage(
                                event.target.value,
                                column?.optionOptions?.apiLink as string
                              );
                            }}
                          >
                            {column?.optionOptions?.data?.map((value) => (
                              <option value={value}>{value}</option>
                            ))}
                          </select>
                        ) : (
                          <select
                            onChange={(
                              event: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                              if (column?.optionOptions?.onChange) {
                                column?.optionOptions?.onChange(
                                  event.target.value
                                );
                              }
                            }}
                          >
                            {column?.optionOptions?.data?.map((value) => (
                              <option value={value}>{value}</option>
                            ))}
                          </select>
                        )}
                      </th>
                    );
                  }

                  if (column.useLink) {
                    return (
                      <th
                        key={colIndex}
                        scope="row"
                        className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {/* <Link
                          className="hover:underline  inline-flex"
                          href={column.linkOptions.href}
                        > */}
                        {renderValue(column, item)}
                        {/* </Link> */}
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
                })}
              {Array.isArray(actions) && (
                <th
                  scope="row"
                  className="px-2 flex items-center gap-x-3 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {actions?.map((action, colIndex) => (
                    <span
                      onClick={() => {
                        if (action?.onClick) {
                          action?.onClick(item);
                        }
                      }}
                      key={colIndex}
                    >
                      {action.component}
                    </span>
                  ))}
                </th>
              )}
              {/* <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {Array.isArray(actions) && actions.map(action => (
                  <>{ action}</>
                   ))}
                    </th> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;

//  {column.useRelationship === true
//                       ? Array.isArray(column.relationship) &&
//                         column.relationship.map(
//                           (rela: any) =>
//                             Array.isArray(rela.join) &&
//                             rela.join.map((jo) => (
//                               <>{`${item[column.name]?.[jo] || "__" + " "} `}</>
//                             ))
//                         )
//                       : Array.isArray(column.join)
//                       ? column.join.map((jo) => (
//                           <>{`${item[jo] || "__" + " "}`}</>
//                         ))
//                       : column.date
//                       ? new Date(item[column.name]).toLocaleString()
//                       : item[column.name]}
