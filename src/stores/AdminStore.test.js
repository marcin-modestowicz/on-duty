// @flow
import firebase from "../firebase";
import AdminStore from "./AdminStore";

describe("AdminStore store", () => {
  let centerDataSnapshotMock;
  let refMock;
  let pushMock;
  let updateMock;
  let setMock;
  let adminStore;

  beforeAll(() => {
    centerDataSnapshotMock = { val: () => "test value" };
    pushMock = jest.fn(() => ({ key: "testUserId" }));
    updateMock = jest.fn();
    setMock = jest.fn();
    refMock = jest.fn(() => ({
      on: () => Promise.resolve(centerDataSnapshotMock),
      push: pushMock,
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
    adminStore = new AdminStore("a1");
  });

  describe("on initialization", () => {
    test("should query firebase database to get center data", () => {
      expect(refMock).toHaveBeenCalled();
    });
  });

  describe("addUser method", () => {
    beforeEach(() => {
      adminStore.addUser("Superman", "super@man.com", true, true);
    });

    test("should get userId from database", () => {
      expect(refMock).toHaveBeenCalledWith("users");
    });

    test("should update user and center data", () => {
      expect(updateMock).toHaveBeenCalledWith({
        "/users/testUserId": {
          center: "spsk2",
          name: "Superman",
          isDoctor: true,
          isSpecialist: true,
          isAdmin: false
        },
        "/centers/spsk2/users/testUserId": true
      });
    });

    test("should set email key", () => {
      expect(refMock).toHaveBeenCalledWith("/emailToUserId/super@man%2Ecom");
      expect(setMock).toHaveBeenCalledWith("testUserId");
    });
  });
});
