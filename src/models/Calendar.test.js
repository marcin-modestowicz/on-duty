// @flow
import {
  daysInCurrentMonth,
  ShiftsCalendar,
  AvailabilityCalendar
} from "./Calendar";
import Availability from "./Availability";
import Shift from "./Shift";
import User from "./User";

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

describe("ShiftsCalendar model", () => {
  let shiftsCalendar;

  beforeAll(() => {
    shiftsCalendar = new ShiftsCalendar();
  });

  describe("on instance creation", () => {
    test("should create slots equal in number to current month days", () => {
      expect(shiftsCalendar.days.length).toBe(daysInCurrentMonth());
    });

    test("should fill slots with Shift instance", () => {
      expect(shiftsCalendar.days[0] instanceof Shift).toBeTruthy();
    });
  });

  describe("fill calendar method", () => {
    test("should choose best solution for 5 days and 4 users", () => {
      const users = [
        new User("lekarz1", false, false, [1, 0, 0, -1, -1]),
        new User("lekarz2", true, false, [0, -1, 1, 1, 0]),
        new User("lekarz3", false, true, [1, 0, 0, 0, -1]),
        new User("lekarz4", false, true, [-1, 1, 0, 1, 0])
      ];
      const calendar = [
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift()
      ];

      shiftsCalendar.days = calendar;

      const shifts = shiftsCalendar.fillCalendar(users);
      const result = shiftsCalendar.days.map(({ onDuty }) =>
        onDuty.map(user => user.name).sort()
      );

      expect(result).toEqual([
        ["lekarz1", "lekarz3"],
        ["lekarz2", "lekarz4"],
        ["lekarz1", "lekarz3"],
        ["lekarz2", "lekarz4"],
        ["lekarz1", "lekarz3"]
      ]);
    });

    xtest("should choose best solution for 30 days and 30 users", () => {
      const users = [
        new User("lekarz1", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz2", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz3", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz4", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz5", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz6", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz7", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz8", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz9", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz10", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz11", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz12", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz13", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz14", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz15", false, true, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz16", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz17", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz18", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz19", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz20", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz21", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz22", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz23", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz24", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz25", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz26", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz27", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz28", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz29", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ]),
        new User("lekarz30", false, false, [
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1,
          1,
          0,
          0,
          -1,
          -1
        ])
      ];
      const calendar = [
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift(),
        new Shift()
      ];

      shiftsCalendar.days = calendar;

      const shifts = shiftsCalendar.fillCalendar(users);
      const result = shiftsCalendar.days.map(({ onDuty }) =>
        onDuty.map(user => user.name).sort()
      );

      expect(result).toEqual([
        ["lekarz16", "lekarz30"],
        ["lekarz21", "lekarz26"],
        ["lekarz30", "lekarz9"],
        ["lekarz24", "lekarz25"],
        ["lekarz19", "lekarz5"],
        ["lekarz15", "lekarz28"],
        ["lekarz14", "lekarz27"],
        ["lekarz22", "lekarz26"],
        ["lekarz19", "lekarz4"],
        ["lekarz20", "lekarz7"],
        ["lekarz17", "lekarz29"],
        ["lekarz18", "lekarz27"],
        ["lekarz20", "lekarz28"],
        ["lekarz18", "lekarz6"],
        ["lekarz21", "lekarz8"],
        ["lekarz30", "lekarz9"],
        ["lekarz10", "lekarz11"],
        ["lekarz12", "lekarz13"],
        ["lekarz17", "lekarz3"],
        ["lekarz24", "lekarz25"],
        ["lekarz2", "lekarz29"],
        ["lekarz22", "lekarz23"],
        ["lekarz30", "lekarz9"],
        ["lekarz16", "lekarz23"],
        ["lekarz30", "lekarz9"],
        ["lekarz1", "lekarz16"],
        ["lekarz30", "lekarz9"],
        ["lekarz1", "lekarz16"],
        ["lekarz30", "lekarz9"],
        ["lekarz1", "lekarz16"]
      ]);
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
