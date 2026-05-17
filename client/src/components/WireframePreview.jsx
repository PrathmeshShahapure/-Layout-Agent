import React from "react";

const WireframePreview = ({ layout }) => {

  if (!layout || !layout.rootNodes) {
    return (
      <div className="text-white">
        No layout available
      </div>
    );
  }
  
  const rootId = layout.rootNodes[0];
  const artboard = layout.nodes[rootId];
  return (
    <div
      className="
    relative
    flex-shrink-0
    bg-white
shadow-[0_0_50px_rgba(0,0,0,0.5)]
overflow-hidden
rounded-md
border border-zinc-700
  "
      style={{
        width: `${artboard.width / 2}px`,
        height: `${artboard.height / 2}px`,
      }}
    >
      {artboard.children.map((childId) => {
        const node = layout.nodes[childId];

        return (
          <div
            key={node.id}
            className="absolute "
            style={{
              left: `${node.x / 2}px`,
              top: `${node.y / 2}px`,
              width: `${node.width / 2}px`,
              height: `${node.height / 2}px`,
            }}
          >
            {/* TEXT */}
            {node.type === "text" && (
              <div
                style={{
                  fontSize: `${node.style.visual.fontSize / 4}px`,
                  color: node.style.visual.color?.hex,
                  background: node.style.visual.fill?.hex,
                  fontFamily: node.style.visual.fontFamily,
                  fontWeight: node.style.visual.fontWeight,
                  fontStyle: node.style.visual.fontStyle,
                  textAlign: node.style.visual.textAlign,
                  textDecoration: node.style.visual.textDecoration,
                  textTransform: node.style.visual.textTransform,
                  textOverflow: node.style.visual.textOverflow,
                }}
              >
                {node.data.content}
              </div>
            )}

            {/* IMAGE */}
            {node.type === "image" && (
              <img
                src={node.data.sourceUrl}
                alt=""
                className="
      w-full
      h-full
      object-cover
      pointer-events-none
    "
              />
            )}

            {/* SHAPE */}
            {node.type === "shape" && (
              <div className="w-full h-full bg-yellow-400 rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WireframePreview;
