import React from "react";

const StatusHistoryList = ({ history }) => {
  const getStatusColor = (status) => {
    const colors = {
      available: "success",
      "in use": "primary",
      "under maintenance": "warning",
      retired: "secondary",
    };
    return colors[status] || "secondary";
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-3 text-muted">
        No status changes recorded yet.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Previous Status</th>
            <th>New Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {history.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>
                <span className={`badge bg-${getStatusColor(log.previousStatus)}`}>
                  {log.previousStatus}
                </span>
              </td>
              <td>
                <span className={`badge bg-${getStatusColor(log.newStatus)}`}>
                  {log.newStatus}
                </span>
              </td>
              <td>{log.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatusHistoryList;