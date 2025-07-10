import React from "react";

const yStageOptions = [
  { label: "Intention", value: 0 },
  { label: "Activation", value: 2 },
  { label: "Execution", value: 4 },
  { label: "Eval + Adapt", value: 8 },
  { label: "Sustained Impact", value: 10 },
];

const PositionConfigPage = ({ ellipses, onPositionChange, onContinue }) => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Configure Ellipses</h2>
      {ellipses.map((ellipse, index) => (
        <div key={ellipse.id} style={{ marginBottom: 20 }}>
          <h3>{ellipse.label}</h3>

          <label>
            Relative Value:
            <select
              value={ellipse.x}
              onChange={(e) =>
                onPositionChange(index, "x", Number(e.target.value))
              }
            >
              <option value={100}>Low</option>
              <option value={400}>Medium</option>
              <option value={700}>High</option>
            </select>
          </label>

          <br />

          <label>
            Start Stage:
            <select
              value={ellipse.stageStart ?? 0}
              onChange={(e) =>
                onPositionChange(index, "stageStart", Number(e.target.value))
              }
            >
              {yStageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <br />

          <label>
            End Stage:
            <select
              value={ellipse.stageEnd ?? 10}
              onChange={(e) =>
                onPositionChange(index, "stageEnd", Number(e.target.value))
              }
            >
              {yStageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
