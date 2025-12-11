import { useState } from "react";

const DropArea = ({ classes, onDrop, onDragOver }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={`
        ${classes}
        border-dashed rounded-md 
        transition-all 
        
        border
        ${
          isActive
            ? "bg-blue-100 border-blue-500 opaciity-100 h-10 flex justify-center items-baseline"
            : "opacity-0"
        }
      `}
      onDragEnter={() => setIsActive(true)}
      onDragLeave={() => setIsActive(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsActive(true);
        onDragOver?.(e);
      }}
      onDrop={(e) => {
        setIsActive(false);
        onDrop?.(e);
      }}
    >
      {" "}
      {isActive && "Drop Here"}
    </div>
  );
};

export default DropArea;
