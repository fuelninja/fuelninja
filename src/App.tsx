
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Book from '@/pages/Book';
import Track from '@/pages/Track';
import Profile from '@/pages/Profile';
import PaymentConfirmation from '@/pages/PaymentConfirmation';
import NotFound from '@/pages/NotFound';
import PersonalInformation from '@/pages/profile/PersonalInformation';
import SavedAddresses from '@/pages/profile/SavedAddresses';
import PaymentMethods from '@/pages/profile/PaymentMethods';
import OrderHistory from '@/pages/profile/OrderHistory';
import Receipts from '@/pages/profile/Receipts';
import HelpSupport from '@/pages/profile/HelpSupport';
import Admin from '@/pages/Admin';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/book" element={<Book />} />
        <Route path="/track" element={<Track />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/profile/personal-information" element={<PersonalInformation />} />
        <Route path="/profile/saved-addresses" element={<SavedAddresses />} />
        <Route path="/profile/payment-methods" element={<PaymentMethods />} />
        <Route path="/profile/order-history" element={<OrderHistory />} />
        <Route path="/profile/receipts" element={<Receipts />} />
        <Route path="/profile/help-support" element={<HelpSupport />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
