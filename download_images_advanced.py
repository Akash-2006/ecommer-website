#!/usr/bin/env python3
"""
Advanced Product Image Downloader
Uses multiple sources and better search algorithms to find product images
"""

import requests
import json
import os
import time
import random
from urllib.parse import quote
import re
from pathlib import Path

class AdvancedImageDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Image sources configuration
        self.sources = {
            'unsplash': True,
            'placeholder': True,
            'picsum': True
        }
        
        # Category-specific search terms
        self.category_keywords = {
            'Top Wear': ['shirt', 'top', 'blouse', 'sweater', 'jacket'],
            'Bottom Wear': ['pants', 'jeans', 'shorts', 'trousers'],
            'Dresses': ['dress', 'gown', 'frock'],
            'Footwear': ['shoes', 'boots', 'sneakers', 'sandals'],
            'Accessories': ['bag', 'belt', 'watch', 'sunglasses', 'scarf'],
            'Activewear': ['sportswear', 'athletic', 'workout', 'gym'],
            'Sleepwear': ['pajama', 'nightwear', 'sleepwear'],
            'Swimwear': ['swimsuit', 'bikini', 'swimwear'],
            'Formal Wear': ['formal', 'suit', 'tuxedo', 'evening'],
            'Outerwear': ['coat', 'jacket', 'blazer', 'cardigan']
        }
    
    def clean_product_name(self, name):
        """Clean product name for better search"""
        # Remove special characters and convert to lowercase
        cleaned = re.sub(r'[^a-zA-Z\s-]', '', name.lower())
        # Replace hyphens with spaces
        cleaned = cleaned.replace('-', ' ')
        # Remove extra spaces
        cleaned = ' '.join(cleaned.split())
        return cleaned
    
    def generate_search_terms(self, product_name, category):
        """Generate multiple search terms for better results"""
        cleaned_name = self.clean_product_name(product_name)
        category_words = self.category_keywords.get(category, [])
        
        terms = []
        
        # Primary terms
        terms.extend([
            cleaned_name,
            f"{cleaned_name} {category.lower()}",
            f"{cleaned_name} fashion",
        ])
        
        # Category-specific terms
        for keyword in category_words[:2]:  # Use top 2 category keywords
            terms.append(f"{cleaned_name} {keyword}")
            terms.append(keyword)
        
        # Fallback terms
        terms.extend([
            category.lower(),
            f"{category.lower()} fashion",
            "fashion clothing"
        ])
        
        return terms
    
    def get_unsplash_image(self, search_term, width=500, height=500):
        """Get image from Unsplash Source API"""
        try:
            encoded_term = quote(search_term)
            url = f"https://source.unsplash.com/{width}x{height}/?{encoded_term}"
            
            response = self.session.get(url, timeout=15, allow_redirects=True)
            if response.status_code == 200 and len(response.content) > 1000:
                return response.content
        except Exception as e:
            print(f"   ⚠️  Unsplash error for '{search_term}': {e}")
        return None
    
    def get_picsum_image(self, width=500, height=500):
        """Get random image from Picsum (Lorem Picsum)"""
        try:
            # Add random seed for variety
            seed = random.randint(1, 1000)
            url = f"https://picsum.photos/seed/{seed}/{width}/{height}"
            
            response = self.session.get(url, timeout=15)
            if response.status_code == 200 and len(response.content) > 1000:
                return response.content
        except Exception as e:
            print(f"   ⚠️  Picsum error: {e}")
        return None
    
    def get_placeholder_image(self, product_name, width=500, height=500):
        """Generate placeholder image with product name"""
        try:
            # Create clean text for placeholder
            text = self.clean_product_name(product_name)
            text = text.replace(' ', '+')[:20]  # Limit length
            
            # Nice color combinations
            color_schemes = [
                'f8f9fa/6c757d',
                'e9ecef/495057', 
                'dee2e6/343a40',
                'f1f3f4/5f6368',
                'ffc107/212529',
                '28a745/ffffff',
                '007bff/ffffff',
                'dc3545/ffffff'
            ]
            
            color = random.choice(color_schemes)
            url = f"https://via.placeholder.com/{width}x{height}/{color}?text={text}"
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                return response.content
        except Exception as e:
            print(f"   ⚠️  Placeholder error: {e}")
        return None
    
    def download_product_image(self, product_name, category):
        """Try multiple sources to get the best image"""
        search_terms = self.generate_search_terms(product_name, category)
        
        # Try Unsplash with different search terms
        if self.sources['unsplash']:
            for term in search_terms[:3]:  # Try top 3 terms
                print(f"   🔍 Searching Unsplash: '{term}'")
                image_data = self.get_unsplash_image(term)
                if image_data:
                    print(f"   ✅ Found on Unsplash")
                    return image_data
                time.sleep(0.5)  # Rate limiting
        
        # Try Picsum as fallback
        if self.sources['picsum']:
            print(f"   🔍 Trying Picsum (random)")
            image_data = self.get_picsum_image()
            if image_data:
                print(f"   ✅ Found on Picsum")
                return image_data
        
        # Final fallback to placeholder
        if self.sources['placeholder']:
            print(f"   🔍 Generating placeholder")
            return self.get_placeholder_image(product_name)
        
        return None
    
    def save_image(self, image_data, filepath):
        """Save image data to file"""
        try:
            with open(filepath, 'wb') as f:
                f.write(image_data)
            return True
        except Exception as e:
            print(f"   ❌ Save error: {e}")
            return False
    
    def process_products(self, products_file, output_dir):
        """Main processing function"""
        # Create directories
        os.makedirs(output_dir, exist_ok=True)
        
        # Load products
        try:
            with open(products_file, 'r') as f:
                products = json.load(f)
        except Exception as e:
            print(f"❌ Error loading products: {e}")
            return
        
        print(f"🚀 Advanced Image Downloader Starting...")
        print(f"📦 Products to process: {len(products)}")
        print(f"📁 Output directory: {output_dir}")
        print("🌍 Sources: Unsplash → Picsum → Placeholder")
        print("=" * 70)
        
        stats = {'success': 0, 'failed': 0, 'skipped': 0}
        
        for i, product in enumerate(products, 1):
            product_name = product['name']
            category = product['category']
            image_url = product['images'][0]['url']
            filename = os.path.basename(image_url)
            filepath = os.path.join(output_dir, filename)
            
            print(f"\n[{i:3d}/{len(products)}] {product_name}")
            print(f"📁 File: {filename}")
            
            # Skip if already exists
            if os.path.exists(filepath):
                print(f"   ⏭️  Already exists, skipping")
                stats['skipped'] += 1
                continue
            
            # Download image
            image_data = self.download_product_image(product_name, category)
            
            if image_data and self.save_image(image_data, filepath):
                file_size = len(image_data) / 1024  # KB
                print(f"   💾 Saved ({file_size:.1f} KB)")
                stats['success'] += 1
            else:
                print(f"   ❌ Failed to download")
                stats['failed'] += 1
            
            # Rate limiting
            time.sleep(random.uniform(0.8, 2.0))
        
        # Final summary
        print("\n" + "=" * 70)
        print(f"📊 DOWNLOAD SUMMARY")
        print(f"   ✅ Successful: {stats['success']}")
        print(f"   ⏭️  Skipped: {stats['skipped']}")
        print(f"   ❌ Failed: {stats['failed']}")
        print(f"   📁 Total files: {stats['success'] + stats['skipped']}")
        print(f"   📂 Directory: {output_dir}")

def main():
    products_file = "data/products.json"
    output_dir = "images/products"
    
    print("🎯 ADVANCED PRODUCT IMAGE DOWNLOADER")
    print("=" * 50)
    print("✨ Features:")
    print("   • Multiple search terms per product")
    print("   • Unsplash + Picsum + Placeholder sources")
    print("   • Smart category-based searching")
    print("   • Rate limiting for API respect")
    print("   • High-quality 500x500 images")
    print("")
    
    if not os.path.exists(products_file):
        print(f"❌ Products file not found: {products_file}")
        return
    
    try:
        downloader = AdvancedImageDownloader()
        downloader.process_products(products_file, output_dir)
        
        print(f"\n🎉 Download process completed!")
        print(f"\n💡 Next steps:")
        print(f"   1. Check images in: {output_dir}/")
        print(f"   2. Replace any unsuitable images manually")
        print(f"   3. Restart your Docker container to see images")
        print(f"   4. Visit: http://localhost:3000")
        
    except KeyboardInterrupt:
        print(f"\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
