// Map Page Specific JavaScript

// Initialize map page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMapPage();
});

function initializeMapPage() {
    // Initialize all common functions from main script
    updateTime();
    setInterval(updateTime, 1000);
    initializeBatteryStatus();
    updateBatteryStatus();
    setInterval(updateBatteryStatus, 30000);
    initializeLanguageDropdown();
    
    // Initialize map specific functionality
    initializeMapInteractions();
    addMapAnimations();
}

// Initialize map interactions
function initializeMapInteractions() {
    // Add click handlers to map hotspots (replacing areas)
    const hotspots = document.querySelectorAll('.map-hotspot');
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            const areaType = this.getAttribute('data-area');
            showAreaInfo(areaType);
        });
    });
    
    // Add hover effects for hotspots
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15)';
            this.style.zIndex = '20';
        });
        
        hotspot.addEventListener('mouseleave', function() {
            if (!this.classList.contains('highlighted')) {
                this.style.transform = 'scale(1)';
                this.style.zIndex = '10';
            }
        });
    });
}

// Add map animations
function addMapAnimations() {
    // Animate hotspots on page load
    const hotspots = document.querySelectorAll('.map-hotspot');
    hotspots.forEach((hotspot, index) => {
        hotspot.style.opacity = '0';
        hotspot.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            hotspot.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            hotspot.style.opacity = '1';
            hotspot.style.transform = 'scale(1)';
        }, 300 + (index * 150));
    });
    
    // Animate nav buttons
    const navBtns = document.querySelectorAll('.nav-btn-compact');
    navBtns.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            btn.style.transition = 'all 0.6s ease';
            btn.style.opacity = '1';
            btn.style.transform = 'translateX(0)';
        }, 800 + (index * 150));
    });
}

// Highlight specific hotspot
function highlightArea(areaId) {
    // Remove previous highlights
    const hotspots = document.querySelectorAll('.map-hotspot');
    hotspots.forEach(hotspot => {
        hotspot.classList.remove('highlighted');
        hotspot.style.transform = 'scale(1)';
        hotspot.style.zIndex = '10';
    });
    
    // Highlight target hotspot
    const targetHotspot = document.querySelector(`[data-area="${areaId}"]`);
    if (targetHotspot) {
        targetHotspot.classList.add('highlighted');
        targetHotspot.style.transform = 'scale(1.2)';
        targetHotspot.style.zIndex = '25';
        targetHotspot.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Show area info
        showAreaInfo(areaId);
        
        // Remove highlight after 4 seconds
        setTimeout(() => {
            targetHotspot.classList.remove('highlighted');
            targetHotspot.style.transform = 'scale(1)';
            targetHotspot.style.zIndex = '10';
        }, 4000);
    }
}

// Show area information
function showAreaInfo(areaType) {
    const areaInfo = {
        'checkin-vietjet': {
            title: 'Quầy Check-in VietJet Air (A-F)',
            description: 'Khu vực check-in dành riêng cho hành khách VietJet Air. Bao gồm các quầy từ A đến F.',
            details: [
                'Thời gian: 3 tiếng - 45 phút trước giờ bay (nội địa)',
                'Thời gian: 3 tiếng - 60 phút trước giờ bay (quốc tế)',
                'Dịch vụ: Check-in, chọn chỗ ngồi, gửi hành lý',
                'Vị trí: Tầng trệt, khu vực A-F'
            ]
        },
        'checkin-other': {
            title: 'Quầy Check-in Hãng Khác (G-L)',
            description: 'Khu vực check-in dành cho các hãng hàng không khác.',
            details: [
                'Dành cho: Các hãng hàng không khác',
                'Vị trí: Tầng trệt, khu vực G-L',
                'Dịch vụ: Check-in, hành lý',
                'Lưu ý: Kiểm tra quầy theo hãng hàng không'
            ]
        },
        'security': {
            title: 'Khu vực Kiểm tra An ninh',
            description: 'Khu vực kiểm tra an ninh và soi chiếu hành lý xách tay.',
            details: [
                'Giấy tờ: CCCD/Hộ chiếu + thẻ lên máy bay',
                'Hành lý: Soi chiếu đồ vật cá nhân',
                'Chất lỏng: Tối đa 100ml/chai',
                'Thời gian: 30-45 phút trước giờ bay'
            ]
        },
        'domestic-gates': {
            title: 'Cổng Lên Máy Bay Nội Địa',
            description: 'Khu vực cổng lên máy bay cho các chuyến bay nội địa.',
            details: [
                'Dành cho: Chuyến bay nội địa',
                'Thời gian: 30 phút trước giờ bay',
                'Dịch vụ: Phòng chờ, cửa hàng',
                'Lưu ý: Theo dõi thông báo trên màn hình'
            ]
        },
        'international-gates': {
            title: 'Cổng Lên Máy Bay Quốc Tế',
            description: 'Khu vực cổng lên máy bay cho các chuyến bay quốc tế.',
            details: [
                'Dành cho: Chuyến bay quốc tế',
                'Thời gian: 45 phút trước giờ bay',
                'Dịch vụ: Phòng chờ, duty-free',
                'Thủ tục: Kiểm tra hộ chiếu, visa'
            ]
        },
        'facilities': {
            title: 'Khu vực Tiện Ích',
            description: 'Nhà hàng, cửa hàng và các dịch vụ tiện ích khác.',
            details: [
                'Nhà hàng: Ẩm thực Việt Nam và quốc tế',
                'Cửa hàng: Quà lưu niệm, duty-free',
                'Dịch vụ: ATM, WiFi miễn phí',
                'Tiện ích: Phòng nghỉ, massage'
            ]
        }
    };
    
    const info = areaInfo[areaType];
    if (info) {
        showAreaModal(info);
    }
}

// Show area modal
function showAreaModal(info) {
    const modal = createAreaModal(info);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

// Create area modal
function createAreaModal(info) {
    const modal = document.createElement('div');
    modal.className = 'area-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeAreaModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${info.title}</h3>
                <button class="modal-close" onclick="closeAreaModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p class="area-description">${info.description}</p>
                <div class="area-details">
                    <h4>Chi tiết:</h4>
                    <ul>
                        ${info.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="closeAreaModal()">Đã hiểu</button>
            </div>
        </div>
    `;
    
    // Add modal styles if not exists
    if (!document.querySelector('#area-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'area-modal-styles';
        style.textContent = `
            .area-modal {
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
            
            .area-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .area-modal .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .area-modal .modal-content {
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
            
            .area-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px 30px 20px;
                border-bottom: 1px solid #e9ecef;
            }
            
            .area-modal .modal-header h3 {
                color: #2c3e50;
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                line-height: 1.3;
            }
            
            .area-modal .modal-close {
                background: none;
                border: none;
                color: #7f8c8d;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .area-modal .modal-close:hover {
                background: #f8f9fa;
                color: #E31E24;
            }
            
            .area-modal .modal-body {
                padding: 25px 30px;
            }
            
            .area-description {
                color: #7f8c8d;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            
            .area-details h4 {
                color: #2c3e50;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 15px;
            }
            
            .area-details ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .area-details li {
                color: #7f8c8d;
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 8px;
            }
            
            .area-modal .modal-footer {
                padding: 20px 30px 25px;
                display: flex;
                justify-content: flex-end;
            }
            
            .area-modal .btn-primary {
                background: linear-gradient(135deg, #FF6B35 0%, #E31E24 100%);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .area-modal .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(227, 30, 36, 0.3);
            }
            
            @media (max-width: 768px) {
                .area-modal .modal-content {
                    min-width: 300px;
                    margin: 20px;
                }
                
                .area-modal .modal-header,
                .area-modal .modal-body,
                .area-modal .modal-footer {
                    padding-left: 20px;
                    padding-right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    return modal;
}

// Close area modal
function closeAreaModal() {
    const modal = document.querySelector('.area-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Go back to home
function goBackToHome() {
    window.location.href = 'index.html';
}

// Make functions available globally
window.highlightArea = highlightArea;
window.showAreaInfo = showAreaInfo;
window.closeAreaModal = closeAreaModal;
window.goBackToHome = goBackToHome;