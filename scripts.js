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

    /* --- LOGIC ĐƯỜNG BAY & VỆT ĐUÔI ĐỘNG (2 CHIỀU) --- */
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
    const TRAIL_LENGTH = 125; // Chiều dài cố định của vệt đuôi nét đứt

    function updateSliderThumbPosition(val) {
        if (!customSliderTrack || !sharkThumb) return;
        const trackWidth = customSliderTrack.offsetWidth;
        const thumbPos = (val / 100) * trackWidth;
        sharkThumb.style.left = thumbPos + 'px';
    }

    // 1. HÀM GETPATHSTRING DÙNG SVG MATRIX CHUẨN XÁC TUYỆT ĐỐI
    function getPathString() {
        if (!flightSvg || !sharkThumb || !targetPlaneIcon) return '';

        const startRect = sharkThumb.getBoundingClientRect();
        const endRect = targetPlaneIcon.getBoundingClientRect();

        // Chuyển tọa độ màn hình sang hệ tọa độ SVG
        const matrix = flightSvg.getScreenCTM();
        if (!matrix) return '';

        const inverseMatrix = matrix.inverse();

        function convertPoint(x, y) {
            const point = flightSvg.createSVGPoint();
            point.x = x;
            point.y = y;
            return point.matrixTransform(inverseMatrix);
        }

        // Tâm điểm xuất phát
        const start = convertPoint(
            startRect.left + startRect.width / 2,
            startRect.top + startRect.height / 2
        );

        // Tâm icon About Me
        const end = convertPoint(
            endRect.left + endRect.width / 2,
            endRect.top + endRect.height / 2
        );

        const dx = end.x - start.x;

        // Tạo quỹ đạo cong
        const lift = flightSvg.clientHeight * 0.25;

        const cp1x = start.x + dx * 0.3;
        const cp1y = start.y - lift;

        const cp2x = start.x + dx * 0.7;
        const cp2y = end.y - lift * 0.5;

        return `M ${start.x} ${start.y}
                C ${cp1x} ${cp1y},
                  ${cp2x} ${cp2y},
                  ${end.x} ${end.y}`;
    }

    // Khởi tạo quỹ đạo
    function initPath() {
        if (!flightPath) return;

        const d = getPathString();
        if (!d) return;

        flightPath.setAttribute('d', d);
        pathLength = flightPath.getTotalLength();
    }

    // Tạo vệt nét đứt động có chiều dài cố định chạy theo sau đuôi máy bay
    function updateMovingTrail(distance) {
        if (!animatedTrailPath || !flightPath || distance <= 0) {
            if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');
            return;
        }

        const startDistance = Math.max(0, distance - TRAIL_LENGTH);
        const actualLength = distance - startDistance;

        if (actualLength <= 0) {
            animatedTrailPath.setAttribute('d', '');
            return;
        }

        const segments = Math.max(12, Math.ceil(actualLength / 5));
        let d = '';

        for (let i = 0; i <= segments; i++) {
            const sampleDistance = startDistance + (actualLength * i / segments);
            const point = flightPath.getPointAtLength(sampleDistance);
            d += `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y} `;
        }

        animatedTrailPath.setAttribute('d', d);
    }

    // Khởi tạo trạng thái ban đầu cho vệt đuôi
    if (animatedTrailPath) {
        animatedTrailPath.setAttribute('d', '');
    }

    // Đợi DOM render xong mới tính tọa độ
    requestAnimationFrame(() => {
        initPath();
        updateSliderThumbPosition(0);
    });

    window.addEventListener('resize', () => {
        initPath();
        const val = sharkRange ? Number(sharkRange.value) : 0;
        updateSliderThumbPosition(val);
    });

    // Lắng nghe sự kiện kéo slider (hỗ trợ cả kéo tiến và kéo ngược)
    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            const val = Number(e.target.value); // 0 -> 100
            updateSliderThumbPosition(val);

            if (!pathLength) {
                initPath();
            }

            const currentDistance = (val / 100) * pathLength;

            if (val > 0) {
                paperPlane.style.opacity = '1';
                
                // Kiểm tra phần kết thúc animation (khi gần chạm 100%)
                if (val >= 99) {
                    sharkThumb.style.opacity = '0';
                    paperPlane.style.opacity = '1'; // Giữ máy bay tại đích để kiểm tra trùng tâm
                } else {
                    sharkThumb.style.opacity = '1';
                }

                // 1. Cập nhật vị trí máy bay
                const currentPoint = flightPath.getPointAtLength(currentDistance);
                paperPlane.style.left = currentPoint.x + 'px';
                paperPlane.style.top = currentPoint.y + 'px';

                // 2. Xác định góc xoay mũi máy bay hướng theo tiếp tuyến quỹ đạo
                const nextDistance = Math.min(currentDistance + 2, pathLength);
                const nextPoint = flightPath.getPointAtLength(nextDistance);
                const previousPoint = flightPath.getPointAtLength(Math.max(0, currentDistance - 2));

                const angle = currentDistance < pathLength
                    ? Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI)
                    : Math.atan2(currentPoint.y - previousPoint.y, currentPoint.x - previousPoint.x) * (180 / Math.PI);

                paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle + 45}deg)`;

                // 3. Cập nhật dải nét đứt bám theo sau đuôi máy bay
                updateMovingTrail(currentDistance);

                // Hiển thị nội dung góc phải khi kéo đến gần cuối, ẩn đi khi kéo ngược về
                if (val >= 98) {
                    if (targetPlaneIcon) targetPlaneIcon.classList.add('show');
                    if (handwritingTitle) handwritingTitle.classList.add('show');
                    if (externalAboutContent) externalAboutContent.classList.add('show');
                } else {
                    if (targetPlaneIcon) targetPlaneIcon.classList.remove('show');
                    if (handwritingTitle) handwritingTitle.classList.remove('show');
                    if (externalAboutContent) externalAboutContent.classList.remove('show');
                }
            } else {
                // Reset hoàn toàn về mốc 0
                paperPlane.style.opacity = '0';
                sharkThumb.style.opacity = '1';
                if (animatedTrailPath) animatedTrailPath.setAttribute('d', '');
                if (targetPlaneIcon) targetPlaneIcon.classList.remove('show');
                if (handwritingTitle) handwritingTitle.classList.remove('show');
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
