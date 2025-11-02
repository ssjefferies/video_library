import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import Header from './components/Header';
import Videos from './components/Videos';
import AddVideoForm from './components/AddVideoForm';
import './App.css'

function App() {
  return (
      <BrowserRouter>
        <div id="app">
          <Header />
          <Routes>
            <Route path="/" element={<Videos />} />
            <Route path="/form/:id?" element={<AddVideoForm />} />
          </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App
