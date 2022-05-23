import React, { useState } from "react";

const CheckBoxWithLabel = ({
  labelOn,
  labelOff,
}: {
  labelOn: string;
  labelOff: string;
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  return (
    <label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      isChecked ? labelOn : labelOff
    </label>
  );
};

export default CheckBoxWithLabel;
