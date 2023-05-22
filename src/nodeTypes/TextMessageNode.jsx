import React,{ useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

export default function TextMessageNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      {/* <Handle type="target" position={Position.Top} /> */}
      <div>
        <label htmlFor="text">Text:{data.lmao}</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
        <h1>{data.lmao}</h1>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </>
  );
}

// export  const TextMessage = React.memo(TextMessageNode)