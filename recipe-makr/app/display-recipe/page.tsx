"use client";

import { useSearchParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecipeDisplay() {
    const [recipeData, setRecipeData] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const data = searchParams.get("recipe");
        if (data) {
            setRecipeData(data);
        }
    }, [searchParams]);

    if (!recipeData) {
        return <p className="text-center">No recipe available.</p>;
    }

    const formatBoldText = (text: string) => {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = text.split(boldRegex);
    
        return parts.map((part, index) => {
          if (index % 2 === 1) {
            // 🔸 If the part matches the bold segment, wrap it in <strong>
            return <strong key={index} style={{ fontWeight: 'bold' }}>{part}</strong>;
          }
          return part;
        });
      };

    const parseRecipe = (recipeText: string) => {
        const lines = recipeText.split("\n");
        const formattedRecipe = [];
        let currentListItems: JSX.Element[] = [];
    
        lines.forEach((line, index) => {
          // 🔸 Create a unique key using the line index and its content to avoid key conflicts
          const uniqueKey = `${index}-${line.slice(0, 10).replace(/\s/g, "")}`;
    
          // 🔸 Handle Markdown-style headers by stripping '#' and applying consistent orange styling
          if (/^#+\s/.test(line)) {
            const headerText = line.replace(/^#+\s*/, "");
            formattedRecipe.push(
                <h2 key={uniqueKey} className="mt-6" style={{ color: 'var(--vibrant-orange)' }}>{formatBoldText(headerText)}</h2>
            );
          } else if (/^- /.test(line)) {
            // 🔸 Handle list items and apply orange color
            currentListItems.push(
                <li key={uniqueKey} style={{ color: 'var(--vibrant-orange)' }}>{formatBoldText(line.replace(/^- /, ""))}</li>
            );
          } else {
            if (currentListItems.length > 0) {
              // 🔸 Render accumulated list items when a non-list line is encountered
              formattedRecipe.push(
                <ul key={`list-${uniqueKey}`} className="list-disc list-inside ml-6 mb-4" style={{ color: 'var(--vibrant-orange)' }}>
                  {currentListItems}
                </ul>
              );
              currentListItems = [];
            }
            // 🔸 Render normal paragraphs with orange color
            formattedRecipe.push(
                <p key={uniqueKey} className="mt-2" style={{ color: 'var(--vibrant-orange)' }}>{formatBoldText(line)}</p>
            );
          }
        });
    
        if (currentListItems.length > 0) {
          // 🔸 Render any remaining list items at the end of parsing
          formattedRecipe.push(
            <ul key="final-list" className="list-disc list-inside ml-6 mb-4" style={{ color: 'var(--vibrant-orange)' }}>{currentListItems}</ul>
          );
        }
    
        return formattedRecipe;
    };

    const navigateToUpload = () => {
        // Clear local storage or any state related to the image upload if necessary
        localStorage.removeItem("uploadedImage"); // 🔸 Example: Adjust if using local storage
        router.push("/upload-img");
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-5xl font-bold text-center mb-4">Recipe</h1>
            <div className="bg-gray-100 p-4 rounded shadow">
                {parseRecipe(recipeData)}
            </div>
            <div className="mt-6 text-center">
                <button
                onClick={navigateToUpload}
                className="px-6 py-3 rounded-full text-lg font-medium transition-all"
                style={{
                    backgroundColor: 'var(--vibrant-orange)',
                    color: 'white',
                    fontWeight: 'bold',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--soft-orange)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--vibrant-orange)')}
                >
                Generate New Recipe
                </button>
            </div>
        </div>
    );
}
