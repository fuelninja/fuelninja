
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';

interface ReviewPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewPrompt: React.FC<ReviewPromptProps> = ({ isOpen, onClose }) => {
  const handleOpenAppStore = () => {
    // In a real app, these would be actual App Store / Play Store links
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.open('https://apps.apple.com/app/fuelninja', '_blank');
    } else {
      window.open('https://play.google.com/store/apps/details?id=app.fuelninja', '_blank');
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Enjoy Your Experience?</DialogTitle>
          <DialogDescription className="text-center">
            <div className="flex justify-center my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400 mx-1" />
              ))}
            </div>
            We're glad we could help you refuel today! If you enjoyed our service, please consider leaving us a review.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <Button className="w-full" onClick={handleOpenAppStore}>
            Leave a Review
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewPrompt;
