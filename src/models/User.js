// @flow
import { AvailabilityCalendar } from "./Calendar";
import uuid from "uuid/v1";

class User {
  id: string;
  name: string;
  isDoctor: boolean;
  isSpecialist: boolean;
  calendar: AvailabilityCalendar;

  constructor(name: string, isDoctor?: boolean, isSpecialist?: boolean) {
    this.id = uuid();
    this.name = name;
    this.isDoctor = !!isDoctor;
    this.isSpecialist = !!isSpecialist;
    this.calendar = new AvailabilityCalendar();
  }

  get power(): number {
    let power = 0;

    if (this.isDoctor) {
      power += 1;
    }

    if (this.isSpecialist) {
      power += 2;
    }

    return power;
  }
}

export default User;
