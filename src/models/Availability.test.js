// @flow
import Availability, {
  AVAILABILITY_STATUSES,
  AVAILABILITY_STATUSES_NAMES
} from "./Availability";

describe("Availability model", () => {
  let availability;

  beforeEach(() => {
    availability = new Availability();
  });

  test("should set index on instance creation", () => {
    expect(availability.status).toBe(AVAILABILITY_STATUSES.FREE);
  });

  describe("statusName computed property", () => {
    test("should return status name according to status value", () => {
      expect(availability.statusName).toBe(
        AVAILABILITY_STATUSES_NAMES[AVAILABILITY_STATUSES.FREE]
      );
    });
  });

  describe("toggle method", () => {
    test("should change status to the next one", () => {
      availability = new Availability(AVAILABILITY_STATUSES.BUSY);
      availability.toggle();
      expect(availability.status).toBe(AVAILABILITY_STATUSES.FREE);
    });
  });

  describe("setStatus method", () => {
    test("should change status to the one provided as argument", () => {
      availability.setStatus(AVAILABILITY_STATUSES.BUSY);
      expect(availability.status).toBe(AVAILABILITY_STATUSES.BUSY);
    });
  });
});
