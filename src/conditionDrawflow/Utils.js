export const translateToNodeElementID = (nodeid) => {
	const nodeID = nodeid.includes('node-')? nodeid: `node-${nodeid}`;
	return nodeID
}

export const translateToNodeDrawFlowID = (nodeid) => {
	const nodeID = nodeid.includes('node-')? nodeid.replace('node-', ''): `${nodeid}`;
	return nodeID
}


export const adjustNumberDisplayText = (displayNumber) => {
	return `${displayNumber}`.length < 2? `0${displayNumber}`: `${displayNumber}`;
}

export const adjustTextMaxLength = (text) => {
	const maxLength = 20;

	if (text.length > maxLength) {
		return `${text.slice(0, maxLength)}...`;
	} else {
		return text
	}
}