import React from "react";
import { useHistory } from "react-router-dom";


function Skipped(){
  const history = useHistory()

  return(
    <>
      <h1>PLEASE START THE GAME FROM THE HOME SCREEN!</h1>
      <button onClick={() => history.push("/")}>HOME</button>
    </>
  )
}

export default Skipped