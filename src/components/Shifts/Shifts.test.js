// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import User from "../../models/User";
import { ShiftsCalendar as ShiftsCalendarModel } from "../../models/Calendar";
import Shifts from "./Shifts";

describe("Shifts component", () => {
  let RealDate;
  let shifts;

  beforeAll(() => {
    RealDate = Date;

    const date = new Date(2017, 9, 1);
    global.Date = function DateMock(...args) {
      return args.length ? new RealDate(...args) : date;
    };

    const calendar = new ShiftsCalendarModel();
    const users = [
      new User("user1", false, false),
      new User("user2", true, false),
      new User("user3", false, true),
      new User("user4", false, true)
    ];
    users.forEach((user, index) => {
      user.id = `a${index}`;
    });
    calendar.fillCalendar(users);
    shifts = shallow(<Shifts calendar={calendar} />);
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test("should render", () => {
    expect(toJson(shifts)).toMatchSnapshot();
  });
});
