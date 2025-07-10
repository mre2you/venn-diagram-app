import React from "react";

const qualitativeX = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 3 },
  { label: "High", value: 5 },
];

const qualitativeY = [
  { label: "Intention", value: 0 },
  { label: "Activation", value: 2 },
  { label: "Execution", value: 4 },
  { label: "Eval + Adapt", value: 8 },
  { label: "Sustained Impact", value: 10 },
];

const PositionConfigPage = ({ ellipses, onPositionChange, onContinue }) => {
  const handleXChange = (index, e) => {
    const value = parseInt(e.target.value, 10);
    const radius = ellipses[index].radiusX;
    const center = 100 + (value - 1) * ((600 / 4) / 2); // maps 1 → 100, 3 → 400, 5 → 700
    const x = center - radius;
    onPositionChange(index, "x", Math.max(0, x + radius)); // center the ellipse
  };

  const handleYStartChange = (index, e) => {
    const yValue = parseInt(e.target.value, 10);
    const stopValue = ellipses[index].yStop ?? yValue;
    const centerY = 550 - ((yValue + stopValue) / 2) * 50;
    const radiusY = Math.abs(stopValue - yValue) * 25;
    onPositionChange(index, "y", centerY);
    onPositionChange(index, "radiusY", radiusY);
    onPositionChange(index, "yStart", yValue);
  };

  const handleYStopChange = (index, e) => {
    const yValue = parseInt(e.target.value, 10);
    const startValue = ellipses[index].yStart ?? yValue;
    const centerY = 550 - ((startValue + yValue) / 2) * 50;
    const radiusY = Math.abs(yValue - startValue) * 25;
    onPositionChange(index, "y", centerY);
    onPositionChange(index, "radiusY", radiusY);
    onPositionChange(index, "yStop", yValue);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Set Ellipse Positions</h2>
      {ellipses.map((el, index) => (
        <div key={el.id} style={{ marginBottom: "30px", padding: "10px", borderBottom: "1px solid #ccc" }}>
          <h4>{el.label.replace("\n", " ")}</h4>

          {/* Relative Value (X-Axis) */}
          <label>
            <strong>Relative Value:</strong>
            <select
              value={qualitativeX.find((q) => 100 + (q.value - 1) * ((600 / 4) / 2) - el.radiusX === el.x - el.radiusX)?.value || ""}
              onChange={(e) => handleXChange(index, e)}
            >
              <option value="">Select</option>
              {qualitativeX.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <br /><br />

          {/* Stage (Y-Axis Start) */}
          <label>
            <strong>Stage Start:</strong>
            <select
              value={el.yStart ?? ""}
              onChange={(e) => handleYStartChange(index, e)}
            >
              <option value="">Select</option>
              {qualitativeY.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <br /><br />

          {/* Stage (Y-Axis Stop) */}
          <label>
            <strong>Stage Stop:</strong>
            <select
              value={el.yStop ?? ""}
              onChange={(e) => handleYStopChange(index, e)}
            >
              <option value="">Select</option>
              {qualitativeY.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ))}
      <button onClick={onContinue} style={{ display: "block", margin: "20px auto" }}>
        Continue
      </button>
    </div>
  );
};

export default PositionConfigPage;
