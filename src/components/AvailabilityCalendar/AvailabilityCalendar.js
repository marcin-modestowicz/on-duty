// @flow
import React, { Component } from "react";
import User from "../../models/User";
import { type AvailabilityCalendar as AvailabilityCalendarModel } from "../../models/Calendar";
import AvailabilityCalendarDay from "./AvailabilityCalendarDay";
import styles from "./AvailabilityCalendar.scss";

type Props = {
  calendar: AvailabilityCalendarModel
};

class AvailabilityCalendar extends Component<Props> {
  static Day = AvailabilityCalendarDay;

  render() {
    return (
      <div className={styles.root}>
        {this.props.calendar.days.map((availability, index) => (
          <AvailabilityCalendar.Day
            key={index}
            day={index + 1}
            availability={availability}
          />
        ))}
      </div>
    );
  }
}

export default AvailabilityCalendar;
