
import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { RealTimePayment } from '@/components/payment/RealTimePayment';

const Payment = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not logged in
      navigate('/registration');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  if (!isLoggedIn) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Payment Portal</h1>
              <p className="text-xl text-muted-foreground">
                Complete your payment securely for your solar installation.
              </p>
            </div>

            <Tabs defaultValue="payment" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="payment">Make Payment</TabsTrigger>
                <TabsTrigger value="history">Payment History</TabsTrigger>
              </TabsList>

              <TabsContent value="payment" className="space-y-8">
                <RealTimePayment 
                  amount={1250} 
                  onSuccess={(data) => {
                    console.log('Payment successful:', data);
                    // You can navigate or show additional UI after successful payment
                  }}
                />
              </TabsContent>

              <TabsContent value="history">
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No payment history found</h3>
                  <p className="text-muted-foreground">
                    When you make payments, they will appear here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Payment;
