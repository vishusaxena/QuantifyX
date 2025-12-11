function SelectComponent({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  onKeyDown,
  required = false,
  placeholder = "Select",
  selectRef,
  icon: Icon,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1">
        {Icon && (
          <Icon size={16} className="dark:text-gray-200 blue:text-[#fdf379]" />
        )}
        <span className=" text-sm dark:text-gray-200 blue:text-[#ffffff] tracking-wider">
          {label} <span className="text-rose-500">{required ? "*" : ""}</span>
        </span>
      </div>
      <div className="mt-2.5">
        <select
          ref={selectRef}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="form-select form-control w-full rounded-lg border-gray-300 focus-ring focus-ring-light"
        >
          <option value="">{placeholder}</option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <small className="text-red-500 mt-1 text-xs" style={{ fontSize: 12 }}>
            {error}
          </small>
        )}
      </div>
    </div>
  );
}

export default SelectComponent;
