import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/global.css';
declare module 'react-data-table-component';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
