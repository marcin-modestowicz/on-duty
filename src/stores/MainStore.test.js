// @flow
import { USER_TYPES } from "../models/User";
import MainStore from "./MainStore";

describe("MainStore store", () => {
  let mainStore;

  beforeEach(() => {
    mainStore = new MainStore();
  });

  describe("addUser method", () => {
    test("should add new user", () => {
      mainStore.addUser("Superman", USER_TYPES.DOCTOR);

      const user = mainStore.users[0];

      expect(user.name).toBe("Superman");
      expect(user.type).toBe(USER_TYPES.DOCTOR);
    });
  });
});
