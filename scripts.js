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

    /* --- LOGIC SLIDER & ĐƯỜNG BAY MÁY BAY GIẤY (ĐOẠN NÉM ĐỨT CỐ ĐỊNH BÁM ĐUÔI) --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const externalAboutContent = document.getElementById('externalAboutContent');
    const sliderTrack = document.getElementById('sliderTrack');

    let pathLength = 0;
    const TAIL_LENGTH = 150; // Độ dài cố định của dải nét đứt bám đuôi máy bay

    // Cập nhật tọa độ quỹ đạo cong uốn lượn từ Slider lên góc trên phải màn hình
    function updateSvgPath() {
        if (!sliderTrack || !flightPath || !animatedTrailPath) return;

        const trackRect = sliderTrack.getBoundingClientRect();
        const startX = trackRect.left + 20;
        const startY = trackRect.top + (trackRect.height / 2);

        const endX = window.innerWidth * 0.78;
        const endY = window.innerHeight * 0.18;

        const controlX1 = startX + (endX - startX) * 0.3;
        const controlY1 = startY - 140;
        const controlX2 = startX + (endX - startX) * 0.7;
        const controlY2 = endY + 90;

        const d = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
        flightPath.setAttribute('d', d);
        animatedTrailPath.setAttribute('d', d);

        pathLength = flightPath.getTotalLength();
    }

    updateSvgPath();
    window.addEventListener('resize', updateSvgPath);

    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            const progress = e.target.value / 100; // 0.0 -> 1.0

            // 1. Cập nhật vị trí icon máy bay nhỏ trên thanh Slider
            sharkThumb.style.left = (progress * 100) + '%';

            // Khi kéo đầy 100%, ẩn icon máy bay trên slider đi (nhưng thanh giữ nguyên đầy)
            if (progress >= 0.99) {
                sharkThumb.style.opacity = '0';
            } else {
                sharkThumb.style.opacity = '1';
            }

            if (progress > 0) {
                paperPlane.style.opacity = '1';

                // 2. Tính vị trí máy bay lớn chạy dọc theo đường cong SVG
                const currentDistance = progress * pathLength;
                const currentPoint = flightPath.getPointAtLength(currentDistance);
                paperPlane.style.left = currentPoint.x + 'px';
                paperPlane.style.top = currentPoint.y + 'px';

                // Góc xoay máy bay theo tiếp tuyến hướng bay
                const nextPoint = flightPath.getPointAtLength(Math.min(currentDistance + 2, pathLength));
                const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI);
                paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

                // 3. TẠO DẢI NÉT ĐỨT CÓ ĐỘ DÀI CỐ ĐỊNH BÁM ĐUÔI MÁY BAY:
                // Đoạn hiển thị nét đứt bắt đầu từ (currentDistance - TAIL_LENGTH) đến currentDistance
                const dashStart = Math.max(0, currentDistance - TAIL_LENGTH);
                const visibleLength = currentDistance - dashStart;

                // Sử dụng stroke-dasharray kết hợp stroke-dashoffset để cô lập đúng một đoạn nét đứt chạy theo đuôi
                animatedTrailPath.style.strokeDasharray = `${visibleLength} ${pathLength}`;
                animatedTrailPath.style.strokeDashoffset = -dashStart;
            } else {
                paperPlane.style.opacity = '0';
                animatedTrailPath.style.strokeDasharray = `0 ${pathLength}`;
            }

            // 4. Khi kéo đến đích (100%)
            if (progress >= 0.99) {
                // Giữ nguyên đoạn nét đứt dài cố định hoàn chỉnh ở cuối quỹ đạo
                const dashStart = Math.max(0, pathLength - TAIL_LENGTH);
                animatedTrailPath.style.strokeDasharray = `${TAIL_LENGTH} ${pathLength}`;
                animatedTrailPath.style.strokeDashoffset = -dashStart;

                handwritingTitle.classList.add('show');
                externalAboutContent.classList.add('show');
            } else {
                handwritingTitle.classList.remove('show');
                externalAboutContent.classList.remove('show');
            }
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
