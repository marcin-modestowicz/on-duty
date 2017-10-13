// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import User from "../../models/User";
import ShiftsCalendarDay from "./ShiftsCalendarDay";

describe("ShiftsCalendarDay component", () => {
  let shiftsCalendarDay;

  beforeAll(() => {
    const users = [
      new User("user1", false, false),
      new User("user2", true, false)
    ];
    users.forEach((user, index) => {
      user.id = `a${index}`;
    });
    shiftsCalendarDay = shallow(<ShiftsCalendarDay day={1} users={users} />);
  });

  test("should render", () => {
    expect(toJson(shiftsCalendarDay)).toMatchSnapshot();
  });
});
