'use client';

import React, { useState } from 'react';
import { Review } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/useToastStore';
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react';

export interface ProductReviewsProps {
  initialReviews: Review[];
  productName: string;
  rating: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  initialReviews,
  productName,
  rating,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToastStore();

  // Form State
  const [newRating, setNewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      addToast({
        title: 'MISSING FIELDS',
        message: 'Please provide your name and review message.',
        type: 'error',
      });
      return;
    }

    const createdReview: Review = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      title: reviewTitle.trim() || 'Verified Purchase Feedback',
      comment: comment.trim(),
      verified: true,
    };

    setReviews([createdReview, ...reviews]);
    setIsModalOpen(false);
    setAuthorName('');
    setReviewTitle('');
    setComment('');

    addToast({
      title: 'REVIEW PUBLISHED!',
      message: 'Thank you for your feedback in the vault.',
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header and Summary Bar */}
      <div className="bg-white border-3 border-black rounded-lg p-6 shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center p-4 bg-neo-yellow border-3 border-black rounded-lg shadow-neo-sm">
            <span className="font-black text-4xl text-black block leading-none">
              {rating.toFixed(1)}
            </span>
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(rating)
                      ? 'fill-black text-black'
                      : 'text-black/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider block mt-1">
              {reviews.length} REVIEWS
            </span>
          </div>

          <div>
            <h3 className="font-black text-xl uppercase tracking-tight text-black">
              CUSTOMER VERIFIED REVIEWS
            </h3>
            <p className="text-xs font-bold text-gray-600 mt-1 max-w-sm">
              Real feedback from verified clothing enthusiasts and atelier customers.
            </p>
          </div>
        </div>

        <Button
          variant="yellow"
          size="md"
          leftIcon={<MessageSquarePlus className="w-4 h-4" strokeWidth={2.5} />}
          onClick={() => setIsModalOpen(true)}
        >
          WRITE A REVIEW
        </Button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 bg-white border-3 border-black rounded-lg shadow-neo flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating
                          ? 'fill-neo-yellow text-black'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono font-bold text-gray-500">
                  {rev.date}
                </span>
              </div>

              <h4 className="font-black text-sm uppercase tracking-tight text-black">
                {rev.title}
              </h4>
              <p className="text-xs font-medium text-gray-800 mt-1 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t-2 border-black/15 flex items-center justify-between">
              <span className="font-black text-xs uppercase text-black">
                {rev.author}
              </span>
              {rev.verified && (
                <div className="flex items-center gap-1 bg-neo-green/15 text-neo-green border border-black/20 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                  <CheckCircle className="w-3 h-3 text-neo-green" />
                  <span>VERIFIED BUYER</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="SUBMIT PRODUCT REVIEW"
      >
        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider block mb-1 text-black">
              RATING (STARS)
            </label>
            <div className="flex items-center gap-2 p-3 bg-white border-3 border-black rounded-lg shadow-neo-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating
                        ? 'fill-neo-yellow text-black'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-auto font-black text-xs bg-neo-yellow px-2 py-0.5 border-2 border-black rounded">
                {newRating} / 5
              </span>
            </div>
          </div>

          <Input
            label="YOUR NAME"
            placeholder="e.g. Alex Mercer"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />

          <Input
            label="REVIEW TITLE"
            placeholder="e.g. Best streetwear jacket I own"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              YOUR FEEDBACK *REQUIRED
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tell others about fit, fabric weight, durability, and craftsmanship..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white text-black font-bold text-sm border-3 border-black rounded-lg shadow-neo p-3 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-neo-md"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              CANCEL
            </Button>
            <Button type="submit" variant="yellow" size="md">
              POST REVIEW
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
