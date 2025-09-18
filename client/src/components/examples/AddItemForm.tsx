import AddItemForm from '../AddItemForm';

export default function AddItemFormExample() {
  return (
    <div className="container mx-auto p-4">
      <AddItemForm
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          alert('Item submitted! (This is just a demo)');
        }}
        isLoading={false}
      />
    </div>
  );
}