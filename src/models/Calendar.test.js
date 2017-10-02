// @flow
import {
  daysInCurrentMonth,
  ShiftCalendar,
  AvailabilityCalendar
} from "./Calendar";
import Availability from "./Availability";
import Shift from "./Shift";

describe("daysInCurrentMonth", () => {
  let date;
  let RealDate;

  beforeAll(() => {
    RealDate = Date;
    global.Date = function DateMock(...args) {
      return args.length ? new RealDate(...args) : date;
    };
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test("should return number of days in current month", () => {
    date = new Date(2016, 1, 3);
    expect(daysInCurrentMonth()).toBe(29);

    date = new Date(2017, 1, 3);
    expect(daysInCurrentMonth()).toBe(28);

    date = new Date(2017, 2, 3);
    expect(daysInCurrentMonth()).toBe(31);

    date = new Date(2017, 3, 3);
    expect(daysInCurrentMonth()).toBe(30);
  });
});

describe("ShiftCalendar model", () => {
  let shiftCalendar;

  beforeAll(() => {
    const calendar = [];
    const maxDay = daysInCurrentMonth();

    for (let day = 0; day <= maxDay; day += 1) {
      calendar.push([]);
    }

    shiftCalendar = new ShiftCalendar(calendar);
  });

  describe("on instance creation", () => {
    test("should create slots equal in number to current month days", () => {
      expect(shiftCalendar.days.length).toBe(daysInCurrentMonth());
    });

    test("should fill slots with Shift instance", () => {
      expect(shiftCalendar.days[0] instanceof Shift).toBeTruthy();
    });
  });
});

describe("AvailabilityCalendar model", () => {
  let availabilityCalendar;

  beforeAll(() => {
    availabilityCalendar = new AvailabilityCalendar();
  });

  describe("on instance creation", () => {
    test("should create slots equal in number to current month days", () => {
      expect(availabilityCalendar.days.length).toBe(daysInCurrentMonth());
    });

    test("should fill slots with Availability instance", () => {
      expect(availabilityCalendar.days[0] instanceof Availability).toBeTruthy();
    });
  });
});
