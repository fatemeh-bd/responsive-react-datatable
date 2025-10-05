import { ActionDropDownProps } from "./types";
import DropDownMenu from "./DropDownMenu";
import { BiDotsVerticalRounded, ChevronDown } from "../../icons";

export function ActionDropDown({
  options,
  button,
  lastItem,
  text,
}: ActionDropDownProps) {
  const renderButton = button
    ? typeof button === "function"
      ? button()
      : button
    : text
    ? managementButton(text)
    : actionButton();

  return (
    <>
      <DropDownMenu
        button={renderButton}
        className="DropDownMenu"
        children={
          <ul className="flex flex-col w-fit min-w-[100px] bg-inherit p-1">
            {options?.map(
              (option, index) =>
                !option.hidden && (
                  <li
                    key={index}
                    className={`w-full flex items-center justify-center gap-1 py-2 px-4 text-sm text-secondary-700 font-medium hover:cursor-pointer
                      hover:bg-gray-200 hover:rounded-md border-b-[1px] border-secondary-400
                      last:border-transparent hover:border-transparent has-[+li:hover]:border-transparent ${
                        lastItem
                          ? index === options?.length - 1
                            ? "text-success font-medium"
                            : ""
                          : ""
                      }`}
                    onClick={option?.onClick}
                  >
                    {option?.href ? (
                      <a href={option?.href} className="w-full text-center">
                        <>
                          {option.Icon && <option.Icon className="size-3.5" />}
                          {option.label}
                        </>
                      </a>
                    ) : (
                      <>
                        {option.Icon && <option.Icon className="size-3.5" />}
                        {option.label}
                      </>
                    )}
                  </li>
                )
            )}
          </ul>
        }
      />
    </>
  );
}

const actionButton = () => {
  return (
    <button className="cursor-pointer bg-slate-300 option-button py-2 text-sm rounded-xl !min-w-fit !px-2 !w-full">
      <BiDotsVerticalRounded className="size-6 mx-auto" />
    </button>
  );
};

const managementButton = (text: string) => {
  return (
    <button className="cursor-pointer option-button flex items-center gap-1 !transition-none bg-slate-300 py-2 text-sm rounded-xl !min-w-fit !px-2 !w-full">
      {text}
      <ChevronDown className="size-5" />
    </button>
  );
};
