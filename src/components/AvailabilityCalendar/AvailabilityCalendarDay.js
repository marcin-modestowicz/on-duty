// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import { getDayName } from "../../utils/date";
import type Availability from "../../models/Availability";
import {
  type AvailabilityStatus,
  AVAILABILITY_STATUSES,
  AVAILABILITY_STATUSES_NAMES
} from "../../models/Availability";
import styles from "./AvailabilityCalendarDay.scss";

type Props = {
  date: Date,
  availability: Availability,
  onClick: (date: Date, availability: AvailabilityStatus) => void
};

@observer
class AvailabilityCalendarDay extends Component<Props> {
  handleClick = () => {
    const { availability, onClick } = this.props;
    const status = availability.status;

    availability.toggle();

    onClick(this.props.date, availability.status);
  };

  renderDayContent(statusName: string) {
    const date = this.props.date;

    return (
      <div
        key={statusName}
        className={classnames(styles.day, styles[statusName])}
      >
        <div className={styles.name}>{getDayName(date)}</div>
        <div className={styles.number}>{date.getDate()}</div>
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
