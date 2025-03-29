# PuffPics

PuffPics is a streamlined image hosting application that allows users to upload images and get shareable links. Built for simplicity and functionality, it demonstrates effective API integration and load-balanced deployment.

![PuffPics Desktop Interface]((https://github.com/user-attachments/assets/f7834411-b9d1-4359-bedf-39ce52c43dc7])) ![PuffPics Desktop Interface]((https://github.com/user-attachments/assets/30af8613-434b-4e8b-b7b2-621add2a267a))



## Project Overview

This project was developed as part of an assignment focused on API integration and deployment. It fulfills the following key requirements:

1. **Local Implementation**: A fully functional web application that leverages external APIs for image hosting
2. **Deployment**: Configuration for hosting the application on multiple web servers with load balancing

## Features

- **Intuitive Upload Interface**: Drag and drop or file selection for image uploads
- **Image Preview**: See your image before uploading
- **Multiple Sharing Formats**: Direct link, HTML, BBCode, and Markdown
- **Responsive Design**: Works seamlessly on mobile and desktop devices
- **Dark/Light Theme**: Automatically adapts to user preferences with manual toggle
- **Robust Error Handling**: Graceful handling of API failures and connection issues
- **Load Balanced Deployment**: Distributed across multiple servers for reliability

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API Integration**: RapidAPI for image hosting
- **Deployment**: NGINX web servers with load balancing
- **Security**: HTTPS with proper credential management

## API Integration Details

The application integrates with the "upload-images-hosting-get-url" API via RapidAPI. Key integration features include:

- **Secure API Key Management**: API keys are properly managed and not exposed in client-side code
- **Retry Logic**: Automatic retry on API failures with intelligent fallback mechanisms
- **Response Handling**: Flexible parsing of various API response formats
- **Error Management**: Comprehensive error handling with user-friendly messages

## Deployment Architecture

PuffPics is deployed on a load-balanced infrastructure for high availability:

- Two identical web servers hosting the static content
- NGINX load balancer with IP hash for session persistence
- Health checks to ensure server availability
- Optimized caching for static assets

For detailed deployment instructions, see the [Deployment Documentation](./DEPLOYMENT.md).

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/puffpics.git
   cd puffpics
   ```

2. **Configure API Keys**
   Open `app.js` and update the API key:
   ```javascript
   const API_KEY = "YOUR_RAPIDAPI_KEY"; // Replace with your actual RapidAPI key
   ```

3. **Run locally**
   Simply open `index.html` in your browser. No build process required.

## File Structure

```
puffpics/
├── index.html         # Main upload page
├── results.html       # Results page showing uploaded image
├── app.js             # Upload functionality
├── results.js         # Results page functionality
├── theme.js           # Theme switching
├── styles.css         # Application styling
├── LICENSE            # MIT License
├── README.md          # Project documentation
└── DEPLOYMENT.md      # Deployment instructions
```

## API Reference

The application uses the "upload-images-hosting-get-url" API from RapidAPI:

- **Endpoint**: `https://upload-images-hosting-get-url.p.rapidapi.com/upload`
- **Method**: POST
- **Headers**:
  - `X-RapidAPI-Key`: Your RapidAPI key
  - `X-RapidAPI-Host`: "upload-images-hosting-get-url.p.rapidapi.com"
- **Body**: FormData with image file
- **Response**: JSON containing the uploaded image URL

## Load Balancer Configuration

The NGINX load balancer is configured to distribute traffic between two web servers:

```nginx
upstream puffpics_backend {
    # Round-robin algorithm with IP hash for session persistence
    server web01.puffpics.example.com:80 weight=5;
    server web02.puffpics.example.com:80 weight=5;
    ip_hash;
    # Health check parameters
    keepalive 32;
}
```

This ensures high availability and seamless user experience even if one server fails.

## Browser Compatibility

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Android Chrome)

## Security Considerations

- **API Keys**: Properly managed in server-side code
- **HTTPS**: All communication encrypted
- **Content Security**: Proper headers to prevent XSS attacks
- **Input Validation**: Client-side validation of file types and sizes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [RapidAPI](https://rapidapi.com/) for the image hosting API
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography
