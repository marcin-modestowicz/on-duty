// @flow
import User, { USER_TYPES } from "./User";
import { AvailabilityCalendar } from "./Calendar";

describe("User model", () => {
  describe("on instance creation", () => {
    test("should set id, name, type and calendar", () => {
      const user = new User("Marty McFly", USER_TYPES.DOCTOR);

      expect(typeof user.id).toBe("string");
      expect(user.name).toBe("Marty McFly");
      expect(user.type).toBe(USER_TYPES.DOCTOR);
      expect(user.calendar instanceof AvailabilityCalendar).toBeTruthy();
    });

    test("should set type to resident if none passed to constructor", () => {
      const user = new User("Marty McFly");

      expect(user.type).toBe(USER_TYPES.RESIDENT);
    });
  });
});
