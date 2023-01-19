import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App"
import "./index.css"
import { BrowserRouter } from "react-router-dom"

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <BrowserRouter>
    <App name="Card-Game" />
  </BrowserRouter>
)