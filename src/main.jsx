import React from 'react'
import { createRoot } from 'react-dom/client'
import { configureTextBuilder } from 'troika-three-text'
import App from './App.jsx'
import './styles.css'

// Render troika SDF text on the main thread. The Web Worker path silently
// fails in some headless/software-GL contexts (and occasionally on iOS Safari),
// leaving headlines invisible. Main-thread generation is robust everywhere.
configureTextBuilder({ useWorker: false })

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
