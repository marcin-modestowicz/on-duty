// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import AdminStore from "../../stores/AdminStore";
import { ShiftsCalendar } from "../../models/Calendar";
import User from "../../models/User";
import AddUser from "../AddUser";
import ShowUser from "../ShowUser";
import Shifts from "../Shifts";

@observer
class AdminPanel extends Component<*> {
  adminStore: AdminStore = new AdminStore("spsk2"); // @todo replace hardcoded center id value with something meaningful

  render() {
    const {
      addUser,
      fillCalendar,
      checkEmailAvailability,
      users,
      calendar,
      isReady,
      summary
    } = this.adminStore;

    return (
      <div>
        <h3>Admin Panel</h3>
        <div>
          <AddUser
            onAdd={addUser}
            onEmailAvailabilityCheck={checkEmailAvailability}
          />
          <button onClick={fillCalendar} disabled={!isReady}>
            Create calendar
          </button>
          {users.map(userStore => {
            return userStore.user ? (
              <ShowUser key={userStore.user.id} userStore={userStore} />
            ) : null;
          })}
        </div>
        <div>
          {calendar && (
            <Shifts
              calendar={calendar}
              summary={summary}
              users={users.map(({ user }) => user)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default AdminPanel;
