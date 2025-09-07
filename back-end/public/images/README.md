# Images Directory

This directory serves static images for the e-commerce application.

## Structure

```
/images
  /products          - Product images
    oxford-shirt-1.jpg
    oxford-shirt-2.jpg
    slim-shirt-1.jpg
    slim-shirt-2.jpg
    womens-jeans-1.jpg
    womens-tshirt-1.jpg
    mens-joggers-1.jpg
    womens-wrap-top-1.jpg
```

## Usage

Images are served via the Express static middleware at:
`http://localhost:5000/images/products/[filename]`

## Adding Images

1. Place image files in the appropriate subdirectory
2. Update product data in `/data/products.json` with the correct image paths
3. Images will be automatically served by the backend

## Supported Formats

- JPG/JPEG
- PNG
- WebP
- GIF
