// Enhanced Application Data with Priority System
const appData = {
  complaints: [
    {
      id: "CMP001",
      title: "Large pothole on MG Road",
      category: "Potholes",
      description: "There is a large pothole near the traffic signal on MG Road causing traffic issues and vehicle damage",
      location: "MG Road, Near City Mall Traffic Signal",
      priority: "High",
      status: "In Progress",
      submittedBy: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh.k@email.com",
      dateSubmitted: "2025-01-07",
      lastUpdated: "2025-01-09",
      assignedTo: "Roads Department",
      officer: "Engineer Sharma",
      photos: ["pothole1.jpg"],
      duplicateCount: 3,
      similarComplaints: ["CMP015", "CMP028"],
      notes: "Inspection completed. Repair work scheduled for this week.",
      responseTime: "24 hours",
      dueDate: "2025-01-10"
    },
    {
      id: "CMP002",
      title: "Sewage overflow in residential area",
      category: "Sewage Blockage",
      description: "Sewage water is overflowing from manholes in Sector 7, creating unhygienic conditions and health hazards",
      location: "Sector 7, Block A, Near Park",
      priority: "Emergency",
      status: "Received",
      submittedBy: "Priya Sharma",
      phone: "9876543211",
      email: "priya.s@email.com",
      dateSubmitted: "2025-01-09",
      lastUpdated: "2025-01-09",
      assignedTo: "Water & Sanitation",
      officer: "Inspector Singh",
      photos: ["sewage1.jpg", "sewage2.jpg"],
      duplicateCount: 7,
      similarComplaints: ["CMP045", "CMP046", "CMP047"],
      notes: "Emergency response team dispatched immediately.",
      responseTime: "2 hours",
      dueDate: "2025-01-09"
    },
    {
      id: "CMP003",
      title: "Street lights not working",
      category: "Street Lighting",
      description: "Multiple street lights in the colony are not working for past one week",
      location: "Green Valley Colony, Phase 2",
      priority: "Medium",
      status: "Resolved",
      submittedBy: "Amit Patel",
      phone: "9876543212",
      email: "amit.p@email.com",
      dateSubmitted: "2025-01-05",
      lastUpdated: "2025-01-08",
      assignedTo: "Electrical Department",
      officer: "Technician Verma",
      photos: ["streetlight1.jpg"],
      duplicateCount: 2,
      similarComplaints: ["CMP032"],
      notes: "All street lights repaired and functioning properly.",
      responseTime: "3 days",
      dueDate: "2025-01-08"
    }
  ],
  
  priorityRules: {
    "Emergency": {
      keywords: ["sewage overflow", "water leak", "electrical hazard", "road blocked", "accident", "health hazard", "urgent", "dangerous"],
      color: "#dc3545",
      responseTime: "2 hours",
      multiplier: 4
    },
    "High": {
      keywords: ["pothole", "main road", "traffic", "school area", "hospital area", "major", "critical"],
      color: "#fd7e14", 
      responseTime: "24 hours",
      multiplier: 3
    },
    "Medium": {
      keywords: ["street light", "garbage", "park", "maintenance", "minor"],
      color: "#ffc107",
      responseTime: "3 days",
      multiplier: 2
    },
    "Low": {
      keywords: ["suggestion", "cosmetic", "minor", "improvement"],
      color: "#28a745",
      responseTime: "7 days",
      multiplier: 1
    }
  },

  categories: ["Potholes", "Sewage Blockage", "Water Supply", "Street Lighting", "Waste Management", "Electricity", "Public Transport", "Parks & Recreation", "Building Permits", "Noise Pollution", "Others"],
  
  departments: [
    {name: "Roads Department", officers: ["Engineer Sharma", "Engineer Patel", "Engineer Singh"]},
    {name: "Water & Sanitation", officers: ["Inspector Singh", "Inspector Kumar", "Inspector Verma"]},
    {name: "Electrical Department", officers: ["Technician Verma", "Technician Gupta", "Technician Shah"]},
    {name: "Waste Management", officers: ["Supervisor Yadav", "Supervisor Joshi"]},
    {name: "Public Works", officers: ["Engineer Reddy", "Engineer Nair"]}
  ],

  officers: [{
    name: "Municipal Officer",
    department: "Administration", 
    email: "officer@municipal.gov",
    password: "admin123"
  }]
};

// Application State
let currentSection = 'home';
let isLoggedIn = false;
let uploadedFiles = [];
let filteredComplaints = [...appData.complaints];
let currentPriorityFilter = 'all';
let duplicateCheckResult = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  console.log('CivicConnect initialized');
  setupEventListeners();
  updateStats();
  loadUrgentIssues();
  loadCitizenComplaints();
});

// Navigation Functions
function showSection(sectionId) {
  console.log('Showing section:', sectionId);
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active class from nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    console.log('Section shown:', sectionId);
  } else {
    console.error('Section not found:', sectionId);
  }
  
  // Activate nav button
  const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  currentSection = sectionId;
  
  // Load section-specific content
  if (sectionId === 'track') {
    loadCitizenComplaints();
  } else if (sectionId === 'dashboard' && isLoggedIn) {
    loadDashboard();
  }
}

// AI-Powered Priority Assignment
function calculatePriority(complaint) {
  const description = complaint.description.toLowerCase();
  const title = complaint.title.toLowerCase();
  const category = complaint.category.toLowerCase();
  const location = complaint.location.toLowerCase();
  
  let maxScore = 0;
  let assignedPriority = "Low";
  let reasoning = [];
  
  Object.entries(appData.priorityRules).forEach(([priority, rule]) => {
    let score = 0;
    let matchedKeywords = [];
    
    // Check keywords in description and title
    rule.keywords.forEach(keyword => {
      if (description.includes(keyword) || title.includes(keyword)) {
        score += rule.multiplier;
        matchedKeywords.push(keyword);
      }
    });
    
    // Category-based scoring
    if (category === "sewage blockage" || category === "water supply") {
      score += 2;
    }
    if (category === "potholes" && (location.includes("main") || location.includes("highway"))) {
      score += 1;
    }
    
    // Location-based scoring
    if (location.includes("school") || location.includes("hospital") || location.includes("main road")) {
      score += 1;
    }
    
    if (score > maxScore) {
      maxScore = score;
      assignedPriority = priority;
      reasoning = matchedKeywords;
    }
  });
  
  return {
    priority: assignedPriority,
    reasoning: reasoning.length ? `Detected keywords: ${reasoning.join(', ')}` : `Based on category: ${complaint.category}`,
    score: maxScore
  };
}

// Enhanced Duplicate Detection
function findDuplicateComplaints(newComplaint) {
  const similarities = [];
  
  appData.complaints.forEach(existing => {
    let similarityScore = 0;
    let reasons = [];
    
    // Category match (high weight)
    if (existing.category === newComplaint.category) {
      similarityScore += 3;
      reasons.push("Same category");
    }
    
    // Location similarity
    const newLocationWords = newComplaint.location.toLowerCase().split(/[\s,]+/);
    const existingLocationWords = existing.location.toLowerCase().split(/[\s,]+/);
    const commonLocationWords = newLocationWords.filter(word => 
      existingLocationWords.includes(word) && word.length > 2
    );
    
    if (commonLocationWords.length >= 2) {
      similarityScore += 4;
      reasons.push("Similar location");
    } else if (commonLocationWords.length === 1) {
      similarityScore += 2;
      reasons.push("Nearby location");
    }
    
    // Title/description keyword similarity
    const newWords = (newComplaint.title + " " + newComplaint.description).toLowerCase().split(/\s+/);
    const existingWords = (existing.title + " " + existing.description).toLowerCase().split(/\s+/);
    const commonWords = newWords.filter(word => 
      existingWords.includes(word) && word.length > 3
    );
    
    if (commonWords.length >= 3) {
      similarityScore += 2;
      reasons.push("Similar description");
    }
    
    // Consider as potential duplicate if similarity score >= 5
    if (similarityScore >= 5) {
      similarities.push({
        complaint: existing,
        score: similarityScore,
        reasons: reasons
      });
    }
  });
  
  return similarities.sort((a, b) => b.score - a.score);
}

// Enhanced Event Listener Setup
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Navigation buttons - more robust event listener setup
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach((btn, index) => {
    const section = btn.getAttribute('data-section');
    console.log(`Setting up nav button ${index}: ${section}`);
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Nav button clicked:', section);
      showSection(section);
    });
  });
  
  // Hero action buttons
  const heroButtons = document.querySelectorAll('.hero__actions button');
  heroButtons.forEach(btn => {
    const section = btn.getAttribute('data-section');
    if (section) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hero button clicked:', section);
        showSection(section);
      });
    }
  });
  
  // Urgent issues click handlers
  setTimeout(() => {
    const urgentItems = document.querySelectorAll('.urgent-item');
    urgentItems.forEach(item => {
      item.addEventListener('click', function() {
        const complaintText = this.querySelector('h5').textContent;
        const complaintId = complaintText.split(' - ')[0];
        console.log('Opening complaint modal for:', complaintId);
        openComplaintModal(complaintId);
      });
      item.style.cursor = 'pointer';
    });
  }, 100);
  
  // Form submissions
  setTimeout(() => {
    const complaintForm = document.getElementById('complaintForm');
    if (complaintForm) {
      complaintForm.addEventListener('submit', handleComplaintSubmission);
      console.log('Complaint form listener added');
      
      // Real-time priority prediction
      ['title', 'description', 'category'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.addEventListener('input', updatePriorityPreview);
        }
      });
    }
    
    const loginForm = document.getElementById('municipalLogin');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
      console.log('Login form listener added');
    }
    
    const trackBtn = document.getElementById('trackBtn');
    if (trackBtn) {
      trackBtn.addEventListener('click', trackComplaint);
      console.log('Track button listener added');
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
      console.log('Logout button listener added');
    }
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });
    
    // Priority tabs
    document.querySelectorAll('.priority-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const priority = e.target.getAttribute('data-priority');
        filterByPriority(priority);
      });
    });
    
    // Duplicate alert buttons
    const addToDuplicateBtn = document.getElementById('addToDuplicateBtn');
    const proceedNewBtn = document.getElementById('proceedNewBtn');
    
    if (addToDuplicateBtn) {
      addToDuplicateBtn.addEventListener('click', addToDuplicate);
    }
    if (proceedNewBtn) {
      proceedNewBtn.addEventListener('click', proceedWithNew);
    }
  }, 100);
  
  // File upload initialization
  setTimeout(() => {
    initFileUpload();
  }, 200);
  
  console.log('Event listeners setup complete');
}

// Real-time Priority Preview
function updatePriorityPreview() {
  const title = document.getElementById('title')?.value || '';
  const description = document.getElementById('description')?.value || '';
  const category = document.getElementById('category')?.value || '';
  
  if (!title && !description && !category) {
    const priorityPreview = document.getElementById('priorityPreview');
    if (priorityPreview) priorityPreview.classList.add('hidden');
    return;
  }
  
  const tempComplaint = { title, description, category, location: '' };
  const priorityResult = calculatePriority(tempComplaint);
  
  const priorityPreview = document.getElementById('priorityPreview');
  const predictedPriority = document.getElementById('predictedPriority');
  const priorityReasoning = document.getElementById('priorityReasoning');
  
  if (priorityPreview && predictedPriority && priorityReasoning) {
    priorityPreview.classList.remove('hidden');
    predictedPriority.textContent = priorityResult.priority;
    predictedPriority.className = `priority-badge ${priorityResult.priority.toLowerCase()}`;
    priorityReasoning.textContent = priorityResult.reasoning;
    
    // Check for duplicates
    if (title || description) {
      const duplicates = findDuplicateComplaints(tempComplaint);
      if (duplicates.length > 0) {
        showDuplicateAlert(duplicates);
      } else {
        hideDuplicateAlert();
      }
    }
  }
}

// Duplicate Detection UI
function showDuplicateAlert(duplicates) {
  const duplicateAlert = document.getElementById('duplicateAlert');
  const duplicateList = document.getElementById('duplicateList');
  
  if (duplicateAlert && duplicateList) {
    duplicateList.innerHTML = duplicates.slice(0, 3).map(dup => `
      <div class="duplicate-item">
        <strong>${dup.complaint.id}</strong> - ${dup.complaint.title}
        <br><small>📍 ${dup.complaint.location}</small>
        <br><small>Similarity: ${dup.reasons.join(', ')} (${dup.complaint.duplicateCount} reports)</small>
        <span class="status status--${getStatusClass(dup.complaint.status)}">${dup.complaint.status}</span>
      </div>
    `).join('');
    
    duplicateAlert.classList.remove('hidden');
    duplicateCheckResult = duplicates;
  }
}

function hideDuplicateAlert() {
  const duplicateAlert = document.getElementById('duplicateAlert');
  if (duplicateAlert) {
    duplicateAlert.classList.add('hidden');
    duplicateCheckResult = null;
  }
}

function addToDuplicate() {
  if (duplicateCheckResult && duplicateCheckResult.length > 0) {
    const mainComplaint = duplicateCheckResult[0].complaint;
    mainComplaint.duplicateCount += 1;
    
    alert(`Your report has been added to existing complaint ${mainComplaint.id}. The duplicate count is now ${mainComplaint.duplicateCount}.`);
    
    // Reset form
    document.getElementById('complaintForm').reset();
    uploadedFiles = [];
    displayFilePreview();
    hideDuplicateAlert();
    updateStats();
  }
}

function proceedWithNew() {
  hideDuplicateAlert();
  duplicateCheckResult = null;
}

// Form Submission
function handleComplaintSubmission(e) {
  e.preventDefault();
  console.log('Handling complaint submission...');
  
  const complaintData = {
    id: generateComplaintId(),
    category: document.getElementById('category').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    location: document.getElementById('location').value,
    submittedBy: document.getElementById('citizenName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value || '',
    status: 'Received',
    dateSubmitted: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    assignedTo: '',
    officer: '',
    photos: uploadedFiles.map(f => f.file.name),
    duplicateCount: 1,
    similarComplaints: [],
    notes: ''
  };
  
  // AI Priority Assignment
  const priorityResult = calculatePriority(complaintData);
  complaintData.priority = priorityResult.priority;
  complaintData.responseTime = appData.priorityRules[priorityResult.priority].responseTime;
  
  // Calculate due date
  const dueDate = new Date();
  const responseHours = priorityResult.priority === 'Emergency' ? 2 : 
                       priorityResult.priority === 'High' ? 24 :
                       priorityResult.priority === 'Medium' ? 72 : 168;
  dueDate.setHours(dueDate.getHours() + responseHours);
  complaintData.dueDate = dueDate.toISOString().split('T')[0];
  
  // Auto-assign department
  complaintData.assignedTo = getAssignedDepartment(complaintData.category);
  
  // Add to complaints
  appData.complaints.unshift(complaintData);
  filteredComplaints = [...appData.complaints];
  
  // Show success modal
  showSuccessModal(complaintData);
  
  // Reset form
  document.getElementById('complaintForm').reset();
  uploadedFiles = [];
  displayFilePreview();
  hideDuplicateAlert();
  updateStats();
  loadUrgentIssues();
}

function getAssignedDepartment(category) {
  const departmentMapping = {
    'Potholes': 'Roads Department',
    'Sewage Blockage': 'Water & Sanitation',
    'Water Supply': 'Water & Sanitation',
    'Street Lighting': 'Electrical Department',
    'Electricity': 'Electrical Department',
    'Waste Management': 'Waste Management',
    'Public Transport': 'Public Works',
    'Parks & Recreation': 'Public Works',
    'Building Permits': 'Public Works'
  };
  return departmentMapping[category] || 'Public Works';
}

function showSuccessModal(complaint) {
  document.getElementById('generatedId').textContent = complaint.id;
  document.getElementById('assignedPriority').textContent = complaint.priority;
  document.getElementById('assignedPriority').className = `priority-badge ${complaint.priority.toLowerCase()}`;
  document.getElementById('expectedResponse').textContent = complaint.responseTime;
  document.getElementById('successModal').classList.remove('hidden');
}

function generateComplaintId() {
  const count = appData.complaints.length + 1;
  return `CMP${String(count).padStart(3, '0')}`;
}

// File Upload Functions
function initFileUpload() {
  const fileUpload = document.getElementById('fileUpload');
  const fileInput = document.getElementById('photoInput');
  const filePreview = document.getElementById('filePreview');
  
  if (!fileUpload || !fileInput || !filePreview) {
    console.log('File upload elements not ready');
    return;
  }
  
  console.log('Initializing file upload...');
  
  const uploadArea = fileUpload.querySelector('.file-upload__area');
  
  uploadArea.addEventListener('click', () => fileInput.click());
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  });
  
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  });
  
  console.log('File upload initialized');
}

function handleFileUpload(files) {
  const maxFiles = 5;
  const maxSize = 2 * 1024 * 1024;
  
  files.forEach(file => {
    if (uploadedFiles.length >= maxFiles) {
      alert('Maximum 5 files allowed');
      return;
    }
    
    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum 2MB allowed.`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert(`File ${file.name} is not an image.`);
      return;
    }
    
    const fileObj = {
      file: file,
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file)
    };
    
    uploadedFiles.push(fileObj);
    displayFilePreview();
  });
}

function displayFilePreview() {
  const filePreview = document.getElementById('filePreview');
  if (!filePreview) return;
  
  filePreview.innerHTML = uploadedFiles.map(fileObj => `
    <div class="file-item">
      <img src="${fileObj.url}" alt="Preview">
      <button type="button" class="file-remove" onclick="removeFile('${fileObj.id}')">×</button>
    </div>
  `).join('');
}

function removeFile(fileId) {
  const fileIndex = uploadedFiles.findIndex(f => f.id == fileId);
  if (fileIndex > -1) {
    URL.revokeObjectURL(uploadedFiles[fileIndex].url);
    uploadedFiles.splice(fileIndex, 1);
    displayFilePreview();
  }
}

// Statistics and Dashboard
function updateStats() {
  const emergencyCount = appData.complaints.filter(c => c.priority === 'Emergency' && c.status !== 'Resolved').length;
  const highCount = appData.complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length;
  const mediumCount = appData.complaints.filter(c => c.priority === 'Medium' && c.status !== 'Resolved').length;
  const resolvedToday = appData.complaints.filter(c => c.status === 'Resolved' && c.lastUpdated === new Date().toISOString().split('T')[0]).length;
  
  // Update home page stats
  const emergencyElement = document.getElementById('emergencyCount');
  const highElement = document.getElementById('highCount'); 
  const mediumElement = document.getElementById('mediumCount');
  const resolvedElement = document.getElementById('resolvedCount');
  
  if (emergencyElement) emergencyElement.textContent = emergencyCount;
  if (highElement) highElement.textContent = highCount;
  if (mediumElement) mediumElement.textContent = mediumCount;
  if (resolvedElement) resolvedElement.textContent = resolvedToday;
  
  // Update dashboard stats
  const dashEmergencyElement = document.getElementById('dashEmergencyCount');
  const dashHighElement = document.getElementById('dashHighCount');
  const dashMediumElement = document.getElementById('dashMediumCount');
  
  if (dashEmergencyElement) dashEmergencyElement.textContent = emergencyCount;
  if (dashHighElement) dashHighElement.textContent = highCount;
  if (dashMediumElement) dashMediumElement.textContent = mediumCount;
}

function loadUrgentIssues() {
  const urgentList = document.getElementById('urgentIssuesList');
  if (!urgentList) return;
  
  const urgentComplaints = appData.complaints
    .filter(c => (c.priority === 'Emergency' || c.priority === 'High') && c.status !== 'Resolved')
    .slice(0, 3);
  
  if (urgentComplaints.length === 0) {
    urgentList.innerHTML = '<p style="text-align:center; color: var(--color-success);">✅ No urgent issues at the moment!</p>';
    return;
  }
  
  urgentList.innerHTML = urgentComplaints.map(complaint => `
    <div class="urgent-item" style="cursor: pointer;" data-complaint-id="${complaint.id}">
      <div class="urgent-item-info">
        <h5>${complaint.id} - ${complaint.title}</h5>
        <p>📍 ${complaint.location} | Due: ${formatDate(complaint.dueDate)}</p>
      </div>
      <span class="priority-badge ${complaint.priority.toLowerCase()}">${complaint.priority}</span>
    </div>
  `).join('');
  
  // Add click handlers to urgent items
  setTimeout(() => {
    document.querySelectorAll('.urgent-item').forEach(item => {
      item.addEventListener('click', function() {
        const complaintId = this.getAttribute('data-complaint-id');
        console.log('Opening urgent complaint:', complaintId);
        openComplaintModal(complaintId);
      });
    });
  }, 50);
}

// Tracking Functions
function trackComplaint() {
  const trackId = document.getElementById('trackId').value.trim();
  if (!trackId) {
    alert('Please enter complaint ID or phone number');
    return;
  }
  
  let complaint = null;
  
  if (trackId.startsWith('CMP')) {
    complaint = appData.complaints.find(c => c.id === trackId);
  } else {
    complaint = appData.complaints.find(c => c.phone === trackId);
  }
  
  if (complaint) {
    displayComplaintTracking(complaint);
    document.getElementById('trackResult').classList.remove('hidden');
  } else {
    alert('No complaint found with the provided ID or phone number');
    document.getElementById('trackResult').classList.add('hidden');
  }
}

function displayComplaintTracking(complaint) {
  const trackResult = document.getElementById('trackResult');
  
  // Update header
  trackResult.querySelector('.complaint-id-display').textContent = complaint.id;
  trackResult.querySelector('.complaint-status-display').innerHTML = 
    `<span class="status status--${getStatusClass(complaint.status)}">${complaint.status}</span>`;
  
  // Update priority display
  const priorityElement = document.getElementById('trackPriority');
  const responseTimeElement = document.getElementById('trackResponseTime');
  
  if (priorityElement && responseTimeElement) {
    priorityElement.textContent = complaint.priority;
    priorityElement.className = `priority-badge-large ${complaint.priority.toLowerCase()}`;
    responseTimeElement.textContent = `Response Time: ${complaint.responseTime}`;
  }
  
  // Update complaint info
  const complaintInfo = trackResult.querySelector('.complaint-info-track');
  complaintInfo.innerHTML = `
    <h4>${complaint.title}</h4>
    <p><strong>Category:</strong> ${complaint.category}</p>
    <p><strong>Location:</strong> ${complaint.location}</p>
    <p><strong>Description:</strong> ${complaint.description}</p>
    <p><strong>Submitted:</strong> ${formatDate(complaint.dateSubmitted)}</p>
    <p><strong>Assigned To:</strong> ${complaint.assignedTo || 'Not Assigned'}</p>
    ${complaint.notes ? `<p><strong>Latest Update:</strong> ${complaint.notes}</p>` : ''}
  `;
  
  // Update progress tracker
  updateProgressTracker(complaint);
  
  // Update timeline
  updateComplaintTimeline(complaint);
}

function updateProgressTracker(complaint) {
  const progressTracker = document.getElementById('progressTracker');
  if (!progressTracker) return;
  
  const steps = ['Received', 'In Progress', 'Resolved'];
  const currentStepIndex = steps.indexOf(complaint.status);
  
  progressTracker.innerHTML = `
    <h5>Progress Tracker</h5>
    <div class="progress-steps">
      ${steps.map((step, index) => `
        <div class="progress-step ${index <= currentStepIndex ? 'active' : ''}">
          <div class="progress-step-icon">${index + 1}</div>
          <div class="progress-step-label">${step}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function updateComplaintTimeline(complaint) {
  const timeline = document.querySelector('.complaint-timeline-track');
  if (!timeline) return;
  
  const events = [
    { date: complaint.dateSubmitted, event: 'Complaint submitted' },
    { date: complaint.lastUpdated, event: complaint.notes || 'Status updated' }
  ];
  
  if (complaint.status === 'Resolved') {
    events.push({ date: complaint.lastUpdated, event: 'Complaint resolved' });
  }
  
  timeline.innerHTML = `
    <h5>Timeline</h5>
    ${events.map(event => `
      <div class="timeline-item">
        <div class="timeline-date">${formatDate(event.date)}</div>
        <div>${event.event}</div>
      </div>
    `).join('')}
  `;
}

// Priority Filtering
function filterByPriority(priority) {
  currentPriorityFilter = priority;
  
  // Update active tab
  document.querySelectorAll('.priority-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-priority="${priority}"]`).classList.add('active');
  
  loadCitizenComplaints();
}

function loadCitizenComplaints() {
  const complaintsContainer = document.getElementById('citizenComplaints');
  if (!complaintsContainer) return;
  
  let complaintsToShow = appData.complaints;
  
  if (currentPriorityFilter !== 'all') {
    complaintsToShow = appData.complaints.filter(c => c.priority === currentPriorityFilter);
  }
  
  complaintsContainer.innerHTML = complaintsToShow.slice(0, 6).map(complaint => `
    <div class="complaint-card ${complaint.priority.toLowerCase()}" onclick="openComplaintModal('${complaint.id}')" style="cursor: pointer;">
      <div class="complaint-card-header">
        <div class="complaint-card-id">${complaint.id}</div>
        <span class="priority-badge ${complaint.priority.toLowerCase()}">${complaint.priority}</span>
      </div>
      <div class="complaint-card-title">${complaint.title}</div>
      <div class="complaint-card-location">📍 ${complaint.location}</div>
      <div class="complaint-card-date">
        Submitted: ${formatDate(complaint.dateSubmitted)}
        ${complaint.duplicateCount > 1 ? `<br><small>📊 ${complaint.duplicateCount} similar reports</small>` : ''}
      </div>
      <span class="status status--${getStatusClass(complaint.status)}">${complaint.status}</span>
    </div>
  `).join('');
}

// Dashboard Functions
function handleLogin(e) {
  e.preventDefault();
  console.log('Handling login...');
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  const officer = appData.officers.find(o => o.email === email && o.password === password);
  
  if (officer) {
    isLoggedIn = true;
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('dashboardContent').classList.remove('hidden');
    loadDashboard();
    console.log('Login successful');
  } else {
    alert('Invalid credentials');
  }
}

function handleLogout() {
  isLoggedIn = false;
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('dashboardContent').classList.add('hidden');
  console.log('Logged out');
}

function loadDashboard() {
  console.log('Loading dashboard...');
  updateStats();
  renderComplaintsTable();
  setupDashboardFilters();
}

function setupDashboardFilters() {
  ['filterPriority', 'filterStatus', 'filterCategory', 'searchComplaints'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', filterDashboardComplaints);
      element.addEventListener('change', filterDashboardComplaints);
    }
  });
  
  const sortBtn = document.getElementById('sortByPriorityBtn');
  if (sortBtn) {
    sortBtn.addEventListener('click', sortByPriority);
  }
}

function filterDashboardComplaints() {
  const priorityFilter = document.getElementById('filterPriority')?.value || '';
  const statusFilter = document.getElementById('filterStatus')?.value || '';
  const categoryFilter = document.getElementById('filterCategory')?.value || '';
  const searchTerm = document.getElementById('searchComplaints')?.value.toLowerCase() || '';
  
  filteredComplaints = appData.complaints.filter(complaint => {
    const priorityMatch = !priorityFilter || complaint.priority === priorityFilter;
    const statusMatch = !statusFilter || complaint.status === statusFilter;
    const categoryMatch = !categoryFilter || complaint.category === categoryFilter;
    const searchMatch = !searchTerm || 
      complaint.title.toLowerCase().includes(searchTerm) ||
      complaint.location.toLowerCase().includes(searchTerm) ||
      complaint.submittedBy.toLowerCase().includes(searchTerm);
    
    return priorityMatch && statusMatch && categoryMatch && searchMatch;
  });
  
  renderComplaintsTable();
}

function sortByPriority() {
  const priorityOrder = { 'Emergency': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
  filteredComplaints.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  renderComplaintsTable();
}

function renderComplaintsTable() {
  const tableBody = document.getElementById('complaintsTableBody');
  if (!tableBody) return;
  
  tableBody.innerHTML = filteredComplaints.map(complaint => {
    const dueDate = new Date(complaint.dueDate);
    const now = new Date();
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
    const dueCssClass = hoursUntilDue < 0 ? 'urgent' : hoursUntilDue < 24 ? 'soon' : '';
    
    return `
      <tr>
        <td class="priority-cell">
          <span class="priority-badge ${complaint.priority.toLowerCase()}">${complaint.priority}</span>
        </td>
        <td>${complaint.id}</td>
        <td>${complaint.category}</td>
        <td>${complaint.title}</td>
        <td>${complaint.location}</td>
        <td><span class="status status--${getStatusClass(complaint.status)}">${complaint.status}</span></td>
        <td>
          <div class="duplicate-count">
            👥 ${complaint.duplicateCount}
          </div>
        </td>
        <td>
          <div class="response-due ${dueCssClass}">
            ${formatDate(complaint.dueDate)}
            ${hoursUntilDue < 0 ? '⚠️ OVERDUE' : hoursUntilDue < 24 ? '🔔 Soon' : ''}
          </div>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn--primary btn--xs" onclick="openComplaintModal('${complaint.id}')">View</button>
            <button class="btn btn--outline btn--xs" onclick="openUpdateModal('${complaint.id}')">Update</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Modal Functions
function openComplaintModal(complaintId) {
  console.log('Opening complaint modal for:', complaintId);
  const complaint = appData.complaints.find(c => c.id === complaintId);
  if (!complaint) return;
  
  document.getElementById('modalTitle').textContent = `Complaint Details - ${complaint.id}`;
  
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="complaint-details">
      <div class="complaint-header">
        <div class="complaint-id-display">${complaint.id}</div>
        <div class="priority-display">
          <span class="priority-badge ${complaint.priority.toLowerCase()}">${complaint.priority}</span>
          <span class="status status--${getStatusClass(complaint.status)}">${complaint.status}</span>
        </div>
      </div>
      
      <div class="complaint-info-track">
        <h4>${complaint.title}</h4>
        <p><strong>Category:</strong> ${complaint.category}</p>
        <p><strong>Location:</strong> ${complaint.location}</p>
        <p><strong>Description:</strong> ${complaint.description}</p>
        <p><strong>Citizen:</strong> ${complaint.submittedBy}</p>
        <p><strong>Phone:</strong> ${complaint.phone}</p>
        <p><strong>Email:</strong> ${complaint.email || 'Not provided'}</p>
        <p><strong>Assigned To:</strong> ${complaint.assignedTo || 'Not Assigned'}</p>
        <p><strong>Submitted:</strong> ${formatDate(complaint.dateSubmitted)}</p>
        <p><strong>Response Due:</strong> ${formatDate(complaint.dueDate)}</p>
        <p><strong>Duplicate Reports:</strong> ${complaint.duplicateCount}</p>
      </div>
      
      ${complaint.photos.length > 0 ? `
        <div class="complaint-photos">
          <h5>Problem Photos</h5>
          <div class="photo-grid">
            ${complaint.photos.map(photo => `
              <div class="photo-item">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%23475569'%3E${photo}%3C/text%3E%3C/svg%3E" alt="${photo}">
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${complaint.notes ? `
        <div class="complaint-notes">
          <h5>Internal Notes</h5>
          <p>${complaint.notes}</p>
        </div>
      ` : ''}
      
      ${generateAIInsights(complaint)}
    </div>
  `;
  
  document.getElementById('complaintModal').classList.remove('hidden');
}

function generateAIInsights(complaint) {
  const similar = appData.complaints.filter(c => 
    c.id !== complaint.id && 
    (c.category === complaint.category || c.location.includes(complaint.location.split(',')[0]))
  ).slice(0, 3);
  
  return `
    <div class="ai-insights">
      <h5>🤖 AI Insights</h5>
      <div class="ai-insight-card">
        <p><strong>Priority Analysis:</strong> This complaint was automatically assigned ${complaint.priority} priority based on content analysis.</p>
        <p><strong>Response Time:</strong> ${complaint.responseTime}</p>
        ${similar.length > 0 ? `
          <p><strong>Similar Issues:</strong> Found ${similar.length} related complaints in the same area or category.</p>
          <div class="similar-complaints">
            ${similar.map(s => `<div class="similar-item">${s.id} - ${s.title}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function openUpdateModal(complaintId) {
  const complaint = appData.complaints.find(c => c.id === complaintId);
  if (!complaint) return;
  
  document.getElementById('modalTitle').textContent = `Update Complaint - ${complaint.id}`;
  
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <form class="modal-form" onsubmit="updateComplaint(event, '${complaintId}')">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-control" id="updateStatus" required>
            <option value="Received" ${complaint.status === 'Received' ? 'selected' : ''}>Received</option>
            <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-control" id="updatePriority">
            <option value="Low" ${complaint.priority === 'Low' ? 'selected' : ''}>Low</option>
            <option value="Medium" ${complaint.priority === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="High" ${complaint.priority === 'High' ? 'selected' : ''}>High</option>
            <option value="Emergency" ${complaint.priority === 'Emergency' ? 'selected' : ''}>Emergency</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Assign To Department</label>
        <select class="form-control" id="updateDepartment">
          <option value="">Select Department</option>
          ${appData.departments.map(dept => `
            <option value="${dept.name}" ${complaint.assignedTo === dept.name ? 'selected' : ''}>${dept.name}</option>
          `).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Internal Notes</label>
        <textarea class="form-control" id="updateNotes" rows="3">${complaint.notes}</textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn--primary">Update Complaint</button>
        <button type="button" class="btn btn--outline" onclick="closeModal()">Cancel</button>
      </div>
    </form>
  `;
  
  document.getElementById('complaintModal').classList.remove('hidden');
}

function updateComplaint(e, complaintId) {
  e.preventDefault();
  
  const complaintIndex = appData.complaints.findIndex(c => c.id === complaintId);
  if (complaintIndex === -1) return;
  
  const complaint = appData.complaints[complaintIndex];
  complaint.status = document.getElementById('updateStatus').value;
  complaint.priority = document.getElementById('updatePriority').value;
  complaint.assignedTo = document.getElementById('updateDepartment').value;
  complaint.notes = document.getElementById('updateNotes').value;
  complaint.lastUpdated = new Date().toISOString().split('T')[0];
  
  // Update response time based on new priority
  complaint.responseTime = appData.priorityRules[complaint.priority].responseTime;
  
  filteredComplaints = [...appData.complaints];
  renderComplaintsTable();
  closeModal();
  updateStats();
  loadUrgentIssues();
  
  alert('Complaint updated successfully!');
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
}

// Utility Functions
function getStatusClass(status) {
  const statusClasses = {
    'Received': 'info',
    'In Progress': 'warning', 
    'Resolved': 'success'
  };
  return statusClasses[status] || 'info';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Make functions globally available for onclick handlers
window.openComplaintModal = openComplaintModal;
window.openUpdateModal = openUpdateModal;
window.updateComplaint = updateComplaint;
window.closeModal = closeModal;
window.removeFile = removeFile;