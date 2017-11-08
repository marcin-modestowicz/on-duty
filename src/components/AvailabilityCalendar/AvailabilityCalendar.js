// @flow
import React, { Component } from "react";
import User from "../../models/User";
import { type AvailabilityCalendar as AvailabilityCalendarModel } from "../../models/Calendar";
import { type AvailabilityStatus } from "../../models/Availability";
import type UserStore from "../../stores/UserStore";
import AvailabilityCalendarSetAll from "./AvailabilityCalendarSetAll";
import AvailabilityCalendarDay from "./AvailabilityCalendarDay";
import styles from "./AvailabilityCalendar.scss";

type Props = {
  calendar: AvailabilityCalendarModel,
  onDayToggle: (date: Date, status: AvailabilityStatus) => void
};

class AvailabilityCalendar extends Component<Props> {
  static SetAll = AvailabilityCalendarSetAll;
  static Day = AvailabilityCalendarDay;

  handleToggleAll = (status: AvailabilityStatus) => {
    this.props.calendar.days.forEach(({ availability }) => {
      availability.status = status;
    });
  };

  render() {
    return (
      <div className={styles.root}>
        <AvailabilityCalendar.SetAll onClick={this.handleToggleAll} />
        <div className={styles.calendar}>
          {this.props.calendar.days.map(({ date, availability }) => (
            <AvailabilityCalendar.Day
              key={date.getTime()}
              date={date}
              availability={availability}
              onClick={this.props.onDayToggle}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default AvailabilityCalendar;
