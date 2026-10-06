'use client';

import React from 'react';
import { CreditCard, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { PaymentDetails } from '@/types';

interface StripeCardFormProps {
  payment: PaymentDetails;
  onChange: (payment: PaymentDetails) => void;
  errors?: Record<string, string>;
}

export const StripeCardForm: React.FC<StripeCardFormProps> = ({
  payment,
  onChange,
  errors = {},
}) => {
  const handleAutofillTestCard = () => {
    onChange({
      ...payment,
      method: 'card',
      cardNumber: '4242 • 4242 • 4242 • 4242',
      cardHolder: 'ALEX MERCER',
      expiryDate: '12/28',
      cvv: '888',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stripe Security & Test Mode Banner */}
      <div className="bg-neo-blue/10 border-2 border-black rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-neo-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black text-white rounded flex items-center justify-center font-black text-xs">
            S
          </div>
          <div>
            <span className="font-black text-xs uppercase text-black block">
              POWERED BY STRIPE
            </span>
            <span className="text-[10px] font-bold text-gray-600 block">
              256-Bit SSL Encrypted End-to-End
            </span>
          </div>
        </div>

        {/* Quick autofill for developer testing */}
        <button
          type="button"
          onClick={handleAutofillTestCard}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neo-yellow text-black border-2 border-black rounded font-black text-[11px] uppercase shadow-neo-sm hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>USE TEST CARD (4242)</span>
        </button>
      </div>

      {/* Card Inputs */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-black uppercase tracking-wider block mb-1 text-black">
            CARD NUMBER *
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={payment.cardNumber || ''}
              onChange={(e) =>
                onChange({ ...payment, cardNumber: e.target.value })
              }
              className={`w-full bg-cream border-3 border-black rounded-lg p-3 font-mono text-sm font-bold shadow-neo-sm focus:outline-none focus:shadow-neo transition-all ${
                errors.cardNumber ? 'border-neo-red' : ''
              }`}
            />
            <CreditCard className="w-5 h-5 text-gray-400 absolute right-3.5 top-3.5" />
          </div>
          {errors.cardNumber && (
            <span className="text-[11px] font-black text-neo-red mt-1 block">
              {errors.cardNumber}
            </span>
          )}
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-wider block mb-1 text-black">
            NAME ON CARD *
          </label>
          <input
            type="text"
            placeholder="ALEX MERCER"
            value={payment.cardHolder || ''}
            onChange={(e) =>
              onChange({ ...payment, cardHolder: e.target.value })
            }
            className={`w-full bg-cream border-3 border-black rounded-lg p-3 text-sm font-bold uppercase shadow-neo-sm focus:outline-none focus:shadow-neo transition-all ${
              errors.cardHolder ? 'border-neo-red' : ''
            }`}
          />
          {errors.cardHolder && (
            <span className="text-[11px] font-black text-neo-red mt-1 block">
              {errors.cardHolder}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider block mb-1 text-black">
              EXPIRY (MM/YY) *
            </label>
            <input
              type="text"
              placeholder="12/28"
              maxLength={5}
              value={payment.expiryDate || ''}
              onChange={(e) =>
                onChange({ ...payment, expiryDate: e.target.value })
              }
              className={`w-full bg-cream border-3 border-black rounded-lg p-3 font-mono text-sm font-bold shadow-neo-sm focus:outline-none focus:shadow-neo transition-all ${
                errors.expiryDate ? 'border-neo-red' : ''
              }`}
            />
            {errors.expiryDate && (
              <span className="text-[11px] font-black text-neo-red mt-1 block">
                {errors.expiryDate}
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider block mb-1 text-black">
              CVC / CVV *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="888"
                maxLength={4}
                value={payment.cvv || ''}
                onChange={(e) =>
                  onChange({ ...payment, cvv: e.target.value })
                }
                className={`w-full bg-cream border-3 border-black rounded-lg p-3 font-mono text-sm font-bold shadow-neo-sm focus:outline-none focus:shadow-neo transition-all ${
                  errors.cvv ? 'border-neo-red' : ''
                }`}
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
            </div>
            {errors.cvv && (
              <span className="text-[11px] font-black text-neo-red mt-1 block">
                {errors.cvv}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
