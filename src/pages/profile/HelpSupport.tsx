
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpSupport: React.FC = () => {
  const navigate = useNavigate();
  
  // FAQ data
  const faqs = [
    {
      question: "How does FuelNinja work?",
      answer: "FuelNinja is a mobile fuel delivery service. We bring gasoline directly to your vehicle, so you don't have to visit a gas station. Simply book a delivery through our app, specify your location and vehicle details, and our trained professionals will fill your tank at the scheduled time."
    },
    {
      question: "What areas do you service?",
      answer: "We service the Houston area and surrounding cities."
    },
    {
      question: "What are your hours of operation?",
      answer: "We operate 7 days a week from 8:00 AM to 10:00 PM. Delivery times may vary based on demand and weather conditions."
    },
    {
      question: "How much does delivery cost?",
      answer: "Our standard service fee is $6.99 per delivery, regardless of the amount of fuel ordered. We often run promotions that may reduce or waive this fee."
    },
    {
      question: "Is there a minimum fuel order?",
      answer: "Yes, our minimum order is 2 gallons of fuel."
    },
    {
      question: "What types of fuel do you offer?",
      answer: "We currently offer regular unleaded gasoline (87 octane), supreme gasoline (93 octane), and Diesel Fuel (#2)."
    },
    {
      question: "How do I pay for the service?",
      answer: "Payment is processed securely through the app using your saved payment methods. We accept all major credit and debit cards."
    },
    {
      question: "Do I need to be present for the delivery?",
      answer: "No, you don't need to be present as long as your vehicle is accessible and the fuel door is unlocked. However, you'll receive notifications when our technician arrives and completes the service."
    },
    {
      question: "Is FuelNinja safe?",
      answer: "Absolutely. Safety is our top priority. Our technicians are trained professionals, and we use specialized equipment designed for safe fuel delivery. All fuel transfers comply with fire safety regulations and environmental protection standards."
    },
    {
      question: "What if I need to cancel or reschedule my delivery?",
      answer: "You can cancel or reschedule your delivery through the app up to 30 minutes before the scheduled delivery time without any penalty. If you do cancel less than 30 minutes prior to your appointment, you will be subject to a $12 cancellation fee."
    }
  ];
  
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  
  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter(i => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:346-233-7937';
  };

  const handleEmailContact = () => {
    window.location.href = 'mailto:fuelninjahelp@gmail.com';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center mb-6 pt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </div>
        
        <div className="space-y-6">
          {/* Contact Options */}
          <div className="glass-card p-5 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button 
                variant="outline" 
                className="h-auto py-3 flex flex-col items-center"
                onClick={handlePhoneCall}
              >
                <Phone className="h-5 w-5 mb-2" />
                <span>Call Support</span>
                <span className="text-xs text-gray-500 mt-1">8am - 10pm</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-3 flex flex-col items-center"
                onClick={handleEmailContact}
              >
                <Mail className="h-5 w-5 mb-2" />
                <span>Email Us</span>
                <span className="text-xs text-gray-500 mt-1">24hr Response</span>
              </Button>
            </div>
          </div>
          
          {/* FAQs */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="glass-card divide-y divide-gray-100 animate-fade-in">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="font-medium text-left">{faq.question}</h3>
                    {expandedFaqs.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaqs.includes(index) && (
                    <div className="mt-2 text-gray-600 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default HelpSupport;
