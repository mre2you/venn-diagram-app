import React from "react";

const qualitativeX = [
  { label: "Low", value: 100 },
  { label: "Medium", value: 400 },
  { label: "High", value: 700 },
];

const stageYLabels = [
  { label: "Intention", value: 550 },
  { label: "Activation", value: 450 },
  { label: "Execution", value: 350 },
  { label: "Eval + Adapt", value: 150 },
  { label: "Sustained Impact", value: 50 },
];

const PositionConfigPage = ({ ellipses, onPositionChange, onEllipsesChange, onContinue }) => {
  // If no ellipses have been initialized, do it here
  React.useEffect(() => {
    if (!ellipses || ellipses.length === 0) {
      const defaultEllipses = [
        {
          id: "cultural",
          label: "Cultural resilience &\nEE buy-in",
          x: 200,
          y: 160,
          radiusX: 80,
          radiusY: 60,
          fill: "rgba(192, 80, 77, 0.4)",
        },
        {
          id: "leadership",
          label: "Leadership alignment\nand buy-in",
          x: 200,
          y: 400,
          radiusX: 100,
          radiusY: 80,
          fill: "rgba(237, 125, 49, 0.4)",
        },
        {
          id: "agile",
          label: "Agile, Data-driven decision\nmaking",
          x: 300,
          y: 280,
          radiusX: 130,
          radiusY: 100,
          fill: "rgba(91, 155, 213, 0.4)",
        },
        {
          id: "change",
          label: "Change sustainability",
          x: 350,
          y: 80,
          radiusX: 150,
          radiusY: 80,
          fill: "rgba(155, 187, 89, 0.4)",
        },
        {
          id: "robust",
          label: "Robust activation\nframework",
          x: 500,
          y: 280,
          radiusX: 170,
          radiusY: 120,
          fill: "rgba(165, 165, 165, 0.3)",
        },
        {
          id: "intent",
          label: "Clear Strategic Intent",
          x: 450,
          y: 450,
          radiusX: 150,
          radiusY: 80,
          fill: "rgba(201, 218, 248, 0.5)",
        },
      ].map((el) => ({
        ...el,
        startY: el.y - el.radiusY,
        stopY: el.y + el.radiusY,
      }));
      onEllipsesChange(defaultEllipses);
    }
  }, [ellipses, onEllipsesChange]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Configure Ellipses</h2>
      {ellipses.map((ellipse, index) => (
        <div key={ellipse.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
          <h3>{ellipse.label}</h3>

          {/* Relative Value (X Axis) */}
          <label>
            Relative Value:
            <select
              value={
                qualitativeX.find((q) => Math.abs(q.value - ellipse.x) < 20)?.label || "Medium"
              }
              onChange={(e) => {
                const selected = qualitativeX.find((q) => q.label === e.target.value);
                if (selected) {
                  onPositionChange(index, "x", selected.value);
                }
              }}
            >
              {qualitativeX.map((q) => (
                <option key={q.label} value={q.label}>
                  {q.label}
                </option>
              ))}
            </select>
          </label>

          {/* Stage Start */}
          <label style={{ marginLeft: 20 }}>
            Stage Start:
            <select
              value={
                stageYLabels.find((s) => Math.abs(s.value - ellipse.startY) < 20)?.label ||
                "Intention"
              }
              onChange={(e) => {
                const selected = stageYLabels.find((s) => s.label === e.target.value);
                if (selected) {
                  onPositionChange(index, "startY", selected.value);
                }
              }}
            >
              {stageYLabels.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          {/* Stage Stop */}
          <label style={{ marginLeft: 20 }}>
            Stage Stop:
            <select
              value={
                stageYLabels.find((s) => Math.abs(s.value - ellipse.stopY) < 20)?.label ||
                "Sustained Impact"
              }
              onChange={(e) => {
                const selected = stageYLabels.find((s) => s.label === e.target.value);
                if (selected) {
                  onPositionChange(index, "stopY", selected.value);
                }
              }}
            >
              {stageYLabels.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ))}

      <button onClick={onContinue} style={{ marginTop: 20 }}>
        Continue to Venn Diagram
      </button>
    </div>
  );
};

export default PositionConfigPage;
