// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import type Availability from "../../models/Availability";
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
  handleClick = () => {
    this.props.availability.toggle();
  };

  renderDayContent(statusName: string) {
    return (
      <div
        key={statusName}
        className={classnames(styles.day, styles[statusName])}
      >
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
        {Object.keys(AVAILABILITY_STATUSES).map(statusKey => {
          const statusName =
            AVAILABILITY_STATUSES_NAMES[AVAILABILITY_STATUSES[statusKey]];

          return this.renderDayContent(statusName.toLowerCase());
        })}
      </div>
    );
  }
}

export default AvailabilityCalendarDay;
