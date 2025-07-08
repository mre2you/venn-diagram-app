import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Ellipse, Text, Transformer, Line } from "react-konva";
import Konva from "konva";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

const initialEllipses = [
  {
    id: "cultural",
    x: 200,
    y: 160,
    radiusX: 80,
    radiusY: 60,
    fill: "rgba(192, 80, 77, 0.4)",
    label: "Cultural resilience &\nEE buy-in",
  },
  {
    id: "leadership",
    x: 200,
    y: 400,
    radiusX: 100,
    radiusY: 80,
    fill: "rgba(237, 125, 49, 0.4)",
    label: "Leadership alignment\nand buy-in",
  },
  {
    id: "agile",
    x: 300,
    y: 280,
    radiusX: 130,
    radiusY: 100,
    fill: "rgba(91, 155, 213, 0.4)",
    label: "Agile, Data-driven decision\nmaking",
  },
  {
    id: "change",
    x: 350,
    y: 80,
    radiusX: 150,
    radiusY: 80,
    fill: "rgba(155, 187, 89, 0.4)",
    label: "Change sustainability",
  },
  {
    id: "robust",
    x: 500,
    y: 280,
    radiusX: 170,
    radiusY: 120,
    fill: "rgba(165, 165, 165, 0.3)",
    label: "Robust activation\nframework",
  },
  {
    id: "intent",
    x: 450,
    y: 450,
    radiusX: 150,
    radiusY: 80,
    fill: "rgba(201, 218, 248, 0.5)",
    label: "Clear Strategic Intent",
  },
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
  const uniqueRegions = new Set();
  for (let x = 0; x <= 800; x += 2) {
    for (let y = 0; y <= 600; y += 2) {
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
  const [ellipses, setEllipses] = useState(initialEllipses);
  const [selectedId, setSelectedId] = useState(null);
  const [ratings, setRatings] = useState({});
  const stageRef = useRef();
  const shapeRefs = useRef({});
  const transformerRef = useRef();

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
    const newEllipses = [...ellipses];
    newEllipses[index].x = e.target.x();
    newEllipses[index].y = e.target.y();
    setEllipses(newEllipses);
  };

  const handleTransform = (index, e) => {
    const node = e.target;
    const width = node.width() * node.scaleX();
    const height = node.height() * node.scaleY();

    const newEllipses = [...ellipses];
    newEllipses[index].radiusX = Math.max(5, width / 2);
    newEllipses[index].radiusY = Math.max(5, height / 2);

    node.scaleX(1);
    node.scaleY(1);
    setEllipses(newEllipses);
  };

  const handleRatingChange = (id, value) => {
    setRatings({ ...ratings, [id]: value });
  };

  const handlePrintPDF = async () => {
    const stage = stageRef.current;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const pdf = new jsPDF({ orientation: "landscape" });

    // Page 1: Diagram Image
    pdf.addImage(uri, "PNG", 10, 10, 270, 180);
    pdf.setFontSize(14);
    pdf.text("Venn Diagram", 10, 200);

    // Page 2+: Intersections
    const intersections = intersectionLabels.filter(({ ids }) =>
      ids.every((id) => ellipses.some((el) => el.id === id))
    );

    if (intersections.length > 0) {
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Applicable Intersection Labels", 10, 20);
      pdf.setFontSize(12);

      let y = 30;
      intersections.forEach(({ name, ids }) => {
        const combination = ids
          .map((id) => {
            const el = ellipses.find((e) => e.id === id);
            return el?.label.replace("\n", " ") || id;
          })
          .join(", ");

        if (y > 190) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(`• ${name} (${combination})`, 10, y);
        y += 8;
      });
    }

    pdf.save("venn-diagram.pdf");
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Venn Diagram Interaction</h2>
      <button onClick={handlePrintPDF}>Print to PDF</button>
      <Stage
        width={800}
        height={600}
        style={{ border: "1px solid #ccc", margin: "0 auto", display: "block" }}
        ref={stageRef}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
          }
        }}
      >
        <Layer>
          {/* Axes */}
          {[...Array(6)].map((_, i) => (
            <>
              <Line
                key={`x-tick-${i}`}
                points={[100 + i * 100, 0, 100 + i * 100, 600]}
                stroke="#ccc"
              />
              <Text
                key={`x-label-${i}`}
                x={95 + i * 100}
                y={580}
                text={i === 1 ? "Low" : i === 3 ? "Med" : i === 5 ? "High" : "|"}
                fontSize={10}
              />
            </>
          ))}
          {[...Array(11)].map((_, i) => (
            <>
              <Line
                key={`y-tick-${i}`}
                points={[0, 600 - i * 60, 800, 600 - i * 60]}
                stroke="#eee"
              />
              <Text
                key={`y-label-${i}`}
                x={5}
                y={600 - i * 60 - 10}
                text={
                  i === 0
                    ? "Intention"
                    : i === 2
                    ? "Activation"
                    : i === 4
                    ? "Execution"
                    : i === 5
                    ? "Eval + Adapt"
                    : i === 6
                    ? "Impact"
                    : ""
                }
                fontSize={10}
              />
            </>
          ))}
          {ellipses.map((el, i) => (
            <React.Fragment key={el.id}>
              <Ellipse
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
                ref={(node) => (shapeRefs.current[el.id] = node)}
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
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {ellipses.map((el) => (
          <div key={el.id} style={{ margin: "0 10px" }}>
            <label>{el.label.replace("\n", " ")}: </label>
            <select
              value={ratings[el.id] || ""}
              onChange={(e) => handleRatingChange(el.id, parseInt(e.target.value))}
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center" }}>
        Unique Intersections: <strong>{countAllStrictOverlaps(ellipses)}</strong>
      </p>
    </div>
  );
};

export default VennApp;
