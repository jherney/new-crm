import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ContactsPage from './pages/Contacts';
import CompaniesPage from './pages/Companies';
import DealsPage from './pages/Deals';
import ActivitiesPage from './pages/Activities';
import TemplatesPage from './pages/Templates';
import EventsPage from './pages/Events';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
