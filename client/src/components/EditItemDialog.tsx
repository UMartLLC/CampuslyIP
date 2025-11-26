import { useState, useEffect, useCallback } from "react";
// Imports UI components for the modal (Dialog) structure.
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// Imports standard UI components.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Imports icons for UI elements.
import { Upload, X, ChevronUp, ChevronDown, Pencil } from "lucide-react";
// Imports React Hook Form core utilities.
import { useForm } from "react-hook-form";
// Imports form components used to wrap inputs and display validation.
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// Imports Zod resolver for integrating Zod schema with React Hook Form.
import { zodResolver } from "@hookform/resolvers/zod";
// Imports Zod for schema definition.
import { z } from "zod";
// Imports category utilities and types from shared modules.
import { CATEGORY_CONFIG, getAllCategories, getSubcategories } from "@shared/categories";
import type { Item } from "@shared/schema";
// Library for converting HEIC image files (common on iPhones) to a web-compatible format (JPEG/PNG).
import heic2any from "heic2any";
// Hook for showing user notifications.
import { useToast } from "@/hooks/use-toast";

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
  // Coerce ensures the input (which is usually a string) is converted to a number,
  // and validates that it's positive.
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  condition: z.string().min(1, "Condition is required"),
});

// -----------------------------------------------------------------------------
// 2. Component Types
// -----------------------------------------------------------------------------

// Interface for managing image state locally.
type ImageItem = {
  type: 'existing' | 'new';
  url?: string; // Original URL for existing images
  file?: File; // File object for newly uploaded images
  preview: string; // Data URL for display in the browser
};

// Interface for the component's external props.
interface EditItemDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Function called on submit, takes the item ID and the final FormData object.
  onSubmit: (itemId: string, formData: FormData) => void;
  isLoading?: boolean;
}

// -----------------------------------------------------------------------------
// 3. EditItemDialog Component
// -----------------------------------------------------------------------------

export default function EditItemDialog({ item, open, onOpenChange, onSubmit, isLoading }: EditItemDialogProps) {
  const { toast } = useToast();
  // Initializes image state from existing item images, mapping them to the local ImageItem structure.
  const [images, setImages] = useState<ImageItem[]>(
    (item.images || []).map(url => ({
      type: 'existing' as const,
      url,
      preview: url,
    }))
  );

  // Initializes React Hook Form with the Zod schema and pre-populates fields with item data.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      // Parse price to float for the number input type.
      price: parseFloat(item.price),
      category: item.category,
      subcategory: item.subcategory || "",
      condition: item.condition,
    },
  });

  // Watch category field changes to dynamically filter available subcategories.
  const selectedCategory = form.watch("category");
  const availableSubcategories = selectedCategory ? getSubcategories(selectedCategory) : [];

  // Reset form and images state whenever the 'item' prop changes (e.g., when editing a different item).
  useEffect(() => {
    form.reset({
      title: item.title,
      description: item.description,
      price: parseFloat(item.price),
      category: item.category,
      subcategory: item.subcategory || "",
      condition: item.condition,
    });
    setImages(
      (item.images || []).map(url => ({
        type: 'existing' as const,
        url,
        preview: url,
      }))
    );
  }, [item, form]);

  // -----------------------------------------------------------------------------
  // 4. Image Handling Logic
  // -----------------------------------------------------------------------------

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Limit selection to 5 images total.
      const selectedFiles = Array.from(e.target.files).slice(0, 5 - images.length);
      
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
            toast({ title: "Converting HEIC image", description: `Converting ${file.name} to JPEG...` });
            
            try {
              // Use heic2any library for browser-side conversion.
              const convertedBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.9,
              });
              
              // Handle potential array output from heic2any.
              const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
              
              // Create a new File object with the correct type and extension.
              processedFile = new File(
                [blob], 
                file.name.replace(/\.(heic|heif)$/i, '.jpg'),
                { type: 'image/jpeg' }
              );
              
              console.log('Successfully converted HEIC to JPEG');
              toast({ title: "Conversion complete", description: `${file.name} converted successfully` });
            } catch (conversionError) {
              console.error('HEIC conversion error:', conversionError);
              throw new Error(`HEIC conversion failed: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`);
            }
          }
          
          // Create Data URL for image preview display.
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
          
          // Add the new image (file and preview) to the state.
          setImages(prev => [...prev, {
            type: 'new',
            file: processedFile,
            preview,
          }]);
          
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

  // Removes an image at a specific index from the state.
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Swaps image positions to move the image up (left in the grid).
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    
    setImages(prev => {
      const newImages = [...prev];
      // ES6 array destructuring swap.
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return newImages;
    });
  };

  // Swaps image positions to move the image down (right in the grid).
  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    
    setImages(prev => {
      const newImages = [...prev];
      // ES6 array destructuring swap.
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return newImages;
    });
  };

  // -----------------------------------------------------------------------------
  // 5. Submit Handler
  // -----------------------------------------------------------------------------

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    
    // Append standard form fields to the FormData object.
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('subcategory', data.subcategory);
    formData.append('condition', data.condition);
    
    // Create an ordered array containing URLs of existing images and placeholders for new images.
    const orderedWithMarkers: string[] = [];
    const newFiles: File[] = [];
    let newImageIndex = 0;
    
    images.forEach(img => {
      if (img.type === 'existing' && img.url) {
        orderedWithMarkers.push(img.url); // Use the URL for existing images.
      } else if (img.type === 'new' && img.file) {
        // Use a unique marker for new images and store the actual File object separately.
        orderedWithMarkers.push(`<<NEW_${newImageIndex}>>`);
        newFiles.push(img.file);
        newImageIndex++;
      }
    });
    
    // Send the ordered array of URLs and markers to the backend.
    formData.append('imageOrder', JSON.stringify(orderedWithMarkers));
    
    // Append new image files using the 'newImages' key, preserving the order defined by markers.
    newFiles.forEach(file => {
      formData.append('newImages', file);
    });
    
    // Call the external submit function with the item ID and the prepared FormData.
    onSubmit(item.id, formData);
  };

  // -----------------------------------------------------------------------------
  // 6. Component Render
  // -----------------------------------------------------------------------------

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Item
          </DialogTitle>
          <DialogDescription>
            Update your item details and manage images
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Images Section */}
            <div className="space-y-4">
              <Label>Photos (up to 5)</Label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Display All Images in Current Order */}
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                    <img 
                      src={img.preview} 
                      alt={`Image ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    
                    {/* Reorder Buttons (Move Up/Down) */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveImageUp(index)}
                        disabled={index === 0} // Disable if already the first image
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
                        disabled={index === images.length - 1} // Disable if already the last image
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
                    
                    {/* New Image Badge */}
                    {img.type === 'new' && (
                      <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    )}
                    
                    {/* Primary Image Badge */}
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Image Upload Button (Only shows if less than 5 images) */}
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover-elevate" data-testid="label-upload-new-images">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground text-center px-2">
                      Add Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*,.heic,.HEIC,.heif,.HEIF" // Accepts common image types including HEIC
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      data-testid="input-new-images"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Calculus Textbook 8th Edition" {...field} data-testid="input-edit-title" />
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
                      placeholder="Describe your item..." 
                      className="min-h-[100px]" 
                      {...field} 
                      data-testid="textarea-edit-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price and Condition Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-edit-price" />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONDITIONS.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {/* Formats condition string (e.g., 'like-new' -> 'Like New') */}
                            {condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category Field */}
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
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-edit-category">
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

            {/* Subcategory Field (Conditionally Rendered) */}
            {selectedCategory && availableSubcategories.length > 0 && (
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-subcategory">
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

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} data-testid="button-save-edit">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}