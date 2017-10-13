//@flow
import React from "react";
import styles from "./ShiftsStatistics.scss";

type Props = {
  summary: Object[]
};

const ShiftsStatistics = ({ summary }: Props) => (
  <table className={styles.root}>
    <thead className={styles.header}>
      <tr>
        <th>Name</th>
        <th>Power</th>
        <th>High Preference</th>
        <th>High Preference Filled</th>
        <th>Low Preference</th>
        <th>Low Preference Filled</th>
        <th>Shifts</th>
        <th>Overall Shift Share</th>
        <th>Satisfaction</th>
      </tr>
    </thead>
    <tbody className={styles.body}>
      {summary.map(user => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.power}</td>
          <td>{user.highPreference}</td>
          <td>{user.highPreferenceFilled}</td>
          <td>{user.lowPreference}</td>
          <td>{user.lowPreferenceFilled}</td>
          <td>{user.shifts}</td>
          <td>{user.shiftsShare}</td>
          <td>{user.satisfaction}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ShiftsStatistics;
