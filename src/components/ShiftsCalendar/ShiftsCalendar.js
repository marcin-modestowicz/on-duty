// @flow
import React, { Component } from "react";
import { observable, computed, action } from "mobx";
import { observer } from "mobx-react";
import type User from "../../models/User";
import type Shift from "../../models/Shift";
import { type ShiftsCalendar as ShiftsCalendarModel } from "../../models/Calendar";
import ShiftsCalendarDay from "./ShiftsCalendarDay";
import ShiftsCalendarModal from "./ShiftsCalendarModal";
import styles from "./ShiftsCalendar.scss";

type Props = {
  calendar: ShiftsCalendarModel,
  users: User[],
  onToggleUser: (date: Date, shift: Shift) => void
};

@observer
class ShiftsCalendar extends Component<Props> {
  static Day = ShiftsCalendarDay;
  static Modal = ShiftsCalendarModal;
  @observable activeDay: ?{ date: Date, shift: Shift };

  @action
  handleDayClick = (date: Date) => {
    const activeDay = this.props.calendar.days.find(day => day.date === date);

    if (activeDay) {
      this.activeDay = activeDay;
    }
  };

  @action
  handleModalClose = () => {
    this.activeDay = null;
  };

  @computed
  get isModalVisible(): boolean {
    return !!(this.props.users && this.activeDay);
  }

  render() {
    return (
      <div className={styles.root}>
        {this.isModalVisible && (
          <ShiftsCalendar.Modal
            users={this.props.users}
            day={this.activeDay}
            onToggleUser={this.props.onToggleUser}
            onClose={this.handleModalClose}
          />
        )}
        {this.props.calendar.days.map(({ date, shift }) => (
          <ShiftsCalendar.Day
            key={date.getTime()}
            date={date}
            users={shift.onDuty}
            onClick={this.handleDayClick}
          />
        ))}
      </div>
    );
  }
}

export default ShiftsCalendar;
