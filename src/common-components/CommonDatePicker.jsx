import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputComponent from "../common-components/InputComponent";

const CommonDatePicker = forwardRef(
  (
    {
      name,
      label,
      value,
      error,
      placeholder,
      isOpen,
      setIsOpen,
      onChange,
      minDate,
      dateFormat = "dd-MMM-yyyy",
      theme,
      onKeyDown,
    },
    ref
  ) => {
    return (
      <div className={`datepicker-container ${theme}`}>
        <DatePicker
          name={name}
          open={isOpen}
          selected={value ? new Date(value) : null}
          onClickOutside={() => setIsOpen(false)}
          onChange={(date) => {
            setIsOpen(false);
            onChange(date);
          }}
          minDate={minDate}
          dateFormat={dateFormat}
          placeholderText={placeholder}
          ref={ref}
          onKeyDown={onKeyDown}
          customInput={
            <InputComponent
              label={label}
              value={value}
              error={error}
              onOpen={() => setIsOpen(true)}
            />
          }
          calendarClassName="text-black"
        />
      </div>
    );
  }
);

export default CommonDatePicker;
