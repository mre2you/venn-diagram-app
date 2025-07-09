import React from "react";

const PositionConfigPage = ({ ellipses, onPositionChange, onContinue }) => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Set Ellipse Positions</h2>
      {ellipses.map((el, index) => (
        <div key={el.id} style={{ marginBottom: 20 }}>
          <strong>{el.label.replace("\n", " ")}:</strong>
          <div>
            X:
            <input
              type="range"
              min="0"
              max="800"
              value={el.x}
              onChange={(e) => onPositionChange(index, "x", parseInt(e.target.value))}
            />
            {el.x}
          </div>
          <div>
            Y:
            <input
              type="range"
              min="0"
              max="600"
              value={el.y}
              onChange={(e) => onPositionChange(index, "y", parseInt(e.target.value))}
            />
            {el.y}
          </div>
        </div>
      ))}
      <button onClick={onContinue}>Continue to Diagram</button>
    </div>
  );
};

export default PositionConfigPage;
