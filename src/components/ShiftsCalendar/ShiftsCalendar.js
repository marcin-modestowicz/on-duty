// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import User from "../../models/User";
import { type ShiftsCalendar as ShiftsCalendarModel } from "../../models/Calendar";
import ShiftsCalendarDay from "./ShiftsCalendarDay";
import styles from "./ShiftsCalendar.scss";

type Props = {
  calendar: ShiftsCalendarModel
};

@observer
class ShiftsCalendar extends Component<Props> {
  static Day = ShiftsCalendarDay;

  render() {
    return (
      <div className={styles.root}>
        {this.props.calendar.days.map((shift, index) => (
          <ShiftsCalendar.Day
            key={index}
            day={index + 1}
            users={shift.onDuty}
          />
        ))}
      </div>
    );
  }
}

export default ShiftsCalendar;
