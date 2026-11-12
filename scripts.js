/*
     * CHẶNG 1 (MỞ RỘNG RA XA CÁC MÉP - THOÁNG ĐÃNG, BAY BỔNG):
     * - Từ slider bay lên, tạo vòng lặp mềm mại ở khoảng giữa
     * - Vươn rộng ra khoảng không gian xa mép phải, lượn vòm cung cao thoáng ở giữa bầu trời rồi uốn lượn lướt qua khu vực "about me" và bay về phía trái cách xa viền
     */
    function getOutboundPathString() {
        const c = getCoordinates();
        if (!c) return '';

        const loopX = c.startX + (c.midX - c.startX) * 0.44;
        const loopY = c.startY + (c.midY - c.startY) * 0.45;

        // Giữ quỹ đạo ở cách xa mép phải và mép trên một khoảng hợp lý để tạo cảm giác thoáng đãng, không bị ép sát viền
        const rightSafePeakX = c.screenW - 120; 
        const topSafeArchY = -80;

        return `M ${c.startX} ${c.startY}
                C ${loopX - 70} ${c.startY - 50},
                  ${loopX + 180} ${loopY + 110},
                  ${loopX + 100} ${loopY - 50}
                C ${loopX + 50} ${loopY - 170},
                  ${loopX - 130} ${loopY - 100},
                  ${loopX - 40} ${loopY + 40}
                C ${loopX + 40} ${loopY + 160},
                  ${c.midX - 220} ${c.midY + 80},
                  ${c.midX} ${c.midY}
                C ${c.midX + 220} ${c.midY - 50},
                  ${rightSafePeakX} ${c.midY - 180},
                  ${c.screenW * 0.45} ${topSafeArchY}
                C ${c.screenW * 0.15} ${topSafeArchY},
                  100 80,
                  -250 380`;
    }
