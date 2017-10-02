// @flow
import Availability, { AVAILABILITY_STATUSES } from "./Availability";

describe("Availability model", () => {
  let availability;

  beforeEach(() => {
    availability = new Availability(AVAILABILITY_STATUSES.KEEN);
  });

  test("should set index on instance creation", () => {
    expect(availability.index).toBe(1);
  });

  test("should return status according to index value", () => {
    expect(availability.status).toBe(AVAILABILITY_STATUSES.KEEN);
  });

  describe("toggle method", () => {
    test("should increase index value if current index is not the last one", () => {
      availability.toggle();
      expect(availability.index).toBe(2);
    });

    test("should set index to 0 if current index is the last one", () => {
      availability = new Availability(AVAILABILITY_STATUSES.BUSY);
      availability.toggle();
      expect(availability.index).toBe(0);
    });
  });
});
