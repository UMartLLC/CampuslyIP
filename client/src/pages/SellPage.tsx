import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const CATEGORIES = ["Electronics", "Textbooks", "Furniture", "Clothing", "Sports", "Other"];
const CONDITIONS = ["new", "like-new", "good", "fair"];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  contact: z.string().optional(),
});

export default function SellPage() {
  const [images, setImages] = useState<File[]>([]);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "",
      contact: "",
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/items', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create item');
      }
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate all items queries (marketplace and My Market)
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          typeof query.queryKey[0] === 'string' && 
          query.queryKey[0].startsWith('/api/items')
      });
      toast({
        title: "Success!",
        description: "Your item has been listed for sale.",
      });
      setLocation('/items');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to list item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('condition', data.condition);
    // sellerId is now automatically set from authenticated user session
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    createItemMutation.mutate(formData);
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Sell an Item</CardTitle>
          <CardDescription>List your item for sale or set a starting bid price</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
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

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Calculus Textbook 8th Edition" {...field} data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONDITIONS.map((cond) => (
                          <SelectItem key={cond} value={cond}>
                            {cond.charAt(0).toUpperCase() + cond.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price / Starting Bid ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your item, its condition, and any other relevant details..."
                        rows={5}
                        {...field}
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Information (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone or email" {...field} data-testid="input-contact" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={createItemMutation.isPending} data-testid="button-list-item">
                {createItemMutation.isPending ? "Listing..." : "List Item for Sale"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
