// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import User from "../../models/User";
import ShowUser from "./ShowUser";

describe("ShowUser component", () => {
  let RealDate;
  let showUser;

  beforeAll(() => {
    RealDate = Date;

    const date = new Date(2017, 9, 1);
    global.Date = function DateMock(...args) {
      return args.length ? new RealDate(...args) : date;
    };

    const user = new User("a1", "Marty McFly", true, true);
    showUser = shallow(<ShowUser user={user} />);
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test("should render", () => {
    expect(toJson(showUser)).toMatchSnapshot();
  });
});
