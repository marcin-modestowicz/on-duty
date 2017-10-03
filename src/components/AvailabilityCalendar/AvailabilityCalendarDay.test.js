// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Availability from "../../models/Availability";
import AvailabilityCalendarDay from "./AvailabilityCalendarDay";

describe("AvailabilityCalendarDay component", () => {
  let availabilityCalendarDay;

  beforeAll(() => {
    const availability = new Availability();
    availabilityCalendarDay = shallow(
      <AvailabilityCalendarDay availability={availability} />
    );
  });

  test("should render", () => {
    expect(toJson(availabilityCalendarDay)).toMatchSnapshot();
  });
});
