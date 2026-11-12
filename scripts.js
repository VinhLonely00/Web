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

    /* --- LOGIC ĐƯỜNG BAY HẠ CÁNH ĐƯỜNG THẲNG & MÁY BAY GIẤY SVG --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const svgPlane = document.getElementById('svgPlane');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const targetPlaneAnchor = document.getElementById('targetPlaneAnchor');
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
        if (!overlay || !customSliderTrack || !targetPlaneAnchor) return '';

        const overlayRect = overlay.getBoundingClientRect();
        const scaleX = overlay.offsetWidth / overlayRect.width;
        const scaleY = overlay.offsetHeight / overlayRect.height;

        // Điểm xuất phát: Vị trí 100% ở cuối thanh slider
        const trackRect = customSliderTrack.getBoundingClientRect();
        const startX = (trackRect.right - overlayRect.left) * scaleX;
        const startY = (trackRect.top + trackRect.height / 2 - overlayRect.top) * scaleY;

        // Điểm dừng trung tâm (khu vực "about me")
        const endRect = targetPlaneAnchor.getBoundingClientRect();
        const midX = (endRect.left + endRect.width / 2 - overlayRect.left) * scaleX;
        const midY = (endRect.top + endRect.height / 2 - overlayRect.top) * scaleY;

        const screenW = overlay.offsetWidth;

        // Quỹ đạo: Cất cánh từ slider -> qua "about me" -> bay ra khuất mép phải màn hình -> 
        // vòng qua trên đỉnh -> từ mép trái màn hình lao vào và HẠ CÁNH BẰNG MỘT ĐƯỜNG THẲNG TẮP về đúng điểm 100% của slider.
        return `M ${startX} ${startY}
                C ${startX + (midX - startX) * 0.45} ${startY - overlay.offsetHeight * 0.15},
                  ${midX - 320} ${midY + 75},
                  ${midX} ${midY}
                C ${screenW + 100} ${midY - 150},
                  ${screenW + 100} -100,
                  ${screenW * 0.5} -100
                C -100 -100,
                  -100 ${startY - 150},
                  -100 ${startY}
                L ${startX} ${startY}`;
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

    function positionSvgPlaneAt(distance) {
        if (!svgPlane || !flightPath) return;
        const point = flightPath.getPointAtLength(distance);
        
        const nextDist = Math.min(distance + 2, pathLength);
        const prevDist = Math.max(0, distance - 2);
        const nextPoint = flightPath.getPointAtLength(nextDist);
        const prevPoint = flightPath.getPointAtLength(prevDist);

        const angle = distance < pathLength
            ? Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI)
            : Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);

        svgPlane.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${angle})`);
    }

    if (animatedTrailPath) {
        animatedTrailPath.setAttribute('d', '');
    }

    if (svgPlane) {
        svgPlane.style.opacity = '0';
    }

    requestAnimationFrame(() => {
        initPath();
        updateSliderThumbPosition(0);
    });

    window.addEventListener('resize', () => {
        initPath();
        if (!isFlying) {
            const val = sharkRange ? Number(sharkRange.value) : 0;
            updateSliderThumbPosition(val);
        }
    });

    // 1. Giai đoạn lấy đà trên Slider
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
                if (svgPlane) svgPlane.style.opacity = '0';
                if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');
            } else {
                sharkThumb.style.opacity = '0';
                if (svgPlane) {
                    svgPlane.style.opacity = '1';
                    positionSvgPlaneAt(0);
                }
            }
        });

        // 2 & 3. Thả tay ở 100% -> Cất cánh bay đường thẳng hạ cánh
        ['mouseup', 'touchend', 'change'].forEach(eventType => {
            sharkRange.addEventListener(eventType, () => {
                if (isFlying) return;
                const val = Number(sharkRange.value);

                if (val >= 99 && !isFlying) {
                    isFlying = true;
                    sharkRange.disabled = true;
                    sharkThumb.style.opacity = '0';
                    svgPlane.style.opacity = '1';

                    let currentDist = 0;
                    const flightDuration = 3400; // Tăng thời gian để máy bay thực hiện hành trình bay vòng và hạ cánh đường thẳng mượt mà
                    const startTime = performance.now();

                    function animateFlight(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / flightDuration, 1);
                        
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        currentDist = easeProgress * pathLength;

                        positionSvgPlaneAt(currentDist);
                        updateMovingTrail(currentDist);

                        // Khi máy bay lướt qua khu vực about me (khoảng 15% tiến trình), kích hoạt hiện chữ và nội dung
                        if (progress >= 0.15) {
                            if (handwritingTitle) handwritingTitle.classList.add('show');
                            if (externalAboutContent) externalAboutContent.classList.add('show');
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animateFlight);
                        } else {
                            // 4. Khi bay xong đường thẳng hạ cánh về đích
                            svgPlane.style.opacity = '0'; 
                            if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');
                            if (sharkRange) {
                                sharkRange.value = 0;
                                sharkRange.disabled = false;
                                updateSliderThumbPosition(0);
                                if (sharkThumb) sharkThumb.style.opacity = '1';
                            }
                            isFlying = false;
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
