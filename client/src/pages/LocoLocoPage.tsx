import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Imports icons for distinguishing ad types (Calendar, MapPin) and linking out (ExternalLink).
import { Calendar, MapPin, ExternalLink } from "lucide-react";

// -----------------------------------------------------------------------------
// 1. Mock Data
// -----------------------------------------------------------------------------

// Mock data array representing different types of advertisements.
const mockAds = [
  {
    id: '1',
    type: 'event', // Ad type: event, roommate, or item.
    title: 'Computer Science Club Meeting',
    description: 'Join us for our weekly GBM featuring guest speakers!',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
    date: 'Friday, 7PM',
    location: 'Room 301',
    link: '#',
    tier: 'premium' // Tier determines display order.
  },
  {
    id: '2',
    type: 'roommate',
    title: 'Looking for Roommate - Spring 2024',
    description: 'Clean, quiet student seeking roommate for off-campus apartment',
    tier: 'standard'
  },
  {
    id: '3',
    type: 'item',
    title: 'Gaming Setup Sale!',
    description: 'High-end gaming PC and peripherals - must see!',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    link: '/items/3',
    tier: 'premium'
  },
  {
    id: '4',
    type: 'event',
    title: 'Study Group - Finals Week',
    description: 'Group study session for Engineering 101',
    tier: 'standard'
  },
];

// -----------------------------------------------------------------------------
// 2. LocoLocoPage Component
// -----------------------------------------------------------------------------

export default function LocoLocoPage() {
  // State controls which type of ad is currently selected for filtering.
  const [selectedType, setSelectedType] = useState('all');

  // Filters the mock ads based on the selected type, showing all if 'all' is selected.
  const filteredAds = selectedType === 'all' 
    ? mockAds 
    : mockAds.filter(ad => ad.type === selectedType);

  // Sorts the filtered ads, ensuring 'premium' ads appear before 'standard' ads.
  const sortedAds = [...filteredAds].sort((a, b) => {
    if (a.tier === 'premium' && b.tier !== 'premium') return -1; // a comes first
    if (a.tier !== 'premium' && b.tier === 'premium') return 1; // b comes first
    return 0; // maintain relative order if tiers are the same
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">LocoLoco Advertisements</h1>
        <p className="text-muted-foreground">
          Browse events, roommate requests, and special promotions
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-8">
        <TabsList>
          <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
          <TabsTrigger value="event" data-testid="filter-event">Events</TabsTrigger>
          <TabsTrigger value="roommate" data-testid="filter-roommate">Roommates</TabsTrigger>
          <TabsTrigger value="item" data-testid="filter-item">Items</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAds.map((ad) => (
          <Card key={ad.id} className="overflow-hidden hover-elevate" data-testid={`ad-${ad.id}`}>
            {/* Ad Image (Conditional) */}
            {ad.image && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{ad.title}</CardTitle>
                {/* Premium Badge (Conditional) */}
                {ad.tier === 'premium' && (
                  <Badge variant="default" className="shrink-0">Premium</Badge>
                )}
              </div>
              <CardDescription>{ad.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Event Date (Conditional) */}
              {ad.date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{ad.date}</span>
                </div>
              )}
              {/* Event Location (Conditional) */}
              {ad.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{ad.location}</span>
                </div>
              )}
              {/* Action Button (Conditional) */}
              {ad.link && (
                <Button 
                  // Uses the default button variant for 'item' ads, and outline for others.
                  variant={ad.type === 'item' ? 'default' : 'outline'} 
                  className="w-full"
                  data-testid={`button-view-${ad.id}`}
                >
                  {ad.type === 'item' ? 'View Item' : 'Learn More'}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}