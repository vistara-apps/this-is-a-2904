import React, { useState } from 'react';
import { X, Check, Crown, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SubscriptionModal = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Star,
      features: [
        '10 trades per day',
        'Basic feedback',
        'Limited scenarios',
        'Community support'
      ],
      limitations: [
        'No advanced analytics',
        'No AI coaching',
        'No premium tutorials'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 15,
      period: 'month',
      icon: Star,
      popular: true,
      features: [
        'Unlimited trades',
        'Advanced AI feedback',
        'All practice scenarios',
        'Detailed analytics',
        'Priority support',
        'Risk management tools'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 30,
      period: 'month',
      icon: Crown,
      features: [
        'Everything in Premium',
        'Personalized AI coaching',
        'Custom scenarios',
        'Advanced portfolio analysis',
        'Market sentiment analysis',
        '1-on-1 expert sessions',
        'White-label reports'
      ]
    }
  ];

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      // Simulate payment processing - in real app, integrate with Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateUser({ subscriptionTier: selectedPlan });
      onClose();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text">Choose Your Plan</h2>
              <p className="text-muted mt-1">Unlock advanced trading features and AI coaching</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-text transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = user?.subscriptionTier === plan.id;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary bg-opacity-5' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isCurrentPlan ? 'ring-2 ring-accent' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <Icon size={32} className={`mx-auto mb-2 ${plan.id === 'pro' ? 'text-purple-600' : 'text-primary'}`} />
                    <h3 className="text-xl font-semibold text-text">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-text">${plan.price}</span>
                      {plan.price > 0 && <span className="text-muted">/{plan.period}</span>}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check size={16} className="text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text">{feature}</span>
                      </li>
                    ))}
                    
                    {plan.limitations?.map((limitation, index) => (
                      <li key={`limit-${index}`} className="flex items-start gap-2">
                        <X size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted line-through">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {selectedPlan !== 'free' && selectedPlan !== user?.subscriptionTier && (
            <div className="mt-8 text-center">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Upgrade to ${plans.find(p => p.id === selectedPlan)?.name}`}
              </button>
              <p className="text-sm text-muted mt-2">
                Cancel anytime. No hidden fees.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;