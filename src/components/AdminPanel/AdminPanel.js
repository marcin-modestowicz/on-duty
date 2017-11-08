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
  adminStore: AdminStore = new AdminStore();

  render() {
    const {
      addUser,
      fillCalendar,
      users,
      calendar,
      isReady,
      summary
    } = this.adminStore;

    return (
      <div>
        <h3>Admin Panel</h3>
        <div>
          <AddUser onAdd={addUser} />
          <button onClick={fillCalendar} disabled={!isReady}>
            Create calendar
          </button>
          {users.map(user => <ShowUser key={user.id} user={user} />)}
        </div>
        <div>
          {calendar && (
            <Shifts calendar={calendar} summary={summary} users={users} />
          )}
        </div>
      </div>
    );
  }
}

export default AdminPanel;
