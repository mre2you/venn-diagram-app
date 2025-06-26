import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Ellipse, Text, Transformer } from "react-konva";
import Konva from "konva";

const initialEllipses = [
  {
    id: "cultural",
    x: 150,
    y: 200,
    radiusX: 100,
    radiusY: 80,
    fill: "rgba(192, 80, 77, 0.4)",
    label: "Cultural resilience &\nEE buy-in",
  },
  {
    id: "leadership",
    x: 180,
    y: 300,
    radiusX: 100,
    radiusY: 80,
    fill: "rgba(237, 125, 49, 0.4)",
    label: "Leadership alignment\nand buy-in",
  },
  {
    id: "agile",
    x: 250,
    y: 230,
    radiusX: 150,
    radiusY: 120,
    fill: "rgba(91, 155, 213, 0.4)",
    label: "Agile, Data-driven decision\nmaking",
  },
  {
    id: "change",
    x: 300,
    y: 120,
    radiusX: 130,
    radiusY: 60,
    fill: "rgba(155, 187, 89, 0.4)",
    label: "Change sustainability",
  },
  {
    id: "robust",
    x: 430,
    y: 220,
    radiusX: 140,
    radiusY: 100,
    fill: "rgba(165, 165, 165, 0.3)",
    label: "Robust activation\nframework",
  },
  {
    id: "intent",
    x: 380,
    y: 330,
    radiusX: 150,
    radiusY: 80,
    fill: "rgba(201, 218, 248, 0.5)",
    label: "Clear Strategic Intent",
  },
];

const VennApp = () => {
  const [ellipses, setEllipses] = useState(initialEllipses);
  const [selectedId, setSelectedId] = useState(null);
  const shapeRefs = useRef({});
  const transformerRef = useRef();

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const node = shapeRefs.current[selectedId];
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
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
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newEllipses = [...ellipses];
    newEllipses[index].radiusX = Math.max(5, newEllipses[index].radiusX * scaleX);
    newEllipses[index].radiusY = Math.max(5, newEllipses[index].radiusY * scaleY);
    node.scaleX(1);
    node.scaleY(1);
    setEllipses(newEllipses);
  };

  const getBoundingBox = (ellipse) => {
    return {
      left: ellipse.x - ellipse.radiusX,
      right: ellipse.x + ellipse.radiusX,
      top: ellipse.y - ellipse.radiusY,
      bottom: ellipse.y + ellipse.radiusY,
    };
  };

  const isOverlap = (boxA, boxB) => {
    return !(
      boxA.right < boxB.left ||
      boxA.left > boxB.right ||
      boxA.bottom < boxB.top ||
      boxA.top > boxB.bottom
    );
  };

  const countIntersections = () => {
    const overlapMap = new Set();

    for (let i = 0; i < ellipses.length; i++) {
      const boxA = getBoundingBox(ellipses[i]);
      for (let j = i + 1; j < ellipses.length; j++) {
        const boxB = getBoundingBox(ellipses[j]);
        if (isOverlap(boxA, boxB)) {
          overlapMap.add([ellipses[i].id, ellipses[j].id].sort().join("&"));
        }
      }
    }

    return overlapMap.size;
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Venn Diagram Interaction</h2>
      <p style={{ textAlign: "center" }}>
        Unique Intersections: <strong>{countIntersections()}</strong>
      </p>
      <Stage
        width={700}
        height={500}
        style={{ border: "1px solid #ccc" }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
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
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => newBox}
            enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default VennApp;