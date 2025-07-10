import React from "react";

const xLabels = ["Low", "", "Med", "", "High"];
const yLabels = {
  0: "Intention",
  2: "Activation",
  4: "Execution",
  8: "Eval + Adapt",
  10: "Sustained Impact"
};

const PositionConfigPage = ({ ellipses, onPositionChange, onContinue }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Configure Ellipse Positions</h2>
      {ellipses.map((el, index) => (
        <div key={el.id} style={{ marginBottom: "20px" }}>
          <h4>{el.label.replace("\n", " ")}</h4>
          <div>
            <label>X Axis (Low to High): </label>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={getXSliderValue(el.x)}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                const newX = mapSliderToX(val);
                onPositionChange(index, "x", newX);
              }}
            />
            <span style={{ marginLeft: "10px" }}>{xLabels[getXSliderValue(el.x)]}</span>
          </div>
          <div>
            <label>Y Axis (Intention to Sustained Impact): </label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={getYSliderValue(el.y)}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                const newY = mapSliderToY(val);
                onPositionChange(index, "y", newY);
              }}
            />
            <span style={{ marginLeft: "10px" }}>{yLabels[getYSliderValue(el.y)] || ""}</span>
          </div>
        </div>
      ))}
      <button onClick={onContinue}>Continue</button>
    </div>
  );
};

const mapSliderToX = (value) => {
  // 0–4 maps to 100–700 linearly (Low to High)
  return 100 + (value * 150);
};

const getXSliderValue = (x) => {
  return Math.round((x - 100) / 150);
};

const mapSliderToY = (value) => {
  // Y: 0 (Intention) -> y = 550, 10 (Sustained Impact) -> y = 50
  return 550 - (value * 50);
};

const getYSliderValue = (y) => {
  return Math.round((550 - y) / 50);
};

export default PositionConfigPage;
