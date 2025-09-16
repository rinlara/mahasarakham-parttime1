
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  link_url?: string;
  position: string;
  is_active: boolean;
}

interface AdvertisementBannerProps {
  position: 'banner' | 'sidebar' | 'footer';
}

export default function AdvertisementBanner({ position }: AdvertisementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: advertisements } = useQuery({
    queryKey: ['advertisements', position],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    if (advertisements && advertisements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [advertisements]);

  if (!advertisements || advertisements.length === 0) return null;

  const currentAd = advertisements[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? advertisements.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === advertisements.length - 1 ? 0 : currentIndex + 1);
  };

  if (position === 'banner') {
    return (
      <div className="relative w-full mb-8">
        <Card className="overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 text-white shadow-xl">
          <CardContent className="p-0">
            <div className="flex items-center min-h-[200px]">
              {currentAd.image_url && (
                <div className="flex-1 h-48 relative">
                  <img
                    src={currentAd.image_url}
                    alt={currentAd.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              )}
              <div className="flex-1 p-8">
                <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">{currentAd.title}</h2>
                <p className="text-xl mb-4 opacity-90 text-white drop-shadow">{currentAd.description}</p>
                {currentAd.link_url && currentAd.link_url !== '#' && (
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => window.open(currentAd.link_url, '_blank')}
                    className="bg-white/90 text-purple-700 hover:bg-white font-semibold shadow-lg"
                  >
                    เรียนรู้เพิ่มเติม
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation */}
        {advertisements.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {/* Dots indicator */}
        {advertisements.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {advertisements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (position === 'sidebar') {
    return (
      <div className="space-y-4">
        {advertisements.map((ad, index) => (
          <Card key={ad.id} className="overflow-hidden shadow-lg border-purple-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              {ad.image_url && (
                <div className="h-32 relative">
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 text-purple-800">{ad.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{ad.description}</p>
                {ad.link_url && ad.link_url !== '#' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
                    onClick={() => window.open(ad.link_url, '_blank')}
                  >
                    ดูรายละเอียด
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return null;
}
