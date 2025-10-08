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
          <ul className="dropdown-list">
            {options?.map(
              (option, index) =>
                !option.hidden && (
                  <li
                    key={index}
                    className={`dropdown-item ${
                      lastItem && index === options?.length - 1
                        ? "dropdown-item--last"
                        : ""
                    }`}
                    onClick={option?.onClick}
                  >
                    {option?.href ? (
                      <a href={option?.href} className="dropdown-link">
                        <>
                          {option.Icon && (
                            <option.Icon className="dropdown-icon" />
                          )}
                          {option.label}
                        </>
                      </a>
                    ) : (
                      <>
                        {option.Icon && (
                          <option.Icon className="dropdown-icon" />
                        )}
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
    <button
      style={{
        backgroundColor: "#fefefe",
      }}
      className="cursor-pointer option-button"
    >
      <BiDotsVerticalRounded />
    </button>
  );
};

const managementButton = (text: string) => {
  return (
    <button
      style={{
        backgroundColor: "#fefefe",
      }}
      className="cursorPointer option-button managementButton"
    >
      {text}
      <ChevronDown />
    </button>
  );
};
