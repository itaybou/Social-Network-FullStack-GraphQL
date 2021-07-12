import React from "react";

interface CloseButtonProps {
  action: () => void;
  back: boolean;
}

function CloseButton({ action, back }: CloseButtonProps) {
  return (
    <span className="back-arrow" onClick={action}>
      <i
        className={back ? "fa fa-arrow-left" : "fa fa-times"}
        aria-hidden="true"
      />
    </span>
  );
}

export default CloseButton;
