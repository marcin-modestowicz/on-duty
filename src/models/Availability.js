// @flow
import { observable, computed, action } from "mobx";

export const AVAILABILITY_STATUSES = {
  FREE: "Free",
  KEEN: "Keen",
  BUSY: "Busy"
};

export type AvailabilityStatus = "Free" | "Keen" | "Busy";

export class Availability {
  static statuses: AvailabilityStatus[] = [
    AVAILABILITY_STATUSES.FREE,
    AVAILABILITY_STATUSES.KEEN,
    AVAILABILITY_STATUSES.BUSY
  ];
  @observable index: number = 0;

  constructor(availability?: AvailabilityStatus) {
    this.index = Availability.statuses.indexOf(
      availability || AVAILABILITY_STATUSES.FREE
    );
  }

  @computed
  get status(): AvailabilityStatus {
    return Availability.statuses[this.index];
  }

  @action
  toggle() {
    if (this.index === Availability.statuses.length - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }
  }
}

export default Availability;
