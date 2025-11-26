import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Imports icons for upload, close/remove, and reordering.
import { Upload, X, ChevronUp, ChevronDown } from "lucide-react";
// Imports TanStack Query hooks for mutation and cache invalidation.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
// Imports React Hook Form core utilities.
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// Imports Zod resolver for integrating Zod schema with React Hook Form.
import { zodResolver } from "@hookform/resolvers/zod";
// Imports Zod for schema definition.
import { z } from "zod";
// Imports category utilities and configuration from shared modules.
import { CATEGORY_CONFIG, getAllCategories, getSubcategories } from "@shared/categories";
// Library for converting HEIC image files (common on iPhones) to a web-compatible format.
import heic2any from "heic2any";

// Static arrays for form options.
const CATEGORIES = getAllCategories();
const CONDITIONS = ["new", "like-new", "good", "fair"];

// -----------------------------------------------------------------------------
// 1. Zod Validation Schema
// -----------------------------------------------------------------------------

// Defines the shape and validation rules for the form data.
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  // Price is kept as string to handle initial empty state and strict decimal input,
  // but validation ensures it represents a positive number.
  price: z.string().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  condition: z.string().min(1, "Condition is required"),
});

// -----------------------------------------------------------------------------
// 2. SellPage Component
// -----------------------------------------------------------------------------

export default function SellPage() {
  // State stores the actual File objects to be submitted via FormData.
  const [images, setImages] = useState<File[]>([]);
  // State stores the Data URLs for immediate preview display in the browser.
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const [, setLocation] = useLocation(); // Function to navigate after successful submission.
  const queryClient = useQueryClient(); // Used to invalidate cache after success.

  // Initializes React Hook Form with the Zod schema.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      subcategory: "",
      condition: "",
    },
  });

  // Watch category field changes to dynamically filter available subcategories.
  const selectedCategory = form.watch("category");
  const availableSubcategories = selectedCategory ? getSubcategories(selectedCategory) : [];

  // -----------------------------------------------------------------------------
  // 3. Create Item Mutation
  // -----------------------------------------------------------------------------

  const createItemMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/items', {
        method: 'POST',
        body: data, // FormData object is passed directly, including files and form data.
        credentials: 'include',
      });
      if (!response.ok) {
        // Reads the detailed error message from the response body if available.
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create item');
      }
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate all queries starting with '/api/items' (marketplace, My Market) to refresh item lists.
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
      setLocation('/items'); // Redirects user to the marketplace page.
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to list item. Please try again.",
        variant: "destructive",
      });
    },
  });

  // -----------------------------------------------------------------------------
  // 4. Image Upload and Conversion Handler
  // -----------------------------------------------------------------------------

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Limits file selection to a maximum of 5 images.
      const selectedFiles = Array.from(e.target.files).slice(0, 5 - images.length);
      const newImages: File[] = [];
      const newPreviews: string[] = [];
      
      for (const file of selectedFiles) {
        try {
          let processedFile = file;
          let preview: string;
          
          // Check for HEIC/HEIF files (common iPhone format).
          const isHEIC = file.name.toLowerCase().endsWith('.heic') || 
                         file.name.toLowerCase().endsWith('.heif') ||
                         file.type === 'image/heic' || 
                         file.type === 'image/heif';
          
          // Convert HEIC to JPEG if detected.
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
              
              // Handles potential array output from heic2any and creates a new File object.
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
          
          // Creates a Data URL for image preview display.
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
          
          // Collect processed images and previews into temporary arrays.
          newImages.push(processedFile);
          newPreviews.push(preview);
          
        } catch (error) {
          console.error('Error processing image:', error);
          toast({
            title: "Error processing image",
            description: `Failed to process ${file.name}. ${error instanceof Error ? error.message : 'Please try another image.'}`,
            variant: "destructive",
          });
        }
      }
      
      // Updates state once with all successfully processed new images.
      if (newImages.length > 0) {
        setImages(prev => [...prev, ...newImages]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
      }
    }
  };

  // -----------------------------------------------------------------------------
  // 5. Image Management Handlers
  // -----------------------------------------------------------------------------

  // Removes an image and its preview at the given index.
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Swaps image positions to move the image up (left in the display).
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    
    // Updates the File objects array.
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return newImages;
    });
    
    // Updates the Preview URLs array, maintaining order parity with files.
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      [newPreviews[index - 1], newPreviews[index]] = [newPreviews[index], newPreviews[index - 1]];
      return newPreviews;
    });
  };

  // Swaps image positions to move the image down (right in the display).
  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    
    // Updates the File objects array.
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return newImages;
    });
    
    // Updates the Preview URLs array.
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];
      return newPreviews;
    });
  };

  // -----------------------------------------------------------------------------
  // 6. Form Submission Handler
  // -----------------------------------------------------------------------------

  // Wrapper around form.handleSubmit that converts form data to FormData for file upload.
  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    // Appends text/select fields to the FormData object.
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    if (data.subcategory) {
      formData.append('subcategory', data.subcategory);
    }
    formData.append('condition', data.condition);
    // sellerId is now automatically set from authenticated user session
    
    // Appends all image File objects to the FormData object under the key 'images'.
    images.forEach((image) => {
      formData.append('images', image);
    });

    createItemMutation.mutate(formData); // Triggers the API call.
  });

  // -----------------------------------------------------------------------------
  // 7. Component Render
  // -----------------------------------------------------------------------------

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
              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Photos (up to 5)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Display Image Previews */}
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
                          disabled={index === 0} // Disable if first image
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
                          disabled={index === images.length - 1} // Disable if last image
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
                      
                      {/* Priority Badge (First image is primary) */}
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Upload Button/Area (Visible if less than 5 images) */}
                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover-elevate" data-testid="label-upload-images">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground text-center px-2">
                        Add Photo
                      </span>
                      <input
                        type="file"
                        // Accepts common image formats, including HEIC/HEIF files.
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

              {/* Form Field: Title */}
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

              {/* Form Field: Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("subcategory", ""); // Reset subcategory when category changes.
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

              {/* Form Field: Subcategory (Conditionally Rendered) */}
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

              {/* Form Field: Condition */}
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
                            {/* Capitalizes first letter for display. */}
                            {cond.charAt(0).toUpperCase() + cond.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Field: Price / Starting Bid */}
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

              {/* Form Field: Description */}
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

              {/* Submit Button */}
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