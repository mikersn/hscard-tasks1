import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { hubspot } from '@hubspot/ui-extensions'
import App from './App.tsx'
import './index.css'

hubspot.extend(() => (
  <StrictMode>
    <App />
  </StrictMode>
))