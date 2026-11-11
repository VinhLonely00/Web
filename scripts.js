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

    /* --- LOGIC KÍCH HOẠT MÁY BAY CẤT CÁNH KHI KÉO HẾT 100% --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const externalAboutContent = document.getElementById('externalAboutContent');
    const sliderTrack = document.getElementById('sliderTrack');

    let pathLength = 0;
    const TAIL_LENGTH = 160; // Độ dài dải nét đứt bám đuôi cố định
    let isLaunched = false;

    // Định nghĩa đường bay lượn từ đúng điểm slider cất cánh chéo sang góc trên bên phải bầu trời (theo ảnh mẫu)
    function updateSvgPath() {
        if (!sliderTrack || !flightPath || !animatedTrailPath) return;

        const trackRect = sliderTrack.getBoundingClientRect();
        // Điểm cất cánh tại cuối thanh slider
        const startX = trackRect.right - 20;
        const startY = trackRect.top + (trackRect.height / 2);

        // Điểm đáp dừng máy bay ở khu vực bầu trời góc trên phải (giống ảnh 2 & 3)
        const endX = window.innerWidth * 0.82;
        const endY = window.innerHeight * 0.18;

        // Điểm uốn lượn mềm mại
        const controlX1 = startX + (endX - startX) * 0.4;
        const controlY1 = startY - 100;
        const controlX2 = startX + (endX - startX) * 0.7;
        const controlY2 = endY + 60;

        const d = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
        flightPath.setAttribute('d', d);
        animatedTrailPath.setAttribute('d', d);

        pathLength = flightPath.getTotalLength();
    }

    updateSvgPath();
    window.addEventListener('resize', updateSvgPath);

    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            if (isLaunched) return;

            const val = e.target.value; // 0 -> 100
            sharkThumb.style.left = val + '%';

            // Khi người dùng kéo hết 100% -> Kích hoạt máy bay cất cánh
            if (val >= 99 && !isLaunched) {
                isLaunched = true;
                sharkThumb.style.opacity = '0'; // Ẩn máy bay trên slider
                startFlightAnimation();
            }
        });
    }

    // Hàm chạy máy bay cất cánh tự động với vệt nét đứt chạy bám đuôi
    function startFlightAnimation() {
        let currentDist = 0;
        const flightDuration = 2200; // Thời gian bay 2.2s
        const startTime = performance.now();

        paperPlane.style.opacity = '1';

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / flightDuration, 1);

            // Chuyển động mượt easeOutQuad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            currentDist = easeProgress * pathLength;

            // 1. Tính tọa độ vị trí máy bay
            const currentPoint = flightPath.getPointAtLength(currentDist);
            paperPlane.style.left = currentPoint.x + 'px';
            paperPlane.style.top = currentPoint.y + 'px';

            // 2. Tự động xoay góc hướng mũi máy bay chuẩn theo quỹ đạo bay
            const nextPoint = flightPath.getPointAtLength(Math.min(currentDist + 2, pathLength));
            const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI);
            paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            // 3. Dải nét đứt có độ dài cố định chạy theo đuôi máy bay
            const dashStart = Math.max(0, currentDist - TAIL_LENGTH);
            const visibleLength = currentDist - dashStart;
            animatedTrailPath.style.strokeDasharray = `${visibleLength} ${pathLength}`;
            animatedTrailPath.style.strokeDashoffset = -dashStart;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Khi chạm đích: Giữ nguyên vệt nét đứt và hiện chữ viết tay + nội dung
                const finalDashStart = Math.max(0, pathLength - TAIL_LENGTH);
                animatedTrailPath.style.strokeDasharray = `${TAIL_LENGTH} ${pathLength}`;
                animatedTrailPath.style.strokeDashoffset = -finalDashStart;

                handwritingTitle.classList.add('show');
                externalAboutContent.classList.add('show');
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
