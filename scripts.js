document.addEventListener('DOMContentLoaded', () => {
    /* --- CẤU HÌNH MẶC ĐỊNH KHI VÀO TRANG --- */
    const sidebar = document.getElementById('sidebar');
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // 1. Mặc định bật Dark Mode ngay khi tải trang
    document.body.setAttribute('data-theme', 'dark');
    if (themeIcon) {
        themeIcon.className = 'fa-solid fa-sun'; // Đổi icon sang mặt trời để chuẩn bị cho lượt bấm chuyển về Light Mode
    }

    // 2. Mặc định Thu gọn Menu Sidebar ngay khi tải trang
    if (sidebar) {
        sidebar.classList.add('collapsed');
    }

    /* --- 0. HIỆU ỨNG ĐÁNH MÁY & XÓA TIÊU ĐỀ TRANG --- */
    const textToType = "@ᴠʏɴᴅᴜsᴋᴡɪɴᴛᴇʀ";
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!isDeleting) {
            document.title = textToType.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === textToType.length) {
                setTimeout(() => { isDeleting = true; }, 1500);
            }
        } else {
            document.title = textToType.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
            }
        }

        const typingSpeed = isDeleting ? 100 : 150;
        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    /* --- 1. SỰ KIỆN NÚT THU GỌN / MỞ RỘNG SIDEBAR MENU --- */
    const toggleSidebarBtn = document.getElementById('toggleSidebar');

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    /* --- 2. SỰ KIỆN NÚT CHUYỂN ĐỔI DARK / LIGHT MODE --- */
    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.body.removeAttribute('data-theme');
                themeIcon.className = 'fa-solid fa-moon';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fa-solid fa-sun';
            }
        });
    }

    /* --- 3. XỬ LÝ PLAYLIST NHẠC (3 BÀI HÁT IN MP3/) --- */
    const playlist = [
        { title: "Sao Em Vô Tình", artist: "Jack-J97", src: "mp3/Sao Em Vô Tình.mp3" },
        { title: "Về Bên Anh", artist: "Jack-J97", src: "mp3/Về Bên Anh.mp3" },
        { title: "Đom Đóm", artist: "Jack-J97", src: "mp3/Đom Đóm.mp3" }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;
    const audio = new Audio();
    audio.volume = 0.8;

    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function loadSong(index) {
        if (songTitle && songArtist) {
            songTitle.innerText = playlist[index].title;
            songArtist.innerText = playlist[index].artist;
            audio.src = playlist[index].src;
        }
    }

    function playSong() {
        audio.play().then(() => {
            isPlaying = true;
            if (playIcon) playIcon.className = 'fa-solid fa-pause';
        }).catch(err => {
            console.log("Chưa thể tự động phát nhạc hoặc chưa có file trong mp3/: ", err);
        });
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        if (playIcon) playIcon.className = 'fa-solid fa-play';
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            loadSong(currentSongIndex);
            if (isPlaying) playSong();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(currentSongIndex);
            if (isPlaying) playSong();
        });
    }

    /* Tự động phát bài tiếp theo khi kết thúc */
    audio.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    });

    loadSong(currentSongIndex);

    /* --- 4. CHẾ ĐỘ KHÁCH / CHỦ VÀ XÁC THỰC MẬT KHẨU --- */
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
