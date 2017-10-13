// @flow
import MainStore from "./MainStore";

describe("MainStore store", () => {
  let localStorage;
  let mainStore;

  beforeAll(() => {
    localStorage = global.localStorage;
    global.localStorage = { setItem: () => {}, getItem: () => {} };
  });

  afterAll(() => {
    global.localStorage = localStorage;
  });

  beforeEach(() => {
    mainStore = new MainStore();
  });

  describe("addUser method", () => {
    test("should add new user", () => {
      mainStore.addUser("Superman", true, true);

      const user = mainStore.users[0];

      expect(user.name).toBe("Superman");
      expect(user.isDoctor).toBeTruthy();
      expect(user.isSpecialist).toBeTruthy();
    });
  });
});
