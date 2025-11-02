import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, ChevronUp, ChevronDown, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORY_CONFIG, getAllCategories, getSubcategories } from "@shared/categories";
import type { Item } from "@shared/schema";
import heic2any from "heic2any";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = getAllCategories();
const CONDITIONS = ["new", "like-new", "good", "fair"];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  condition: z.string().min(1, "Condition is required"),
});

interface EditItemDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (itemId: string, formData: FormData) => void;
  isLoading?: boolean;
}

type ImageItem = {
  type: 'existing' | 'new';
  url?: string; // For existing images
  file?: File; // For new images
  preview: string; // Preview URL for display
};

export default function EditItemDialog({ item, open, onOpenChange, onSubmit, isLoading }: EditItemDialogProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageItem[]>(
    (item.images || []).map(url => ({
      type: 'existing' as const,
      url,
      preview: url,
    }))
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      price: parseFloat(item.price),
      category: item.category,
      subcategory: item.subcategory || "",
      condition: item.condition,
    },
  });

  // Watch category to update subcategories
  const selectedCategory = form.watch("category");
  const availableSubcategories = selectedCategory ? getSubcategories(selectedCategory) : [];

  // Reset form when item changes
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 5 - images.length);
      
      for (const file of selectedFiles) {
        try {
          let processedFile = file;
          
          // Convert HEIC to JPEG
          if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
            toast({
              title: "Converting HEIC image",
              description: `Converting ${file.name} to JPEG...`,
            });
            
            const convertedBlob = await heic2any({
              blob: file,
              toType: 'image/jpeg',
              quality: 0.9,
            });
            
            // heic2any can return an array of blobs for multi-image HEIC files
            const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            
            processedFile = new File(
              [blob], 
              file.name.replace(/\.heic$/i, '.jpg'),
              { type: 'image/jpeg' }
            );
          }
          
          // Create preview
          const reader = new FileReader();
          reader.onload = (e) => {
            const preview = e.target?.result as string;
            setImages(prev => [...prev, {
              type: 'new',
              file: processedFile,
              preview,
            }]);
          };
          reader.readAsDataURL(processedFile);
        } catch (error) {
          console.error('Error processing image:', error);
          toast({
            title: "Error processing image",
            description: `Failed to process ${file.name}. Please try another image.`,
            variant: "destructive",
          });
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return newImages;
    });
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return newImages;
    });
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    
    // Add form fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('subcategory', data.subcategory);
    formData.append('condition', data.condition);
    
    // Create ordered array with markers for new images
    const orderedWithMarkers: string[] = [];
    const newFiles: File[] = [];
    let newImageIndex = 0;
    
    images.forEach(img => {
      if (img.type === 'existing' && img.url) {
        orderedWithMarkers.push(img.url);
      } else if (img.type === 'new' && img.file) {
        orderedWithMarkers.push(`<<NEW_${newImageIndex}>>`);
        newFiles.push(img.file);
        newImageIndex++;
      }
    });
    
    // Send ordered array with markers for new images
    formData.append('imageOrder', JSON.stringify(orderedWithMarkers));
    
    // Add new image files in the same order they appear in markers
    newFiles.forEach(file => {
      formData.append('newImages', file);
    });
    
    onSubmit(item.id, formData);
  };

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
                {/* All Images in Order */}
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                    <img 
                      src={img.preview} 
                      alt={`Image ${index + 1}`} 
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
                    
                    {/* New Badge */}
                    {img.type === 'new' && (
                      <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    )}
                    
                    {/* Primary Badge */}
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Upload Button */}
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover-elevate" data-testid="label-upload-new-images">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground text-center px-2">
                      Add Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*,.heic,.HEIC"
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

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("subcategory", "");
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
