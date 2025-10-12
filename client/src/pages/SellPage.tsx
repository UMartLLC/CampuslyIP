import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

const CATEGORIES = ["Electronics", "Textbooks", "Furniture", "Clothing", "Sports", "Other"];
const CONDITIONS = ["new", "like-new", "good", "fair"];

export default function SellPage() {
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting item...');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Sell an Item</CardTitle>
          <CardDescription>List your item for sale or set a starting bid price</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">Item Images</Label>
              <div className="border-2 border-dashed rounded-md p-8 text-center hover-elevate cursor-pointer">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-testid="input-images"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images (up to 5)
                  </p>
                  {images.length > 0 && (
                    <p className="text-sm text-primary mt-2">
                      {images.length} image{images.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Item Title</Label>
              <Input id="title" placeholder="e.g., Calculus Textbook 8th Edition" data-testid="input-title" />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select>
                <SelectTrigger id="condition" data-testid="select-condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((cond) => (
                    <SelectItem key={cond} value={cond}>
                      {cond.charAt(0).toUpperCase() + cond.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price / Starting Bid ($)</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" data-testid="input-price" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item, its condition, and any other relevant details..."
                rows={5}
                data-testid="textarea-description"
              />
            </div>

            {/* Contact Information (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information (Optional)</Label>
              <Input id="contact" placeholder="Phone or email" data-testid="input-contact" />
            </div>

            <Button type="submit" className="w-full" data-testid="button-list-item">
              List Item for Sale
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
