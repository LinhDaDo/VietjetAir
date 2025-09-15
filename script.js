// Global Variables
let currentService = null;
let isVoiceActive = false;
let isChatbotOpen = true;
let recognition = null;
let synthesis = window.speechSynthesis;
let currentLanguage = 'vi'; // Default to Vietnamese
let isAppLoaded = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
});

// Show loading screen and simulate loading process
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainApp = document.getElementById('mainApp');
    
    // Ensure loading screen is visible
    loadingScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    
    // Auto transition after exactly 2 seconds
    setTimeout(() => {
        completeLoading();
    }, 2000);
}

// Complete loading and show main application
function completeLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainApp = document.getElementById('mainApp');
    
    // Fade out loading screen
    loadingScreen.classList.add('hidden');
    
    // Show main app after transition
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        // Fade in main app
        setTimeout(() => {
            mainApp.classList.add('visible');
            initializeMainApp();
        }, 100);
        
    }, 800); // Wait for fade out transition
}

// Initialize main application after loading
function initializeMainApp() {
    if (isAppLoaded) return; // Prevent double initialization
    
    isAppLoaded = true;
    initializeApp();
    setupEventListeners();
    initializeSpeechRecognition();
    updateTime();
    setInterval(updateTime, 1000);
    initializeBatteryStatus();
    updateBatteryStatus();
    setInterval(updateBatteryStatus, 30000); // Update every 30 seconds
}

// Initialize the application
function initializeApp() {
    // Hide all content panels initially
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Setup initial chatbot state - hidden by default
    const chatbotContainer = document.getElementById('chatbotContainer');
    chatbotContainer.style.display = 'none';
    isChatbotOpen = false;
    
    // Initialize timestamp for the initial Amy message
    initializeInitialTimestamp();
    
    // Initialize drag functionality for floating icon
    initializeDragFunctionality();
}

// Initialize timestamp for the initial Amy message
function initializeInitialTimestamp() {
    const initialTimestamp = document.getElementById('initialTimestamp');
    if (initialTimestamp) {
        // Set the initial timestamp to current time (static, not updating)
        initialTimestamp.textContent = getCurrentTimestamp();
    }
}

// Get current timestamp in hh:mm:ss format
function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

// Setup event listeners
function setupEventListeners() {
    // Service card click handlers
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            showService(service);
        });
    });
    
    // Chat input enter key
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Language switch handlers
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

// Update current time display
function updateTime() {
    const timeDisplay = document.getElementById('currentTime');
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    timeDisplay.textContent = timeString;
}

// Initialize battery status
function initializeBatteryStatus() {
    // Check if Battery API is supported
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            updateBatteryDisplay(battery.level, battery.charging);
            
            // Add event listeners for battery changes
            battery.addEventListener('levelchange', function() {
                updateBatteryDisplay(battery.level, battery.charging);
            });
            
            battery.addEventListener('chargingchange', function() {
                updateBatteryDisplay(battery.level, battery.charging);
            });
        });
    } else {
        // Fallback for browsers that don't support Battery API
        simulateBatteryStatus();
    }
}

// Update battery status (fallback simulation)
function updateBatteryStatus() {
    if (!('getBattery' in navigator)) {
        simulateBatteryStatus();
    }
}

// Simulate battery status for browsers without Battery API
function simulateBatteryStatus() {
    // Generate a random battery level between 15% and 100%
    const batteryLevel = Math.random() * 0.85 + 0.15; // 15% to 100%
    const isCharging = Math.random() > 0.7; // 30% chance of charging
    
    updateBatteryDisplay(batteryLevel, isCharging);
}

// Update battery display
function updateBatteryDisplay(level, charging) {
    const batteryIcon = document.getElementById('batteryIcon');
    const batteryPercentage = document.getElementById('batteryPercentage');
    const batteryInfo = document.getElementById('batteryInfo');
    
    if (!batteryIcon || !batteryPercentage || !batteryInfo) return;
    
    const percentage = Math.round(level * 100);
    batteryPercentage.textContent = percentage + '%';
    
    // Remove all battery classes
    batteryIcon.className = batteryIcon.className.replace(/fa-battery-[\w-]+/g, '');
    batteryInfo.classList.remove('low-battery');
    
    // Determine battery icon based on level
    let iconClass = '';
    let iconColor = '';
    
    if (charging) {
        iconClass = 'fas fa-charging-station';
        iconColor = '#4CAF50'; // Green for charging
    } else if (percentage <= 20) {
        iconClass = 'fas fa-battery-empty';
        iconColor = '#f44336'; // Red for low battery
        batteryInfo.classList.add('low-battery'); // Add pulsing animation
    } else if (percentage <= 40) {
        iconClass = 'fas fa-battery-quarter';
        iconColor = '#FF9800'; // Orange for medium-low
    } else if (percentage <= 60) {
        iconClass = 'fas fa-battery-half';
        iconColor = '#FFC107'; // Yellow for medium
    } else if (percentage <= 80) {
        iconClass = 'fas fa-battery-three-quarters';
        iconColor = '#8BC34A'; // Light green for good
    } else {
        iconClass = 'fas fa-battery-full';
        iconColor = '#4CAF50'; // Green for full
    }
    
    batteryIcon.className = iconClass;
    batteryIcon.style.color = iconColor;
}

// Show specific service content
function showService(serviceName) {
    // Update service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.classList.remove('active');
        if (card.getAttribute('data-service') === serviceName) {
            card.classList.add('active');
        }
    });
    
    // Show corresponding content panel
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(`${serviceName}-panel`);
    if (targetPanel) {
        targetPanel.classList.add('active');
        currentService = serviceName;
        
        // Show back button
        const backBtn = document.getElementById('backBtn');
        backBtn.classList.add('show');
        
        // Scroll to content
        targetPanel.scrollIntoView({ behavior: 'smooth' });
    }
}

// Go back to main menu
function goBack() {
    // Hide all content panels
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Deactivate all service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => card.classList.remove('active'));
    
    // Hide back button
    const backBtn = document.getElementById('backBtn');
    backBtn.classList.remove('show');
    
    // Reset current service
    currentService = null;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Chatbot Functions
function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    
    if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
        chatbotContainer.style.display = 'block';
        isChatbotOpen = true;
    } else {
        chatbotContainer.style.display = 'none';
        isChatbotOpen = false;
    }
}

function closeChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    chatbotContainer.style.display = 'none';
    isChatbotOpen = false;
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = generateBotResponse(message);
            addMessage(response, 'bot');
            speakMessage(response);
        }, 1000);
    }
}

function sendQuickReply(message) {
    addMessage(message, 'user');
    
    setTimeout(() => {
        const response = generateBotResponse(message);
        addMessage(response, 'bot');
        speakMessage(response);
    }, 1000);
}

function addMessage(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (sender === 'bot') {
        // Use VietJet logo for bot messages
        const logoImg = document.createElement('img');
        logoImg.src = 'https://cdn-media.vinbase.ai/chat-widget/vietjet-external/assets/images/logo-vj.png';
        logoImg.alt = 'VietJet Air';
        logoImg.className = 'vj-logo-mini';
        logoImg.onerror = function() {
            this.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/VietJet_Air_logo.svg/200px-VietJet_Air_logo.svg.png';
        };
        avatarDiv.appendChild(logoImg);
    } else {
        // User avatar - use Font Awesome user icon
        const iconDiv = document.createElement('div');
        iconDiv.className = 'user-avatar-icon';
        const icon = document.createElement('i');
        icon.className = 'fas fa-user';
        iconDiv.appendChild(icon);
        avatarDiv.appendChild(iconDiv);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const p = document.createElement('p');
    p.textContent = content;
    contentDiv.appendChild(p);
    
    // Add timestamp for all messages (both user and bot)
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-timestamp';
    timestampDiv.textContent = getCurrentTimestamp();
    contentDiv.appendChild(timestampDiv);
    
    if (sender === 'user') {
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
    } else {
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (currentLanguage === 'vi') {
        // Vietnamese responses
        if (message.includes('check-in') || message.includes('chế') || message.includes('làm thủ tục')) {
            return 'Check-in VietJet Air có thể thực hiện tại quầy A-F hoặc trực tuyến. Nội địa: 45 phút trước giờ bay, quốc tế: 60 phút trước giờ bay.';
        } else if (message.includes('chuyến bay') || message.includes('máy bay') || message.includes('bay')) {
            return 'Tôi có thể giúp bạn tra cứu thông tin chuyến bay. Vui lòng cho biết số hiệu chuyến bay hoặc điểm đến.';
        } else if (message.includes('sân bay') || message.includes('đường') || message.includes('bản đồ')) {
            return 'Sân bay Tân Sơn Nhất có nhiều khu vực: Check-in VietJet tại quầy A-F, kiểm tra an ninh, cổng lên máy bay và khu tiện ích. Tôi có thể hướng dẫn cụ thể hơn.';
        } else if (message.includes('hành lý') || message.includes('va li') || message.includes('túi xách')) {
            return 'Hành lý xách tay: 7kg, kích thước 56x36x23cm. Hành lý ký gửi: 20kg (có thể mua thêm). Không mang chất lỏng quá 100ml lên máy bay.';
        } else if (message.includes('chỗ ngồi') || message.includes('ghế')) {
            return 'Bạn có thể chọn chỗ ngồi khi check-in trực tuyến, trên app VietJet hoặc tại quầy sân bay. Một số chỗ ngồi có phí bổ sung.';
        } else if (message.includes('xin chào') || message.includes('chào') || message.includes('hello')) {
            return 'Xin chào! Tôi là Amy, trợ lý ảo của VietJet Air. Tôi 🟢 sẵn sàng hỗ trợ bạn với các thủ tục check-in và thông tin sân bay!';
        } else if (message.includes('cảm ơn') || message.includes('cám ơn')) {
            return 'Rất vui được hỗ trợ bạn! Nếu có thêm câu hỏi gì, đừng ngần ngại hỏi nhé!';
        } else if (message.includes('giá vé') || message.includes('giá cả') || message.includes('chi phí')) {
            return 'Giá vé VietJet thay đổi theo tầng bay và thời gian. Bạn có thể xem giá vé hiện tại trên website vietjetair.com hoặc app VietJet Air.';
        } else {
            return 'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về: check-in, thông tin chuyến bay, hành lý, chỗ ngồi, hoặc bản đồ sân bay.';
        }
    } else {
        // English responses
        if (message.includes('check-in') || message.includes('checkin')) {
            return 'VietJet check-in is available at counters A-F or online. Domestic: 45 minutes before departure, International: 60 minutes before departure.';
        } else if (message.includes('flight') || message.includes('plane')) {
            return 'I can help you check flight information. Please provide your flight number or destination.';
        } else if (message.includes('airport') || message.includes('map') || message.includes('direction')) {
            return 'Tan Son Nhat Airport has several areas: VietJet check-in at counters A-F, security check, boarding gates, and facilities. I can provide more specific directions.';
        } else if (message.includes('baggage') || message.includes('luggage')) {
            return 'Carry-on baggage: 7kg, size 56x36x23cm. Checked baggage: 20kg (additional can be purchased). No liquids over 100ml on board.';
        } else if (message.includes('seat') || message.includes('seating')) {
            return 'You can select seats during online check-in, on VietJet app, or at airport counter. Some seats may have additional fees.';
        } else if (message.includes('hello') || message.includes('hi')) {
            return 'Hello! I\'m Amy, VietJet Air\'s virtual assistant. I\'m ready to help you with check-in procedures and airport information!';
        } else if (message.includes('thank')) {
            return 'You\'re welcome! If you have any more questions, feel free to ask!';
        } else {
            return 'Sorry, I didn\'t understand your question. You can ask about: check-in, flight information, baggage, seats, or airport map.';
        }
    }
}

// Speech Recognition and Synthesis
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';
        
        recognition.onstart = function() {
            console.log('Đang bắt đầu nhận diện giọng nói...');
            showVoiceIndicator();
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log('Giọng nói được nhận diện:', transcript);
            
            // Add the recognized speech as a user message
            addMessage(transcript, 'user');
            
            // Generate and speak bot response
            setTimeout(() => {
                const response = generateBotResponse(transcript);
                addMessage(response, 'bot');
                speakMessage(response);
            }, 1000);
        };
        
        recognition.onerror = function(event) {
            console.error('Lỗi nhận diện giọng nói:', event.error);
            hideVoiceIndicator();
            updateVoiceButton(false);
        };
        
        recognition.onend = function() {
            console.log('Kết thúc nhận diện giọng nói.');
            hideVoiceIndicator();
            updateVoiceButton(false);
        };
    } else {
        console.log('Trình duyệt không hỗ trợ nhận diện giọng nói.');
    }
}

function toggleVoice(event) {
    event.stopPropagation();
    
    if (!recognition) {
        const message = currentLanguage === 'vi' ? 
            'Trình duyệt không hỗ trợ nhận diện giọng nói.' : 
            'Speech recognition is not supported in this browser.';
        alert(message);
        return;
    }
    
    if (isVoiceActive) {
        recognition.stop();
        isVoiceActive = false;
        updateVoiceButton(false);
        hideVoiceIndicator();
    } else {
        recognition.start();
        isVoiceActive = true;
        updateVoiceButton(true);
    }
}

function updateVoiceButton(active) {
    const voiceBtn = document.getElementById('voiceBtn');
    if (active) {
        voiceBtn.classList.add('active');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
    } else {
        voiceBtn.classList.remove('active');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
    isVoiceActive = active;
}

function showVoiceIndicator() {
    const voiceIndicator = document.getElementById('voiceIndicator');
    voiceIndicator.classList.add('active');
}

function hideVoiceIndicator() {
    const voiceIndicator = document.getElementById('voiceIndicator');
    voiceIndicator.classList.remove('active');
}

function speakMessage(message) {
    if (synthesis) {
        // Cancel any ongoing speech
        synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = currentLanguage === 'vi' ? 'vi-VN' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Find appropriate voice
        const voices = synthesis.getVoices();
        let selectedVoice;
        if (currentLanguage === 'vi') {
            selectedVoice = voices.find(voice => voice.lang.includes('vi'));
        } else {
            selectedVoice = voices.find(voice => voice.lang.includes('en'));
        }
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        utterance.onstart = function() {
            console.log('Bắt đầu phát âm thanh');
        };
        
        utterance.onend = function() {
            console.log('Hoàn thành phát âm thanh');
        };
        
        synthesis.speak(utterance);
    }
}

// Service-specific functions
function performOnlineCheckin() {
    const bookingNumber = document.getElementById('bookingNumber').value;
    const passengerName = document.getElementById('passengerName').value;
    
    if (!bookingNumber || !passengerName) {
        const message = currentLanguage === 'vi' ? 
            'Vui lòng nhập đầy đủ mã đặt chỗ và họ tên.' : 
            'Please enter both booking number and passenger name.';
        alert(message);
        return;
    }
    
    // Simulate check-in process
    const processingMessage = currentLanguage === 'vi' ? 
        `Đang xử lý check-in cho ${passengerName}. Vui lòng chờ...` : 
        `Processing check-in for ${passengerName}. Please wait...`;
    alert(processingMessage);
    
    setTimeout(() => {
        const successMessage = currentLanguage === 'vi' ? 
            'Check-in thành công! Bạn có thể in thẻ lên máy bay hoặc lưu vào điện thoại.' : 
            'Check-in successful! You can print your boarding pass or save it to your mobile.';
        alert(successMessage);
        // Clear form
        document.getElementById('bookingNumber').value = '';
        document.getElementById('passengerName').value = '';
    }, 2000);
}

function searchFlight() {
    const searchInput = document.getElementById('flightSearch');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        const message = currentLanguage === 'vi' ? 
            'Vui lòng nhập số hiệu chuyến bay hoặc điểm đến.' : 
            'Please enter flight number or destination.';
        alert(message);
        return;
    }
    
    // Simulate flight search
    const flightRows = document.querySelectorAll('.flight-row:not(.header)');
    let found = false;
    
    flightRows.forEach(row => {
        const flightNumber = row.children[0].textContent.toLowerCase();
        const destination = row.children[1].textContent.toLowerCase();
        
        if (flightNumber.includes(searchTerm) || destination.includes(searchTerm)) {
            row.style.display = 'grid';
            row.style.backgroundColor = '#fff3cd';
            found = true;
        } else {
            row.style.display = 'none';
        }
    });
    
    if (!found) {
        const message = currentLanguage === 'vi' ? 
            'Không tìm thấy kết quả. Vui lòng thử lại.' : 
            'No results found. Please try again.';
        alert(message);
        // Reset display
        flightRows.forEach(row => {
            row.style.display = 'grid';
            row.style.backgroundColor = '';
        });
    }
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'error' ? '#e74c3c' : '#2ecc71',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        zIndex: '10000',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Lỗi hệ thống:', e.error);
    const message = currentLanguage === 'vi' ? 
        'Có lỗi xảy ra. Vui lòng tải lại trang.' : 
        'An error occurred. Please refresh the page.';
    showNotification(message, 'error');
});

// Prevent context menu (right-click) for kiosk mode
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable text selection for kiosk mode
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

// Initialize drag functionality for floating icon
function initializeDragFunctionality() {
    const floatingIcon = document.getElementById('vietjetFloatIcon');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    floatingIcon.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events for mobile
    floatingIcon.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        e.stopPropagation(); // Prevent toggleChatbot from firing
        
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        isDragging = true;
        floatingIcon.style.transition = 'none'; // Disable transition during drag
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            // Constrain to viewport
            const rect = floatingIcon.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            xOffset = Math.min(Math.max(0, xOffset), maxX);
            yOffset = Math.min(Math.max(0, yOffset), maxY);

            setTranslate(xOffset, yOffset, floatingIcon);
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;
            floatingIcon.style.transition = 'all 0.3s ease'; // Re-enable transition
            
            // If it was just a click (minimal movement), trigger toggleChatbot
            if (Math.abs(xOffset) < 5 && Math.abs(yOffset) < 5) {
                setTimeout(() => toggleChatbot(), 0);
            }
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
}

// Language Dropdown Functions
function initializeLanguageDropdown() {
    const selectedLanguage = document.getElementById('selectedLanguage');
    const languageOptions = document.getElementById('languageOptions');
    const languageDropdown = selectedLanguage.closest('.language-dropdown');
    const languageOptionItems = document.querySelectorAll('.language-option');
    
    // Toggle dropdown
    selectedLanguage.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('open');
    });
    
    // Handle language selection
    languageOptionItems.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const selectedLang = this.getAttribute('data-lang');
            const flagIcon = this.querySelector('.flag-icon').src;
            const langText = this.querySelector('span').textContent;
            
            // Update selected language display
            const selectedFlag = selectedLanguage.querySelector('.flag-icon');
            const selectedText = selectedLanguage.querySelector('span');
            selectedFlag.src = flagIcon;
            selectedText.textContent = langText;
            
            // Update active state
            languageOptionItems.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Close dropdown
            languageDropdown.classList.remove('open');
            
            // Switch language
            switchLanguage(selectedLang);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove('open');
        }
    });
    
    // Set initial active state
    const initialOption = document.querySelector('.language-option[data-lang="vi"]');
    if (initialOption) {
        initialOption.classList.add('active');
    }
}

// Initialize language dropdown when page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...
    initializeLanguageDropdown();
});