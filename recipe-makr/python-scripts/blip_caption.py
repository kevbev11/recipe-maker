from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import sys

def generate_caption(image_path):
    # Load the BLIP model
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

    # Open and process the image
    image = Image.open(image_path)
    inputs = processor(images=image, return_tensors="pt")

    # Generate caption
    output = model.generate(**inputs)
    caption = processor.decode(output[0], skip_special_tokens=True)
    return caption

if __name__ == "__main__":
    image_path = sys.argv[1]
    caption = generate_caption(image_path)
    print(caption)
