// @flow
import User from "./User";
import { AvailabilityCalendar } from "./Calendar";

describe("User model", () => {
  describe("on instance creation", () => {
    test("should set id, name, type and calendar", () => {
      const user = new User("Marty McFly", true, true);

      expect(typeof user.id).toBe("string");
      expect(user.name).toBe("Marty McFly");
      expect(user.isDoctor).toBeTruthy();
      expect(user.isSpecialist).toBeTruthy();
      expect(
        user.availabilityCalendar instanceof AvailabilityCalendar
      ).toBeTruthy();
    });

    test("should set isDoctor and isSpecialist to false by default", () => {
      const user = new User("Marty McFly");

      expect(user.isDoctor).toBeFalsy();
      expect(user.isSpecialist).toBeFalsy();
    });
  });
});
