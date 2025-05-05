// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'

// Create root and render
const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <div className="full-width-container">
      <App />
    </div>
  </StrictMode>
)