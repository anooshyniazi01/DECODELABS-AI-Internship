/**
 * AI Vision Lab — Image & Text Recognition
 * Final Project: AI Internship
 * 
 * Uses:
 *  - TensorFlow.js + MobileNet v2 for Image Classification
 *  - Tesseract.js v5 for OCR (Text Recognition)
 */

// ===== Global State =====
let mobilenetModel = null;
let isModelLoading = false;
let currentImageFile = null;  // for image recognition
let currentTextFile = null;   // for text recognition

// ===== DOM Elements =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initUploadZones();
  initButtons();
  initSmoothScroll();
  initNavbarScroll();
});

// ===== Tab Switching =====
function initTabs() {
  $$('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;

      // Update tab styles
      $$('.mode-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      $$('.panel').forEach(p => p.classList.remove('active'));
      $(`#panel${mode.charAt(0).toUpperCase() + mode.slice(1)}`).classList.add('active');
    });
  });
}

// ===== Upload Zone Setup =====
function initUploadZones() {
  // Image Recognition Upload
  setupUploadZone('imageUploadZone', 'imageFileInput', (file) => {
    currentImageFile = file;
    showPreview(file, 'imagePreviewImg', 'imagePreview');
    $('#analyzeImageBtn').disabled = false;
  });

  // Text Recognition Upload
  setupUploadZone('textUploadZone', 'textFileInput', (file) => {
    currentTextFile = file;
    showPreview(file, 'textPreviewImg', 'textPreview');
    $('#analyzeTextBtn').disabled = false;
  });
}

function setupUploadZone(zoneId, inputId, onFile) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);

  // Click to upload
  zone.addEventListener('click', () => input.click());

  // File input change
  input.addEventListener('change', (e) => {
    if (e.target.files[0]) {
      handleFile(e.target.files[0], onFile);
    }
  });

  // Drag & Drop
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], onFile);
    }
  });
}

function handleFile(file, callback) {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('Please upload an image file (JPG, PNG, WEBP)', 'error');
    return;
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    showToast('File size exceeds 10MB limit', 'error');
    return;
  }

  callback(file);
  showToast('Image uploaded successfully!', 'success');
}

function showPreview(file, imgId, containerId) {
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById(imgId).src = e.target.result;
    document.getElementById(containerId).classList.add('visible');
  };
  reader.readAsDataURL(file);
}

// ===== Clear Image =====
function clearImage(mode) {
  if (mode === 'image') {
    currentImageFile = null;
    $('#imagePreview').classList.remove('visible');
    $('#imagePreviewImg').src = '';
    $('#analyzeImageBtn').disabled = true;
    $('#imageFileInput').value = '';
    // Clear results
    $('#imageResults').classList.remove('visible');
    $('#imageResults').innerHTML = '';
    $('#imageResultsPlaceholder').style.display = '';
  } else {
    currentTextFile = null;
    $('#textPreview').classList.remove('visible');
    $('#textPreviewImg').src = '';
    $('#analyzeTextBtn').disabled = true;
    $('#textFileInput').value = '';
    // Clear results
    $('#textResultBox').classList.remove('visible');
    $('#extractedText').textContent = '';
    $('#textResultsPlaceholder').style.display = '';
  }
}

// ===== Button Handlers =====
function initButtons() {
  $('#analyzeImageBtn').addEventListener('click', classifyImage);
  $('#analyzeTextBtn').addEventListener('click', extractText);
}

// ===== Image Classification =====
async function classifyImage() {
  if (!currentImageFile) return;

  const btn = $('#analyzeImageBtn');
  const loading = $('#imageLoading');
  const placeholder = $('#imageResultsPlaceholder');
  const resultsEl = $('#imageResults');
  const progressBar = $('#imageProgressBar');
  const loadingText = $('#imageLoadingText');

  // Show loading
  btn.disabled = true;
  placeholder.style.display = 'none';
  resultsEl.classList.remove('visible');
  loading.classList.add('visible');

  try {
    // Load model if not loaded
    if (!mobilenetModel) {
      loadingText.textContent = 'Loading MobileNet model (~5MB)...';
      progressBar.style.width = '20%';

      mobilenetModel = await mobilenet.load({
        version: 2,
        alpha: 1.0
      });

      progressBar.style.width = '60%';
      loadingText.textContent = 'Model loaded! Classifying...';
    } else {
      loadingText.textContent = 'Classifying image...';
      progressBar.style.width = '50%';
    }

    // Create image element for classification
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = $('#imagePreviewImg').src;
    });

    progressBar.style.width = '80%';
    loadingText.textContent = 'Running predictions...';

    // Classify
    const predictions = await mobilenetModel.classify(img, 5);

    progressBar.style.width = '100%';

    // Short delay for UX polish
    await sleep(300);

    // Display results
    loading.classList.remove('visible');
    displayImageResults(predictions);

    showToast(`Classified as: ${formatLabel(predictions[0].className)}`, 'success');

  } catch (error) {
    console.error('Classification error:', error);
    loading.classList.remove('visible');
    placeholder.style.display = '';
    showToast('Error during classification. Please try again.', 'error');
  }

  btn.disabled = false;
}

function displayImageResults(predictions) {
  const container = $('#imageResults');
  container.innerHTML = '';

  predictions.forEach((pred, index) => {
    const confidence = (pred.probability * 100).toFixed(1);
    const label = formatLabel(pred.className);

    const item = document.createElement('div');
    item.className = 'result-item';
    item.style.animationDelay = `${index * 0.1}s`;
    item.innerHTML = `
      <div class="result-header">
        <span class="result-label">${label}</span>
        <span class="result-confidence">${confidence}%</span>
      </div>
      <div class="result-bar">
        <div class="result-bar-fill" style="width: 0%"></div>
      </div>
    `;

    container.appendChild(item);

    // Animate bar after small delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        item.querySelector('.result-bar-fill').style.width = `${confidence}%`;
      }, 100 + index * 100);
    });
  });

  container.classList.add('visible');
}

function formatLabel(className) {
  // MobileNet returns labels like "tabby, tabby cat" — clean them up
  return className
    .split(',')[0]
    .trim()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ===== Text Recognition (OCR) =====
async function extractText() {
  if (!currentTextFile) return;

  const btn = $('#analyzeTextBtn');
  const loading = $('#textLoading');
  const placeholder = $('#textResultsPlaceholder');
  const resultBox = $('#textResultBox');
  const progressBar = $('#textProgressBar');
  const loadingText = $('#textLoadingText');

  // Show loading
  btn.disabled = true;
  placeholder.style.display = 'none';
  resultBox.classList.remove('visible');
  loading.classList.add('visible');

  try {
    loadingText.textContent = 'Initializing Tesseract OCR engine...';
    progressBar.style.width = '10%';

    const result = await Tesseract.recognize(
      currentTextFile,
      'eng',
      {
        logger: (m) => {
          if (m.status) {
            loadingText.textContent = capitalizeFirst(m.status) + '...';
          }
          if (m.progress !== undefined) {
            const pct = Math.round(m.progress * 100);
            progressBar.style.width = `${pct}%`;
          }
        }
      }
    );

    progressBar.style.width = '100%';
    await sleep(300);

    // Display results
    loading.classList.remove('visible');
    const extractedText = result.data.text.trim();

    if (extractedText) {
      $('#extractedText').textContent = extractedText;
      resultBox.classList.add('visible');
      showToast(`Extracted ${extractedText.split(/\s+/).length} words successfully!`, 'success');
    } else {
      placeholder.style.display = '';
      showToast('No text detected in the image. Try a clearer image.', 'info');
    }

  } catch (error) {
    console.error('OCR error:', error);
    loading.classList.remove('visible');
    placeholder.style.display = '';
    showToast('Error during text extraction. Please try again.', 'error');
  }

  btn.disabled = false;
}

// ===== Copy Text =====
function copyText() {
  const text = $('#extractedText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Text copied to clipboard!', 'success');
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Text copied to clipboard!', 'success');
  });
}

// ===== Load Sample Image =====
function loadSample(url, mode) {
  // Switch to the correct tab
  const tab = mode === 'image' ? $('#tabImage') : $('#tabText');
  tab.click();

  // Scroll to recognition section
  document.getElementById('recognize').scrollIntoView({ behavior: 'smooth' });

  // Fetch image and load it
  showToast('Loading sample image...', 'info');

  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], `sample_${mode}.jpg`, { type: 'image/jpeg' });

      if (mode === 'image') {
        currentImageFile = file;
        $('#imagePreviewImg').src = url;
        $('#imagePreview').classList.add('visible');
        $('#analyzeImageBtn').disabled = false;
      } else {
        currentTextFile = file;
        $('#textPreviewImg').src = url;
        $('#textPreview').classList.add('visible');
        $('#analyzeTextBtn').disabled = false;
      }

      showToast('Sample loaded! Click the analyze button to start.', 'success');
    })
    .catch(() => {
      // If fetch fails (CORS), load via img tag approach
      if (mode === 'image') {
        $('#imagePreviewImg').src = url;
        $('#imagePreview').classList.add('visible');
        // We'll use the img element directly for classification
        currentImageFile = 'url:' + url;
        $('#analyzeImageBtn').disabled = false;
      }
      showToast('Sample loaded (preview mode)', 'info');
    });
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  const container = $('#toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${message}`;

  container.appendChild(toast);

  // Auto-remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
  $$('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }

        // Update active state
        $$('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const navbar = $('#navbar');
    if (window.scrollY > 50) {
      navbar.style.padding = '10px 0';
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      navbar.style.padding = '16px 0';
      navbar.style.boxShadow = 'none';
    }
  });
}

// ===== Utilities =====
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
