// @flow
import React, { Component } from "react";
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";

/* global SyntheticInputEvent */

type Props = {
  onAdd: (
    name: string,
    email: string,
    isSpecialist: boolean,
    isDoctor: boolean
  ) => void,
  onEmailAvailabilityCheck: (email: string) => Promise<boolean>
};

@observer
class AddUser extends Component<Props> {
  @observable userName: string = "";
  @observable email: string = "";
  @observable isEmailAvailable: ?boolean = null;
  @observable isDoctor: boolean = false;
  @observable isSpecialist: boolean = false;

  @action
  handleNameChange = (event: SyntheticInputEvent<*>) => {
    this.userName = event.target.value;
  };

  @action
  handleEmailChange = (event: SyntheticInputEvent<*>) => {
    this.email = event.target.value;
  };

  @action
  handleEmailFocus = () => {
    this.isEmailAvailable = null;
  };

  @action
  handleEmailBlur = () => {
    if (this.isValidEmail) {
      this.isEmailAvailable = null;
      this.props.onEmailAvailabilityCheck(this.email).then(isEmailAvailable => {
        this.isEmailAvailable = isEmailAvailable;
      });
    }
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
    if (!this.isAddButtonDisabled) {
      this.props.onAdd(
        this.userName,
        this.email,
        this.isDoctor,
        this.isSpecialist
      );
      this.userName = "";
      this.email = "";
      this.isDoctor = false;
      this.isSpecialist = false;
    }
  };

  @computed
  get isValidEmail(): boolean {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.email);
  }

  @computed
  get isAddButtonDisabled(): boolean {
    return (
      this.userName.trim() === "" ||
      this.email.trim() === "" ||
      this.isEmailAvailable !== true
    );
  }

  render() {
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
          value={this.email}
          onChange={this.handleEmailChange}
          onBlur={this.handleEmailBlur}
          onFocus={this.handleEmailFocus}
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
        {this.isEmailAvailable === false && (
          <span>User with email address provided already exists</span>
        )}
        <button
          onClick={this.handleUserAdd}
          disabled={this.isAddButtonDisabled}
        >
          Add User
        </button>
      </div>
    );
  }
}

export default AddUser;
