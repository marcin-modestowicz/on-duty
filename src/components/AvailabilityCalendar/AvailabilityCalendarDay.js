// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import type Availability, {
  AvailabilityStatus
} from "../../models/Availability";
import { AVAILABILITY_STATUSES } from "../../models/Availability";
import styles from "./AvailabilityCalendar.scss";

type Props = {
  availability: Availability
};

@observer
class CalendarDay extends Component<Props> {
  handleClick = () => {
    this.props.availability.toggle();
  };

  getClassName(status: AvailabilityStatus): string {
    switch (status) {
      case AVAILABILITY_STATUSES.KEEN:
        return "keen";
      case AVAILABILITY_STATUSES.BUSY:
        return "busy";
      default:
        return "free";
    }
  }

  render() {
    const status = this.props.availability.status;
    const className = this.getClassName(status);

    return (
      <div
        className={classnames(styles.day, styles[className])}
        role="button"
        title="Click to toggle availability"
        onClick={this.handleClick}
      >
        {status}
      </div>
    );
  }
}

export default CalendarDay;
