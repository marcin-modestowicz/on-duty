// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import AdminStore from "../../stores/AdminStore";
import { ShiftsCalendar } from "../../models/Calendar";
import User from "../../models/User";
import Button from "../Button";
import AddUser from "../AddUser";
import ShowUser from "../ShowUser";
import Alert from "../Alert";
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
        <div>
          <h2>Add User</h2>
          <AddUser
            onAdd={addUser}
            onEmailAvailabilityCheck={checkEmailAvailability}
          />
        </div>
        <div>
          <h2>Shift Calendar</h2>
          {!isReady && <Alert>Add more users to create calendar.</Alert>}
          <Button onClick={fillCalendar} disabled={!isReady}>
            Create
          </Button>
          {calendar && (
            <Shifts
              calendar={calendar}
              summary={summary}
              users={users.map(({ user }) => user)}
            />
          )}
        </div>
        <div>
          <h2>Users</h2>
          {users.map(userStore => {
            return userStore.user ? (
              <ShowUser key={userStore.user.id} userStore={userStore} />
            ) : null;
          })}
        </div>
      </div>
    );
  }
}

export default AdminPanel;
