// @flow
import firebase from "../firebase";
import User from "../models/User";
import UserStore from "./UserStore";

describe("UserStore store", () => {
  let userDataSnapshotMock;
  let availabilityCalendarSnapshotMock;
  let refMock;
  let updateMock;
  let setMock;
  let userStore;

  beforeAll(() => {
    userDataSnapshotMock = { val: () => "test value" };
    updateMock = jest.fn();
    setMock = jest.fn();
    refMock = jest.fn(() => ({
      on: (param, callback) => {
        callback(userDataSnapshotMock);
      },
      set: setMock,
      update: updateMock
    }));
    jest
      .spyOn(firebase, "database")
      .mockImplementation(() => ({ ref: refMock }));
  });

  afterAll(() => {
    // $FlowFixMe - jest bug https://github.com/facebook/jest/issues/4436
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    userStore = new UserStore();
  });

  describe("on initialization", () => {
    describe("if no userId was passed", () => {
      test("should do nothing", () => {
        expect(refMock).not.toHaveBeenCalled();
      });
    });

    describe("if userId was passed", () => {
      let getUserDataSpy;

      beforeEach(() => {
        getUserDataSpy = jest.spyOn(UserStore.prototype, "getUserData");
        userStore = new UserStore("a1");
      });

      test("should query firebase database to get user data", () => {
        expect(getUserDataSpy).toHaveBeenCalledWith(userDataSnapshotMock);
      });
    });
  });

  describe("computed property isAdmin", () => {
    test("should return false if there's no user", () => {
      expect(userStore.isAdmin).toBeFalsy();
    });

    test("should return false if user has isAdmin property set to false", () => {
      userStore.user = new User("a1", "Jake Doe");

      expect(userStore.isAdmin).toBeFalsy();
    });

    test("should return true if user has isAdmin property set to true", () => {
      userStore.user = new User(
        "a1",
        "Jake Doe",
        false,
        false,
        undefined,
        true
      );

      expect(userStore.isAdmin).toBeTruthy();
    });
  });

  describe("getUserData method", () => {
    test("should create new user", () => {
      const userData = {
        name: "Jane Doe",
        isDoctor: true,
        isSpecialist: true,
        isAdmin: true
      };

      userStore.getUserData({
        key: "a1",
        val: () => userData
      });

      expect(userStore.user).toMatchObject(userData);
    });
  });

  describe("setDayStatus method", () => {
    beforeEach(() => {
      userStore.user = new User("a2", "Homer Simpson");
    });

    test("should update ref", () => {
      const date = new Date();
      const status = -1;

      userStore.setDayStatus(date, status);

      expect(refMock).toHaveBeenCalledWith(
        `/users/${userStore.user.id}/availabilityCalendar/${date.getTime()}`
      );
      expect(setMock).toHaveBeenCalledWith(status);
    });
  });

  describe("setAllDaysStatus method", () => {
    beforeEach(() => {
      userStore.user = new User("a2", "Homer Simpson");
    });

    test("should update ref", () => {
      const status = -1;
      const availabilityCalendar = userStore.user.availabilityCalendar.days.reduce(
        (sum, day) => {
          sum[day.date.getTime()] = status;
          return sum;
        },
        {}
      );

      userStore.setAllDaysStatus(userStore.user.availabilityCalendar, status);

      expect(refMock).toHaveBeenCalledWith(
        `/users/${userStore.user.id}/availabilityCalendar`
      );
      expect(setMock).toHaveBeenCalledWith(availabilityCalendar);
    });
  });
});
