// Info Page Specific JavaScript

// Initialize info page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeInfoPage();
});

function initializeInfoPage() {
    // Initialize all common functions from main script
    updateTime();
    setInterval(updateTime, 1000);
    initializeBatteryStatus();
    updateBatteryStatus();
    setInterval(updateBatteryStatus, 30000);
    initializeLanguageDropdown();
    
    // Initialize info specific functionality
    initializeInfoToggles();
    loadInfoSettings();
    updateAppInfo();
}

// Initialize info page toggles
function initializeInfoToggles() {
    const autoUpdateToggle = document.getElementById('autoUpdate');
    if (autoUpdateToggle) {
        autoUpdateToggle.addEventListener('change', function() {
            handleAutoUpdateToggle(this.checked);
        });
    }
}

// Handle auto update toggle
function handleAutoUpdateToggle(isEnabled) {
    localStorage.setItem('vietjet_auto_update', isEnabled);
    
    const message = isEnabled ? 'Tự động cập nhật đã bật' : 'Tự động cập nhật đã tắt';
    showInfoFeedback(message, isEnabled);
    
    console.log('Auto Update:', isEnabled ? 'Enabled' : 'Disabled');
}

// Load info settings from localStorage
function loadInfoSettings() {
    const autoUpdate = localStorage.getItem('vietjet_auto_update');
    if (autoUpdate !== null) {
        const toggle = document.getElementById('autoUpdate');
        if (toggle) {
            toggle.checked = autoUpdate === 'true';
        }
    }
}

// Update app information dynamically
function updateAppInfo() {
    // Get current date for build version
    const currentDate = new Date();
    const buildDate = currentDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    
    // Update build version in the UI if needed
    const buildElements = document.querySelectorAll('.build-date');
    buildElements.forEach(element => {
        element.textContent = buildDate;
    });
}

// Check for updates function
function checkForUpdates() {
    showInfoFeedback('Đang kiểm tra cập nhật...', true);
    
    // Simulate checking for updates
    setTimeout(() => {
        const hasUpdate = Math.random() > 0.7; // 30% chance of having update
        
        if (hasUpdate) {
            showUpdateDialog();
        } else {
            showInfoFeedback('Bạn đang sử dụng phiên bản mới nhất', true);
        }
    }, 2000);
}

// Show update options
function showUpdateOptions() {
    const modal = createUpdateModal();
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

// Create update modal
function createUpdateModal() {
    const modal = document.createElement('div');
    modal.className = 'update-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeUpdateModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Cập nhật ứng dụng</h3>
                <button class="modal-close" onclick="closeUpdateModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="update-info">
                    <div class="update-icon">
                        <i class="fas fa-download"></i>
                    </div>
                    <h4>Phiên bản mới có sẵn!</h4>
                    <p>Phiên bản 1.1.0 đã có sẵn với nhiều tính năng mới và cải thiện hiệu suất.</p>
                    <div class="update-details">
                        <div class="detail-item">
                            <span class="label">Phiên bản hiện tại:</span>
                            <span class="value">1.0.0</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Phiên bản mới:</span>
                            <span class="value">1.1.0</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Kích thước:</span>
                            <span class="value">15.2 MB</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeUpdateModal()">Để sau</button>
                <button class="btn-primary" onclick="startUpdate()">Cập nhật ngay</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .update-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .update-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 15px;
            min-width: 400px;
            max-width: 90vw;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px 30px 20px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .modal-header h3 {
            color: #2c3e50;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: #7f8c8d;
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: #f8f9fa;
            color: #E31E24;
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .update-info {
            text-align: center;
        }
        
        .update-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #FF6B35 0%, #E31E24 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }
        
        .update-icon i {
            color: white;
            font-size: 24px;
        }
        
        .update-info h4 {
            color: #2c3e50;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .update-info p {
            color: #7f8c8d;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 25px;
        }
        
        .update-details {
            text-align: left;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .detail-item:last-child {
            margin-bottom: 0;
        }
        
        .detail-item .label {
            color: #7f8c8d;
            font-size: 14px;
        }
        
        .detail-item .value {
            color: #2c3e50;
            font-size: 14px;
            font-weight: 500;
        }
        
        .modal-footer {
            padding: 20px 30px 25px;
            display: flex;
            gap: 15px;
            justify-content: flex-end;
        }
        
        .btn-secondary, .btn-primary {
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #6c757d;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #FF6B35 0%, #E31E24 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(227, 30, 36, 0.3);
        }
    `;
    
    if (!document.querySelector('#update-modal-styles')) {
        style.id = 'update-modal-styles';
        document.head.appendChild(style);
    }
    
    return modal;
}

// Close update modal
function closeUpdateModal() {
    const modal = document.querySelector('.update-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Start update process
function startUpdate() {
    closeUpdateModal();
    showInfoFeedback('Đang tải xuống cập nhật...', true);
    
    // Simulate update process
    setTimeout(() => {
        showInfoFeedback('Cập nhật hoàn tất! Khởi động lại ứng dụng.', true);
    }, 3000);
}

// Show update dialog
function showUpdateDialog() {
    showUpdateOptions();
}

// Show info feedback
function showInfoFeedback(message, isSuccess = true) {
    const feedback = document.createElement('div');
    feedback.className = 'info-feedback';
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${isSuccess ? '#E31E24' : '#6c757d'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(50px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 300px;
    `;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Animate in
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateX(50px)';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 3000);
}

// Make functions available globally
window.checkForUpdates = checkForUpdates;
window.showUpdateOptions = showUpdateOptions;
window.closeUpdateModal = closeUpdateModal;
window.startUpdate = startUpdate;