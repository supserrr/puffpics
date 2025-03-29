document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("file-input");
  const fileInfo = document.querySelector(".file-info");
  const previewContainer = document.getElementById("preview-container");
  const previewImage = document.getElementById("preview-image");
  const changeImageBtn = document.getElementById("change-image-btn");
  const uploadBtn = document.getElementById("upload-btn");
  const loadingContainer = document.getElementById("loading-container");
  const errorEl = document.querySelector(".error");

  // API Configuration
  const API_KEY = "X-Rapidapi-Key";
  const API_HOST = "X-Rapidapi-Host";
  const API_URL = "https://upload-images-hosting-get-url.p.rapidapi.com/upload";

  // Selected file
  let selectedFile = null;

  // Clear any previous data
  localStorage.removeItem("uploadedImageData");
  localStorage.removeItem("uploadedImagePreview");
  
  // Test localStorage functionality
  try {
    localStorage.setItem("test", "test");
    const testValue = localStorage.getItem("test");
    if (testValue !== "test") {
      throw new Error("localStorage is not functioning correctly");
    }
    localStorage.removeItem("test");
    console.log("localStorage is working correctly");
  } catch (error) {
    console.error("localStorage error:", error);
    showError("Your browser doesn't support local storage. Please enable cookies and try again.");
  }

  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Highlight drop area when item is dragged over it
  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  // Handle dropped files
  dropArea.addEventListener("drop", handleDrop, false);

  // Handle file input change
  fileInput.addEventListener("change", handleFiles);

  // Handle click on drop area
  dropArea.addEventListener("click", (e) => {
    if (e.target.classList.contains("upload-btn")) return;
    fileInput.click();
  });

  // Handle change image button
  changeImageBtn.addEventListener("click", () => {
    resetUpload();
  });

  // Handle upload button
  uploadBtn.addEventListener("click", handleUpload);

  // Prevent defaults
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Highlight drop area
  function highlight() {
    dropArea.classList.add("active");
  }

  // Unhighlight drop area
  function unhighlight() {
    dropArea.classList.remove("active");
  }

  // Handle dropped files
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files } });
  }

  // Handle files
  function handleFiles(e) {
    const files = e.target.files;

    if (files.length > 0) {
      selectedFile = files[0];

      // Check if file is an image
      if (!selectedFile.type.match("image.*")) {
        showError("Please upload an image file");
        resetUpload();
        return;
      }

      // Check file size (max 10MB)
      const maxFileSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxFileSize) {
        showError("File size exceeds 10MB. Please use a smaller image.");
        resetUpload();
        return;
      }

      // Update file info
      fileInfo.textContent = `Selected: ${selectedFile.name}`;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        dropArea.classList.add("hidden");
        previewContainer.classList.remove("hidden");
        errorEl.classList.add("hidden");
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  // Reset upload
  function resetUpload() {
    selectedFile = null;
    fileInput.value = "";
    fileInfo.textContent = "No file selected";
    previewContainer.classList.add("hidden");
    dropArea.classList.remove("hidden");
    errorEl.classList.add("hidden");
  }

  // Show error
  function showError(message) {
    errorEl.innerHTML = `<span>${message}</span>`;
    errorEl.classList.remove("hidden");
    console.error("Error:", message);
  }

  // Handle upload
  async function handleUpload() {
    if (!selectedFile) {
      showError("Please select an image first");
      return;
    }

    // Show loading
    previewContainer.classList.add("hidden");
    loadingContainer.classList.remove("hidden");
    errorEl.classList.add("hidden");

    try {
      // Save the image preview to localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          localStorage.setItem("uploadedImagePreview", e.target.result);
          console.log("Preview image saved to localStorage");
        } catch (err) {
          console.error("Failed to save preview to localStorage:", err);
        }
      };
      reader.readAsDataURL(selectedFile);

      // Create FormData object
      const formData = new FormData();
      formData.append("image", selectedFile);

      console.log("Uploading image to API...");
      
      // First approach: Using the RapidAPI as provided
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST
          },
          body: formData
        });

        console.log("API response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log("API response data:", data);

        // Store API response in localStorage
        try {
          localStorage.setItem("uploadedImageData", JSON.stringify(data));
          console.log("Image data saved to localStorage:", JSON.stringify(data));
        } catch (err) {
          console.error("Failed to save data to localStorage:", err);
          throw new Error("Failed to save uploaded image data");
        }

        // Fallback approach in case API doesn't return expected data
        if (!data || (!data.url && !data.results && !data.data)) {
          throw new Error("API response does not contain image URL");
        }

        // If API returned data in an unexpected format, try to extract the URL
        let imageUrl = null;
        if (data.url) {
          imageUrl = data.url;
        } else if (data.results && data.results.url) {
          imageUrl = data.results.url;
        } else if (data.data && data.data.url) {
          imageUrl = data.data.url;
        } else if (typeof data === 'string' && data.startsWith('http')) {
          imageUrl = data;
        }

        if (!imageUrl) {
          throw new Error("Could not find image URL in API response");
        }

        // Redirect to results page
        if (window.location.hostname.includes("puffpics.supserrr.tech")) {
          window.location.href = "/results";
        } else {
          window.location.href = "results.html";
        }
      } catch (error) {
        console.error("API Error:", error);
        
        // Fallback: Save preview image for direct display on results page
        console.log("Using fallback approach with preview image only");
        
        // Create a simplified data object with the preview image
        const fallbackData = {
          url: null,
          previewAvailable: true,
          error: error.message,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem("uploadedImageData", JSON.stringify(fallbackData));
        
        // Redirect to results page with fallback data
        if (window.location.hostname.includes("puffpics.supserrr.tech")) {
          window.location.href = "/results";
        } else {
          window.location.href = "results.html";
        }
      }
    } catch (error) {
      // Show error for any other issues
      console.error("Upload error:", error);
      loadingContainer.classList.add("hidden");
      previewContainer.classList.remove("hidden");
      showError(error.message || "There was an error uploading your image. Please try again.");
    }
  }
});
