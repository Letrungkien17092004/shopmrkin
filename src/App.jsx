import React, { useState, useCallback } from 'react';


var isSet = false
var myCallBack;
export default function App() {
	console.log("re-render!")
	const [state, setState] = useState(0);

	const printState = useCallback((e) => {
		e.stopPropagation()
		console.log(state)
	})
	if (isSet === false) {
		myCallBack = printState
		isSet = true
	}

	function compare(e) {
		e.stopPropagation()
		console.log(myCallBack === printState)
	}

	function reRender(e) {
		e.stopPropagation()
		setState(state+1);
	}
	return (
		<>
		<button onClick={reRender}>reRender!</button>
		<button onClick={printState}>log Count!</button>
		<button onClick={compare}>compare!</button>
		</>
	);
}
