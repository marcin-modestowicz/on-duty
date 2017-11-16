// @flow
import React from "react";
import classnames from "classnames";
import styles from "./Button.scss";

/* global React$Node */

type Props = {
  onClick?: () => void,
  color?: "red" | "yellow" | "green",
  title?: string,
  type?: string,
  children?: React$Node,
  disabled?: boolean,
  className?: string
};

const Button = ({
  onClick,
  color,
  title,
  type = "button",
  disabled,
  className,
  children
}: Props) => (
  <button
    type="submit"
    className={classnames(styles.root, styles[color || "default"], className)}
    title={title}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
