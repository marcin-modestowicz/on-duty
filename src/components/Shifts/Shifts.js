// @flow
import React from "react";
import { observer } from "mobx-react";
import { type ShiftsCalendar as ShiftsCalendarModel } from "../../models/Calendar";
import ShiftsCalendar from "../ShiftsCalendar";
import ShiftsStatistics from "../ShiftsStatistics";

type Props = {
  calendar: ShiftsCalendarModel
};

const Shifts = ({ calendar }: Props) => (
  <div>
    <header>
      <h3>Shifts</h3>
    </header>
    <ShiftsCalendar calendar={calendar} />
    <ShiftsStatistics summary={calendar.summary} />
  </div>
);

export default observer(Shifts);
