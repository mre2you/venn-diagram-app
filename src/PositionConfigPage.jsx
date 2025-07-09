import React from "react";

const xLabels = ["Low", "", "Medium", "", "High"];
const yLabels = [
  "Intention",
  "",
  "Activation",
  "",
  "Execution",
  "",
  "",
  "Eval + Adapt",
  "",
  "Impact",
];

const PositionConfigPage = ({ ellipses, onPositionChange, onContinue }) => {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Set Ellipse Positions</h2>
      {ellipses.map((el, i) => (
        <div key={el.id} style={{ marginBottom: 20 }}>
          <h4>{el.label.replace("\n", " ")}</h4>
          <label>
            X Position:
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={mapXToLabelIndex(el.x)}
              onChange={(e) =>
                onPositionChange(i, "x", mapLabelIndexToX(Number(e.target.value)))
              }
            />
            <span style={{ marginLeft: 10 }}>{xLabels[mapXToLabelIndex(el.x)]}</span>
          </label>
          <br />
          <label>
            Y Position:
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              value={mapYToLabelIndex(el.y)}
              onChange={(e) =>
                onPositionChange(i, "y", mapLabelIndexToY(Number(e.target.value)))
              }
            />
            <span style={{ marginLeft: 10 }}>{yLabels[mapYToLabelIndex(el.y)]}</span>
          </label>
        </div>
      ))}
      <div style={{ textAlign: "center" }}>
        <button onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
};

const mapXToLabelIndex = (x) => {
  if (x < 180) return 0;
  if (x < 320) return 1;
  if (x < 460) return 2;
  if (x < 600) return 3;
  return 4;
};

const mapLabelIndexToX = (index) => 100 + (600 / 4) * index;

const mapYToLabelIndex = (y) => {
  if (y < 100) return 0;
  if (y < 150) return 1;
  if (y < 200) return 2;
  if (y < 250) return 3;
  if (y < 300) return 4;
  if (y < 350) return 5;
  if (y < 400) return 6;
  if (y < 450) return 7;
  if (y < 500) return 8;
  return 9;
};

const mapLabelIndexToY = (index) => 50 + (500 / 9) * index;

export default PositionConfigPage;
