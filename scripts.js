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

    /* =====================================================
       AIRPLANE FLIGHT SYSTEM
       Chỉ cất cánh khi Slider đạt 100%
    ===================================================== */

    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');

    const flightSvg = document.getElementById('flightSvg');
    const flightPath = document.getElementById('flightPath');
    const animatedTrailPath = document.getElementById('animatedTrailPath');

    const handwritingTitle = document.getElementById('handwritingTitle');
    const targetPlaneIcon = document.getElementById('targetPlaneIcon');
    const externalAboutContent = document.getElementById('externalAboutContent');

    const customSliderTrack = document.getElementById('sliderTrack');

    let pathLength = 0;
    let hasLaunched = false;
    let animationFrame = null;

    const FLIGHT_DURATION = 2800;
    const TRAIL_SCREEN_LENGTH = 125;

    // Cập nhật vị trí máy bay trên Slider
    function updateSliderThumbPosition(val) {
        if (!customSliderTrack || !sharkThumb) return;

        const trackWidth = customSliderTrack.clientWidth;
        const position = (val / 100) * trackWidth;

        sharkThumb.style.left = position + 'px';
    }

    // Chuyển tọa độ màn hình sang tọa độ SVG
    function screenToSVG(x, y) {
        if (!flightSvg) return null;
        const matrix = flightSvg.getScreenCTM();

        if (!matrix) return null;

        const point = flightSvg.createSVGPoint();

        point.x = x;
        point.y = y;

        return point.matrixTransform(matrix.inverse());
    }

    // Tính đường bay từ tâm Slider đến tâm icon đích
    function initPath() {
        if (!flightSvg || !flightPath ||
            !sharkThumb || !targetPlaneIcon) return false;

        const startRect = sharkThumb.getBoundingClientRect();
        const endRect = targetPlaneIcon.getBoundingClientRect();

        const start = screenToSVG(
            startRect.left + startRect.width / 2,
            startRect.top + startRect.height / 2
        );

        const end = screenToSVG(
            endRect.left + endRect.width / 2,
            endRect.top + endRect.height / 2
        );

        if (!start || !end) return false;

        const dx = end.x - start.x;

        // Đường cong bay uốn lượn
        const lift = flightSvg.clientHeight * 0.22;

        const cp1x = start.x + dx * 0.30;
        const cp1y = start.y - lift;

        const cp2x = start.x + dx * 0.72;
        const cp2y = end.y - lift * 0.45;

        const d = `
            M ${start.x} ${start.y}
            C ${cp1x} ${cp1y},
              ${cp2x} ${cp2y},
              ${end.x} ${end.y}
        `;

        flightPath.setAttribute('d', d);

        pathLength = flightPath.getTotalLength();

        return pathLength > 0;
    }

    // Tạo vệt nét đứt có chiều dài cố định
    function updateMovingTrail(distance) {
        if (!animatedTrailPath || !flightPath || !flightSvg) return;

        const matrix = flightSvg.getScreenCTM();

        if (!matrix) return;

        // Giữ chiều dài vệt ổn định ngay cả khi zoom
        const scale = Math.hypot(matrix.a, matrix.b);

        const trailLength = TRAIL_SCREEN_LENGTH / scale;

        const startDistance = Math.max(
            0,
            distance - trailLength
        );

        const actualLength = distance - startDistance;

        const segments = Math.max(
            20,
            Math.ceil(actualLength / 3)
        );

        let d = '';

        for (let i = 0; i <= segments; i++) {
            const sampleDistance =
                startDistance + actualLength * i / segments;

            const point = flightPath.getPointAtLength(sampleDistance);

            d += `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y} `;
        }

        animatedTrailPath.setAttribute('d', d);
        animatedTrailPath.style.strokeDasharray = '6 7';
        animatedTrailPath.style.strokeDashoffset = '0';
        animatedTrailPath.style.strokeLinecap = 'round';
        animatedTrailPath.style.strokeLinejoin = 'round';
    }

    // Đặt trạng thái ban đầu
    function resetFlight() {
        if (paperPlane) {
            paperPlane.style.opacity = '0';
        }

        if (sharkThumb) {
            sharkThumb.style.opacity = '1';
        }

        if (animatedTrailPath) {
            animatedTrailPath.setAttribute('d', '');
        }

        if (targetPlaneIcon) {
            targetPlaneIcon.classList.remove('show');
        }

        if (handwritingTitle) {
            handwritingTitle.classList.remove('show');
        }

        if (externalAboutContent) {
            externalAboutContent.classList.remove('show');
        }
    }

    // BẮT ĐẦU CHUYẾN BAY
    function launchPlane() {
        if (hasLaunched) return;

        // Đánh dấu đã cất cánh
        hasLaunched = true;

        // Slider giữ nguyên 100%
        sharkRange.value = 100;
        updateSliderThumbPosition(100);

        // Tính lại tọa độ thật sau khi Slider đạt 100%
        if (!initPath()) {
            hasLaunched = false;
            return;
        }

        // Ẩn máy bay trên thanh Slider
        sharkThumb.style.opacity = '0';

        // Xóa vệt cũ
        animatedTrailPath.setAttribute('d', '');

        // Máy bay xuất hiện tại điểm xuất phát
        const startPoint = flightPath.getPointAtLength(0);

        paperPlane.style.transition = 'none';
        paperPlane.style.left = startPoint.x + 'px';
        paperPlane.style.top = startPoint.y + 'px';
        paperPlane.style.opacity = '1';

        const startTime = performance.now();

        function animate(now) {
            const elapsed = now - startTime;

            const progress = Math.min(
                elapsed / FLIGHT_DURATION,
                1
            );

            // Chuyển động mượt, giảm tốc khi gần đích
            const eased = 1 - Math.pow(1 - progress, 3);

            const distance = eased * pathLength;

            // Vị trí máy bay
            const current = flightPath.getPointAtLength(distance);

            // Hai điểm lân cận để xác định hướng bay
            const next = flightPath.getPointAtLength(
                Math.min(distance + 2, pathLength)
            );

            const previous = flightPath.getPointAtLength(
                Math.max(distance - 2, 0)
            );

            const angle = Math.atan2(
                next.y - previous.y,
                next.x - previous.x
            ) * (180 / Math.PI);

            // Cập nhật vị trí và góc xoay
            paperPlane.style.left = current.x + 'px';
            paperPlane.style.top = current.y + 'px';

            paperPlane.style.transform =
                `translate(-50%, -50%) rotate(${angle + 45}deg)`;

            // Cập nhật vệt nét đứt phía sau
            updateMovingTrail(distance);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                // Đưa máy bay chính xác vào tọa độ đích
                const destination = flightPath.getPointAtLength(pathLength);

                paperPlane.style.left = destination.x + 'px';
                paperPlane.style.top = destination.y + 'px';

                // Giữ nguyên vệt cuối cùng
                updateMovingTrail(pathLength);

                // Hiện icon đích thay cho máy bay đang bay
                paperPlane.style.opacity = '0';

                // Hiện About Me sau khi hạ cánh
                targetPlaneIcon.classList.add('show');
                handwritingTitle.classList.add('show');

                setTimeout(() => {
                    externalAboutContent.classList.add('show');
                }, 400);

                animationFrame = null;
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    // Khởi tạo ban đầu
    resetFlight();

    requestAnimationFrame(() => {
        updateSliderThumbPosition(0);
        initPath();
    });

    // Chỉ cất cánh khi đạt đúng 100%
    if (sharkRange) {
        sharkRange.addEventListener('input', (e) => {
            if (hasLaunched) {
                sharkRange.value = 100;
                return;
            }

            const val = Number(e.target.value);

            updateSliderThumbPosition(val);

            // Chưa đạt 100%: không có máy bay bay bên ngoài
            if (val < 100) {
                resetFlight();
                return;
            }

            // Đạt 100%: phóng máy bay
            launchPlane();
        });
    }

    // Cập nhật vị trí khi đổi kích thước màn hình
    window.addEventListener('resize', () => {
        if (!hasLaunched) {
            updateSliderThumbPosition(
                Number(sharkRange.value)
            );

            initPath();
        }
    });

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
