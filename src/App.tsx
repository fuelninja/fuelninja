
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Book from "./pages/Book";
import Track from "./pages/Track";
import Profile from "./pages/Profile";
import PersonalInformation from "./pages/profile/PersonalInformation";
import SavedAddresses from "./pages/profile/SavedAddresses";
import PaymentMethods from "./pages/profile/PaymentMethods";
import OrderHistory from "./pages/profile/OrderHistory";
import Receipts from "./pages/profile/Receipts";
import HelpSupport from "./pages/profile/HelpSupport";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book" element={<Book />} />
          <Route path="/track" element={<Track />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/personal-information" element={<PersonalInformation />} />
          <Route path="/profile/saved-addresses" element={<SavedAddresses />} />
          <Route path="/profile/payment-methods" element={<PaymentMethods />} />
          <Route path="/profile/order-history" element={<OrderHistory />} />
          <Route path="/profile/receipts" element={<Receipts />} />
          <Route path="/profile/help-support" element={<HelpSupport />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
