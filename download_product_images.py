#!/usr/bin/env python3
"""
Product Image Downloader Script
Automatically searches and downloads product images for the e-commerce website
"""

import requests
import json
import os
import time
import random
from urllib.parse import urlparse, urljoin
from pathlib import Path
import hashlib

class ProductImageDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.download_count = 0
        self.max_downloads = 150
        
    def get_unsplash_image(self, search_term, width=400, height=400):
        """Get image from Unsplash"""
        try:
            # Clean search term
            clean_term = search_term.lower().replace('-', ' ')
            url = f"https://source.unsplash.com/{width}x{height}/?{clean_term}"
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                return response.content
        except:
            pass
        return None
    
    def get_placeholder_image(self, product_name, width=400, height=400):
        """Get placeholder image with product name"""
        try:
            # Create a clean text for the placeholder
            text = product_name.replace('-', '+').replace(' ', '+')
            colors = ['cccccc/666666', 'f0f0f0/333333', 'e0e0e0/555555', 'd0d0d0/444444']
            color = random.choice(colors)
            
            url = f"https://via.placeholder.com/{width}x{height}/{color}?text={text}"
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                return response.content
        except:
            pass
        return None
    
    def get_product_image(self, product_name, category):
        """Try to get product image from various sources"""
        # Try Unsplash first with specific search terms
        search_terms = [
            f"{product_name} {category}",
            f"{product_name} fashion",
            f"{category} clothing",
            product_name.split('-')[0],  # First word of product name
        ]
        
        for term in search_terms:
            image_data = self.get_unsplash_image(term)
            if image_data:
                return image_data
            time.sleep(0.5)  # Rate limiting
        
        # Fallback to placeholder
        return self.get_placeholder_image(product_name)
    
    def download_image(self, image_data, filename, output_dir):
        """Save image data to file"""
        try:
            filepath = os.path.join(output_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(image_data)
            return True
        except Exception as e:
            print(f"❌ Error saving {filename}: {e}")
            return False
    
    def process_products(self, products_file, output_dir):
        """Process all products and download images"""
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Load products
        try:
            with open(products_file, 'r') as f:
                products = json.load(f)
        except Exception as e:
            print(f"❌ Error loading products file: {e}")
            return
        
        print(f"🚀 Starting download of {len(products)} product images...")
        print(f"📁 Output directory: {output_dir}")
        print("=" * 60)
        
        successful_downloads = 0
        failed_downloads = 0
        
        for i, product in enumerate(products, 1):
            if self.download_count >= self.max_downloads:
                print(f"⚠️  Reached maximum download limit of {self.max_downloads}")
                break
                
            product_name = product['name']
            category = product['category']
            
            # Get the expected filename from the product's image URL
            image_url = product['images'][0]['url']
            filename = os.path.basename(image_url)
            
            print(f"[{i:3d}/{len(products)}] {product_name} -> {filename}")
            
            # Check if image already exists
            filepath = os.path.join(output_dir, filename)
            if os.path.exists(filepath):
                print(f"   ✅ Already exists, skipping...")
                continue
            
            # Download image
            image_data = self.get_product_image(product_name, category)
            
            if image_data and self.download_image(image_data, filename, output_dir):
                successful_downloads += 1
                self.download_count += 1
                print(f"   ✅ Downloaded successfully")
            else:
                failed_downloads += 1
                print(f"   ❌ Failed to download")
            
            # Rate limiting to be respectful to APIs
            time.sleep(random.uniform(0.5, 1.5))
        
        print("=" * 60)
        print(f"📊 Download Summary:")
        print(f"   ✅ Successful: {successful_downloads}")
        print(f"   ❌ Failed: {failed_downloads}")
        print(f"   📁 Images saved to: {output_dir}")

def main():
    # Configuration
    products_file = "data/products.json"
    output_dir = "images/products"
    
    print("🎯 PRODUCT IMAGE DOWNLOADER")
    print("=" * 40)
    print("This script will automatically search and download")
    print("product images for your e-commerce website.")
    print("")
    
    # Check if products file exists
    if not os.path.exists(products_file):
        print(f"❌ Products file not found: {products_file}")
        print("Please make sure your products.json file exists.")
        return
    
    # Initialize downloader
    downloader = ProductImageDownloader()
    
    # Start downloading
    try:
        downloader.process_products(products_file, output_dir)
        print("\n🎉 Image download process completed!")
        print("\n💡 Tips:")
        print("- Check the downloaded images and replace any that don't look good")
        print("- You can run this script again to download missing images")
        print("- Consider using higher quality images for production")
        
    except KeyboardInterrupt:
        print("\n⚠️  Download interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
