document.addEventListener('DOMContentLoaded', () => {
    /* --- CẤU HÌNH MẶC ĐỊNH KHI VÀO TRANG --- */
    const sidebar = document.getElementById('sidebar');

    // Mặc định Thu gọn Menu Sidebar ngay khi tải trang
    if (sidebar) {
        sidebar.classList.add('collapsed');
    }

    /* --- 0. HIỆU ỨNG ĐÁNH MÁY (CHỈ XÓA ĐẾN KÝ TỰ '@') --- */
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

    /* --- BẬT / TẮT CHẾ ĐỘ VIDEO NỀN MP4 & NÚT CON MẮT --- */
    const videoBgToggle = document.getElementById('videoBgToggle');
    const bgVideo = document.getElementById('bgVideo');
    const toggleContentBtn = document.getElementById('toggleContentBtn');
    const eyeIcon = document.getElementById('eyeIcon');

    if (videoBgToggle && bgVideo) {
        videoBgToggle.addEventListener('click', () => {
            if (bgVideo.style.display === 'block') {
                bgVideo.style.display = 'none';
                bgVideo.pause();
                document.body.classList.remove('video-bg-active');
                document.body.classList.remove('content-hidden'); // Hiện lại nội dung nếu đang ẩn
                if (eyeIcon) eyeIcon.className = 'fa-solid fa-eye';
            } else {
                bgVideo.style.display = 'block';
                bgVideo.play().catch(e => console.log("Không thể phát video tự động:", e));
                document.body.classList.add('video-bg-active');
            }
        });
    }

    // Sự kiện bấm nút con mắt để ẩn/hiện nội dung
    if (toggleContentBtn && eyeIcon) {
        toggleContentBtn.addEventListener('click', () => {
            document.body.classList.toggle('content-hidden');
            if (document.body.classList.contains('content-hidden')) {
                eyeIcon.className = 'fa-solid fa-eye-slash'; // Đổi icon thành mắt gạch chéo
                toggleContentBtn.title = "Hiện lại nội dung";
            } else {
                eyeIcon.className = 'fa-solid fa-eye'; // Đổi icon về mắt bình thường
                toggleContentBtn.title = "Ẩn nội dung";
            }
        });
    }

    /* --- 1. SỰ KIỆN NÚT THU GỌN / MỞ RỘNG SIDEBAR MENU --- */
    const toggleSidebarBtn = document.getElementById('toggleSidebar');

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    /* --- 2. CHẾ ĐỘ KHÁCH / CHỦ VÀ XÁC THỰC MẬT KHẨU --- */
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
            if (secretMenuLi) secretMenuLi.style.display = 'block';
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
