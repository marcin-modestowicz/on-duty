// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import AvailabilityCalendarSetAll from "./AvailabilityCalendarSetAll";

describe("AvailabilityCalendarSetAll component", () => {
  let availabilityCaledarSetAll;

  beforeAll(() => {
    availabilityCaledarSetAll = shallow(
      <AvailabilityCalendarSetAll onClick={jest.fn()} />
    );
  });

  test("should render properly", () => {
    expect(toJson(availabilityCaledarSetAll)).toMatchSnapshot();
  });
});
