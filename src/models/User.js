// @flow
import { AvailabilityCalendar } from "./Calendar";
import { type AvailabilityStatus } from "./Availability";

export const POWER = {
  RESIDENT: 0,
  DOCTOR: 1,
  SPECIALIST: 2
};

const REQUIRED_SHIFTS = {
  RESIDENT: 2,
  DOCTOR: 1,
  SPECIALIST: 1
};

class User {
  id: string;
  name: string;
  isDoctor: boolean;
  isSpecialist: boolean;
  isAdmin: boolean;
  availabilityCalendar: AvailabilityCalendar;

  constructor(
    id: string,
    name: string,
    isDoctor?: boolean,
    isSpecialist?: boolean,
    availability?: AvailabilityStatus[],
    isAdmin?: boolean
  ) {
    this.id = id;
    this.name = name;
    this.isDoctor = !!isDoctor;
    this.isSpecialist = !!isSpecialist;
    this.isAdmin = !!isAdmin;
    this.availabilityCalendar = new AvailabilityCalendar(availability);
  }

  get power(): number {
    let power = POWER.RESIDENT;

    if (this.isDoctor) {
      power += POWER.DOCTOR;
    }

    if (this.isSpecialist) {
      power += POWER.SPECIALIST;
    }

    return power;
  }

  get requiredShifts(): number {
    let requiredShifts = REQUIRED_SHIFTS.RESIDENT;

    if (this.isDoctor) {
      requiredShifts = REQUIRED_SHIFTS.DOCTOR;
    }

    if (this.isSpecialist) {
      requiredShifts = REQUIRED_SHIFTS.SPECIALIST;
    }

    return requiredShifts;
  }
}

export default User;
