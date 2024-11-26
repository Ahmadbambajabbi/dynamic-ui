import { PAGINATION_TYPE } from "./types";

type PropsType = {
  pagination: PAGINATION_TYPE;
};

const PaginationController = ({ pagination }: PropsType) => {
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 bg-white !z-0"
      aria-label="Table navigation"
    >
      <div className="flex items-center gap-x-3">
        <span className="text-sm font-normal text-gray-500">
          Showing
          <span className="font-semibold text-gray-900">
            {pagination?.page || 1}-{pagination?.totalPages || 0}
          </span>
          of
          <span className="font-semibold text-gray-900">
            {pagination?.totalPages}
          </span>
        </span>
        {pagination.per_pageComponent}
      </div>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <button
            onClick={() => {
              pagination.handlePageChange(pagination.page - 1);
            }}
            disabled={pagination?.page <= 1}
            className="flex items-center justify-center h-full py-1.5 px-3 cursor-pointer disabled:cursor-not-allowed ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
        {pagination?.totalPages <= 5 ? (
          Array.from({ length: pagination?.totalPages }, (_, index) => (
            <li
              onClick={() => {
                pagination.handlePageChange(index + 1);
              }}
              key={index}
              className="cursor-pointer"
            >
              <span
                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                  index + 1 === pagination.page
                    ? "bg-gray-300"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </span>
            </li>
          ))
        ) : (
          <>
            <li
              onClick={() => {
                pagination.handlePageChange(1);
              }}
              className="cursor-pointer"
            >
              <span
                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                  pagination?.page === 1
                    ? "bg-gray-300"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                1
              </span>
            </li>
            {pagination?.page > 3 && (
              <li
                onClick={() => {
                  pagination.handlePageChange(pagination.page - 1);
                }}
                className="cursor-pointer"
              >
                <span className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300">
                  ...
                </span>
              </li>
            )}
            {Array.from({ length: 3 }, (_, i) => (
              <li
                onClick={() => {
                  pagination.handlePageChange(pagination?.page - 1 + i);
                }}
                key={pagination?.page - 1 + i}
                className="cursor-pointer"
              >
                {pagination?.page - 1 + i > 1 &&
                  pagination?.page - 1 + i < pagination?.totalPages && (
                    <span
                      className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                        pagination?.page === pagination?.page - 1 + i
                          ? "bg-gray-300"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {pagination?.page - 1 + i}
                    </span>
                  )}
              </li>
            ))}
            {pagination?.page < pagination?.totalPages - 2 && (
              <li
                onClick={() => {
                  pagination.handlePageChange(pagination.page + 1);
                }}
                className="cursor-pointer"
              >
                <span className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300">
                  ...
                </span>
              </li>
            )}
            <li
              onClick={() => {
                pagination.handlePageChange(pagination?.totalPages || 0);
              }}
              className="cursor-pointer"
            >
              <span
                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                  pagination?.page === pagination?.totalPages
                    ? "bg-gray-300"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {pagination?.totalPages}
              </span>
            </li>
          </>
        )}
        <li>
          <button
            onClick={() => {
              pagination.handlePageChange(pagination.page + 1);
            }}
            disabled={pagination?.page >= pagination?.totalPages}
            className="flex items-center justify-center h-full py-1.5 px-3 cursor-pointer disabled:cursor-not-allowed leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default PaginationController;
