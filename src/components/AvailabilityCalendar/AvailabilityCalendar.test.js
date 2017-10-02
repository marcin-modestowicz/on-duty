// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { AvailabilityCalendar as AvailabilityCalendarModel } from "../../models/Calendar";
import AvailabilityCalendar from "./AvailabilityCalendar";

describe("AvailabilityCalendar component", () => {
  let RealDate;
  let availabilityCalendar;

  beforeAll(() => {
    RealDate = Date;

    const date = new Date(2017, 9, 1);
    global.Date = function DateMock(...args) {
      return args.length ? new RealDate(...args) : date;
    };

    const calendar = new AvailabilityCalendarModel();
    availabilityCalendar = shallow(
      <AvailabilityCalendar calendar={calendar} />
    );
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test("should render", () => {
    expect(toJson(availabilityCalendar)).toMatchSnapshot();
  });
});
