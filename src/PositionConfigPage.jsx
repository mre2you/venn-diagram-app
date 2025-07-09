import React from "react";

const xScale = {
  1: 200, // Low
  3: 400, // Medium
  5: 600, // High
};

const yScale = {
  "Intention": 100,
  "Activation": 200,
  "Execution": 300,
  "Eval + Adapt": 400,
  "Impact": 500,
};

const PositionConfigPage = ({ ellipses, onPositionChange, onContinue }) => {
  const handleXChange = (index, value) => {
    const radiusX = ellipses[index].radiusX;
    const targetRightEdge = xScale[value];
    const newX = Math.max(targetRightEdge - radiusX, radiusX); // Prevent x < 0
    onPositionChange(index, "x", newX);
  };

  const handleYChange = (index, label) => {
    const newY = yScale[label];
    onPositionChange(index, "y", newY);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Configure Positions</h2>
      {ellipses.map((ellipse, index) => (
        <div key={ellipse.id} style={{ marginBottom: "20px" }}>
          <h4>{ellipse.label.replace("\n", " ")}</h4>

          {/* X Axis Rating */}
          <label>
            X-axis (Low → High):{" "}
            <select
              onChange={(e) => handleXChange(index, parseInt(e.target.value))}
              value={
                Object.keys(xScale).find(
                  (key) =>
                    Math.round(ellipse.x + ellipse.radiusX) === xScale[key]
                ) || ""
              }
            >
              <option value="">Select</option>
              <option value="1">Low</option>
              <option value="3">Medium</option>
              <option value="5">High</option>
            </select>
          </label>

          <br />

          {/* Y Axis Stage */}
          <label>
            Y-axis (Intention → Impact):{" "}
            <select
              onChange={(e) => handleYChange(index, e.target.value)}
              value={
                Object.keys(yScale).find((label) => ellipse.y === yScale[label]) || ""
              }
            >
              <option value="">Select</option>
              {Object.keys(yScale).map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ))}
      <button onClick={onContinue}>Continue</button>
    </div>
  );
};

export default PositionConfigPage;
