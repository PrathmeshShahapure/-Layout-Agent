import React from 'react'

const WireframePreview = ({layout}) => {
    const rootId = layout.rootNodes[0];
    const artboard = layout.nodes[rootId];
  return (
    <div
    className="relative border bg-gray-100 overflow-hidden"
    style={{
      width: "100%",
      aspectRatio: `${artboard.width} / ${artboard.height}`,
    }}
  >
    {artboard.children.map((childId) => {
      const node = layout.nodes[childId];

      return (
        <div
          key={node.id}
          className="absolute border"
          style={{
            left: `${node.nx * 100}%`,
            top: `${node.ny * 100}%`,
            width: `${node.nw * 100}%`,
            height: `${node.nh * 100}%`,
          }}
        >

          {/* TEXT */}
          {node.type === "text" && (
            <div
              style={{
                fontSize: `${node.style.visual.fontSize/4}px`,
                color: node.style.visual.color.value,
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
            <div className="w-full h-full bg-blue-300 flex items-center justify-center text-xs">
              IMG
            </div>
          )}

          {/* SHAPE */}
          {node.type === "shape" && (
            <div className="w-full h-full bg-yellow-400 rounded-full" />
          )}

        </div>
      );
    })}
  </div>
  )
}

export default WireframePreview