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
      new User("a1", "user1", false, false),
      new User("a2", "user2", true, false)
    ];
    users.forEach((user, index) => {
      user.id = `a${index}`;
    });
    shiftsCalendarDay = shallow(
      <ShiftsCalendarDay
        date={new Date(2017, 9, 1)}
        users={users}
        onClick={jest.fn()}
      />
    );
  });

  test("should render", () => {
    expect(toJson(shiftsCalendarDay)).toMatchSnapshot();
  });
});
