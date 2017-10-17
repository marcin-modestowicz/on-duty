// @flow
import React, { Component } from "react";
import User from "../../models/User";
import { type AvailabilityCalendar as AvailabilityCalendarModel } from "../../models/Calendar";
import { type AvailabilityStatus } from "../../models/Availability";
import AvailabilityCalendarSetAll from "./AvailabilityCalendarSetAll";
import AvailabilityCalendarDay from "./AvailabilityCalendarDay";
import styles from "./AvailabilityCalendar.scss";

type Props = {
  calendar: AvailabilityCalendarModel
};

class AvailabilityCalendar extends Component<Props> {
  static SetAll = AvailabilityCalendarSetAll;
  static Day = AvailabilityCalendarDay;

  handleToggleAll = (status: AvailabilityStatus) => {
    this.props.calendar.days.forEach(day => {
      day.status = status;
    });
  };

  render() {
    return (
      <div className={styles.root}>
        <AvailabilityCalendar.SetAll onClick={this.handleToggleAll} />
        <div className={styles.calendar}>
          {this.props.calendar.days.map((availability, index) => (
            <AvailabilityCalendar.Day
              key={index}
              day={index + 1}
              availability={availability}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default AvailabilityCalendar;
