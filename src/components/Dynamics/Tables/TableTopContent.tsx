import { TopContentOptionsType } from "./types";
const TableTopContent = ({
  searchInput,
  addButton,
  moreComponents,
}: TopContentOptionsType) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 bg-white">
      <div className="w-full md:w-1/2">
        <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              {...(searchInput
                ? {
                    ...searchInput,
                    ...(searchInput?.className
                      ? {
                          className: `${searchInput?.className} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2`,
                        }
                      : {
                          className:
                            "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2",
                        }),
                    ...(searchInput?.placeholder
                      ? {}
                      : { placeholder: "Search" }),
                    ...(searchInput?.type ? {} : { type: "text" }),
                    ...(searchInput?.id ? {} : { id: "simple-search-input" }),
                  }
                : {
                    type: "text",
                    id: "simple-search",
                    placeholder: "Search",
                    className:
                      "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2",
                  })}
            />
          </div>
        </form>
      </div>
      <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
        <button
          {...((addButton
            ? {
                ...addButton,
                ...(addButton?.className
                  ? {
                      className: `${addButton?.className} flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2`,
                    }
                  : {
                      className:
                        "flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2",
                    }),
              }
            : {
                type: "button",
                className:
                  "flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2",
              }) as any)}
        >
          {addButton?.startContent || ""}
          {addButton?.title || ""}
          {addButton?.endContent || ""}
        </button>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {moreComponents}
        </div>
      </div>
    </div>
  );
};

export default TableTopContent;
