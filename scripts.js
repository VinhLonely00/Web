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

    /* --- LOGIC CÁ MẬP SLIDER & MÁY BAY GIẤY BAY NGOÀI CARD --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');
    const flightPath = document.getElementById('flightPath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const externalAboutContent = document.getElementById('externalAboutContent');

    const pathLength = flightPath.getTotalLength();
    const TAIL_LENGTH = 180; // Độ dài cố định của dải nét đứt chạy theo đuôi máy bay

    // Khởi tạo trạng thái đường bay ẩn ban đầu
    flightPath.style.strokeDasharray = `${TAIL_LENGTH} ${pathLength}`;
    flightPath.style.strokeDashoffset = pathLength;

    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            const progress = e.target.value / 100; // 0.0 -> 1.0

            // 1. Cập nhật vị trí cá mập há miệng trên slider
            sharkThumb.style.left = (progress * 100) + '%';
            sharkThumb.style.transform = `translateX(-50%) translateY(-2px) scaleX(-1) scale(${1 + progress * 0.2})`;

            if (progress > 0) {
                paperPlane.style.opacity = '1';

                // 2. Tính toán điểm trên đường cong SVG
                const currentPoint = flightPath.getPointAtLength(progress * pathLength);
                
                // Đặt vị trí máy bay
                paperPlane.style.left = currentPoint.x + 'px';
                paperPlane.style.top = currentPoint.y + 'px';

                // Tính góc xoay của máy bay theo tiếp tuyến đường cong
                const nextPoint = flightPath.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));
                const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI);
                paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

                // 3. Dải nét đứt độ dài cố định chạy bám theo đuôi máy bay
                const currentDistance = progress * pathLength;
                flightPath.style.strokeDashoffset = pathLength - currentDistance;
            } else {
                paperPlane.style.opacity = '0';
                flightPath.style.strokeDashoffset = pathLength;
            }

            // 4. Khi đến đích (Slider = 100%)
            if (progress >= 0.99) {
                // Giữ nét đứt dừng lại chuẩn vị trí cuối
                flightPath.style.strokeDasharray = `${pathLength} 0`;
                flightPath.style.strokeDashoffset = 0;

                // Hiển thị chữ "about me" và Nội dung giới thiệu ngoài màn hình
                handwritingTitle.classList.add('show');
                externalAboutContent.classList.add('show');
            } else {
                flightPath.style.strokeDasharray = `${TAIL_LENGTH} ${pathLength}`;
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
