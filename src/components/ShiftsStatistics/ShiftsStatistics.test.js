// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import ShiftsStatistics from "./ShiftsStatistics";

describe("ShiftsStatistics component", () => {
  let shiftsStatistics;

  beforeAll(() => {
    const summary = [
      {
        id: "abc1",
        name: "John Doe",
        power: 2,
        highPreference: 2,
        highPreferenceFilled: 1,
        lowPreference: 5,
        lowPreferenceFilled: 1,
        shifts: 4,
        shiftsShare: "20%",
        satisfaction: 0.1
      }
    ];
    shiftsStatistics = shallow(<ShiftsStatistics summary={summary} />);
  });

  test("should render", () => {
    expect(toJson(shiftsStatistics)).toMatchSnapshot();
  });
});
