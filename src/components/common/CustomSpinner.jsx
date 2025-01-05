import React from "react";

const CustomSpinner = ({ size = 20, color = "#ffffff" }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    border: `2px solid ${color}`,
    borderTop: `2px solid transparent`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return <div style={spinnerStyle} className="custom-spinner" />;
};

export default CustomSpinner;
