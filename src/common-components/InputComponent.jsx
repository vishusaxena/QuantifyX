import React, { useState, forwardRef } from "react";
import { Form } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";

const InputComponent = forwardRef(
  (
    {
      label,
      icon: Icon,
      name,
      type = "text",
      value,
      onChange,
      onKeyDown,
      maxLength,
      disabled,
      inputMode,
      placeholder,
      error,
      as,
      min,
      max,
      rows,
      onOpen,
      isRequired = true,
      readOnly,
      classes,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <Form.Group
        className={` ${classes ? classes : "mb-3"}  w-100`}
        style={{ position: "relative" }}
      >
        <Form.Label className="flex items-center gap-2">
          <div className="flex justify-center items-center gap-1">
            {Icon && (
              <Icon
                size={16}
                className="dark:text-gray-200 blue:text-[#fdf379]"
              />
            )}
            {label && (
              <span className=" text-sm dark:text-gray-200 blue:text-[#ffffff] tracking-wider">
                {label}{" "}
                <span className="text-rose-500">{isRequired ? "*" : ""}</span>
              </span>
            )}
          </div>
        </Form.Label>

        <Form.Control
          ref={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          name={name}
          value={value}
          as={as}
          rows={rows}
          autoComplete="off"
          readOnly={readOnly}
          onClick={onOpen}
          onChange={onChange}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={placeholder}
          inputMode={inputMode}
          min={min}
          max={max}
          className={`focus-ring focus-ring-light ${
            disabled
              ? "dark:bg-[#2d3a68!important] blue:bg-[#393636!important]"
              : "light:bg-white"
          } dark:bg-[#1c2442] ${isPassword ? "pr-10" : ""}`}
        />

        {isPassword && !disabled && (
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "38px",
              cursor: "pointer",
              color: "#555",
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        )}

        {as === "textarea" && maxLength && (
          <div className="w-full text-right mt-1">
            <small className="text-gray-500 dark:text-gray-400">
              {value?.length || 0}/{maxLength}
            </small>
          </div>
        )}

        {error && (
          <small
            className="dark:text-red-400 light:text-red-500 blue:text-red-400"
            style={{ fontSize: 12 }}
          >
            {error}
          </small>
        )}
      </Form.Group>
    );
  }
);

export default InputComponent;
