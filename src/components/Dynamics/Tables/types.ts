import { HTMLProps, ReactNode } from "react";

export type OptionOptions = {
  data?: string[];
  color?: "success" | "warning" | "danger";
  onChange?: (value: string) => void;
  apiLink?: string;
  onAftterFetch?: (value: any) => void;
};
type ActionsOptionsType = {
  componenet?: ReactNode;
  onClick?: (data: any) => void;
  useLink?: boolean;
  linkOptions?: LinkOptionsType;
};
export type ActionsType = {
  component?: ReactNode;
  onClick?: (data: any) => void;
  useOptions?: boolean;
  optionText?: ReactNode;
  options?: ActionsOptionsType[];
};

export type LinkOptionsType = {
  href?: string;
  variant?: "default" | "underline";
};

type ChipOptions = {
  className: string;
};

type ColumnConditionsRenderType<K extends string> = {
  columnName: string;
  accessor?: K;
  showIf?: boolean;
  rename?: string;
  className?: string;
  useDate?: boolean;
  join?: K[];
  useAction?: boolean;
  actionOptions?: ActionsType;
  useOption?: boolean;
  optionOptions?: OptionOptions;
  useLink?: boolean;
  linkOptions?: LinkOptionsType;
  normalProps?: {
    th?: HTMLProps<HTMLTableColElement>;
    td?: HTMLProps<HTMLTableColElement>;
    tHeadTr?: HTMLProps<HTMLTableRowElement>;
    tBodyTr?: HTMLProps<HTMLTableRowElement>;
  };
  useChip?: boolean;
  chipOptions?: ChipOptions;
};

type ColumnConditionsType<T extends string> = {
  condtion:
    | boolean
    | {
        compare: string[];
      };
  redner: ColumnConditionsRenderType<T>;
};

export type ColumnType<K extends string> = {
  columnName: string;
  accessor: K;
  showIf?: boolean;
  condtions?: ColumnConditionsType<K>[];
  useCondition?: boolean;
  rename?: string;
  className?: string;
  useDate?: boolean;
  join?: K[];
  useAction?: boolean;
  actionOptions?: ActionsType;
  useOption?: boolean;
  optionOptions?: OptionOptions;
  useLink?: boolean;
  linkOptions?: LinkOptionsType;
  useChip?: boolean;
  chipOptions?: ChipOptions;
  normalProps?: {
    th?: HTMLProps<HTMLTableColElement>;
    td?: HTMLProps<HTMLTableCellElement>;
  };
  // normalProps: HTMLProps<HTMLTD>
};

export type TopContentAddButtonType = {
  title?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type TopContentSearhInputType = {};

export type TopContentOptionsType = {
  addButton?: HTMLProps<HTMLButtonElement> & TopContentAddButtonType;
  searchInput?: HTMLProps<HTMLInputElement> & TopContentSearhInputType;
  moreComponents?: ReactNode;
};

type PlainObjectKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];
type MaxDepth = 10;
export type NestedFieldPaths<TData, Depth extends number = MaxDepth> = {
  [TKey in PlainObjectKeys<TData>]: TData[TKey] extends object
    ? Depth extends 0
      ? `${TKey & string}`
      :
          | `${TKey & string}`
          | `${TKey & string}.${NestedFieldPaths<TData[TKey], Prev<Depth>>}`
    : `${TKey & string}`;
}[PlainObjectKeys<TData>];
type Prev<N extends number> = N extends 0
  ? never
  : N extends 1
  ? 0
  : N extends 2
  ? 1
  : N extends 3
  ? 2
  : never;

export type PAGINATION_TYPE = {
  per_page: number;
  page: number;
  totalPages: number;
  // handlerPerPageChange: (per_page: number) => void;
  handlePageChange: (page: number) => void;
  per_pageComponent?: ReactNode;
};

export type DynamicTablePropsType<T> = {
  tableName?: string;
  topContent?: ReactNode;
  topContentOptions?: TopContentOptionsType;
  columns: ColumnType<NestedFieldPaths<T>>[];
  items: T[];
  emptyContent?: ReactNode;
  isLoading?: boolean;
  loadingContent?: ReactNode;
  tBodyProps?: HTMLProps<HTMLTableSectionElement>;
  tHeadProps?: HTMLProps<HTMLTableSectionElement>;
  tHeadTrProps?: HTMLProps<HTMLTableRowElement>;
  tBodyTrProps?: HTMLProps<HTMLTableRowElement>;
  actions?: ActionsType[];
  actionColumName?: string;
  usePagination: boolean;
  pagination?: PAGINATION_TYPE;
};
