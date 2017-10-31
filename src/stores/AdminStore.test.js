// @flow
import AdminStore from "./AdminStore";

describe("AdminStore store", () => {
  let localStorage;
  let adminStore;

  beforeAll(() => {
    localStorage = global.localStorage;
    global.localStorage = { setItem: () => {}, getItem: () => {} };
  });

  afterAll(() => {
    global.localStorage = localStorage;
  });

  beforeEach(() => {
    adminStore = new AdminStore();
  });

  describe("addUser method", () => {
    test("should add new user", () => {
      adminStore.addUser("Superman", true, true);

      const user = adminStore.users[0];

      expect(user.name).toBe("Superman");
      expect(user.isDoctor).toBeTruthy();
      expect(user.isSpecialist).toBeTruthy();
    });
  });
});
