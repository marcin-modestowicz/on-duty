// @flow
import React from "react";
import { observer } from "mobx-react";
import { type ShiftsCalendar as ShiftsCalendarModel } from "../../models/Calendar";
import type User from "../../models/User";
import ShiftsCalendar from "../ShiftsCalendar";
import ShiftsStatistics from "../ShiftsStatistics";

type Props = {
  calendar: ShiftsCalendarModel,
  users: User[]
};

const Shifts = ({ calendar, users }: Props) => (
  <div>
    <header>
      <h3>Shifts</h3>
    </header>
    <ShiftsCalendar calendar={calendar} users={users} />
    <ShiftsStatistics summary={calendar.summary} />
  </div>
);

export default observer(Shifts);
