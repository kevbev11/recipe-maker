"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GPTComponent() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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

    setLoading(true);
  
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
        router.push(`/display-recipe?recipe=${encodeURIComponent(data.description)}`);
      } else {
        setError(data.error || "Failed to generate a response.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h1 className="text-7xl font-bold mb-10 text-center text-[var(--foreground)]">Recipe Makr</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <label
              htmlFor="file-upload"
              className="px-6 py-3 rounded-full text-lg font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: "var(--vibrant-orange)",
                color: "white",
                fontWeight: "bold",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--soft-orange)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--vibrant-orange)")}
            >
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {selectedImage && <p className="mt-2 text-sm">{selectedImage.name}</p>}
          </div>

          {previewImage && (
          <div className="flex justify-center">
            <div className="inline-block border border-gray-300 p-2 rounded-md">
              <img
                src={previewImage}
                alt="Dish Preview"
                className="w-auto h-auto max-w-full max-h-[500px] object-contain rounded" // 🔸 Dynamically fit image size
              />
            </div>
          </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
                loading || !selectedImage ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
              style={{
                backgroundColor: loading || !selectedImage ? "gray" : "var(--vibrant-orange)",
                color: "white",
                fontWeight: "bold",
              }}
              onMouseOver={(e) => {
                if (!(loading || !selectedImage)) {
                  e.currentTarget.style.backgroundColor = "var(--soft-orange)";
                }
              }}
              onMouseOut={(e) => {
                if (!(loading || !selectedImage)) {
                  e.currentTarget.style.backgroundColor = "var(--vibrant-orange)";
                }
              }}
              disabled={loading || !selectedImage}
            >
              {loading ? "Generating Recipe..." : "Generate Recipe"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}