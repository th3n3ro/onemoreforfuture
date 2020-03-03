import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.jsx'
import { Context } from './components/StateContext'

ReactDOM.render(
  <Context>
    <App />
  </Context>,
  document.getElementById('root')
)
