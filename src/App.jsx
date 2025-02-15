import React, { Fragment, useState } from "react"
import "./css/Main.css"
var count = 10;
function Button({onClick}) {
    return (
        <Fragment>
            <button onClick={onClick} className="test">
                sharing Count: {count}
            </button>
        </Fragment>
    )
}

export default function App() {
    function clickHandler() {
        alert("run!")
        count++
        console.log(count)
    }
    return (
        <Fragment>
            <Button onClick={clickHandler}></Button>
            <Button onClick={clickHandler}></Button>
        </Fragment>
    )
}