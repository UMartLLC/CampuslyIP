import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, ChevronUp, ChevronDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORY_CONFIG, getAllCategories, getSubcategories } from "@shared/categories";
import heic2any from "heic2any";

const CATEGORIES = getAllCategories();
const CONDITIONS = ["new", "like-new", "good", "fair"];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  condition: z.string().min(1, "Condition is required"),
  contact: z.string().optional(),
});

export default function SellPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
      subcategory: "",
      condition: "",
      contact: "",
    },
  });

  // Watch category to update subcategories
  const selectedCategory = form.watch("category");
  const availableSubcategories = selectedCategory ? getSubcategories(selectedCategory) : [];

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 5 - images.length);
      
      for (const file of selectedFiles) {
        try {
          let processedFile = file;
          let preview: string;
          
          // Check if file is HEIC based on file extension (browsers don't always set correct MIME type)
          const isHEIC = file.name.toLowerCase().endsWith('.heic') || 
                         file.name.toLowerCase().endsWith('.heif') ||
                         file.type === 'image/heic' || 
                         file.type === 'image/heif';
          
          // Convert HEIC to JPEG for preview and upload
          if (isHEIC) {
            console.log('Detected HEIC file:', file.name, 'type:', file.type);
            toast({
              title: "Converting HEIC image",
              description: `Converting ${file.name} to JPEG...`,
            });
            
            try {
              const convertedBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.9,
              });
              
              // heic2any can return an array of blobs for multi-image HEIC files
              const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
              
              processedFile = new File(
                [blob], 
                file.name.replace(/\.(heic|heif)$/i, '.jpg'),
                { type: 'image/jpeg' }
              );
              
              console.log('Successfully converted HEIC to JPEG');
              toast({
                title: "Conversion complete",
                description: `${file.name} converted successfully`,
              });
            } catch (conversionError) {
              console.error('HEIC conversion error:', conversionError);
              throw new Error(`HEIC conversion failed: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`);
            }
          }
          
          // Create preview from processed file
          preview = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                resolve(e.target.result as string);
              } else {
                reject(new Error('Failed to read file'));
              }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(processedFile);
          });
          
          console.log('Preview created for:', file.name);
          
          // Add image and preview immediately
          setImages(prev => [...prev, processedFile]);
          setImagePreviews(prev => [...prev, preview]);
          
        } catch (error) {
          console.error('Error processing image:', error);
          toast({
            title: "Error processing image",
            description: `Failed to process ${file.name}. ${error instanceof Error ? error.message : 'Please try another image.'}`,
            variant: "destructive",
          });
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return newImages;
    });
    
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      [newPreviews[index - 1], newPreviews[index]] = [newPreviews[index], newPreviews[index - 1]];
      return newPreviews;
    });
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return newImages;
    });
    
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];
      return newPreviews;
    });
  };

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    if (data.subcategory) {
      formData.append('subcategory', data.subcategory);
    }
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
              <div className="space-y-4">
                <Label>Photos (up to 5)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Reorder Buttons */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          data-testid={`button-move-up-${index}`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => moveImageDown(index)}
                          disabled={index === images.length - 1}
                          data-testid={`button-move-down-${index}`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => removeImage(index)}
                        data-testid={`button-remove-image-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      
                      {/* Priority Badge */}
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover-elevate" data-testid="label-upload-images">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground text-center px-2">
                        Add Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*,.heic,.HEIC,.heif,.HEIF"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        data-testid="input-images"
                      />
                    </label>
                  )}
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
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("subcategory", ""); // Reset subcategory when category changes
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedCategory && availableSubcategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-subcategory">
                            <SelectValue placeholder="Select a subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSubcategories.map((subcat) => (
                            <SelectItem key={subcat} value={subcat}>
                              {subcat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
