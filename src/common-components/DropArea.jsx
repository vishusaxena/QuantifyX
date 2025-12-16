import { useState } from "react";

const DropArea = ({ classes, onDrop, onDragOver, show = false }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className={`
        
        border-dashed rounded-md 
        transition-all 
        
        border
        ${
          isActive
            ? `bg-blue-100 border-blue-500 opacity-100 ${classes} flex justify-center items-center`
            : `opacity-0 ${show ? `${classes} ` : ""}`
        }
      `}
      onDragEnter={() => setIsActive(true)}
      onDragLeave={() => setIsActive(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsActive(true);
        onDragOver(e);
      }}
      onDrop={(e) => {
        setIsActive(false);
        onDrop(e);
      }}
    >
      {isActive && "Drop Here"}
    </div>
  );
};

export default DropArea;
