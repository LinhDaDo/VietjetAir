// Settings Page Specific JavaScript

// Initialize settings page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
});

function initializeSettingsPage() {
    // Initialize all common functions from main script
    updateTime();
    setInterval(updateTime, 1000);
    initializeBatteryStatus();
    updateBatteryStatus();
    setInterval(updateBatteryStatus, 30000);
    initializeLanguageDropdown();
    
    // Initialize settings specific functionality
    initializeSettingsToggles();
    loadSettingsFromStorage();
}

// Initialize settings toggles
function initializeSettingsToggles() {
    const toggles = ['notifications', 'sound', 'vibration', 'darkmode'];
    
    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('change', function() {
                handleToggleChange(toggleId, this.checked);
            });
        }
    });
}

// Handle toggle changes
function handleToggleChange(settingName, isEnabled) {
    // Save to localStorage
    localStorage.setItem(`vietjet_${settingName}`, isEnabled);
    
    // Apply setting based on type
    switch(settingName) {
        case 'notifications':
            handleNotificationSetting(isEnabled);
            break;
        case 'sound':
            handleSoundSetting(isEnabled);
            break;
        case 'vibration':
            handleVibrationSetting(isEnabled);
            break;
        case 'darkmode':
            handleDarkModeSetting(isEnabled);
            break;
    }
    
    // Show feedback
    showSettingFeedback(settingName, isEnabled);
}

// Handle notification setting
function handleNotificationSetting(isEnabled) {
    if (isEnabled && 'Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    console.log('Notifications:', isEnabled ? 'Enabled' : 'Disabled');
}

// Handle sound setting
function handleSoundSetting(isEnabled) {
    // Store sound preference globally
    window.soundEnabled = isEnabled;
    console.log('Sound:', isEnabled ? 'Enabled' : 'Disabled');
}

// Handle vibration setting
function handleVibrationSetting(isEnabled) {
    // Store vibration preference globally
    window.vibrationEnabled = isEnabled;
    console.log('Vibration:', isEnabled ? 'Enabled' : 'Disabled');
}

// Handle dark mode setting
function handleDarkModeSetting(isEnabled) {
    if (isEnabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    console.log('Dark Mode:', isEnabled ? 'Enabled' : 'Disabled');
}

// Load settings from localStorage
function loadSettingsFromStorage() {
    const settings = ['notifications', 'sound', 'vibration', 'darkmode'];
    
    settings.forEach(settingName => {
        const saved = localStorage.getItem(`vietjet_${settingName}`);
        if (saved !== null) {
            const toggle = document.getElementById(settingName);
            if (toggle) {
                toggle.checked = saved === 'true';
                handleToggleChange(settingName, toggle.checked);
            }
        }
    });
}

// Show setting feedback
function showSettingFeedback(settingName, isEnabled) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'setting-feedback';
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${isEnabled ? '#E31E24' : '#6c757d'};
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
    `;
    
    // Set feedback text
    const settingNames = {
        'notifications': 'Thông báo',
        'sound': 'Âm thanh', 
        'vibration': 'Rung',
        'darkmode': 'Chế độ tối'
    };
    
    feedback.textContent = `${settingNames[settingName]} đã ${isEnabled ? 'bật' : 'tắt'}`;
    
    // Add to page
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
    }, 2000);
}

// Export functions for use in other pages
window.vietjetSettings = {
    handleToggleChange,
    loadSettingsFromStorage,
    showSettingFeedback
};