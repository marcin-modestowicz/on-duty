// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import type Availability from "../../models/Availability";
import styles from "./AvailabilityCalendar.scss";

type Props = {
  availability: Availability
};

@observer
class CalendarDay extends Component<Props> {
  handleClick = () => {
    this.props.availability.toggle();
  };

  render() {
    return (
      <div
        className={styles.day}
        role="button"
        title="Click to toggle availability"
        onClick={this.handleClick}
      >
        {this.props.availability.status}
      </div>
    );
  }
}

export default CalendarDay;
