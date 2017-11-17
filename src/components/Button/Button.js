// @flow
import React from "react";
import classnames from "classnames";
import styles from "./Button.scss";

/* global React$Node */

type Props = {
  onClick?: () => void,
  color?: "red" | "yellow" | "green",
  size?: "small" | "big" | "full",
  title?: string,
  type?: string,
  children?: React$Node,
  disabled?: boolean,
  marginless?: boolean
};

const Button = ({
  onClick,
  color = "default",
  size = "auto",
  title,
  type = "button",
  disabled,
  marginless,
  children
}: Props) => (
  <button
    type="submit"
    className={classnames(styles.root, styles[color], styles[size], {
      [styles.marginless]: marginless
    })}
    title={title}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
