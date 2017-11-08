// @flow
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
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
    test("should update isDoctor property", () => {
      instance.handleTypeChange({ target: { value: "isDoctor" } });
      expect(instance.isDoctor).toBeTruthy();
    });

    test("should update isSpecialist property", () => {
      instance.handleTypeChange({ target: { value: "isSpecialist" } });
      expect(instance.isSpecialist).toBeTruthy();
    });
  });

  describe("handleUserAdd method", () => {
    describe("if user name is not filled", () => {
      test("should do nothing", () => {
        instance.handleUserAdd();
        expect(onAdd).not.toHaveBeenCalled();
      });
    });

    describe("if email is not filled", () => {
      test("should do nothing", () => {
        instance.handleNameChange({ target: { value: "Bronco Billy" } });
        instance.handleUserAdd();
        expect(onAdd).not.toHaveBeenCalled();
      });
    });

    describe("if user name and email is filled", () => {
      beforeEach(() => {
        instance.handleNameChange({ target: { value: "Bronco Billy" } });
        instance.handleEmailChange({ target: { value: "bronco@billy.com" } });
        instance.handleTypeChange({ target: { value: "isDoctor" } });
        instance.handleTypeChange({ target: { value: "isSpecialist" } });
        instance.handleUserAdd();
      });

      test("should call onAdd prop", () => {
        expect(onAdd).toHaveBeenCalledWith(
          "Bronco Billy",
          "bronco@billy.com",
          true,
          true
        );
      });

      test("should reset fields values properties", () => {
        expect(instance.userName).toBe("");
        expect(instance.emailAddress).toBe("");
        expect(instance.userType).toBeFalsy();
      });
    });
  });
});
