// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import type Availability, {
  AvailabilityStatus
} from "../../models/Availability";
import {
  AVAILABILITY_STATUSES,
  AVAILABILITY_STATUSES_NAMES
} from "../../models/Availability";
import styles from "./AvailabilityCalendarDay.scss";

type Props = {
  day: number,
  availability: Availability
};

@observer
class AvailabilityCalendarDay extends Component<Props> {
  statuses: AvailabilityStatus[] = [
    AVAILABILITY_STATUSES.FREE,
    AVAILABILITY_STATUSES.KEEN,
    AVAILABILITY_STATUSES.BUSY
  ];

  handleClick = () => {
    this.props.availability.toggle();
  };

  renderDayContent(status: string) {
    return (
      <div key={status} className={classnames(styles.day, styles[status])}>
        <div className={styles.dayName}>Monday</div>
        <div className={styles.dayNum}>{this.props.day}</div>
      </div>
    );
  }

  render() {
    const status = this.props.availability.status;
    const isFreeActive = status === AVAILABILITY_STATUSES.FREE;
    const isKeenActive = status === AVAILABILITY_STATUSES.KEEN;
    const isBusyActive = status === AVAILABILITY_STATUSES.BUSY;

    return (
      <div
        className={classnames(styles.root, {
          [styles.freeActive]: isFreeActive,
          [styles.keenActive]: isKeenActive,
          [styles.busyActive]: isBusyActive
        })}
        role="button"
        title="Click to toggle availability"
        onClick={this.handleClick}
      >
        {this.statuses.map(_status =>
          this.renderDayContent(
            AVAILABILITY_STATUSES_NAMES[_status].toLowerCase()
          )
        )}
      </div>
    );
  }
}

export default AvailabilityCalendarDay;
