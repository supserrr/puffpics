document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const uploadedImage = document.getElementById("uploaded-image");
  const directLinkInput = document.getElementById("direct-link");
  const htmlCodeInput = document.getElementById("html-code");
  const bbCodeInput = document.getElementById("bb-code");
  const markdownCodeInput = document.getElementById("markdown-code");
  const downloadBtn = document.getElementById("download-btn");
  
  // Copy buttons
  const copyDirectLink = document.getElementById("copy-direct-link");
  const copyHtmlCode = document.getElementById("copy-html-code");
  const copyBbCode = document.getElementById("copy-bb-code");
  const copyMarkdownCode = document.getElementById("copy-markdown-code");
  
  // Debug container
  const debugInfo = document.getElementById("debug-info");
  const debugContent = document.getElementById("debug-content");
  
  // Enable debug mode with URL parameter ?debug=true
  const urlParams = new URLSearchParams(window.location.search);
  const debugMode = urlParams.get('debug') === 'true';
  
  if (debugMode) {
    debugInfo.classList.remove("hidden");
  }

  // Log function that also adds to debug panel
  function log(message, data = null) {
    const timestamp = new Date().toISOString().substr(11, 8);
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage, data);
    
    if (debugMode) {
      debugContent.textContent += logMessage + "\n";
      if (data) {
        debugContent.textContent += JSON.stringify(data, null, 2) + "\n\n";
      }
    }
  }

  // Check if we have image data
  log("Checking for image data in localStorage");
  const imageDataStr = localStorage.getItem("uploadedImageData");
  const previewImageStr = localStorage.getItem("uploadedImagePreview");
  
  if (debugMode) {
    debugContent.textContent += "localStorage Data:\n";
    if (imageDataStr) {
      debugContent.textContent += "uploadedImageData: " + imageDataStr + "\n\n";
    } else {
      debugContent.textContent += "uploadedImageData: null\n\n";
    }
    
    if (previewImageStr) {
      debugContent.textContent += "uploadedImagePreview: [Base64 data available]\n\n";
    } else {
      debugContent.textContent += "uploadedImagePreview: null\n\n";
    }
  }
  
  if (!imageDataStr && !previewImageStr) {
    log("No image data found, redirecting to home");
    alert("No image data found. Redirecting to homepage.");
    window.location.href = "/";
    return;
  }

  try {
    // Load image data from localStorage
    let imageSrc = null;
    let imageUrl = null;
    let imageName = "image.jpg";
    
    // If we have API data, try to use it
    if (imageDataStr) {
      log("Parsing image data from API response");
      const imageData = JSON.parse(imageDataStr);
      log("Parsed image data", imageData);
      
      // Try to extract image URL from various API response formats
      if (imageData.url) {
        log("Found direct URL in response");
        imageUrl = imageData.url;
      } else if (imageData.results && imageData.results.url) {
        log("Found URL in results.url");
        imageUrl = imageData.results.url;
      } else if (imageData.data && imageData.data.url) {
        log("Found URL in data.url");
        imageUrl = imageData.data.url;
      } else if (imageData.image && imageData.image.url) {
        log("Found URL in image.url");
        imageUrl = imageData.image.url;
      } else {
        log("No URL found in API response data");
      }
      
      // If we found a URL, set it as the image source
      if (imageUrl) {
        log("Setting image source to API URL: " + imageUrl);
        imageSrc = imageUrl;
        
        try {
          // Extract filename from URL for download button
          const urlParts = imageUrl.split('/');
          imageName = urlParts[urlParts.length - 1];
          if (!imageName.includes('.')) {
            imageName = "image.jpg";
          }
          log("Extracted image name: " + imageName);
        } catch (error) {
          log("Error extracting filename", error);
          imageName = "image.jpg";
        }
      }
    }
    
    // If we couldn't get a URL from the API data, fall back to the preview image
    if (!imageSrc && previewImageStr) {
      log("Using preview image as fallback");
      imageSrc = previewImageStr;
      imageUrl = previewImageStr; // This will be a data URL
    }
    
    // If we still don't have an image source, throw an error
    if (!imageSrc) {
      throw new Error("Could not determine image source from available data");
    }
    
    // Set the image source
    uploadedImage.src = imageSrc;
    log("Set image src to: " + (imageSrc.length > 100 ? imageSrc.substring(0, 100) + "..." : imageSrc));
    
    // Handle errors loading the image
    uploadedImage.onerror = function() {
      log("Error loading image from source: " + imageSrc);
      alert("There was an error loading your image. Redirecting to homepage.");
      window.location.href = "/";
    };
    
    // Set up sharing links and codes
    setupSharingOptions(imageUrl, imageName);
    
  } catch (error) {
    log("Error processing image data", error);
    alert("There was an error loading your image. Redirecting to homepage.");
    window.location.href = "/";
  }
  
  // Set up sharing options based on image URL
  function setupSharingOptions(imageUrl, imageName) {
    // Check if we have a real URL or a data URL
    const isDataUrl = imageUrl && imageUrl.startsWith('data:image');
    
    if (isDataUrl) {
      log("Using data URL for sharing options");
      // For data URLs, we can only show the image in the UI
      // We can't provide sharing links
      directLinkInput.value = "Not available - use the download button";
      htmlCodeInput.value = "Not available - use the download button";
      bbCodeInput.value = "Not available - use the download button";
      markdownCodeInput.value = "Not available - use the download button";
      
      // Set up download button to work with data URL
      downloadBtn.href = imageUrl;
      downloadBtn.download = imageName;
      
      // Disable copy buttons
      document.querySelectorAll(".copy-btn").forEach(btn => {
        btn.disabled = true;
        btn.title = "Copying not available for this image";
      });
      
      return;
    }
    
    log("Setting up sharing options with URL: " + imageUrl);
    
    // Direct link
    directLinkInput.value = imageUrl;
    
    // HTML code
    htmlCodeInput.value = `<img src="${imageUrl}" alt="${imageName}" />`;
    
    // BBCode
    bbCodeInput.value = `[img]${imageUrl}[/img]`;
    
    // Markdown
    markdownCodeInput.value = `![${imageName}](${imageUrl})`;
    
    // Download button
    downloadBtn.href = imageUrl;
    downloadBtn.download = imageName;
  }

  // Copy button functionality
  copyDirectLink.addEventListener("click", () => copyToClipboard(directLinkInput));
  copyHtmlCode.addEventListener("click", () => copyToClipboard(htmlCodeInput));
  copyBbCode.addEventListener("click", () => copyToClipboard(bbCodeInput));
  copyMarkdownCode.addEventListener("click", () => copyToClipboard(markdownCodeInput));

  // Copy to clipboard function
  function copyToClipboard(element) {
    if (element.disabled) return;
    
    try {
      element.select();
      document.execCommand("copy");
      
      // Show feedback
      const copyBtn = element.parentElement.querySelector(".copy-btn");
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
      }, 2000);
    } catch (error) {
      log("Error copying to clipboard", error);
      alert("Failed to copy to clipboard. Please select and copy manually.");
    }
  }
});
