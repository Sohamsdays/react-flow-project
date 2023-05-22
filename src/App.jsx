import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  useReactFlow,
  Panel,
  useStore,
} from "reactflow";
import "reactflow/dist/style.css";
const flowKey = "example-flow";
const getNodeId = () => `randomnode_${+new Date()}`;
import Sidebar from "./Components/SideBar";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";
import ColorSelectorNode from "./nodeTypes/ColorSelectorNode";

const initialNodes = [
  // {
  //   id: "1",
  //   type: "",
  //   data: { label: "input nodeee", lmao: "Dude" },
  //   position: { x: 250, y: 5 },
  // },
];

let id = 0;
const getId = () => `dndnode_${id++}`;
const nodeTypes = {
  custom: ColorSelectorNode,
};
const notify = () => toast.success("Save");
const error = () => toast.error("Cannot Save Flow");
const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [captureElementClick, setCaptureElementClick] = useState(true);
  const [nodeName, setNodeName] = useState("No");
  const [currentNode, setCurrentNode] = useState("1");
  const [labelValue, setLabelValue] = useState("");
  const [captureZoomClick, setCaptureZoomClick] = useState(true);
  const [save, setSave] = useState(false);

  //console.log(ColorSelectorNode);
  // save and restore
  const [rfInstance, setRfInstance] = useState(null);
  // const { setViewport } = useReactFlow();
  const [editMessageBar, setEditMessageBar] = useState(false);
  const elements = useStore((store) => store.elements);
  //if all nodes connected
  //

  const areAllNodesConnected = () => {
    // Iterate through each node
    console.log(edges);
    console.log("----------");
    console.log(nodes);
    // for (const element of elements) {
    //   if (element.type === "input" || element.type === "output") {
    //     // Skip the input and output nodes
    //     continue;
    //   }

    //   // Check if the node has any connections
    //   const isConnected = elements.some(
    //     (el) => el.source === element.id || el.target === element.id
    //   );

    //   // If the node is not connected, return false
    //   if (!isConnected) {
    //     return false;
    //   }
    // }

    // All nodes have at least one connection
    return true;
  };

  const onNodeClick = (event, node) => {
    setEditMessageBar(true);
    console.log(node);
    setCurrentNode(node);
    setNodeName(node.data.label);
    // console.log(currentNode);
    // console.log("click node", node, event);
  };
  const onPaneClick = (event) => {
    setEditMessageBar(false);
    console.log("onPaneClick", event);
  };

  const clickOut = () => {
    console.log("Hello");
  };
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === currentNode.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }

        return node;
      })
    );
  }, [nodeName, setNodes]);
  //Drag and Drop elements
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type: "custom",
        position,
        data: { label: `${type} node`, message: "" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  //On save and restore
  const onSave = useCallback(() => {
    console.log(edges.length, nodes.length);

    if (edges.length === nodes.length - 1) {
      console.log("YOU can savee");
      notify();
      setSave(true);

      if (rfInstance) {
        const flow = rfInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
      } else {
        console.log(22);
      }
    } else {
      error();
      setSave(false);
    }
  }, [edges.length, nodes.length, rfInstance, save]);

  // useEffect(() => {
  //   if (edges.length === nodes.length - 1) {
  //     setSave(true);
  //   } else {
  //     setSave(false);
  //   }
  // }, [edges.length, nodes.length]);
  // useEffect(() => {
  //   if (save) {
  //     notify();
  //   }
  // }, [save]);

  const reactFlowStyle = {
    width: "100%",
    height: 300,
  };
  // const onRestore = useCallback(() => {
  //   const restoreFlow = async () => {
  //     const flow = JSON.parse(localStorage.getItem(flowKey));

  //     if (flow) {
  //       const { x = 0, y = 0, zoom = 1 } = flow.viewport;
  //       setNodes(flow.nodes || []);
  //       setEdges(flow.edges || []);
  //       setViewport({ x, y, zoom });
  //     }
  //   };

  //   restoreFlow();
  // }, [setNodes, setViewport]);

  return (
    <>
      <div className="navbar">Soham De</div>
      <div className="dndflow" style={{ height: "100vh" }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              style={reactFlowStyle}
              nodeTypes={nodeTypes}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={captureElementClick ? onNodeClick : clickOut}
              fitView
              onPaneClick={captureZoomClick ? onPaneClick : undefined}
            >
              <MiniMap />
              <Controls />
            </ReactFlow>
          </div>

          <Panel position="top-right">
            <button className="btn" onClick={onSave}>
              Save Changes
            </button>
            {/* <Toaster/> */}
            {/* {save ? <Toaster /> : console.log(33)} */}
            <Toaster />
            {/* <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button> */}
          </Panel>
          {/* <button onClick={areAllNodesConnected}>
            Check if all nodes are connected
          </button> */}
          {editMessageBar ? (
            <aside>
              <div className="message__bar">
                <div className="message">Message</div>

                <textarea
                  rows={4}
                  cols={30}
                  value={nodeName}
                  onChange={(evt) => setNodeName(evt.target.value)}
                />
              </div>
            </aside>
          ) : (
            <Sidebar />
          )}
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default DnDFlow;
