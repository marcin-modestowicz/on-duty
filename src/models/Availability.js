// @flow
import { observable, computed, action } from "mobx";

export const AVAILABILITY_STATUSES = {
  FREE: 0,
  KEEN: 1,
  BUSY: -1
};

export const AVAILABILITY_STATUSES_NAMES = {
  "0": "Free",
  "1": "Keen",
  "-1": "Busy"
};

export type AvailabilityStatus = -1 | 0 | 1;

class Availability {
  @observable status: AvailabilityStatus;

  constructor(availability?: AvailabilityStatus) {
    this.status = availability || AVAILABILITY_STATUSES.FREE;
  }

  @computed
  get statusName(): AvailabilityStatus {
    return AVAILABILITY_STATUSES_NAMES[this.status];
  }

  @action
  toggle() {
    switch (this.status) {
      case AVAILABILITY_STATUSES.BUSY:
        this.status = AVAILABILITY_STATUSES.FREE;
        break;
      case AVAILABILITY_STATUSES.KEEN:
        this.status = AVAILABILITY_STATUSES.BUSY;
        break;
      default:
        this.status = AVAILABILITY_STATUSES.KEEN;
    }
  }

  @action
  setStatus(status: AvailabilityStatus) {
    this.status = status;
  }
}

export default Availability;
