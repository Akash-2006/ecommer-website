#!/usr/bin/env python3
"""
Professional Placeholder Generator
Creates clean, professional placeholder images for all products
"""

import requests
import json
import os
import random
import time
from urllib.parse import quote

def clean_product_name(name):
    """Clean product name for display"""
    # Remove special chars, convert to title case
    cleaned = name.replace('-', ' ')
    cleaned = ' '.join(word.capitalize() for word in cleaned.split())
    return cleaned

def get_category_color(category):
    """Get category-specific colors"""
    colors = {
        'Top Wear': ['4a90e2/ffffff', '7ed321/ffffff', 'f5a623/ffffff'],
        'Bottom Wear': ['50e3c2/ffffff', '417505/ffffff', '9013fe/ffffff'],
        'Dresses': ['d0021b/ffffff', 'f8e71c/ffffff', 'bd10e0/ffffff'],
        'Footwear': ['8b572a/ffffff', '5a5a5a/ffffff', '000000/ffffff'],
        'Accessories': ['b8860b/ffffff', '9b59b6/ffffff', '1abc9c/ffffff'],
        'Activewear': ['e74c3c/ffffff', '3498db/ffffff', '2ecc71/ffffff'],
        'Sleepwear': ['dda0dd/ffffff', '98fb98/ffffff', 'ffd1dc/ffffff'],
        'Swimwear': ['00bcd4/ffffff', '4fc3f7/ffffff', '81c784/ffffff'],
        'Formal Wear': ['2c3e50/ffffff', '34495e/ffffff', '5d4037/ffffff'],
        'Outerwear': ['607d8b/ffffff', '795548/ffffff', '37474f/ffffff']
    }
    return random.choice(colors.get(category, ['cccccc/666666']))

def generate_placeholder(product_name, category, width=500, height=500):
    """Generate a professional placeholder image"""
    clean_name = clean_product_name(product_name)
    
    # Limit text length for readability
    if len(clean_name) > 20:
        clean_name = clean_name[:17] + "..."
    
    text = quote(clean_name.replace(' ', '+'))
    color = get_category_color(category)
    
    url = f"https://via.placeholder.com/{width}x{height}/{color}?text={text}"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.content
    except Exception as e:
        print(f"   ❌ Error generating placeholder: {e}")
    
    return None

def main():
    products_file = "data/products.json"
    output_dir = "images/products"
    
    print("🎨 PROFESSIONAL PLACEHOLDER GENERATOR")
    print("=" * 50)
    print("✨ Features:")
    print("   • Category-specific colors")
    print("   • Clean product names")
    print("   • Professional appearance")
    print("   • Fast generation")
    print("   • 500x500 high quality")
    print("")
    
    if not os.path.exists(products_file):
        print(f"❌ Products file not found: {products_file}")
        return
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Load products
    try:
        with open(products_file, 'r') as f:
            products = json.load(f)
    except Exception as e:
        print(f"❌ Error loading products: {e}")
        return
    
    print(f"🚀 Generating placeholders for {len(products)} products...")
    print("=" * 50)
    
    success = 0
    skipped = 0
    failed = 0
    
    for i, product in enumerate(products, 1):
        product_name = product['name']
        category = product['category']
        filename = os.path.basename(product['images'][0]['url'])
        filepath = os.path.join(output_dir, filename)
        
        print(f"[{i:3d}/{len(products)}] {product_name}")
        
        if os.path.exists(filepath):
            print(f"   ⏭️  Already exists")
            skipped += 1
            continue
        
        # Generate placeholder
        image_data = generate_placeholder(product_name, category)
        
        if image_data:
            try:
                with open(filepath, 'wb') as f:
                    f.write(image_data)
                size_kb = len(image_data) / 1024
                print(f"   ✅ Generated ({size_kb:.1f} KB)")
                success += 1
            except Exception as e:
                print(f"   ❌ Save failed: {e}")
                failed += 1
        else:
            print(f"   ❌ Generation failed")
            failed += 1
        
        # Small delay to be respectful
        time.sleep(0.2)
    
    print("\n" + "=" * 50)
    print("📊 GENERATION SUMMARY")
    print(f"   ✅ Generated: {success}")
    print(f"   ⏭️  Skipped: {skipped}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📁 Total files: {success + skipped}")
    print(f"\n🎉 Professional placeholders created!")
    print(f"📁 Location: {output_dir}/")
    print(f"🔄 Restart Docker: docker restart ecommerce-fullstack")
    print(f"🌐 Visit: http://localhost:3000")

if __name__ == "__main__":
    main()
