// @flow
import React from "react";
import { observer } from "mobx-react";
import User from "../../models/User";
import AvailabilityCalendar from "../AvailabilityCalendar";

type Props = {
  user: User
};

const ShowUser = ({ user }: Props) => (
  <div>
    <header>
      <h3>{user.name}</h3>
      <h4>
        {user.isDoctor && "Doctor"} {user.isSpecialist && "Specialist"}
      </h4>
    </header>
    <AvailabilityCalendar calendar={user.availabilityCalendar} />
  </div>
);

export default observer(ShowUser);
