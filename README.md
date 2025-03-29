# PuffPics

PuffPics is a simple image hosting application that allows users to upload images and get shareable links.

## Description

PuffPics is designed to provide a streamlined, user-friendly image hosting solution that emphasizes simplicity and functionality. The application enables users to quickly upload images through an intuitive drag-and-drop interface or file selection, and instantly receive shareable links in various formats. 

The project demonstrates effective API integration by connecting to an external image hosting service, handling the upload process securely, and presenting the resulting data in a clean, accessible format. PuffPics features a modern, responsive design with a dual-theme interface that adapts to user preferences and device characteristics.

Key technical aspects include:
- API integration with proper error handling and fallback mechanisms
- Client-side file validation and preview functionality
- Responsive UI with intuitive user interaction flow
- Secure management of API credentials
- Theme persistence using localStorage

## Features

- Drag and drop or file selection for image uploads
- Image preview before uploading
- Support for multiple image formats
- Image sharing via direct link, HTML, BBCode, and Markdown formats
- Copy-to-clipboard functionality
- Image download option
- Dark/light theme toggle
- Responsive design for all devices

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- RapidAPI for image hosting

## Project Structure

- `index.html` - The main upload page
- `results.html` - The results page showing the uploaded image and sharing options
- `app.js` - JavaScript for the upload functionality
- `results.js` - JavaScript for the results page functionality
- `theme.js` - Theme switching functionality
- `styles.css` - Styling for the application
- `.gitignore` - Git ignore file

## How It Works

1. Users can upload an image by dragging and dropping it into the designated area or by selecting a file
2. The image is previewed before uploading
3. Upon clicking "Upload Image," the file is sent to the image hosting API
4. Users are redirected to a results page showing the uploaded image
5. The results page provides various sharing options and a download link

## API Integration

The application integrates with the "upload-images-hosting-get-url" API via RapidAPI for image hosting. The API response provides a URL for the uploaded image, which is then used for sharing options.

## Error Handling

- Handles file type validation (only images allowed)
- Size limitation enforced (max 10MB)
- Fallback mechanism if API fails
- LocalStorage for temporary data persistence

## Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. For testing API functionality, you'll need to provide your own RapidAPI key

## Deployment

The application can be deployed on any standard web server. For the assignment, it should be deployed on the provided web servers with load balancer configuration.

## Notes

- API keys should be properly secured in a production environment
- The application has basic responsive design for various screen sizes
