
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Book from '@/pages/Book';
import Track from '@/pages/Track';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import PaymentConfirmation from '@/pages/PaymentConfirmation';
import NotFound from '@/pages/NotFound';
import PersonalInformation from '@/pages/profile/PersonalInformation';
import SavedAddresses from '@/pages/profile/SavedAddresses';
import PaymentMethods from '@/pages/profile/PaymentMethods';
import OrderHistory from '@/pages/profile/OrderHistory';
import Receipts from '@/pages/profile/Receipts';
import HelpSupport from '@/pages/profile/HelpSupport';
import AdminDashboard from '@/pages/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/auth';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/book" element={<Book />} />
          <Route path="*" element={<NotFound />} />
          
          {/* Protected Routes */}
          <Route path="/track" element={
            <ProtectedRoute>
              <Track />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/payment-confirmation" element={
            <ProtectedRoute>
              <PaymentConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/profile/personal-information" element={
            <ProtectedRoute>
              <PersonalInformation />
            </ProtectedRoute>
          } />
          <Route path="/profile/saved-addresses" element={
            <ProtectedRoute>
              <SavedAddresses />
            </ProtectedRoute>
          } />
          <Route path="/profile/payment-methods" element={
            <ProtectedRoute>
              <PaymentMethods />
            </ProtectedRoute>
          } />
          <Route path="/profile/order-history" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="/profile/receipts" element={
            <ProtectedRoute>
              <Receipts />
            </ProtectedRoute>
          } />
          <Route path="/profile/help-support" element={
            <ProtectedRoute>
              <HelpSupport />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
