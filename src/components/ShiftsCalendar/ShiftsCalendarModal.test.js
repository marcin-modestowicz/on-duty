// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Shift from "../../models/Shift";
import User from "../../models/User";
import { AVAILABILITY_STATUSES } from "../../models/Availability";
import ShiftsCalendarModal from "./ShiftsCalendarModal";

describe("ShiftsCalendarModal component", () => {
  let RealDate;
  let shiftsCalendarModal;

  beforeAll(() => {
    RealDate = Date;
    const date = new Date(2017, 9, 1);
    global.Date = function DateMock(...args) {
      return args.length ? new RealDate(...args) : date;
    };

    const users = [
      new User("user1", false, false),
      new User("user2", false, false, [AVAILABILITY_STATUSES.BUSY]),
      new User("user3", true, false, [AVAILABILITY_STATUSES.KEEN])
    ];
    users.forEach((user, index) => {
      user.id = `a${index}`;
    });
    const day = {
      date: new Date(2017, 10, 1),
      shift: new Shift([users[0]])
    };

    shiftsCalendarModal = shallow(
      <ShiftsCalendarModal day={day} users={users} onClose={jest.fn()} />
    );
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test("should render", () => {
    expect(toJson(shiftsCalendarModal)).toMatchSnapshot();
  });
});
