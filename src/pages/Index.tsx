
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Fuel, MapPin, ArrowRight, Zap } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    { 
      icon: Fuel, 
      title: 'Convenient Refueling', 
      description: 'Fill your tank up from anywhere you are. We come to you!',
      delay: 'animation-delay-100'
    },
    { 
      icon: MapPin, 
      title: 'Houston Area Service', 
      description: 'We only service the Houston area and surrounding cities.',
      delay: 'animation-delay-200'
    },
    { 
      icon: Zap, 
      title: 'Fast Delivery', 
      description: 'Schedule for today or pre-book for a future date and time.',
      delay: 'animation-delay-300'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24 overflow-hidden">
        {/* Hero Section */}
        <section className="pt-6 pb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in">
            Fuel Delivery<br /><span className="text-gradient">On Demand</span>
          </h1>
          <p className="text-gray-600 mb-8 animate-fade-in animation-delay-100">
            Fast Fuel, No Hassle. Get fuel delivered to your car, anywhere in Houston.
          </p>
          
          <button 
            onClick={() => navigate('/book')}
            className="button-primary px-6 py-3 text-lg animate-scale-in animation-delay-200 flex items-center justify-center mx-auto"
          >
            Book Delivery <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </section>
        
        {/* Features Section */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-6 text-center section-animation">How It Works</h2>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`glass-card p-5 flex items-start space-x-4 section-animation ${feature.delay}`}
              >
                <div className="bg-gradient-to-br from-ninja-orange to-ninja-green p-3 rounded-xl shadow-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Recent Deliveries */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-6 text-center section-animation">Recent Deliveries</h2>
          
          <div className="glass-card p-5 section-animation animation-delay-100">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium">Houston Area</div>
              <div className="text-sm text-gray-500">Last 24 hours</div>
            </div>
            
            <div className="h-40 relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg overflow-hidden">
              {/* This would be an actual map in a real app */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Map Placeholder
              </div>
              
              {/* Delivery pins */}
              <div className="absolute left-1/4 top-1/3">
                <MapPin className="w-4 h-4 text-ninja-orange" />
              </div>
              <div className="absolute right-1/3 top-1/2">
                <MapPin className="w-4 h-4 text-ninja-orange" />
              </div>
              <div className="absolute left-1/2 bottom-1/4">
                <MapPin className="w-4 h-4 text-ninja-orange" />
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              27 deliveries completed today
            </div>
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
