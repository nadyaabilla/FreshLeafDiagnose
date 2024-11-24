document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea");
    const input = document.getElementById("plantFile");
    const previewImg = document.getElementById("previewImg");
  
    // Prevent default behavior for drag events
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropArea.addEventListener(eventName, e => e.preventDefault());
    });
  
    // Highlight the drop area
    ["dragenter", "dragover"].forEach(eventName => {
      dropArea.addEventListener(eventName, () => dropArea.classList.add("highlight"));
    });
  
    // Remove highlight
    ["dragleave", "drop"].forEach(eventName => {
      dropArea.addEventListener(eventName, () => dropArea.classList.remove("highlight"));
    });
  
    // Handle dropped files
    dropArea.addEventListener("drop", e => {
      const files = e.dataTransfer.files;
      handleFiles(files);
    });
  
    // Handle file input
    input.addEventListener("change", () => {
      const files = input.files;
      handleFiles(files);
    });
  
    // Handle the files
    function handleFiles(files) {
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = e => {
            previewImg.innerHTML = `<img src="${e.target.result}" alt="Preview" class="img-fluid mt-3" />`;
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please upload a valid image file.");
        }
      }
    }
  });
  