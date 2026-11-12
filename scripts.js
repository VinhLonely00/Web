document.addEventListener('DOMContentLoaded', () => {

    /* --- 0. HIỆU ỨNG ĐÁNH MÁY TAB TITLE --- */
    const textToType = "@ᴠʏɴᴅᴜsᴋᴡɪɴᴛᴇʀ";
    let charIndex = textToType.length;
    let isDeleting = true;

    function typeEffect() {
        if (!isDeleting) {
            document.title = textToType.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === textToType.length) {
                setTimeout(() => { isDeleting = true; }, 1500);
            }
        } else {
            document.title = textToType.substring(0, charIndex);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
            }
        }
        setTimeout(typeEffect, isDeleting ? 80 : 130);
    }
    typeEffect();

    /* --- LOGIC ĐƯỜNG BAY & VỆT ĐUÔI NGẮN --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const targetPlaneIcon = document.getElementById('targetPlaneIcon');
    const externalAboutContent = document.getElementById('externalAboutContent');
    const customSliderTrack = document.getElementById('sliderTrack');

    let pathLength = 0;
    const TRAIL_LENGTH = 330; 
    let isFlying = false;

    function updateSliderThumbPosition(val) {
        if (!customSliderTrack || !sharkThumb) return;
        const trackWidth = customSliderTrack.offsetWidth;
        const thumbPos = (val / 100) * trackWidth;
        sharkThumb.style.left = thumbPos + 'px';
    }

    function getPathString() {
        const overlay = document.getElementById('airplaneOverlay');
        if (!overlay || !sharkThumb || !targetPlaneIcon) return '';

        const overlayRect = overlay.getBoundingClientRect();
        
        const trackRect = customSliderTrack.getBoundingClientRect();
        const startX = (trackRect.right - overlayRect.left) * (overlay.offsetWidth / overlayRect.width);
        const startY = (trackRect.top + trackRect.height / 2 - overlayRect.top) * (overlay.offsetHeight / overlayRect.height);

        const endRect = targetPlaneIcon.getBoundingClientRect();
        const scaleX = overlay.offsetWidth / overlayRect.width;
        const scaleY = overlay.offsetHeight / overlayRect.height;

        const endX = (endRect.left + endRect.width / 2 - overlayRect.left) * scaleX;
        const endY = (endRect.top + endRect.height / 2 - overlayRect.top) * scaleY;

        // Đã hạ thấp hệ số uốn cong xuống thêm khoảng 0.25
        const dx = endX - startX;
        const controlX1 = startX + dx * 0.45;
        const controlY1 = startY - overlay.offsetHeight * 0.15  + 15; 
        const controlX2 = endX - 320;
        const controlY2 = endY + 100; 

        return `M ${startX} ${startY}
                C ${controlX1} ${controlY1},
                  ${controlX2} ${controlY2},
                  ${endX} ${endY}`;
    }

    function initPath() {
        if (!flightPath) return;
        const d = getPathString();
        if (!d) return;

        flightPath.setAttribute('d', d);
        pathLength = flightPath.getTotalLength();
    }

    function updateMovingTrail(currentDistance) {
        if (!animatedTrailPath || !flightPath) return;

        if (currentDistance <= 0) {
            animatedTrailPath.setAttribute('d', '');
            return;
        }

        const startDistance = Math.max(0, currentDistance - TRAIL_LENGTH);
        const actualLength = currentDistance - startDistance;

        if (actualLength <= 0) {
            animatedTrailPath.setAttribute('d', '');
            return;
        }

        const segments = Math.max(15, Math.ceil(actualLength / 4));
        let d = '';

        for (let i = 0; i <= segments; i++) {
            const sampleDist = startDistance + (actualLength * (i / segments));
            const point = flightPath.getPointAtLength(sampleDist);
            d += `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y} `;
        }

        animatedTrailPath.setAttribute('d', d);
    }

    if (animatedTrailPath) {
        animatedTrailPath.setAttribute('d', '');
    }

    if (paperPlane) {
        paperPlane.style.opacity = '0';
    }

    requestAnimationFrame(() => {
        initPath();
        updateSliderThumbPosition(0);
    });

    window.addEventListener('resize', () => {
        if (!isFlying) {
            initPath();
            const val = sharkRange ? Number(sharkRange.value) : 0;
            updateSliderThumbPosition(val);
        }
    });

    // 1. Giai đoạn lấy đà
    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            if (isFlying) return;

            const val = Number(e.target.value);
            updateSliderThumbPosition(val);

            if (!pathLength) {
                initPath();
            }

            if (val < 99) {
                sharkThumb.style.opacity = '1';
                if (paperPlane) paperPlane.style.opacity = '0';
                if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');
            } else {
                sharkThumb.style.opacity = '0';
                if (paperPlane) {
                    paperPlane.style.opacity = '1';
                    const startPoint = flightPath.getPointAtLength(0);
                    paperPlane.style.left = startPoint.x + 'px';
                    paperPlane.style.top = startPoint.y + 'px';
                    paperPlane.style.transform = `translate(-50%, -50%) rotate(45deg)`;
                }
            }
        });

        // 2 & 3. Thả tay ở 100% -> Cất cánh bay tự động
        ['mouseup', 'touchend', 'change'].forEach(eventType => {
            sharkRange.addEventListener(eventType, () => {
                if (isFlying) return;
                const val = Number(sharkRange.value);

                if (val >= 99 && !isFlying) {
                    isFlying = true;
                    sharkRange.disabled = true;
                    sharkThumb.style.opacity = '0';
                    paperPlane.style.opacity = '1';

                    let currentDist = 0;
                    const flightDuration = 1600;
                    const startTime = performance.now();

                    function animateFlight(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / flightDuration, 1);
                        
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        currentDist = easeProgress * pathLength;

                        const point = flightPath.getPointAtLength(currentDist);
                        paperPlane.style.left = point.x + 'px';
                        paperPlane.style.top = point.y + 'px';

                        const nextDist = Math.min(currentDist + 2, pathLength);
                        const nextPoint = flightPath.getPointAtLength(nextDist);
                        const prevPoint = flightPath.getPointAtLength(Math.max(0, currentDist - 2));
                        
                        const angle = currentDist < pathLength
                            ? Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI)
                            : Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);

                        paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle + 45}deg)`;

                        updateMovingTrail(currentDist);

                        if (progress < 1) {
                            requestAnimationFrame(animateFlight);
                        } else {
                            // 4. Đến đích
                            paperPlane.style.opacity = '0';
                            if (targetPlaneIcon) targetPlaneIcon.classList.add('show');
                            if (handwritingTitle) handwritingTitle.classList.add('show');
                            if (externalAboutContent) externalAboutContent.classList.add('show');
                        }
                    }

                    requestAnimationFrame(animateFlight);
                }
            });
        });
    }

    /* --- CHUYỂN ĐỔI BACKGROUND VIDEO --- */
    const switchBgBtn = document.getElementById('switchBgBtn');
    const bgVideo1 = document.getElementById('bgVideo1');
    const bgVideo2 = document.getElementById('bgVideo2');

    if (switchBgBtn && bgVideo1 && bgVideo2) {
        switchBgBtn.addEventListener('click', () => {
            if (bgVideo1.classList.contains('active')) {
                bgVideo1.classList.remove('active');
                bgVideo1.pause();
                bgVideo2.classList.add('active');
                bgVideo2.play().catch(e => console.log(e));
            } else {
                bgVideo2.classList.remove('active');
                bgVideo2.pause();
                bgVideo1.classList.add('active');
                bgVideo1.play().catch(e => console.log(e));
            }
        });
    }

    /* --- TỰ ĐỘNG MỜ DẦN SAU 10 GIÂY KHÔNG TƯƠNG TÁC --- */
    let idleTimer;
    function resetIdleTimer() {
        if (document.body.classList.contains('idle-mode')) {
            document.body.classList.remove('idle-mode');
        }
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            document.body.classList.add('idle-mode');
        }, 10000);
    }

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('keypress', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    resetIdleTimer();

    /* --- CHẾ ĐỘ KHÁCH / CHỦ VÀ MẬT KHẨU --- */
    const roleModal = document.getElementById('roleModal');
    const passwordModal = document.getElementById('passwordModal');
    const secretMenuLi = document.getElementById('secretMenuLi');
    const secretSection = document.getElementById('secret-section');
    const passInput = document.getElementById('passInput');
    const passError = document.getElementById('passError');

    window.selectRole = function(role) {
        if (roleModal) roleModal.style.display = 'none';
        if (role === 'guest') {
            if (secretMenuLi) secretMenuLi.style.display = 'none';
            if (secretSection) secretSection.style.display = 'none';
        } else if (role === 'owner') {
            if (passwordModal) {
                passwordModal.style.display = 'flex';
                if (passInput) passInput.focus();
            }
        }
    };

    window.backToRoleModal = function() {
        if (passwordModal) passwordModal.style.display = 'none';
        if (roleModal) roleModal.style.display = 'flex';
        if (passError) passError.style.display = 'none';
        if (passInput) passInput.value = '';
    };

    window.verifyPassword = function() {
        if (!passInput) return;
        if (passInput.value === 'Vinh23456f@@') {
            if (passwordModal) passwordModal.style.display = 'none';
            if (secretMenuLi) secretMenuLi.style.display = 'inline-block';
            if (secretSection) secretSection.style.display = 'block';
            if (passError) passError.style.display = 'none';
        } else {
            if (passError) passError.style.display = 'block';
        }
    };

    window.checkEnterKey = function(event) {
        if (event.key === 'Enter') {
            window.verifyPassword();
        }
    };
});
