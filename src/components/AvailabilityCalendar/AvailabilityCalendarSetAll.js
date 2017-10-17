// @flow
import React, { Component } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import classnames from "classnames";
import {
  type AvailabilityStatus,
  AVAILABILITY_STATUSES,
  AVAILABILITY_STATUSES_NAMES
} from "../../models/Availability";
import styles from "./AvailabilityCalendarSetAll.scss";

type Props = {
  onClick: AvailabilityStatus => void
};

class AvailabilityCalendarSetAll extends Component<Props> {
  handleToggleAll = (status: AvailabilityStatus) => {
    return () => {
      this.props.onClick(status);
    };
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.label}>Set all:</div>
        {Object.keys(AVAILABILITY_STATUSES).map(statusKey => {
          const status = AVAILABILITY_STATUSES[statusKey];
          const statusName = AVAILABILITY_STATUSES_NAMES[status];

          return (
            <div
              key={status}
              role="button"
              className={classnames(
                styles.button,
                styles[statusName.toLowerCase()]
              )}
              title={`Click to set all to ${statusName}`}
              onClick={this.handleToggleAll(status)}
            >
              {statusName}
            </div>
          );
        })}
      </div>
    );
  }
}

export default AvailabilityCalendarSetAll;
