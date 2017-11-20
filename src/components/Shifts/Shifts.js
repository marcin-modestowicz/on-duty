// @flow
import React from "react";
import { observer } from "mobx-react";
import { type ShiftsCalendar as ShiftsCalendarModel } from "../../models/Calendar";
import type User from "../../models/User";
import type Shift from "../../models/Shift";
import ShiftsCalendar from "../ShiftsCalendar";
import ShiftsStatistics from "../ShiftsStatistics";

type Props = {
  calendar: ShiftsCalendarModel,
  summary: Object[],
  users: User[],
  onToggleUser: (date: Date, shift: Shift) => void
};

const Shifts = ({ calendar, summary, users, onToggleUser }: Props) => (
  <div>
    <div>
      <h3>Shifts</h3>
      <ShiftsCalendar
        calendar={calendar}
        users={users}
        onToggleUser={onToggleUser}
      />
    </div>
    {summary && (
      <div>
        <h3>Statistics</h3>
        <ShiftsStatistics summary={summary} />
      </div>
    )}
  </div>
);

export default observer(Shifts);
