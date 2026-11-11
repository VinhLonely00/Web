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

    /* --- LOGIC ĐƯỜNG BAY & KÉO NGƯỢC --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');
    const handwritingTitle = document.getElementById('handwritingTitle');
    const targetPlaneIcon = document.getElementById('targetPlaneIcon');
    const externalAboutContent = document.getElementById('externalAboutContent');
    const customSliderTrack = document.getElementById('sliderTrack');
    const airplaneOverlay = document.getElementById('airplaneOverlay');

    let pathLength = 0;

    function updateSliderThumbPosition(val) {
        if (!customSliderTrack || !sharkThumb) return;
        const trackWidth = customSliderTrack.offsetWidth;
        const thumbPos = (val / 100) * trackWidth;
        sharkThumb.style.left = thumbPos + 'px';
    }

    // Hàm lấy tọa độ quỹ đạo chuẩn xác dựa trên bounding rect của overlay và các phần tử
    function getPathString() {
        if (!airplaneOverlay || !sharkThumb || !targetPlaneIcon) return '';

        const overlayRect = airplaneOverlay.getBoundingClientRect();
        const startRect = sharkThumb.getBoundingClientRect();
        const endRect = targetPlaneIcon.getBoundingClientRect();

        // Tọa độ tâm máy bay xuất phát quy về hệ quy chiếu overlay
        const startX = startRect.left + startRect.width / 2 - overlayRect.left;
        const startY = startRect.top + startRect.height / 2 - overlayRect.top;

        // Tọa độ tâm máy bay đích ở góc phải quy về hệ quy chiếu overlay
        const endX = endRect.left + endRect.width / 2 - overlayRect.left;
        const endY = endRect.top + endRect.height / 2 - overlayRect.top;

        // Tạo đường cong bay mềm mại uốn lượn phía trên
        const distanceX = endX - startX;
        const controlX1 = startX + distanceX * 0.35;
        const controlY1 = startY - overlayRect.height * 0.36;
        const controlX2 = startX + distanceX * 0.65;
        const controlY2 = endY - overlayRect.height * 0.25;

        return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    }

    function initPath() {
        if (!flightPath) return;
        const d = getPathString();
        if (!d) return;

        flightPath.setAttribute('d', d);
        if (animatedTrailPath) {
            animatedTrailPath.setAttribute('d', d);
        }
        pathLength = flightPath.getTotalLength();
        if (animatedTrailPath) {
            animatedTrailPath.style.strokeDasharray = `${pathLength}`;
            animatedTrailPath.style.strokeDashoffset = pathLength;
        }
    }

    // Đợi DOM render hoàn tất rồi mới khởi tạo tọa độ tránh lệch DOM
    requestAnimationFrame(() => {
        initPath();
        updateSliderThumbPosition(0);
    });

    window.addEventListener('resize', () => {
        initPath();
        const val = sharkRange ? parseFloat(sharkRange.value) : 0;
        updateSliderThumbPosition(val);
    });

    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value); // Giá trị từ 0 đến 100
            updateSliderThumbPosition(val);

            if (!pathLength) {
                initPath();
            }

            const currentDist = (val / 100) * pathLength;

            if (val > 0) {
                paperPlane.style.opacity = '1';
                // Ẩn nút kéo khi chạm đến gần cuối, hiện lại khi kéo ngược về
                sharkThumb.style.opacity = val >= 99 ? '0' : '1';

                // 1. Cập nhật vị trí máy bay giấy di chuyển theo thời gian thực (hỗ trợ cả tiến và lùi)
                const currentPoint = flightPath.getPointAtLength(currentDist);
                paperPlane.style.left = currentPoint.x + 'px';
                paperPlane.style.top = currentPoint.y + 'px';

                // 2. Góc xoay mũi máy bay hướng theo tiếp tuyến quỹ đạo
                const nextPoint = flightPath.getPointAtLength(Math.min(currentDist + 2, pathLength));
                const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI);
                paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle + 45}deg)`;

                // 3. Hiệu ứng nét đứt bám theo sau đuôi máy bay
                if (animatedTrailPath) {
                    animatedTrailPath.style.strokeDasharray = `${pathLength}`;
                    animatedTrailPath.style.strokeDashoffset = pathLength - currentDist;
                }

                // Hiển thị nội dung góc phải khi kéo tới gần đích, ẩn đi khi kéo ngược về
                if (val >= 98) {
                    if (handwritingTitle) handwritingTitle.classList.add('show');
                    if (targetPlaneIcon) targetPlaneIcon.classList.add('show');
                    if (externalAboutContent) externalAboutContent.classList.add('show');
                } else {
                    if (handwritingTitle) handwritingTitle.classList.remove('show');
                    if (targetPlaneIcon) targetPlaneIcon.classList.remove('show');
                    if (externalAboutContent) externalAboutContent.classList.remove('show');
                }
            } else {
                // Khi kéo về 0: Reset hoàn toàn trạng thái ban đầu
                paperPlane.style.opacity = '0';
                sharkThumb.style.opacity = '1';
                if (animatedTrailPath) {
                    animatedTrailPath.style.strokeDashoffset = pathLength;
                }
                if (handwritingTitle) handwritingTitle.classList.remove('show');
                if (targetPlaneIcon) targetPlaneIcon.classList.remove('show');
                if (externalAboutContent) externalAboutContent.classList.remove('show');
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
