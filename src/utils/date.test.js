import { getDayName, getNextMonthDays } from "./date";

describe("getDayName", () => {
  test("should return proper day name for each day of the week", () => {
    expect(getDayName(new Date(2017, 9, 2))).toBe("Monday");
    expect(getDayName(new Date(2017, 9, 3))).toBe("Tuesday");
    expect(getDayName(new Date(2017, 9, 4))).toBe("Wednesday");
    expect(getDayName(new Date(2017, 9, 5))).toBe("Thursday");
    expect(getDayName(new Date(2017, 9, 6))).toBe("Friday");
    expect(getDayName(new Date(2017, 9, 7))).toBe("Saturday");
    expect(getDayName(new Date(2017, 9, 8))).toBe("Sunday");
  });
});

describe("getNextMonthDays", () => {
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

  test("should return array of next month days", () => {
    let days;

    date = new Date(2016, 0, 3);
    days = getNextMonthDays();
    expect(days[0].getTime()).toBe(new Date(2016, 1, 1).getTime());
    expect(days.length).toBe(29);

    date = new Date(2017, 0, 3);
    days = getNextMonthDays();
    expect(days[0].getTime()).toBe(new Date(2017, 1, 1).getTime());
    expect(days.length).toBe(28);

    date = new Date(2017, 1, 3);
    days = getNextMonthDays();
    expect(days[0].getTime()).toBe(new Date(2017, 2, 1).getTime());
    expect(days.length).toBe(31);

    date = new Date(2017, 2, 3);
    days = getNextMonthDays();
    expect(days[0].getTime()).toBe(new Date(2017, 3, 1).getTime());
    expect(days.length).toBe(30);
  });
});
