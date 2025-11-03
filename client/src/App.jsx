import { useState } from 'react'
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
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);

  return (
      <BrowserRouter>
        <div id="app">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <Videos
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  categories={categories}
                  setCategories={setCategories}
                />
              } 
          />
            <Route path="/form/:id?" element={<AddVideoForm />} />
          </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App
