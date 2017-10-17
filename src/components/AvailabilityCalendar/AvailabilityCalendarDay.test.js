// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Availability from "../../models/Availability";
import AvailabilityCalendarDay from "./AvailabilityCalendarDay";

describe("AvailabilityCalendarDay component", () => {
  let availability;
  let availabilityCalendarDay;

  beforeAll(() => {
    availability = new Availability();
    availabilityCalendarDay = shallow(
      <AvailabilityCalendarDay
        date={new Date(2017, 9, 1)}
        availability={availability}
      />
    );
  });

  test("should render with free status active", () => {
    expect(toJson(availabilityCalendarDay)).toMatchSnapshot();
  });

  test("should render with keen status active", () => {
    availability.toggle();
    expect(toJson(availabilityCalendarDay)).toMatchSnapshot();
  });

  test("should render with busy status active", () => {
    availability.toggle();
    expect(toJson(availabilityCalendarDay)).toMatchSnapshot();
  });
});
