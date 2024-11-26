import { handlePropsDynamic } from "./helpers/helpers";

type ChipProps = {
  className?: string;
  item: any;
};
const Chip = ({ className, item }: ChipProps) => {
  console.log({ className });
  return (
    <span
      {...(className
        ? {
            ...handlePropsDynamic(
              {
                className: `${className} inline-flex ${
                  !className.includes("w-") && "w-2"
                } ${!className.includes("h-") && "h-2"} ${
                  !className.includes("rounded-") && "rounded-full"
                }`,
              },
              item
            ),
            ...(className
              ? {}
              : {
                  className: `${className}  w-2 h-2 rounded-full text-red-700 bg-red-500`,
                }),
          }
        : {
            className: `${className} inline-flex w-2 h-2 rounded-full text-red-700 bg-red-500`,
          })}
    ></span>
  );
};

export default Chip;
