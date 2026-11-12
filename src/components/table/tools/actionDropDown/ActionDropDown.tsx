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
          <ul role="menu" className="dropdown-list">
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
                    role="none"
                  >
                    {option?.href ? (
                      <a role="menuitem" onClick={option.onClick} href={option.href} className="dropdown-link">
                        <>
                          {option.Icon && (
                            <option.Icon className="dropdown-icon" />
                          )}
                          {option.label}
                        </>
                      </a>
                    ) : (
                      <button type="button" role="menuitem" onClick={option.onClick} className="dropdown-link">
                        {option.Icon && (
                          <option.Icon className="dropdown-icon" />
                        )}
                        {option.label}
                      </button>
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
      type="button"
      aria-label="Actions"
      style={{
        backgroundColor: "#f5f5f5", color: "inherit",
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
      type="button"
      aria-label="Actions"
      style={{
        backgroundColor: "transparent", color: "inherit",
      }}
      className="cursorPointer option-button managementButton"
    >
      {text}
      <ChevronDown />
    </button>
  );
};
