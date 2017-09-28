// @flow
import Calendar from "./Calendar";

export type UserType = "resident" | "doctor" | "specialist";

class User {
  type: UserType = "resident";
  calendar: Calendar = new Calendar();
}

export default User;
