// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import User from "../../models/User";
import UserStore from "../../stores/UserStore";
import AvailabilityCalendar from "../AvailabilityCalendar";

type Props = {
  user: User
};

class ShowUser extends Component<*> {
  props: Props;
  userStore: UserStore;

  constructor(props: Props) {
    super(props);

    this.userStore = new UserStore(props.user);
  }

  render() {
    const user = this.props.user;
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
          userStore={this.userStore}
        />
      </div>
    );
  }
}

export default ShowUser;
