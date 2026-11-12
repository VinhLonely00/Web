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

    /* --- LOGIC QUỸ ĐẠO MÁY BAY GIẤY MỀM MẠI, THOÁNG ĐÃNG (CÁCH XA CÁC MÉP) --- */
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
    const TRAIL_LENGTH = 380;
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

    /*
     * CHẶNG 1:
     * - Từ slider lướt nhẹ nhàng lên, tạo vòng lặp mềm mại ở khoảng giữa bầu trời
     * - Vươn lượn thoáng đãng cách xa mép phải và cách xa mép trên, bay bổng qua "about me"
     * - Uốn vòm cung lớn ở khoảng giữa khung hình rồi lượn thong thả vòng xuống phía trái
     */
    function getOutboundPathString() {
        const c = getCoordinates();
        if (!c) return '';

        const loopX = c.startX + (c.midX - c.startX) * 0.44;
        const loopY = c.startY + (c.midY - c.startY) * 0.45;

        const rightSafePeakX = c.screenW - 120;
        const topSafeArchY = -80;

        return `M ${c.startX} ${c.startY}
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
    }

    /*
     * CHẶNG 2:
     * - Xuất hiện từ viền trái màn hình, bay thẳng tắp mượt mà về đúng vị trí 100% của slider
     */
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

    /*
     * Xử lý vệt nét đứt: Khi máy bay bay qua khu vực about me (progress > 0.6), 
     * vệt nét đứt được giữ neo cố định lại dưới about me, máy bay tiếp tục bay một mình.
     */
    function updateMovingTrail(currentDistance, progress) {
        if (!animatedTrailPath || !flightPath) return;

        if (currentDistance <= 0) {
            animatedTrailPath.setAttribute('d', '');
            return;
        }

        let startDistance = Math.max(0, currentDistance - TRAIL_LENGTH);
        
        if (progress > 0.6) {
            const fixedAnchorDist = flightPath.getTotalLength() * 0.45;
            startDistance = Math.min(startDistance, fixedAnchorDist);
        }

        const actualLength = currentDistance - startDistance;

        if (actualLength <= 0) {
            animatedTrailPath.setAttribute('d', '');
            return;
        }

        const segments = Math.max(28, Math.ceil(actualLength / 4));
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

    // Kéo Slider lấy đà
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

                // Tự động mờ dần ẩn nội dung "about me" khi kéo lùi về 0%
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

        // Thả tay ở 100% -> Chạy chậm rãi, mượt mà, thoáng đãng
        ['mouseup', 'touchend', 'change'].forEach(eventType => {
            sharkRange.addEventListener(eventType, () => {
                if (isFlying) return;
                const val = Number(sharkRange.value);

                if (val >= 99 && !isFlying) {
                    isFlying = true;
                    sharkRange.disabled = true;
                    sharkThumb.style.opacity = '0';
                    
                    // --- CHẶNG 1 ---
                    setActivePath(getOutboundPathString());
                    svgPlane.style.opacity = '1';

                    const outboundDuration = 8500; // Tốc độ siêu mượt và thong thả
                    const startTime1 = performance.now();
                    let textShown = false;

                    function animateOutbound(currentTime) {
                        const elapsed = currentTime - startTime1;
                        const progress = Math.min(elapsed / outboundDuration, 1);
                        
                        const smoothProgress = progress < 0.5
                            ? 2 * progress * progress
                            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                        const currentDist = smoothProgress * pathLength;

                        positionSvgPlaneAt(currentDist);
                        updateMovingTrail(currentDist, smoothProgress);

                        if (!textShown && smoothProgress >= 0.45) {
                            textShown = true;
                            if (handwritingTitle) handwritingTitle.classList.add('show');
                            if (externalAboutContent) externalAboutContent.classList.add('show');
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animateOutbound);
                        } else {
                            svgPlane.style.opacity = '0';
                            if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');

                            setTimeout(() => {
                                // --- CHẶNG 2 ---
                                setActivePath(getInboundPathString());
                                positionSvgPlaneAt(0);
                                svgPlane.style.opacity = '1';

                                const inboundDuration = 3000; // Hạ cánh thẳng tắp êm ái
                                const startTime2 = performance.now();

                                function animateInbound(time2) {
                                    const elapsed2 = time2 - startTime2;
                                    const progress2 = Math.min(elapsed2 / inboundDuration, 1);
                                    
                                    const easeOut = 1 - Math.pow(1 - progress2, 3);
                                    const currentDist2 = easeOut * pathLength;

                                    positionSvgPlaneAt(currentDist2);
                                    updateMovingTrail(currentDist2, progress2);

                                    if (progress2 < 1) {
                                        requestAnimationFrame(animateInbound);
                                    } else {
                                        svgPlane.style.opacity = '0';
                                        if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');
                                        
                                        if (sharkRange) {
                                            sharkRange.value = 100;
