
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { costSharingAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const RealTimePayment = ({ amount = 0, onSuccess }) => {
  const [paymentAmount, setPaymentAmount] = useState(amount);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const formatCardNumber = (value) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add spaces after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvvChange = (e) => {
    // Only allow up to 3 digits
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvv(value);
  };

  const handleAmountChange = (e) => {
    // Don't allow negative values
    const value = Math.max(0, parseFloat(e.target.value) || 0);
    setPaymentAmount(value);
  };

  const processPayment = async () => {
    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      toast({
        title: "Invalid card number",
        description: "Please enter a valid 16-digit card number.",
        variant: "destructive",
      });
      return;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
      toast({
        title: "Invalid expiry date",
        description: "Please enter a valid expiry date (MM/YY).",
        variant: "destructive",
      });
      return;
    }
    
    if (!cvv || cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid 3-digit CVV number.",
        variant: "destructive",
      });
      return;
    }
    
    if (!nameOnCard) {
      toast({
        title: "Missing information",
        description: "Please enter the name on your card.",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });
      return;
    }

    // Start processing animation
    setIsProcessing(true);
    setPaymentStatus('processing');
    setProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
        }
        return Math.min(newProgress, 95); // Cap at 95% until final confirmation
      });
    }, 150);

    try {
      // Process payment through API
      const response = await costSharingAPI.makePayment({
        amount: paymentAmount,
        cardDetails: {
          // In a real app, you would use a secure payment processor
          // and not send raw card details to your backend
          lastFour: cardNumber.replace(/\s/g, '').slice(-4)
        }
      });
      
      clearInterval(progressInterval);
      
      if (response.success) {
        // Set progress to 100% after success
        setProgress(100);
        setPaymentStatus('success');
        
        toast({
          title: "Payment successful",
          description: `Your payment of $${paymentAmount.toFixed(2)} has been processed.`,
          variant: "default",
        });
        
        // Call the success callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess(response);
          }, 1500);
        }
      } else {
        setPaymentStatus('error');
        toast({
          title: "Payment failed",
          description: response.message || "Your payment could not be processed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setPaymentStatus('error');
      toast({
        title: "Payment failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        if (paymentStatus !== 'success') {
          setIsProcessing(false);
          setPaymentStatus(null);
        }
      }, 3000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your card information to complete the payment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <div className="space-y-5 py-4">
            <div className="text-center">
              {paymentStatus === 'success' ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-lg font-medium">Payment Successful!</h3>
                  <p className="text-muted-foreground">Your transaction was completed successfully.</p>
                </div>
              ) : paymentStatus === 'error' ? (
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-2" />
                  <h3 className="text-lg font-medium">Payment Failed</h3>
                  <p className="text-muted-foreground">There was an issue processing your payment.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Clock className="h-12 w-12 text-primary animate-pulse mb-2" />
                  <h3 className="text-lg font-medium">Processing Payment</h3>
                  <p className="text-muted-foreground">Please wait while we process your payment...</p>
                </div>
              )}
            </div>
            
            <Progress value={progress} className="h-2 w-full" />
            
            <div className="text-center text-sm text-muted-foreground">
              {paymentStatus === 'processing' && "Do not close this window or refresh the page."}
            </div>
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="payment-amount">Payment Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="payment-amount"
                  type="number"
                  value={paymentAmount}
                  onChange={handleAmountChange}
                  min="0"
                  step="0.01"
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="card-name">Name on Card</Label>
              <Input
                id="card-name"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <div className="relative mt-1">
                <Input
                  id="card-number"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="mt-1"
                  type="password"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {!isProcessing && (
          <Button 
            onClick={processPayment} 
            className="w-full bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
          >
            Pay ${paymentAmount.toFixed(2)}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
