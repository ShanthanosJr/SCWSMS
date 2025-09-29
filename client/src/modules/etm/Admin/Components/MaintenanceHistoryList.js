import React from "react";

const MaintenanceHistoryList = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-3 text-muted">
        No maintenance records found.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Service Date</th>
            <th>Service Details</th>
            <th>Next Service</th>
            <th>Damage Reported</th>
          </tr>
        </thead>
        <tbody>
          {history.map((maintenance) => (
            <tr key={maintenance._id}>
              <td>{new Date(maintenance.serviceDate).toLocaleDateString()}</td>
              <td>{maintenance.serviceDetails}</td>
              <td>
                {maintenance.nextScheduledService 
                  ? new Date(maintenance.nextScheduledService).toLocaleDateString() 
                  : "Not scheduled"}
              </td>
              <td>{maintenance.damageReported || "None"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceHistoryList;