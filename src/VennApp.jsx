import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Ellipse, Text, Transformer, Line } from "react-konva";
import Konva from "konva";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PositionConfigPage from "./PositionConfigPage";

const intersectionLabels = [
  { name: "Strategy", ids: ["intent"] },
  { name: "Cohesion", ids: ["intent", "leadership"] },
  { name: "Leadership", ids: ["leadership"] },
  { name: "Dexterity", ids: ["intent", "leadership", "agile"] },
  { name: "Rigor", ids: ["intent", "agile"] },
  { name: "Sequencing", ids: ["intent", "robust"] },
  { name: "Pragmatism", ids: ["intent", "robust", "agile"] },
  { name: "Strategic Readiness", ids: ["intent", "leadership", "agile", "robust"] },
  { name: "Commitment", ids: ["leadership", "agile"] },
  { name: "Delivery Readiness", ids: ["leadership", "agile", "robust"] },
  { name: "Activation", ids: ["robust"] },
  { name: "Execution Mechanics", ids: ["robust", "agile"] },
  { name: "Data-Driven Decision", ids: ["agile"] },
  { name: "Fortitude", ids: ["agile", "cultural", "robust"] },
  { name: "Engagement", ids: ["agile", "cultural"] },
  { name: "Purpose", ids: ["cultural"] },
  { name: "Dedication", ids: ["cultural", "change"] },
  { name: "Organizational Realization", ids: ["cultural", "change", "agile"] },
  { name: "Focus", ids: ["agile", "change"] },
  { name: "Sustainability", ids: ["change"] },
];

const pointInEllipse = (x, y, ellipse) => {
  const dx = x - ellipse.x;
  const dy = y - ellipse.y;
  return (
    (dx * dx) / (ellipse.radiusX * ellipse.radiusX) +
      (dy * dy) / (ellipse.radiusY * ellipse.radiusY) <=
    1
  );
};

const countAllStrictOverlaps = (ellipses) => {
  if (!Array.isArray(ellipses)) return 0;
  const uniqueRegions = new Set();
  for (let x = 0; x <= 800; x += 4) {
    for (let y = 0; y <= 600; y += 4) {
      const inside = ellipses
        .map((ellipse) => (pointInEllipse(x, y, ellipse) ? ellipse.id : null))
        .filter(Boolean)
        .sort();
      if (inside.length > 0) {
        const key = inside.join("&");
        uniqueRegions.add(key);
      }
    }
  }
  return uniqueRegions.size;
};

const VennApp = () => {
  const [configMode, setConfigMode] = useState(true);
  const [ellipses, setEllipses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef();
  const shapeRefs = useRef({});
  const transformerRef = useRef();

  const handlePositionChange = (index, axis, value) => {
    const updated = [...ellipses];
    if (axis === "startY") {
      const stopY = updated[index].stopY ?? updated[index].y + updated[index].radiusY;
      const newY = (value + stopY) / 2;
      const newRadiusY = Math.abs(stopY - value) / 2;
      updated[index] = { ...updated[index], y: newY, radiusY: newRadiusY };
    } else if (axis === "stopY") {
      const startY = updated[index].startY ?? updated[index].y - updated[index].radiusY;
      const newY = (startY + value) / 2;
      const newRadiusY = Math.abs(value - startY) / 2;
      updated[index] = { ...updated[index], y: newY, radiusY: newRadiusY };
    } else if (axis === "x") {
      updated[index].x = value;
    }
    updated[index].startY = updated[index].y - updated[index].radiusY;
    updated[index].stopY = updated[index].y + updated[index].radiusY;
    setEllipses(updated);
  };

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const node = shapeRefs.current[selectedId];
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId, ellipses]);

  const handleDragMove = (index, e) => {
    const updated = [...ellipses];
    updated[index].x = e.target.x();
    updated[index].y = e.target.y();
    updated[index].startY = updated[index].y - updated[index].radiusY;
    updated[index].stopY = updated[index].y + updated[index].radiusY;
    setEllipses(updated);
  };

  const handleTransform = (index, e) => {
    const node = e.target;
    const width = node.width() * node.scaleX();
    const height = node.height() * node.scaleY();
    const updated = [...ellipses];
    updated[index].radiusX = Math.max(5, width / 2);
    updated[index].radiusY = Math.max(5, height / 2);
    updated[index].startY = updated[index].y - updated[index].radiusY;
    updated[index].stopY = updated[index].y + updated[index].radiusY;
    node.scaleX(1);
    node.scaleY(1);
    setEllipses(updated);
  };

  const handlePrintPDF = async () => {
    const stage = stageRef.current;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const pdf = new jsPDF({ orientation: "landscape" });
    pdf.addImage(uri, "PNG", 10, 10, 270, 180);
    pdf.text("Applicable Intersections:", 10, 200);
    let y = 210;
    intersectionLabels.forEach(({ name, ids }) => {
      const present = ids.every((id) => ellipses.some((el) => el.id === id));
      if (present) {
        pdf.text(name, 10, y);
        y += 8;
      }
    });
    pdf.save("venn-diagram.pdf");
  };

  if (configMode) {
    return (
      <PositionConfigPage
        ellipses={ellipses}
        onEllipsesChange={setEllipses}
        onPositionChange={handlePositionChange}
        onContinue={() => setConfigMode(false)}
      />
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Venn Diagram Interaction</h2>
      <p style={{ textAlign: "center" }}>
        Unique Intersections: <strong>{countAllStrictOverlaps(ellipses)}</strong>
      </p>
      <button onClick={handlePrintPDF} style={{ display: "block", margin: "10px auto" }}>
        Print to PDF
      </button>

      <Stage
        ref={stageRef}
        width={800}
        height={600}
        style={{ border: "1px solid #ccc", margin: "0 auto", display: "block" }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
          } else {
            const clickedOnTransformer = e.target.getParent().className === "Transformer";
            if (!clickedOnTransformer) setSelectedId(null);
          }
        }}
      >
        <Layer>
          {ellipses.map((el, i) => (
            <React.Fragment key={el.id}>
              <Ellipse
                ref={(node) => (shapeRefs.current[el.id] = node)}
                x={el.x}
                y={el.y}
                radiusX={el.radiusX}
                radiusY={el.radiusY}
                fill={el.fill}
                draggable
                onClick={() => setSelectedId(el.id)}
                onTap={() => setSelectedId(el.id)}
                onDragMove={(e) => handleDragMove(i, e)}
                onTransformEnd={(e) => handleTransform(i, e)}
                stroke="black"
                strokeWidth={1}
              />
              <Text
                x={el.x - 70}
                y={el.y - 10}
                text={el.label}
                fontSize={12}
                width={140}
                align="center"
              />
            </React.Fragment>
          ))}

          {/* X-axis (Relative Value) */}
          <Line points={[100, 550, 700, 550]} stroke="black" strokeWidth={1} />
          {[0, 0.25, 0.5, 0.75, 1].map((val, i) => {
            const x = 100 + 600 * val;
            const label = ["Low", "", "Medium", "", "High"][i];
            return (
              <React.Fragment key={i}>
                <Line points={[x, 545, x, 555]} stroke="black" strokeWidth={1} />
                {label && <Text x={x - 15} y={560} text={label} fontSize={12} width={30} align="center" />}
              </React.Fragment>
            );
          })}
          <Text x={350} y={580} text="Relative Value" fontSize={14} />

          {/* Y-axis (Stage) */}
          <Line points={[100, 50, 100, 550]} stroke="black" strokeWidth={1} />
          {[0, 2, 4, 8, 10].map((val, i) => {
            const y = 550 - (val / 10) * 500;
            const label = ["Intention", "Activation", "Execution", "Eval + Adapt", "Sustained Impact"][i];
            return (
              <React.Fragment key={val}>
                <Line points={[95, y, 105, y]} stroke="black" strokeWidth={1} />
                <Text x={-10} y={y - 6} text={label} fontSize={12} width={100} align="right" />
              </React.Fragment>
            );
          })}
          <Text x={10} y={20} text="Stage" fontSize={14} />
          <Transformer ref={transformerRef} rotateEnabled={false} />
        </Layer>
      </Stage>
    </div>
  );
};

export default VennApp;
