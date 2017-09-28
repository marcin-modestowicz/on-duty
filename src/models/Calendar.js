// @flow
export type DayStatus = "free" | "keen" | "busy";

class Day {
  status: DayStatus = "free";

  setStatus = (status: DayStatus) => {
    this.status = status;
  };
}

class Calendar {
  days: Day[];

  constructor() {
    for (let days = 0; days < 31; days += 1) {
      this.days.push(new Day());
    }
  }
}

export default Calendar;
