// @flow
import { AvailabilityCalendar } from "./Calendar";
import uuid from "uuid/v1";

export const USER_TYPES = {
  RESIDENT: "Resident",
  DOCTOR: "Doctor",
  SPECIALIST: "Specialist"
};

export type UserType = "Resident" | "Doctor" | "Specialist";

class User {
  id: string;
  name: string;
  type: UserType;
  calendar: AvailabilityCalendar;

  constructor(name: string, type?: UserType) {
    this.id = uuid();
    this.name = name;
    this.type = type || USER_TYPES.RESIDENT;
    this.calendar = new AvailabilityCalendar();
  }
}

export default User;
