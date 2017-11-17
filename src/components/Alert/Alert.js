// @flow
import React from "react";
import styles from "./Alert.scss";

/* global React$Node */

type Props = {
  children?: React$Node
};

const Alert = ({ children }: Props) => (
  <div className={styles.root}>{children}</div>
);

export default Alert;
