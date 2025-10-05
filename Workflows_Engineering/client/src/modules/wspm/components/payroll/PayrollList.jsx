import React from "react";
import "../../styles/globals.css";

export default function PayrollList({ records }) {
  return (
    <table className="wspm-table wspm-payroll-table">
      <thead>
        <tr className="wspm-payroll-table-header">
          <th className="wspm-payroll-table-cell">Worker ID</th>
          <th className="wspm-payroll-table-cell">Period</th>
          <th className="wspm-payroll-table-cell">Hours</th>
          <th className="wspm-payroll-table-cell">Pay</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r, idx) => (
          <tr key={idx} className="wspm-payroll-table-row">
            <td className="wspm-payroll-table-cell">{r.workerId}</td>
            <td className="wspm-payroll-table-cell">{r.period}</td>
            <td className="wspm-payroll-table-cell">{r.hoursWorked}</td>
            <td className="wspm-payroll-table-cell">Rs.{r.totalPay}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}