// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import { getDayName } from "../../utils/date";
import type User from "../../models/User";
import styles from "./ShiftsCalendarDay.scss";

type Props = {
  date: Date,
  users: User[],
  onClick: (date: Date) => void
};

@observer
class ShiftsCalendarDay extends Component<Props> {
  handleClick = () => {
    this.props.onClick(this.props.date);
  };

  render() {
    const { date, users } = this.props;

    return (
      <div className={styles.root} onClick={this.handleClick}>
        <div className={styles.shift}>
          {users.map(({ id, name }) => (
            <div key={id} className={styles.user}>
              {name}
            </div>
          ))}
        </div>
        <div className={styles.day}>
          <div className={styles.name}>{getDayName(date)}</div>
          <div className={styles.number}>{date.getDate()}</div>
        </div>
      </div>
    );
  }
}

export default ShiftsCalendarDay;
