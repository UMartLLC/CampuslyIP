import { useState } from "react";
import { useLocation } from "wouter";
import AddItemForm from "@/components/AddItemForm";
import type { InsertItem } from "@shared/schema";

export default function AddItemPage() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: InsertItem) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Submit to API
      console.log('Submitting item:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success and redirect
      alert('Item listed successfully! Redirecting to browse page...');
      setTimeout(() => {
        setLocation('/items');
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting item:', error);
      alert('Error listing item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Sell Your Item
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          List your item for sale and connect with buyers on your campus. It's free and takes just minutes.
        </p>
      </div>

      <AddItemForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}