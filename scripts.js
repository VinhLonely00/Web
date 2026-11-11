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

    /* --- LOGIC ĐƯỜNG BAY CẤT CÁNH CHUẨN XÁC --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const externalAboutContent = document.getElementById('externalAboutContent');
    const customSliderTrack = document.getElementById('sliderTrack');

    let pathLength = 0;
    let isLaunched = false;
    const ZOOM_FACTOR = 0.5;

    function updateSvgPath() {
        if (!customSliderTrack || !flightPath || !animatedTrailPath || !sharkThumb) return;

        // Tọa độ nút kéo hiện tại trên slider
        const thumbRect = sharkThumb.getBoundingClientRect();
        const startX = (thumbRect.left + thumbRect.width / 2) / ZOOM_FACTOR;
        const startY = (thumbRect.top + thumbRect.height / 2) / ZOOM_FACTOR;

        // Tọa độ đích đến (Chữ "about me" ở góc phải)
        const handwritingEl = document.getElementById('handwritingTitle');
        const hRect = handwritingEl.getBoundingClientRect();
        const endX = (hRect.left + 40) / ZOOM_FACTOR;
        const endY = (hRect.top + hRect.height / 2) / ZOOM_FACTOR;

        // Quỹ đạo uốn lượn hình cánh cung bay lên bầu trời
        const controlX1 = startX + (endX - startX) * 0.35;
        const controlY1 = startY - 220;
        const controlX2 = startX + (endX - startX) * 0.75;
        const controlY2 = endY + 60;

        const d = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
        flightPath.setAttribute('d', d);
        animatedTrailPath.setAttribute('d', d);

        pathLength = flightPath.getTotalLength();
        
        // Mặc định ẩn hoàn toàn nét đứt trước khi cất cánh
        if (!isLaunched) {
            animatedTrailPath.style.strokeDasharray = `0, ${pathLength}`;
        }
    }

    // Khởi tạo tọa độ ban đầu
    setTimeout(updateSvgPath, 100);
    window.addEventListener('resize', updateSvgPath);

    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            if (isLaunched) return; // Nếu đã cất cánh thì không nhận sự kiện kéo nữa

            const val = e.target.value; // 0 -> 100

            // Cập nhật vị trí nút kéo trên thanh slider
            const trackWidth = customSliderTrack.offsetWidth;
            const thumbPos = (val / 100) * trackWidth;
            sharkThumb.style.left = thumbPos + 'px';

            // Cập nhật tọa độ đường bay theo nút kéo
            updateSvgPath();

            // Khi người dùng kéo chạm mốc 99-100% -> Kích hoạt máy bay cất cánh
            if (val >= 99 && !isLaunched) {
                isLaunched = true;
                sharkThumb.style.opacity = '0'; // Ẩn nút kéo trên slider
                startFlightAnimation();
            }
        });
    }

    function startFlightAnimation() {
        let currentDist = 0;
        const flightDuration = 2200; // Thời gian bay (2.2 giây)
        const startTime = performance.now();

        paperPlane.style.opacity = '1'; // Hiển thị máy bay cất cánh

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / flightDuration, 1);

            const easeProgress = 1 - (1 - progress) * (1 - progress);
            currentDist = easeProgress * pathLength;

            // 1. Cập nhật vị trí của máy bay theo đường cong Bezier
            const currentPoint = flightPath.getPointAtLength(currentDist);
            paperPlane.style.left = (currentPoint.x * ZOOM_FACTOR) + 'px';
            paperPlane.style.top = (currentPoint.y * ZOOM_FACTOR) + 'px';

            // 2. Góc xoay mũi máy bay hướng chuẩn theo quỹ đạo bay
            const nextPoint = flightPath.getPointAtLength(Math.min(currentDist + 2, pathLength));
            const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI);
            paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle + 45}deg)`;

            // 3. Dải nét đứt bám theo sát đuôi máy bay từ điểm xuất phát đến vị trí hiện tại
            animatedTrailPath.style.strokeDasharray = `${currentDist}, ${pathLength}`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Khi máy bay bay đến đích hoàn toàn:
                paperPlane.style.opacity = '0'; // Ẩn máy bay cất cánh
                handwritingTitle.classList.add('show'); // Hiện chữ viết tay "about me"
                externalAboutContent.classList.add('show'); // Hiện khung nội dung bên dưới
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
