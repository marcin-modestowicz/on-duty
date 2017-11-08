// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import type UserStore from "../../stores/UserStore";
import AvailabilityCalendar from "../AvailabilityCalendar";

type Props = {
  userStore: UserStore
};

@observer
class ShowUser extends Component<*> {
  props: Props;

  render() {
    const { user, setDayStatus } = this.props.userStore;

    return (
      <div>
        <header>
          <h3>{user.name}</h3>
          <h4>
            {user.isDoctor && "Doctor"} {user.isSpecialist && "Specialist"}
          </h4>
        </header>
        <AvailabilityCalendar
          calendar={user.availabilityCalendar}
          onDayToggle={setDayStatus}
        />
      </div>
    );
  }
}

export default ShowUser;
