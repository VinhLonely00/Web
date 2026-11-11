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

    /* --- LOGIC ĐƯỜNG BAY CẤT CÁNH CHUẨN QUỸ ĐẠO --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const targetPlaneIcon = document.getElementById('targetPlaneIcon');
    const externalAboutContent = document.getElementById('externalAboutContent');
    const customSliderTrack = document.getElementById('sliderTrack');
    const flightSvg = document.getElementById('flightSvg');

    let pathLength = 0;
    let isLaunched = false;
    const ZOOM_FACTOR = 0.5;

    function updateSliderThumbPosition(val) {
        if (!customSliderTrack || !sharkThumb) return;
        const trackWidth = customSliderTrack.offsetWidth;
        const thumbPos = (val / 100) * trackWidth;
        sharkThumb.style.left = thumbPos + 'px';
    }

    // Tính toán tọa độ xuất phát chính xác từ nút kéo và điểm đích tại icon góc phải
    function getPathString() {
        if (!customSliderTrack || !sharkThumb || !targetPlaneIcon || !flightSvg) return "";

        const svgRect = flightSvg.getBoundingClientRect();
        const thumbRect = sharkThumb.getBoundingClientRect();
        const targetRect = targetPlaneIcon.getBoundingClientRect();

        // Quy đổi tọa độ chính xác theo không gian SVG container
        const startX = ((thumbRect.left + thumbRect.width / 2) - svgRect.left) / ZOOM_FACTOR;
        const startY = ((thumbRect.top + thumbRect.height / 2) - svgRect.top) / ZOOM_FACTOR;

        const endX = ((targetRect.left + targetRect.width / 2) - svgRect.left) / ZOOM_FACTOR;
        const endY = ((targetRect.top + targetRect.height / 2) - svgRect.top) / ZOOM_FACTOR;

        // Điểm điều khiển (Control points) giúp đường cong uốn lượn bầu trời hệt như mẫu
        const controlX1 = startX + (endX - startX) * 0.35;
        const controlY1 = Math.min(startY, endY) - 220;
        const controlX2 = startX + (endX - startX) * 0.65;
        const controlY2 = endY + 60;

        return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    }

    updateSliderThumbPosition(0);

    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            if (isLaunched) return;

            const val = e.target.value;
            updateSliderThumbPosition(val);

            // Khi kéo thanh trượt đạt ngưỡng >= 98% -> Cất cánh
            if (val >= 98 && !isLaunched) {
                isLaunched = true;
                
                const finalD = getPathString();
                flightPath.setAttribute('d', finalD);
                if (animatedTrailPath) {
                    animatedTrailPath.setAttribute('d', finalD);
                }
                pathLength = flightPath.getTotalLength();

                if (animatedTrailPath) {
                    animatedTrailPath.style.strokeDasharray = `6, 6`;
                    animatedTrailPath.style.strokeDashoffset = pathLength;
                }

                sharkThumb.style.opacity = '0'; // Ẩn nút kéo slider
                startFlightAnimation();
            }
        });
    }

    function startFlightAnimation() {
        const flightDuration = 2200; // Thời gian bay 2.2 giây
        const startTime = performance.now();

        paperPlane.style.opacity = '1';

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / flightDuration, 1);

            // Chuyển động mượt mà (Ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            const currentDist = easeProgress * pathLength;

            // 1. Cập nhật tọa độ máy bay giấy di chuyển dẫn đầu
            const currentPoint = flightPath.getPointAtLength(currentDist);
            paperPlane.style.left = (currentPoint.x * ZOOM_FACTOR) + 'px';
            paperPlane.style.top = (currentPoint.y * ZOOM_FACTOR) + 'px';

            // 2. Góc xoay mũi máy bay hướng theo tiếp tuyến quỹ đạo
            const nextPoint = flightPath.getPointAtLength(Math.min(currentDist + 2, pathLength));
            const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI);
            paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle + 45}deg)`;

            // 3. Đường nét đứt bám theo sau đuôi máy bay (nếu có sử dụng)
            if (animatedTrailPath) {
                animatedTrailPath.style.strokeDashoffset = pathLength - currentDist;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Khi đến đích: Ẩn máy bay, hiện chữ viết tay và nội dung bên dưới
                paperPlane.style.opacity = '0';
                if (handwritingTitle) handwritingTitle.classList.add('show');
                if (targetPlaneIcon) targetPlaneIcon.classList.add('show');
                if (externalAboutContent) externalAboutContent.classList.add('show');
            }
        }

        requestAnimationFrame(animate);
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
