import React, { Component } from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import {
  AVAILABILITY_STATUSES_NAMES,
  AVAILABILITY_STATUSES_COLORS
} from "../../models/Availability";
import type User from "../../models/User";
import type Shift from "../../models/Shift";
import CheckboxButton from "../CheckboxButton";
import styles from "./ShiftsCalendarModal.scss";

/* global SyntheticInputEvent */

type Props = {
  users: User[],
  day: { date: Date, shift: Shift },
  onClose: () => void
};

@observer
class ShiftsCalendarModal extends Component {
  handleInputChange = (event: SyntheticInputEvent) => {
    const userId = event.target.value;
    const user = this.props.users.find(({ id }) => id === userId);

    if (user) {
      this.props.day.shift.toggleUser(user);
    }
  };

  renderUser(user) {
    const day = this.props.day;
    const userId = user.id;
    const isUserActive = day.shift.onDuty.some(
      activeUser => activeUser.id === userId
    );
    const dayInAvailabilityCalendar = user.availabilityCalendar.days.find(
      ({ date }) => date.toString() === day.date.toString()
    );
    const availabilityStatus = dayInAvailabilityCalendar.availability.status;
    const statusName = AVAILABILITY_STATUSES_NAMES[availabilityStatus];
    const statusColor = AVAILABILITY_STATUSES_COLORS[availabilityStatus];

    return (
      <CheckboxButton
        key={userId}
        id={userId}
        value={userId}
        label={user.name}
        checked={isUserActive}
        onChange={this.handleInputChange}
        color={statusColor}
      />
    );
  }

  render() {
    const { users, onClose } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <div role="button" className={styles.button} onClick={onClose}>
              Close
            </div>
          </div>
          <div className={styles.content}>
            {users.map(user => this.renderUser(user))}
          </div>
        </div>
      </div>
    );
  }
}

export default ShiftsCalendarModal;
