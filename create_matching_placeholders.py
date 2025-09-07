#!/usr/bin/env python3
"""
Offline Matching Placeholder Creator
Creates professional placeholders that actually represent the products
NO random images - only creates placeholders that clearly show what the product is
"""

import json
import os
from PIL import Image, ImageDraw, ImageFont
import random

class ProductPlaceholderCreator:
    def __init__(self):
        self.width = 500
        self.height = 500
        
        # Category-specific colors and icons
        self.category_styles = {
            'Top Wear': {
                'bg_color': (74, 144, 226),  # Blue
                'text_color': (255, 255, 255),
                'icon': '👔',
                'description': 'Shirts & Tops'
            },
            'Bottom Wear': {
                'bg_color': (46, 204, 113),  # Green
                'text_color': (255, 255, 255),
                'icon': '👖',
                'description': 'Pants & Shorts'
            },
            'Dresses': {
                'bg_color': (231, 76, 60),  # Red
                'text_color': (255, 255, 255),
                'icon': '👗',
                'description': 'Dresses'
            },
            'Footwear': {
                'bg_color': (52, 73, 94),  # Dark Blue
                'text_color': (255, 255, 255),
                'icon': '👟',
                'description': 'Shoes & Boots'
            },
            'Accessories': {
                'bg_color': (142, 68, 173),  # Purple
                'text_color': (255, 255, 255),
                'icon': '👜',
                'description': 'Accessories'
            },
            'Activewear': {
                'bg_color': (230, 126, 34),  # Orange
                'text_color': (255, 255, 255),
                'icon': '🏃',
                'description': 'Athletic Wear'
            },
            'Sleepwear': {
                'bg_color': (155, 89, 182),  # Light Purple
                'text_color': (255, 255, 255),
                'icon': '🌙',
                'description': 'Sleepwear'
            },
            'Swimwear': {
                'bg_color': (52, 152, 219),  # Light Blue
                'text_color': (255, 255, 255),
                'icon': '🏊',
                'description': 'Swimwear'
            },
            'Formal Wear': {
                'bg_color': (44, 62, 80),  # Very Dark Blue
                'text_color': (255, 255, 255),
                'icon': '🤵',
                'description': 'Formal Wear'
            },
            'Outerwear': {
                'bg_color': (127, 140, 141),  # Gray
                'text_color': (255, 255, 255),
                'icon': '🧥',
                'description': 'Jackets & Coats'
            }
        }
    
    def clean_product_name(self, name):
        """Clean product name for display"""
        # Convert to title case, replace hyphens with spaces
        cleaned = name.replace('-', ' ').title()
        return cleaned
    
    def create_product_placeholder(self, product_name, category, price):
        """Create a professional placeholder image for a specific product"""
        try:
            # Get style for category
            style = self.category_styles.get(category, {
                'bg_color': (149, 165, 166),
                'text_color': (255, 255, 255),
                'icon': '📦',
                'description': 'Product'
            })
            
            # Create image
            img = Image.new('RGB', (self.width, self.height), style['bg_color'])
            draw = ImageDraw.Draw(img)
            
            # Try to use system fonts, fallback to default
            try:
                # Try common system fonts
                title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
                subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
                price_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
                icon_font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", 60)
            except:
                # Fallback to default font
                title_font = ImageFont.load_default()
                subtitle_font = ImageFont.load_default()
                price_font = ImageFont.load_default()
                icon_font = ImageFont.load_default()
            
            clean_name = self.clean_product_name(product_name)
            
            # Draw category icon
            icon_text = style['icon']
            try:
                icon_bbox = draw.textbbox((0, 0), icon_text, font=icon_font)
                icon_width = icon_bbox[2] - icon_bbox[0]
                icon_x = (self.width - icon_width) // 2
                draw.text((icon_x, 80), icon_text, fill=style['text_color'], font=icon_font)
            except:
                # If emoji font fails, draw a simple shape
                draw.ellipse([225, 80, 275, 130], fill=style['text_color'], outline=None)
            
            # Draw product name (split into multiple lines if too long)
            words = clean_name.split()
            lines = []
            current_line = ""
            
            for word in words:
                test_line = current_line + (" " if current_line else "") + word
                try:
                    bbox = draw.textbbox((0, 0), test_line, font=title_font)
                    test_width = bbox[2] - bbox[0]
                except:
                    test_width = len(test_line) * 20  # Rough estimation
                
                if test_width <= self.width - 40:  # Leave margin
                    current_line = test_line
                else:
                    if current_line:
                        lines.append(current_line)
                    current_line = word
            
            if current_line:
                lines.append(current_line)
            
            # Draw product name lines
            y_offset = 180
            for line in lines[:3]:  # Max 3 lines
                try:
                    bbox = draw.textbbox((0, 0), line, font=title_font)
                    text_width = bbox[2] - bbox[0]
                except:
                    text_width = len(line) * 20
                
                x = (self.width - text_width) // 2
                draw.text((x, y_offset), line, fill=style['text_color'], font=title_font)
                y_offset += 40
            
            # Draw category description
            category_desc = style['description']
            try:
                bbox = draw.textbbox((0, 0), category_desc, font=subtitle_font)
                desc_width = bbox[2] - bbox[0]
            except:
                desc_width = len(category_desc) * 12
            
            desc_x = (self.width - desc_width) // 2
            draw.text((desc_x, y_offset + 20), category_desc, fill=style['text_color'], font=subtitle_font)
            
            # Draw price
            price_text = f"${price:.2f}"
            try:
                bbox = draw.textbbox((0, 0), price_text, font=price_font)
                price_width = bbox[2] - bbox[0]
            except:
                price_width = len(price_text) * 16
            
            price_x = (self.width - price_width) // 2
            draw.text((price_x, y_offset + 80), price_text, fill=style['text_color'], font=price_font)
            
            # Add a subtle border
            draw.rectangle([0, 0, self.width-1, self.height-1], outline=(255, 255, 255, 100), width=2)
            
            return img
        
        except Exception as e:
            print(f"   ❌ Error creating placeholder: {e}")
            # Create a simple colored rectangle as absolute fallback
            img = Image.new('RGB', (self.width, self.height), (150, 150, 150))
            draw = ImageDraw.Draw(img)
            draw.text((50, 250), product_name[:20], fill=(255, 255, 255))
            return img
    
    def process_products(self, products_file, output_dir):
        """Create placeholders for all products"""
        os.makedirs(output_dir, exist_ok=True)
        
        try:
            with open(products_file, 'r') as f:
                products = json.load(f)
        except Exception as e:
            print(f"❌ Error loading products: {e}")
            return
        
        print(f"🎨 MATCHING PRODUCT PLACEHOLDER CREATOR")
        print(f"=" * 60)
        print(f"✨ Features:")
        print(f"   • Each image shows actual product name")
        print(f"   • Category-specific colors and icons")
        print(f"   • Price display")
        print(f"   • Professional appearance")
        print(f"   • NO random/unrelated images")
        print(f"")
        print(f"📦 Products: {len(products)}")
        print(f"📁 Output: {output_dir}")
        print(f"=" * 60)
        
        stats = {'success': 0, 'skipped': 0, 'failed': 0}
        
        for i, product in enumerate(products, 1):
            product_name = product['name']
            category = product['category']
            price = product.get('discountPrice', product.get('price', 0))
            filename = os.path.basename(product['images'][0]['url'])
            filepath = os.path.join(output_dir, filename)
            
            print(f"[{i:3d}/{len(products)}] {product_name}")
            
            if os.path.exists(filepath):
                print(f"   ⏭️  Already exists")
                stats['skipped'] += 1
                continue
            
            # Create placeholder
            img = self.create_product_placeholder(product_name, category, price)
            
            if img:
                try:
                    img.save(filepath, 'JPEG', quality=90)
                    file_size = os.path.getsize(filepath) / 1024
                    print(f"   ✅ Created ({file_size:.1f} KB)")
                    stats['success'] += 1
                except Exception as e:
                    print(f"   ❌ Save failed: {e}")
                    stats['failed'] += 1
            else:
                stats['failed'] += 1
        
        print(f"\n" + "=" * 60)
        print(f"📊 CREATION SUMMARY")
        print(f"   ✅ Created: {stats['success']}")
        print(f"   ⏭️  Skipped: {stats['skipped']}")
        print(f"   ❌ Failed: {stats['failed']}")
        print(f"   📁 Total files: {stats['success'] + stats['skipped']}")

def main():
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("❌ PIL (Pillow) not found. Installing...")
        os.system("pip3 install Pillow")
        try:
            from PIL import Image, ImageDraw, ImageFont
            print("✅ PIL installed successfully")
        except ImportError:
            print("❌ Could not install PIL. Please run: pip3 install Pillow")
            return
    
    products_file = "data/products.json"
    output_dir = "images/products"
    
    if not os.path.exists(products_file):
        print(f"❌ Products file not found: {products_file}")
        return
    
    creator = ProductPlaceholderCreator()
    creator.process_products(products_file, output_dir)
    
    print(f"\n🎉 All placeholders created!")
    print(f"💡 Each image clearly shows:")
    print(f"   • Exact product name")
    print(f"   • Category icon and color")
    print(f"   • Product price")
    print(f"\n🔄 Restart Docker: docker restart ecommerce-fullstack")
    print(f"🌐 Visit: http://localhost:3000")

if __name__ == "__main__":
    main()
