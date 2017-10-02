// @flow
import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { type UserType, USER_TYPES } from "../../models/User";

/* global SyntheticInputEvent */

type Props = {
  onAdd: (name: string, type: UserType) => void
};

@observer
class AddUser extends Component<Props> {
  @observable userName: string = "";
  @observable userType: UserType = USER_TYPES.RESIDENT;

  @action
  handleNameChange = (event: SyntheticInputEvent<*>) => {
    this.userName = event.target.value;
  };

  @action
  handleTypeChange = (event: SyntheticInputEvent<*>) => {
    //$FlowFixMe
    this.userType = event.target.value;
  };

  @action
  handleUserAdd = () => {
    if (this.userName !== "") {
      this.props.onAdd(this.userName, this.userType);
      this.userName = "";
      this.userType = USER_TYPES.RESIDENT;
    }
  };

  render() {
    const isAddButtonDisabled = this.userName.trim() === "";
    return (
      <div>
        <input
          type="text"
          value={this.userName}
          onChange={this.handleNameChange}
        />
        <select value={this.userType} onChange={this.handleTypeChange}>
          {Object.keys(USER_TYPES).map(userType => (
            <option key={userType} value={USER_TYPES[userType]}>
              {USER_TYPES[userType]}
            </option>
          ))}
        </select>
        <button onClick={this.handleUserAdd} disabled={isAddButtonDisabled}>
          Add User
        </button>
      </div>
    );
  }
}

export default AddUser;
