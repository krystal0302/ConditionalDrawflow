export const translateToNodeElementID = (nodeid) => {
	const nodeID = nodeid.includes('node-')? nodeid: `node-${nodeid}`;
	return nodeID
}

export const translateToNodeDrawFlowID = (nodeid) => {
	const nodeID = nodeid.includes('node-')? nodeid.replace('node-', ''): `${nodeid}`;
	return nodeID
}