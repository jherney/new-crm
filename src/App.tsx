import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ContactsPage from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import CompaniesPage from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import DealsPage from './pages/Deals';
import DealDetail from './pages/DealDetail';
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
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
