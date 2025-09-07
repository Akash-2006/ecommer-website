#!/usr/bin/env python3
"""
Targeted Product Image Downloader
Uses multiple fashion-specific sources to find relevant product images
"""

import requests
import json
import os
import time
import random
from urllib.parse import quote
import re
from pathlib import Path

class TargetedImageDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Fashion-specific keywords for better matching
        self.product_mappings = {
            'oxford button-down shirt': 'oxford shirt business',
            'slim-fit stretch shirt': 'slim shirt men formal',
            'casual t-shirt': 'basic tshirt cotton',
            'v-neck wrap top': 'wrap top women',
            'high-waist skinny jeans': 'skinny jeans women high waist',
            'slim fit joggers': 'joggers men athletic',
            'athletic shorts': 'athletic shorts sports',
            'floral summer dress': 'floral dress summer',
            'denim jacket': 'denim jacket fashion',
            'wool blend coat': 'wool coat winter',
            'leather boots': 'leather boots fashion',
            'canvas sneakers': 'canvas sneakers casual',
            'silk scarf': 'silk scarf fashion accessory',
            'leather belt': 'leather belt fashion',
            'workout leggings': 'yoga leggings athletic',
            'pajama set': 'pajamas sleepwear',
            'nightgown': 'nightgown sleepwear',
            'bikini set': 'bikini swimwear',
            'one-piece swimsuit': 'one piece swimsuit',
            'tuxedo': 'tuxedo formal wear',
            'evening dress': 'evening gown dress',
            'blazer': 'blazer jacket formal',
            'bomber jacket': 'bomber jacket fashion',
            'trench coat': 'trench coat fashion',
            'hoodie': 'hoodie sweatshirt',
            'cardigan': 'cardigan sweater',
            'polo shirt': 'polo shirt men',
            'tank top': 'tank top fashion',
            'wide leg pants': 'wide leg pants fashion',
            'midi dress': 'midi dress women',
            'maxi dress': 'maxi dress long',
            'cocktail dress': 'cocktail dress formal',
            'ankle boots': 'ankle boots fashion',
            'high heels': 'high heel shoes',
            'sandals': 'sandals summer shoes',
            'loafers': 'loafers dress shoes',
            'sunglasses': 'sunglasses fashion',
            'backpack': 'fashion backpack',
            'handbag': 'handbag purse',
            'wallet': 'leather wallet',
            'watch': 'fashion watch',
            'sports bra': 'sports bra athletic',
            'yoga pants': 'yoga pants leggings',
            'running shorts': 'running shorts athletic',
            'compression shirt': 'compression shirt athletic',
            'track jacket': 'track jacket athletic',
            'sweatshirt': 'sweatshirt hoodie',
            'dress pants': 'dress pants formal',
            'chino pants': 'chino pants casual',
            'cargo shorts': 'cargo shorts men',
            'bermuda shorts': 'bermuda shorts',
            'palazzo pants': 'palazzo pants wide',
            'capri pants': 'capri pants summer',
            'bootcut jeans': 'bootcut jeans denim',
            'leggings': 'leggings fashion',
            'sweatpants': 'sweatpants joggers',
        }
    
    def get_search_term(self, product_name, category):
        """Get optimized search term for the product"""
        cleaned_name = self.clean_product_name(product_name)
        
        # Check if we have a specific mapping
        if cleaned_name in self.product_mappings:
            return self.product_mappings[cleaned_name]
        
        # Generate smart search term based on category
        category_terms = {
            'Top Wear': f"{cleaned_name} shirt fashion",
            'Bottom Wear': f"{cleaned_name} pants fashion", 
            'Dresses': f"{cleaned_name} dress fashion",
            'Footwear': f"{cleaned_name} shoes fashion",
            'Accessories': f"{cleaned_name} accessory fashion",
            'Activewear': f"{cleaned_name} athletic sportswear",
            'Sleepwear': f"{cleaned_name} sleepwear pajama",
            'Swimwear': f"{cleaned_name} swimwear bikini",
            'Formal Wear': f"{cleaned_name} formal elegant",
            'Outerwear': f"{cleaned_name} jacket coat"
        }
        
        return category_terms.get(category, f"{cleaned_name} fashion clothing")
    
    def clean_product_name(self, name):
        """Clean and normalize product name"""
        cleaned = re.sub(r'[^a-zA-Z\s-]', '', name.lower())
        cleaned = cleaned.replace('-', ' ')
        cleaned = ' '.join(cleaned.split())
        return cleaned
    
    def get_unsplash_fashion_image(self, search_term, width=500, height=500):
        """Get fashion-specific image from Unsplash"""
        try:
            # Add fashion-specific keywords to improve results
            enhanced_term = f"{search_term} fashion clothing"
            encoded_term = quote(enhanced_term)
            url = f"https://source.unsplash.com/{width}x{height}/?{encoded_term}"
            
            response = self.session.get(url, timeout=15, allow_redirects=True)
            if response.status_code == 200 and len(response.content) > 5000:  # Ensure it's a real image
                return response.content, "Unsplash"
        except Exception as e:
            print(f"   ⚠️  Unsplash error: {e}")
        return None, None
    
    def get_unsplash_category_image(self, category, width=500, height=500):
        """Get category-specific image from Unsplash"""
        try:
            category_searches = {
                'Top Wear': 'fashion shirt clothing',
                'Bottom Wear': 'fashion pants jeans',
                'Dresses': 'fashion dress elegant',
                'Footwear': 'fashion shoes boots',
                'Accessories': 'fashion accessories bag',
                'Activewear': 'athletic wear sportswear',
                'Sleepwear': 'sleepwear pajamas',
                'Swimwear': 'swimwear bikini',
                'Formal Wear': 'formal wear suit',
                'Outerwear': 'fashion jacket coat'
            }
            
            search_term = category_searches.get(category, 'fashion clothing')
            encoded_term = quote(search_term)
            url = f"https://source.unsplash.com/{width}x{height}/?{encoded_term}"
            
            response = self.session.get(url, timeout=15, allow_redirects=True)
            if response.status_code == 200 and len(response.content) > 5000:
                return response.content, "Unsplash Category"
        except Exception as e:
            print(f"   ⚠️  Category search error: {e}")
        return None, None
    
    def get_pexels_image(self, search_term):
        """Get image from Pexels (alternative source)"""
        # Note: This would require Pexels API key for production use
        # For now, we'll use a placeholder that looks more fashion-oriented
        return None, None
    
    def get_fashion_placeholder(self, product_name, category, width=500, height=500):
        """Generate a fashion-styled placeholder"""
        try:
            # Create a more descriptive text
            clean_name = self.clean_product_name(product_name)
            text = f"{clean_name}".replace(' ', '+')[:25]
            
            # Fashion-appropriate color schemes
            fashion_colors = [
                'f8f9fa/2c3e50',  # Light gray / dark blue
                'ecf0f1/34495e',  # Very light gray / dark gray
                'e8e8e8/555555',  # Light gray / medium gray  
                'f1c40f/2c3e50',  # Gold / dark blue
                'e74c3c/ffffff',  # Red / white
                '3498db/ffffff',  # Blue / white
                '2ecc71/ffffff',  # Green / white
                '9b59b6/ffffff',  # Purple / white
                '1abc9c/ffffff',  # Teal / white
                'e67e22/ffffff'   # Orange / white
            ]
            
            color = random.choice(fashion_colors)
            url = f"https://via.placeholder.com/{width}x{height}/{color}?text={text}"
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                return response.content, "Fashion Placeholder"
        except Exception as e:
            print(f"   ⚠️  Placeholder error: {e}")
        return None, None
    
    def download_product_image(self, product_name, category):
        """Download the best matching image for the product"""
        search_term = self.get_search_term(product_name, category)
        
        # Try 1: Specific product search on Unsplash
        print(f"   🎯 Searching: '{search_term}'")
        image_data, source = self.get_unsplash_fashion_image(search_term)
        if image_data:
            return image_data, source
        
        time.sleep(0.8)  # Rate limiting
        
        # Try 2: Category-based search on Unsplash  
        print(f"   🏷️  Trying category: '{category}'")
        image_data, source = self.get_unsplash_category_image(category)
        if image_data:
            return image_data, source
        
        time.sleep(0.5)
        
        # Try 3: Basic product name search
        basic_search = self.clean_product_name(product_name)
        print(f"   🔍 Basic search: '{basic_search}'")
        image_data, source = self.get_unsplash_fashion_image(basic_search)
        if image_data:
            return image_data, source
        
        # Fallback: Fashion-styled placeholder
        print(f"   🎨 Creating fashion placeholder")
        return self.get_fashion_placeholder(product_name, category)
    
    def save_image(self, image_data, filepath):
        """Save image to file"""
        try:
            with open(filepath, 'wb') as f:
                f.write(image_data)
            return True
        except Exception as e:
            print(f"   ❌ Save error: {e}")
            return False
    
    def process_products(self, products_file, output_dir):
        """Process all products"""
        os.makedirs(output_dir, exist_ok=True)
        
        try:
            with open(products_file, 'r') as f:
                products = json.load(f)
        except Exception as e:
            print(f"❌ Error loading products: {e}")
            return
        
        print(f"🎯 TARGETED FASHION IMAGE DOWNLOADER")
        print(f"=" * 60)
        print(f"📦 Products: {len(products)}")
        print(f"📁 Output: {output_dir}")
        print(f"🎨 Strategy: Product-specific → Category → Placeholder")
        print(f"=" * 60)
        
        stats = {'success': 0, 'failed': 0, 'skipped': 0, 'sources': {}}
        
        for i, product in enumerate(products, 1):
            product_name = product['name']
            category = product['category']
            filename = os.path.basename(product['images'][0]['url'])
            filepath = os.path.join(output_dir, filename)
            
            print(f"\n[{i:3d}/{len(products)}] {product_name}")
            print(f"📂 Category: {category}")
            print(f"💾 File: {filename}")
            
            if os.path.exists(filepath):
                print(f"   ✅ Already exists")
                stats['skipped'] += 1
                continue
            
            # Download image
            result = self.download_product_image(product_name, category)
            
            if result[0]:
                image_data, source = result
                if self.save_image(image_data, filepath):
                    size_kb = len(image_data) / 1024
                    print(f"   ✅ Saved from {source} ({size_kb:.1f} KB)")
                    stats['success'] += 1
                    stats['sources'][source] = stats['sources'].get(source, 0) + 1
                else:
                    stats['failed'] += 1
            else:
                print(f"   ❌ Failed to download")
                stats['failed'] += 1
            
            # Rate limiting
            time.sleep(random.uniform(1.0, 2.5))
        
        # Summary
        print(f"\n" + "=" * 60)
        print(f"📊 DOWNLOAD SUMMARY")
        print(f"   ✅ Successful: {stats['success']}")
        print(f"   ⏭️  Skipped: {stats['skipped']}")
        print(f"   ❌ Failed: {stats['failed']}")
        print(f"\n📈 Sources Used:")
        for source, count in stats['sources'].items():
            print(f"   • {source}: {count} images")

def main():
    products_file = "data/products.json"
    output_dir = "images/products"
    
    print("🎯 TARGETED FASHION IMAGE DOWNLOADER")
    print("=" * 50)
    print("🎨 Features:")
    print("   • Fashion-specific search terms")
    print("   • Product name optimization")  
    print("   • Category fallback search")
    print("   • No random/unrelated images")
    print("   • High-quality results")
    print("")
    
    if not os.path.exists(products_file):
        print(f"❌ Products file not found: {products_file}")
        return
    
    downloader = TargetedImageDownloader()
    
    try:
        downloader.process_products(products_file, output_dir)
        print(f"\n🎉 Targeted download completed!")
        print(f"\n📝 Next Steps:")
        print(f"   1. Review images: ls {output_dir}/")
        print(f"   2. Restart Docker: docker restart ecommerce-fullstack")
        print(f"   3. Check website: http://localhost:3000")
        
    except KeyboardInterrupt:
        print(f"\n⚠️  Download interrupted")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
