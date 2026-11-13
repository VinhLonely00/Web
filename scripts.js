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

    /* --- LOGIC QUỸ ĐẠO MÁY BAY & GẠCH CHÂN DƯỚI ABOUT ME --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const svgPlane = document.getElementById('svgPlane');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');
    const staticUnderlinePath = document.getElementById('staticUnderlinePath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const externalAboutContent = document.getElementById('externalAboutContent');
    const customSliderTrack = document.getElementById('sliderTrack');

    let pathLength = 0;
    let aboutMeDistance = 0; 
    const TRAIL_LENGTH = 280; 
    let isFlying = false;

    if (animatedTrailPath) {
        animatedTrailPath.style.transition = 'opacity 0.4s ease-in-out';
        animatedTrailPath.style.opacity = '1';
    }

    function updateSliderThumbPosition(val) {
        if (!customSliderTrack || !sharkThumb) return;
        const trackWidth = customSliderTrack.offsetWidth;
        const thumbPos = (val / 100) * trackWidth;
        sharkThumb.style.left = thumbPos + 'px';
    }

    function getCoordinates() {
        const overlay = document.getElementById('airplaneOverlay');
        const targetPlaneAnchor = document.getElementById('targetPlaneAnchor');
        if (!overlay || !customSliderTrack || !targetPlaneAnchor) return null;

        const overlayRect = overlay.getBoundingClientRect();
        const scaleX = overlay.offsetWidth / overlayRect.width;
        const scaleY = overlay.offsetHeight / overlayRect.height;

        const trackRect = customSliderTrack.getBoundingClientRect();
        const startX = (trackRect.right - overlayRect.left) * scaleX;
        const startY = (trackRect.top + trackRect.height / 2 - overlayRect.top) * scaleY;

        // Tạm bật title để lấy chính xác tọa độ gạch chân dưới chữ about me
        const wasShown = handwritingTitle.classList.contains('show');
        if (!wasShown) handwritingTitle.classList.add('show');
        
        const titleRect = handwritingTitle.getBoundingClientRect();
        const midX = (titleRect.left + titleRect.width * 0.5 - overlayRect.left) * scaleX;
        const midY = (titleRect.bottom - 2 - overlayRect.top) * scaleY;

        if (!wasShown) handwritingTitle.classList.remove('show');

        const screenW = overlay.offsetWidth;
        const screenH = overlay.offsetHeight;

        return { startX, startY, midX, midY, screenW, screenH };
    }

    function setupOutboundPath() {
        const c = getCoordinates();
        if (!c || !flightPath) return;

        const loopX = c.startX + (c.midX - c.startX) * 0.44;
        const loopY = c.startY + (c.midY - c.startY) * 0.45;
        const rightSafePeakX = c.screenW - 120;
        const topSafeArchY = -80;

        const fullPath = `M ${c.startX} ${c.startY}
                          C ${loopX - 70} ${c.startY - 50},
                            ${loopX + 180} ${loopY + 110},
                            ${loopX + 100} ${loopY - 50}
                          C ${loopX + 50} ${loopY - 170},
                            ${loopX - 130} ${loopY - 100},
                            ${loopX - 40} ${loopY + 40}
                          C ${loopX + 40} ${loopY + 160},
                            ${c.midX - 220} ${c.midY + 80},
                            ${c.midX} ${c.midY}
                          C ${c.midX + 220} ${c.midY - 50},
                            ${rightSafePeakX} ${c.midY - 180},
                            ${c.screenW * 0.45} ${topSafeArchY}
                          C ${c.screenW * 0.15} ${topSafeArchY},
                            100 80,
                            -250 380`;

        flightPath.setAttribute('d', fullPath);
        pathLength = flightPath.getTotalLength();
        aboutMeDistance = pathLength * 0.55;

        // Định hình đoạn gạch chân tĩnh nằm ngay dưới about me khớp với quỹ đạo
        if (staticUnderlinePath) {
            let underlineD = '';
            const startDist = Math.max(0, aboutMeDistance - 140);
            const endDist = Math.min(pathLength, aboutMeDistance + 140);
            const segs = 20;
            for (let i = 0; i <= segs; i++) {
                const pt = flightPath.getPointAtLength(startDist + (endDist - startDist) * (i / segs));
                underlineD += `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y} `;
            }
            staticUnderlinePath.setAttribute('d', underlineD);
        }
    }

    function getInboundPathString() {
        const c = getCoordinates();
        if (!c) return '';
        return `M -250 ${c.startY} L ${c.startX} ${c.startY}`;
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

        let d = '';
        const segments = Math.max(25, Math.ceil(actualLength / 4));
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
        animatedTrailPath.style.opacity = '1';
    }
    if (staticUnderlinePath) staticUnderlinePath.style.opacity = '0';
    if (svgPlane) svgPlane.style.opacity = '0';

    requestAnimationFrame(() => {
        setupOutboundPath();
        updateSliderThumbPosition(0);
    });

    window.addEventListener('resize', () => {
        if (!isFlying) {
            setupOutboundPath();
            const val = sharkRange ? Number(sharkRange.value) : 0;
            updateSliderThumbPosition(val);
        }
    });

    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            if (isFlying) return;

            const val = Number(e.target.value);
            updateSliderThumbPosition(val);
            setupOutboundPath();

            if (val < 99) {
                sharkThumb.style.opacity = '1';
                if (svgPlane) svgPlane.style.opacity = '0';
                if (animatedTrailPath) {
                    animatedTrailPath.setAttribute('d', '');
                    animatedTrailPath.style.opacity = '1';
                }
                if (staticUnderlinePath) staticUnderlinePath.style.opacity = '0';

                if (handwritingTitle) handwritingTitle.classList.remove('show');
                if (externalAboutContent) externalAboutContent.classList.remove('show');
            } else {
                sharkThumb.style.opacity = '0';
                if (svgPlane) {
                    svgPlane.style.opacity = '1';
                    positionSvgPlaneAt(0);
                }
            }
        });

        ['mouseup', 'touchend', 'change'].forEach(eventType => {
            sharkRange.addEventListener(eventType, () => {
                if (isFlying) return;
                const val = Number(sharkRange.value);

                if (val >= 99 && !isFlying) {
                    isFlying = true;
                    sharkRange.disabled = true;
                    sharkThumb.style.opacity = '0';
                    
                    setupOutboundPath();
                    svgPlane.style.opacity = '1';
                    if (animatedTrailPath) animatedTrailPath.style.opacity = '1';

                    const outboundDuration = 8500;
                    const startTime1 = performance.now();
                    let triggeredShow = false;
                    let trailFaded = false;

                    function animateOutbound(currentTime) {
                        const elapsed = currentTime - startTime1;
                        const progress = Math.min(elapsed / outboundDuration, 1);
                        
                        const smoothProgress = progress < 0.5
                            ? 2 * progress * progress
                            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                        const currentDist = smoothProgress * pathLength;

                        positionSvgPlaneAt(currentDist);
                        updateMovingTrail(currentDist);

                        // Khi máy bay bay tới gần: hiện gạch chân tĩnh và chữ about me cùng lúc
                        if (!triggeredShow && currentDist >= aboutMeDistance * 0.9) {
                            triggeredShow = true;
                            if (staticUnderlinePath) staticUnderlinePath.style.opacity = '1';
                            if (handwritingTitle) handwritingTitle.classList.add('show');
                            if (externalAboutContent) externalAboutContent.classList.add('show');
                        }

                        // Khi máy bay đi qua khỏi about me một đoạn: đuôi nét đứt bám theo máy bay mờ dần biến mất
                        if (!trailFaded && currentDist >= aboutMeDistance + 120) {
                            trailFaded = true;
                            if (animatedTrailPath) {
                                animatedTrailPath.style.opacity = '0';
                                setTimeout(() => {
                                    animatedTrailPath.setAttribute('d', '');
                                }, 400);
                            }
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animateOutbound);
                        } else {
                            svgPlane.style.opacity = '0';

                            setTimeout(() => {
                                setActivePath(getInboundPathString());
                                positionSvgPlaneAt(0);
                                svgPlane.style.opacity = '1';

                                const inboundDuration = 3000;
                                const startTime2 = performance.now();

                                function animateInbound(time2) {
                                    const elapsed2 = time2 - startTime2;
                                    const progress2 = Math.min(elapsed2 / inboundDuration, 1);
                                    
                                    const easeOut = 1 - Math.pow(1 - progress2, 3);
                                    const currentDist2 = easeOut * pathLength;

                                    positionSvgPlaneAt(currentDist2);

                                    if (progress2 < 1) {
                                        requestAnimationFrame(animateInbound);
                                    } else {
                                        svgPlane.style.opacity = '0';
                                        
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
                            }, 700);
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
