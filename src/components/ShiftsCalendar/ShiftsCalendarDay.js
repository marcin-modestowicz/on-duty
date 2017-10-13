// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import type User from "../../models/User";
import styles from "./ShiftsCalendarDay.scss";

type Props = {
  day: number,
  users: User[]
};

@observer
class ShiftsCalendarDay extends Component<Props> {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.shift}>
          {this.props.users.map(({ id, name }) => (
            <div key={id} className={styles.user}>
              {name}
            </div>
          ))}
        </div>
        <div className={styles.day}>
          <div className={styles.name}>Monday</div>
          <div className={styles.number}>{this.props.day}</div>
        </div>
      </div>
    );
  }
}

export default ShiftsCalendarDay;
