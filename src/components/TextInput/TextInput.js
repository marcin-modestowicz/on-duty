// @flow

import React from "react";
import classnames from "classnames";
import styles from "./TextInput.scss";

/* global SyntheticInputEvent */

type Props = {
  id: string,
  value: string,
  label: string,
  type?: string,
  className?: string,
  isInvalid?: boolean,
  marginless?: boolean,
  onChange?: (event: SyntheticInputEvent<*>) => void,
  onBlur?: () => void,
  onFocus?: () => void
};

const TextInput = ({
  id,
  value,
  className,
  isInvalid,
  label,
  type,
  marginless,
  onChange,
  onBlur,
  onFocus
}: Props) => (
  <div
    className={classnames(
      styles.root,
      { [styles.error]: isInvalid, [styles.marginless]: marginless },
      className
    )}
    htmlFor={id}
  >
    <label className={styles.label}>{label}</label>
    <input
      id={id}
      type={type || "text"}
      className={styles.input}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  </div>
);

export default TextInput;
