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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [hasNextPage, setHasNextPage] = useState(false);

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
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                  hasNextPage={hasNextPage}
                  setHasNextPage={setHasNextPage}
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
