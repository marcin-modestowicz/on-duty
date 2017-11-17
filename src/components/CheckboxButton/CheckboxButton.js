// @flow

import React from "react";
import classnames from "classnames";
import styles from "./CheckboxButton.scss";

/* global SyntheticInputEvent */

type Props = {
  onChange: (event: SyntheticInputEvent<*>) => void,
  color?: "red" | "yellow" | "green",
  size?: "small" | "big" | "full",
  marginless?: boolean,
  value: string,
  label: string,
  checked: boolean
};

const CheckboxButton = ({
  value,
  checked,
  onChange,
  color = "default",
  size = "auto",
  marginless,
  label
}: Props) => (
  <div
    className={classnames(styles.root, styles[size], {
      [styles.marginless]: marginless
    })}
  >
    <input
      type="checkbox"
      id={value}
      value={value}
      checked={checked}
      onChange={onChange}
      className={styles.input}
    />
    <label htmlFor={value} className={classnames(styles.label, styles[color])}>
      {label}
    </label>
  </div>
);

export default CheckboxButton;
