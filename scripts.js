document.addEventListener('DOMContentLoaded', () => {

    /* --- 0. HIỆU ỨNG ĐÁNH MÁY TIÊU ĐỀ TRANG TAB --- */
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

        const typingSpeed = isDeleting ? 80 : 130;
        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    /* --- HIỆU ỨNG ĐÁNH MÁY CHẬM RÃI CHO "About Me ..." --- */
    const titleElement = document.getElementById('typingAboutTitle');
    const textToTypeAbout = "About Me ...";
    let indexAbout = 0;

    function typeAboutEffect() {
        if (indexAbout < textToTypeAbout.length && titleElement) {
            titleElement.textContent += textToTypeAbout.charAt(indexAbout);
            indexAbout++;
            setTimeout(typeAboutEffect, 150); // Đánh máy chậm 150ms mỗi ký tự
        }
    }
    setTimeout(typeAboutEffect, 500);

    /* --- TƯƠNG TÁC KÉO CÁ MẬP & PHÓNG MÁY BAY GIẤY --- */
    const sharkRange = document.getElementById('sharkRange');
    const sharkThumb = document.getElementById('sharkThumb');
    const paperPlane = document.getElementById('paperPlane');
    const aboutCard = document.getElementById('about');

    if (aboutCard) {
        aboutCard.addEventListener('click', () => {
            aboutCard.classList.toggle('active-expand');
        });
    }

    if (sharkRange && sharkThumb && paperPlane) {
        sharkRange.addEventListener('input', (e) => {
            const val = e.target.value; // Giá trị từ 0 -> 100
            
            // 1. Di chuyển đầu cá mập há miệng
            sharkThumb.style.left = val + '%';
            sharkThumb.style.transform = `translateX(-50%) translateY(-2px) scaleX(-1) scale(${1 + val * 0.002})`;

            // 2. Phóng máy bay giấy bay theo đường cong uốn lượn
            const planeX = (val / 100) * 320; 
            const planeY = -Math.sin((val / 100) * Math.PI) * 45; // Quỹ đạo cong uốn lượn
            
            if (val > 0) {
                paperPlane.style.opacity = '1';
                paperPlane.style.transform = `translate(${planeX}px, ${planeY}px) rotate(${15 - val * 0.25}deg)`;
            } else {
                paperPlane.style.opacity = '0';
            }
        });
    }

    /* --- CHUYỂN ĐỔI QUA LẠI GIỮA 2 BACKGROUND VIDEO --- */
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

    /* --- TỰ ĐỘNG MỜ DẦN & TÀNG HÌNH SAU 10 GIÂY KHÔNG DI CHUYỂN CHUỘT --- */
    let idleTimer;
    const IDLE_TIMEOUT = 10000; // 10 giây

    function resetIdleTimer() {
        if (document.body.classList.contains('idle-mode')) {
            document.body.classList.remove('idle-mode');
        }

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            document.body.classList.add('idle-mode');
        }, IDLE_TIMEOUT);
    }

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('keypress', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);

    resetIdleTimer();

    /* --- CHẾ ĐỘ KHÁCH / CHỦ VÀ XÁC THỰC MẬT KHẨU --- */
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
        const enteredPass = passInput.value;
        if (enteredPass === 'Vinh23456f@@') {
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
