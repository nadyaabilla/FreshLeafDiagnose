// Catch elements
const dropArea = document.getElementById('dropArea');
const predictForm = document.getElementById('predictForm');
const previewImg = document.getElementById('previewImg');

const waitingToPredicting = document.querySelector('.result-container #waitingToPredicting');
const loadingPredict = document.querySelector('.result-container .loading');
const predictionError = document.querySelector('.result-container #predictionError');
const result = document.querySelector('.result-container #result');

// Form data
const predictFormData = new FormData();

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach((eventName) => {
  dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
});
// Remove highlight drop area when item is drag leave
['dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
});

// Handle dropped and submit files
dropArea.addEventListener('drop', (event) => {
  const files = event.dataTransfer.files;
  const skinImage = files[0];
  predictFormData.set('image', skinImage, skinImage.name);
  previewFile(skinImage);
});

predictForm.elements.plantFile.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  const skinImage = files[0];
  predictFormData.set('image', skinImage, skinImage.name);
  previewFile(skinImage);
});

predictForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!predictFormData.has('image')) {
    alert('Silakan pilih gambar Anda terlebih dahulu');
    return;
  }
  await uploadFile(predictFormData);
});

// Show preview after choose image
function previewFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    previewImg.innerHTML = '';
    const img = document.createElement('img');
    img.src = reader.result;
    previewImg.appendChild(img);
  };
}

// Send image to server
async function uploadFile(formData) {
  try {
    waitingToPredicting.style.display = 'none';
    loadingPredict.style.display = 'block';
    predictionError.style.display = 'none';

    // Fake response untuk testing
    const fakeResponse = {
      diseaseName: 'Hawar Daun',
      diseaseDetails: 'Hawar daun adalah penyakit yang menyerang tanaman padi, menyebabkan bercak coklat pada daun. Penyakit ini disebabkan oleh bakteri Xanthomonas oryzae.',
      preventionAndTreatment: 'Pencegahan: Gunakan varietas tahan penyakit dan tanam pada musim yang sesuai. Pengobatan: Gunakan fungisida yang direkomendasikan dan perbaiki sistem irigasi.'
    };

    // Simulasi delay respons API
    await new Promise(resolve => setTimeout(resolve, 1000));

    showPredictionResult(fakeResponse);
  } catch (error) {
    predictionError.textContent = error.message;
    predictionError.style.display = 'block';
  } finally {
    loadingPredict.style.display = 'none';
  }
}

// Show prediction result
function showPredictionResult({ diseaseName, diseaseDetails, preventionAndTreatment }) {
  result.style.display = 'block';
  result.innerHTML = `
    <strong>Nama Penyakit:</strong> ${diseaseName}<br />
    <strong>Detail Penyakit:</strong><br />
    <p>${diseaseDetails}</p>
    <strong>Cara Mengatasi & Pencegahan:</strong><br />
    <p>${preventionAndTreatment}</p>
  `;
}