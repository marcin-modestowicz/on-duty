// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import User from "../../models/User";
import { ShiftsCalendar as ShiftsCalendarModel } from "../../models/Calendar";
import ShiftsCalendar from "./ShiftsCalendar";

describe("ShiftsCalendar component", () => {
  let RealDate;
  let shiftsCalendar;

  beforeAll(() => {
    RealDate = Date;

    const date = new Date(2017, 9, 1);
    global.Date = function DateMock(...args) {
      return args.length ? new RealDate(...args) : date;
    };

    const calendar = new ShiftsCalendarModel();
    const users = [
      new User("a1", "user1", false, false),
      new User("a2", "user2", true, false),
      new User("a3", "user3", false, true),
      new User("a4", "user4", false, true)
    ];
    calendar.fillCalendar(users);
    shiftsCalendar = shallow(
      <ShiftsCalendar calendar={calendar} users={users} />
    );
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test("should render", () => {
    expect(toJson(shiftsCalendar)).toMatchSnapshot();
  });
});
