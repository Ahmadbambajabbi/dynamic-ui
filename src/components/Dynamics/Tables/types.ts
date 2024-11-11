import { ReactNode } from "react";

export type Relationship<K extends string> = {
  keys: any[],
  join: K
};

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

type ColumnConditionsRenderType<K extends string> = {
  columnName: string;
  accessor?: K,
  showIf?: boolean,
  rename?: string;
  className?: string;
  useDate?: boolean;
  join?: K[];
  useRelationship?: boolean;
  relationship?: Relationship<K | any>;
  useOption?: boolean;
  optionOptions?: OptionOptions;
  useLink?: boolean;
  linkOptions?: LinkOptionsType;
}

type ColumnConditionsType<T extends string> = {
  condtion: boolean | {
    compare: string[]
  };
  redner: ColumnConditionsRenderType<T>
}

export type ColumnType<K extends string> = {
  columnName: string;
  accessor: K,
  showIf?: boolean,
  condtions?: ColumnConditionsType<K>[]
  useCondition?: boolean;
  rename?: string;
  className?: string;
  useDate?: boolean;
  join?: K[];
  useRelationship?: boolean;
  relationship?: Relationship<K | any>;
  useOption?: boolean;
  optionOptions?: OptionOptions;
  useLink?: boolean;
  linkOptions?: LinkOptionsType;
};

export type ActionsType = {
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

type PlainObjectKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];
// Helper type to restrict recursion depth
type MaxDepth = 10; // You can adjust this number to your needs

// Recursive type definition with a max depth
type NestedFieldPaths<TData, Depth extends number = MaxDepth> = {
  [TKey in PlainObjectKeys<TData>]: TData[TKey] extends object
    ? Depth extends 0
      ? `${TKey & string}` 
      : `${TKey & string}` | `${TKey & string}.${NestedFieldPaths<TData[TKey], Prev<Depth>>}`
    : `${TKey & string}`;
}[PlainObjectKeys<TData>];

// Helper type to decrease the depth
type Prev<N extends number> = N extends 0 ? never : N extends 1 ? 0 : N extends 2 ? 1 : N extends 3 ? 2 : never;


export type DynamicTablePropsType<T> = {
  topContent?: ReactNode;
  topContentOptions?: TopContentOptionsType;
  columns: ColumnType<NestedFieldPaths<T>>[];
  items: T[];
  actions?: ActionsType[];
  actionColumName?: string;
};