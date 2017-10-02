// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { USER_TYPES } from "../../models/User";
import AddUser from "./AddUser";

describe("AddUser component", () => {
  let onAdd;
  let addUser;
  let instance;

  beforeEach(() => {
    onAdd = jest.fn();
    addUser = shallow(<AddUser onAdd={onAdd} />);
    instance = addUser.instance();
  });

  test("should render with button disabled", () => {
    expect(toJson(addUser)).toMatchSnapshot();
  });

  test("should render with button enabled", () => {
    instance.handleNameChange({ target: { value: "Marty McFly" } });
    expect(toJson(addUser)).toMatchSnapshot();
  });

  describe("handleNameChange method", () => {
    test("should update user name", () => {
      instance.handleNameChange({ target: { value: "Batman" } });
      expect(instance.userName).toBe("Batman");
    });
  });

  describe("handleTypeChange method", () => {
    test("should update user type", () => {
      instance.handleTypeChange({ target: { value: USER_TYPES.DOCTOR } });
      expect(instance.userType).toBe(USER_TYPES.DOCTOR);
    });
  });

  describe("handleUserAdd method", () => {
    describe("if user name is not filled", () => {
      test("should do nothing", () => {
        instance.handleUserAdd();
        expect(onAdd).not.toHaveBeenCalled();
      });
    });

    describe("if user name is filled", () => {
      beforeEach(() => {
        instance.handleNameChange({ target: { value: "Bronco Billy" } });
        instance.handleUserAdd();
      });

      test("should call onAdd prop", () => {
        expect(onAdd).toHaveBeenCalledWith("Bronco Billy", USER_TYPES.RESIDENT);
      });

      test("should reset user name and type", () => {
        expect(instance.userName).toBe("");
        expect(instance.userType).toBe(USER_TYPES.RESIDENT);
      });
    });
  });
});
