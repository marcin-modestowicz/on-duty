// @flow

import React from "react";
import classnames from "classnames";
import styles from "./CheckboxButton.scss";

/* global SyntheticInputEvent */

type Props = {
  onChange: (event: SyntheticInputEvent<*>) => void,
  color?: "red" | "yellow" | "green",
  value: string,
  label: string,
  checked: boolean,
  className?: string
};

const CheckboxButton = ({
  value,
  checked,
  onChange,
  color,
  className,
  label
}: Props) => (
  <div className={styles.root}>
    <input
      type="checkbox"
      id={value}
      value={value}
      checked={checked}
      onChange={onChange}
      className={styles.input}
    />
    <label
      htmlFor={value}
      className={classnames(
        styles.label,
        styles[color || "default"],
        className
      )}
    >
      {label}
    </label>
  </div>
);

export default CheckboxButton;
