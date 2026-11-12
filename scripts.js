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

    /* --- LOGIC ĐƯỜNG BAY 2 CHẶNG (LƯỢN TỪ TRÁI VÀO & HẠ CÁNH THẲNG) --- */
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

    function getCoordinates() {
        const overlay = document.getElementById('airplaneOverlay');
        if (!overlay || !customSliderTrack || !targetPlaneAnchor) return null;

        const overlayRect = overlay.getBoundingClientRect();
        const scaleX = overlay.offsetWidth / overlayRect.width;
        const scaleY = overlay.offsetHeight / overlayRect.height;

        const trackRect = customSliderTrack.getBoundingClientRect();
        const startX = (trackRect.right - overlayRect.left) * scaleX;
        const startY = (trackRect.top + trackRect.height / 2 - overlayRect.top) * scaleY;

        const endRect = targetPlaneAnchor.getBoundingClientRect();
        const midX = (endRect.left + endRect.width / 2 - overlayRect.left) * scaleX;
        const midY = (endRect.top + endRect.height / 2 - overlayRect.top) * scaleY;

        const screenW = overlay.offsetWidth;
        const screenH = overlay.offsetHeight;

        return { startX, startY, midX, midY, screenW, screenH };
    }

    // Chặng 1: Bay từ slider -> qua about me -> vút mất hút ra ngoài mép phải màn hình
    function getOutboundPathString() {
        const c = getCoordinates();
        if (!c) return '';

        return `M ${c.startX} ${c.startY}
                C ${c.startX + (c.midX - c.startX) * 0.45} ${c.startY - c.screenH * 0.15},
                  ${c.midX - 320} ${c.midY + 75},
                  ${c.midX} ${c.midY}
                S ${c.screenW + 250} ${c.midY - 120},
                  ${c.screenW + 400} ${c.midY - 220}`;
    }

    // Chặng 2: Lượn từ góc trên bên trái -> ẩn ra viền trái -> bay thẳng tắp hạ cánh vào slider
    function getInboundPathString() {
        const c = getCoordinates();
        if (!c) return '';

        return `M -100 -100
                Q 50 ${c.screenH * 0.3}, -150 ${c.startY - 100}
                L ${c.startX} ${c.startY}`;
    }

    function setActivePath(pathString) {
        if (!flightPath || !pathString) return;
        flightPath.setAttribute('d', pathString);
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

    if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');
    if (svgPlane) svgPlane.style.opacity = '0';

    requestAnimationFrame(() => {
        setActivePath(getOutboundPathString());
        updateSliderThumbPosition(0);
    });

    window.addEventListener('resize', () => {
        if (!isFlying) {
            setActivePath(getOutboundPathString());
            const val = sharkRange ? Number(sharkRange.value) : 0;
            updateSliderThumbPosition(val);
        }
    });

    // 1. Kéo Slider lấy đà
    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            if (isFlying) return;

            const val = Number(e.target.value);
            updateSliderThumbPosition(val);
            setActivePath(getOutboundPathString());

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

        // 2. Thả tay ở 100% -> Chạy Chặng 1 -> Chờ 3s -> Chạy Chặng 2 lượn vòng & hạ cánh thẳng tắp
        ['mouseup', 'touchend', 'change'].forEach(eventType => {
            sharkRange.addEventListener(eventType, () => {
                if (isFlying) return;
                const val = Number(sharkRange.value);

                if (val >= 99 && !isFlying) {
                    isFlying = true;
                    sharkRange.disabled = true;
                    sharkThumb.style.opacity = '0';
                    
                    // --- CHẶNG 1: BAY MẤT HÚT SANG PHẢI ---
                    setActivePath(getOutboundPathString());
                    svgPlane.style.opacity = '1';

                    const outboundDuration = 1800;
                    const startTime1 = performance.now();

                    function animateOutbound(currentTime) {
                        const elapsed = currentTime - startTime1;
                        const progress = Math.min(elapsed / outboundDuration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 2.5);
                        const currentDist = easeProgress * pathLength;

                        positionSvgPlaneAt(currentDist);
                        updateMovingTrail(currentDist);

                        if (progress >= 0.35) {
                            if (handwritingTitle) handwritingTitle.classList.add('show');
                            if (externalAboutContent) externalAboutContent.classList.add('show');
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animateOutbound);
                        } else {
                            // Bay khuất hẳn -> Ẩn máy bay và vệt đuôi
                            svgPlane.style.opacity = '0';
                            if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');

                            // --- CHỜ ĐÚNG 3 GIÂY ---
                            setTimeout(() => {
                                // --- CHẶNG 2: LƯỢN TỪ TRÁI VÀO & HẠ CÁNH THẲNG ---
                                setActivePath(getInboundPathString());
                                positionSvgPlaneAt(0);
                                svgPlane.style.opacity = '1';

                                const inboundDuration = 2000;
                                const startTime2 = performance.now();

                                function animateInbound(time2) {
                                    const elapsed2 = time2 - startTime2;
                                    const progress2 = Math.min(elapsed2 / inboundDuration, 1);
                                    const easeOut = 1 - Math.pow(1 - progress2, 3);
                                    const currentDist2 = easeOut * pathLength;

                                    positionSvgPlaneAt(currentDist2);
                                    updateMovingTrail(currentDist2);

                                    if (progress2 < 1) {
                                        requestAnimationFrame(animateInbound);
                                    } else {
                                        // Hoàn tất hạ cánh
                                        svgPlane.style.opacity = '0';
                                        if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');
                                        
                                        if (sharkRange) {
                                            sharkRange.value = 100;
                                            updateSliderThumbPosition(100);
                                            sharkRange.disabled = false;
                                        }
                                        if (sharkThumb) {
                                            sharkThumb.style.opacity = '1';
                                        }
                                        isFlying = false;
                                    }
                                }

                                requestAnimationFrame(animateInbound);
                            }, 3000);
                        }
                    }

                    requestAnimationFrame(animateOutbound);
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
