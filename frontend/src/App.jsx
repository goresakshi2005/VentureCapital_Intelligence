import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import ListsPage from './pages/ListsPage';
import SavedSearchesPage from './pages/SavedSearchesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CompaniesPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="companies/:id" element={<CompanyDetailPage />} />
          <Route path="lists" element={<ListsPage />} />
          <Route path="saved" element={<SavedSearchesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;