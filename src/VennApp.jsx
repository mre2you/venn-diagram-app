import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Ellipse, Text, Transformer, Line } from "react-konva";
import Konva from "konva";

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

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Venn Diagram Interaction</h2>
      <p style={{ textAlign: "center" }}>
        Unique Intersections: <strong>{countAllStrictOverlaps(ellipses)}</strong>
      </p>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {ellipses.map((el) => (
          <div key={el.id} style={{ marginBottom: "10px" }}>
            <label>
              {el.label.replace("\n", " ")} Rating:
              <select
                value={ratings[el.id] || ""}
                onChange={(e) => handleRatingChange(el.id, e.target.value)}
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>

      <Stage
        width={800}
        height={600}
        style={{ border: "1px solid #ccc", margin: "0 auto", display: "block" }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
          } else {
            const clickedOnTransformer = e.target.getParent().className === 'Transformer';
            if (!clickedOnTransformer) {
              setSelectedId(null);
            }
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
                width={el.radiusX * 2}
                height={el.radiusY * 2}
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

          <Line points={[100, 550, 700, 550]} stroke="black" strokeWidth={1} />
          {[...Array(6)].map((_, i) => {
            const x = 100 + (600 / 5) * i;
            const label = i === 1 ? "Low" : i === 3 ? "Med" : i === 5 ? "High" : "";
            return (
              <React.Fragment key={i}>
                <Line points={[x, 545, x, 555]} stroke="black" strokeWidth={1} />
                {label && (
                  <Text
                    x={x - 15}
                    y={560}
                    text={label}
                    fontSize={12}
                    width={30}
                    align="center"
                  />
                )}
              </React.Fragment>
            );
          })}

          <Line points={[100, 50, 100, 550]} stroke="black" strokeWidth={1} />
          {[...Array(10)].map((_, i) => {
            const y = 550 - (500 / 9) * i;
            let label = "";
            if (i === 0) label = "Intention";
            else if (i === 2) label = "Activation";
            else if (i === 4) label = "Execution";
            else if (i === 7) label = "Eval + Adapt";
            else if (i === 9) label = "Impact";
            return (
              <React.Fragment key={i}>
                <Line points={[95, y, 105, y]} stroke="black" strokeWidth={1} />
                {label && (
                  <Text
                    x={-10}
                    y={y - 6}
                    text={label}
                    fontSize={12}
                    width={100}
                    align="right"
                  />
                )}
              </React.Fragment>
            );
          })}

          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => newBox}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
              "top-center",
              "bottom-center",
            ]}
            rotateEnabled={false}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default VennApp;
