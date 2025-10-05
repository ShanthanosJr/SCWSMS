import React, { useState, useEffect } from "react";
import { addTraining, getTrainings } from "../services/trainingService";
import TrainingForm from "../components/training/TrainingForm";
import TrainingList from "../components/training/TrainingList";
import "../styles/globals.css";

export default function Training() {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const data = await getTrainings();
      setTrainings(data);
    } catch {
      alert("❌ Failed to load trainings");
    }
  };

  const handleSaveTraining = async (trainingData) => {
    try {
      await addTraining(trainingData);
      alert("✅ Training recorded successfully");
      loadTrainings();
    } catch {
      alert("❌ Failed to save training");
    }
  };

  return (
    <div className="wspm-container">
      {/* Header */}
      <div className="wspm-header">
        <h1>Training Records</h1>
        <p>Track worker training progress, certifications, and safety badges</p>
      </div>

      <div className="wspm-content">
        {/* Training Form */}
        <div className="wspm-content-card">
          <h2>Record New Training</h2>
          <TrainingForm onSave={handleSaveTraining} />
        </div>

        {/* Training List */}
        <div className="wspm-content-card">
          <h2>Training History</h2>
          <TrainingList trainings={trainings} />
        </div>
      </div>
    </div>
  );
}