// @flow
import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

/* global SyntheticInputEvent */

type Props = {
  onAdd: (name: string, isSpecialist: boolean, isDoctor: boolean) => void
};

@observer
class AddUser extends Component<Props> {
  @observable userName: string = "";
  @observable emailAddress: string = "";
  @observable isDoctor: boolean = false;
  @observable isSpecialist: boolean = false;

  @action
  handleNameChange = (event: SyntheticInputEvent<*>) => {
    this.userName = event.target.value;
  };

  @action
  handleEmailChange = (event: SyntheticInputEvent<*>) => {
    this.emailAddress = event.target.value;
  };

  @action
  handleTypeChange = (event: SyntheticInputEvent<*>) => {
    const type = event.target.value;

    if (type === "isDoctor") {
      this.isDoctor = !this.isDoctor;
    } else {
      this.isSpecialist = !this.isSpecialist;
    }
  };

  @action
  handleUserAdd = () => {
    if (this.userName !== "" && this.emailAddress !== "") {
      this.props.onAdd(
        this.userName,
        this.emailAddress,
        this.isDoctor,
        this.isSpecialist
      );
      this.userName = "";
      this.emailAddress = "";
      this.isDoctor = false;
      this.isSpecialist = false;
    }
  };

  render() {
    const isAddButtonDisabled = this.userName.trim() === "";
    return (
      <div>
        <input
          name="name"
          type="text"
          value={this.userName}
          onChange={this.handleNameChange}
        />
        <label htmlFor="name">Name</label>
        <input
          name="email"
          type="text"
          value={this.emailAddress}
          onChange={this.handleEmailChange}
        />
        <label htmlFor="email">Email</label>
        <input
          name="isDoctor"
          type="checkbox"
          value="isDoctor"
          checked={this.isDoctor}
          onChange={this.handleTypeChange}
        />
        <label htmlFor="isDoctor">Doctor</label>
        <input
          name="isSpecialist"
          type="checkbox"
          value="isSpecialist"
          checked={this.isSpecialist}
          onChange={this.handleTypeChange}
        />
        <label htmlFor="isSpecialist">Specialist</label>
        <button onClick={this.handleUserAdd} disabled={isAddButtonDisabled}>
          Add User
        </button>
      </div>
    );
  }
}

export default AddUser;
