// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Login from "./Login";

describe("Login component", () => {
  let login;

  beforeAll(() => {
    login = shallow(<Login onLogin={jest.fn()} />);
  });

  test("should render", () => {
    expect(toJson(login)).toMatchSnapshot();
  });
});
