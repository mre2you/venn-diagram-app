import React from "react";

const qualitativeX = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 3 },
  { label: "High", value: 5 },
];

const stageYLabels = [
  "Intention",
  "Activation",
  "Execution",
  "Eval + Adapt",
  "Impact",
];

const PositionConfigPage = ({ ellipses, onPositionChange, onContinue }) => {
  const handleXChange = (index, newValue) => {
    const radius = ellipses[index].radiusX;
    const newX = newValue * 100 - radius; // ensure rightmost edge is aligned to scale
    onPositionChange(index, "x", Math.max(newX, 0));
  };

  const handleYBeginChange = (index, beginStage) => {
    const endStage = ellipses[index].yEndStage || beginStage;
    updateYAndRadius(index, beginStage, endStage);
  };

  const handleYEndChange = (index, endStage) => {
    const beginStage = ellipses[index].yBeginStage || endStage;
    updateYAndRadius(index, beginStage, endStage);
  };

  const updateYAndRadius = (index, beginStage, endStage) => {
    const beginIndex = stageYLabels.indexOf(beginStage);
    const endIndex = stageYLabels.indexOf(endStage);
    const yTop = Math.min(beginIndex, endIndex);
    const yBottom = Math.max(beginIndex, endIndex);
    const pixelTop = 100 + yTop * 90;
    const pixelBottom = 100 + yBottom * 90;
    const centerY = (pixelTop + pixelBottom) / 2;
    const radiusY = (pixelBottom - pixelTop) / 2;

    onPositionChange(index, "y", centerY);
    onPositionChange(index, "radiusY", radiusY);
    onPositionChange(index, "yBeginStage", beginStage);
    onPositionChange(index, "yEndStage", endStage);
  };

  return (
    <div>
      <h2>Configure Ellipses</h2>
      {ellipses.map((el, i) => (
        <div key={el.id} style={{ marginBottom: "20px" }}>
          <h4>{el.label.replace("\n", " ")}</h4>

          <label>
            X Position (Low → High):
            <select
              value={
                qualitativeX.find(opt => el.x + el.radiusX <= opt.value * 100 + 1)?.label || ""
              }
              onChange={(e) => {
                const selected = qualitativeX.find(opt => opt.label === e.target.value);
                if (selected) handleXChange(i, selected.value);
              }}
            >
              <option value="">Select</option>
              {qualitativeX.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <br />

          <label>
            Y Begin:
            <select
              value={el.yBeginStage || ""}
              onChange={(e) => handleYBeginChange(i, e.target.value)}
            >
              <option value="">Select</option>
              {stageYLabels.map(label => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <br />

          <label>
            Y End:
            <select
              value={el.yEndStage || ""}
              onChange={(e) => handleYEndChange(i, e.target.value)}
            >
              <option value="">Select</option>
              {stageYLabels.map(label => (
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
