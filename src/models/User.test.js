// @flow
import User from "./User";
import { AvailabilityCalendar } from "./Calendar";

describe("User model", () => {
  describe("on instance creation", () => {
    test("should set properties according to passed arguments", () => {
      const user = new User("a1", "Marty McFly", true, true, undefined, true);

      expect(user).toMatchObject({
        id: "a1",
        name: "Marty McFly",
        isDoctor: true,
        isSpecialist: true,
        isAdmin: true
      });
    });

    test("should set defaults properly if no argument passed", () => {
      const user = new User("a1", "Marty McFly");

      expect(user).toMatchObject({
        id: "a1",
        isDoctor: false,
        isSpecialist: false,
        isAdmin: false
      });
    });
  });
});
