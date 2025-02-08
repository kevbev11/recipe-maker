"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GPTComponent() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file) {
      setSelectedImage(file);  // Ensure this is called correctly
      setPreviewImage(URL.createObjectURL(file));
    }
  }
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedImage) {
      setError("Please upload an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", selectedImage);
  
    try {
      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("API Response:", data); // Debugging log
  
      if (response.ok) {
        // setRecipe(data.description);
        router.push(`/display-recipe?recipe=${encodeURIComponent(data.description)}`);
      } else {
        setError(data.error || "Failed to generate a response.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };
  

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-7xl font-bold mb-6 text-center">Recipe Makr</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-center justify-center items-center">
            <label className="block text-lg font-medium mb-2">Upload an image of the dish:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {previewImage && (
            <div className="mb-4">
              <p className="text-md font-semibold">Preview:</p>
              <img
                src={previewImage}
                alt="Dish Preview"
                className="w-full h-auto rounded border mt-2"
              />
            </div>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading || !selectedImage}
          >
            {loading ? "Analyzing Image..." : "Generate Recipe"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {recipe && (
          <div className="mt-6 p-4 border rounded bg-gray-100">
            <h2 className="text-xl font-bold mb-2">Generated Recipe:</h2>
            <p className="whitespace-pre-wrap">{recipe}</p>
          </div>
        )}
      </div>
    </div>
  );
}