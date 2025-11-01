(() => {
    
    const principalEl = document.getElementById('principal');
    const annualRateRange = document.getElementById('annualRate');
    const rateLabel = document.getElementById('rateLabel');

    const tenureRange = document.getElementById('tenureRange');
    const yearsEl = document.getElementById('years');
    const monthsEl = document.getElementById('months');
    const tenureLabel = document.getElementById('tenureLabel');

    const form = document.getElementById('emiForm');
    const resetBtn = document.getElementById('resetBtn');

    const resultBox = document.getElementById('result');
    const emiValueEl = document.getElementById('emiValue');
    const totalPaymentEl = document.getElementById('totalPayment');
    const totalInterestEl = document.getElementById('totalInterest');
    
    const summaryToggleBtn = document.getElementById('summaryToggleBtn');
    const resultContent = document.getElementById('resultContent'); 

    const themeToggle = document.getElementById('themeToggle');

    const fmt = (v) => isFinite(v) ? `₹ ${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';

    function calculateEMI(P, annualRatePercent, nMonths) {
        if (!isFinite(P) || P <= 0 || !isFinite(nMonths) || nMonths <= 0) {
            return { emi: 0, totalPayment: 0, totalInterest: 0 };
        }
        const r = (annualRatePercent / 100) / 12;
        let emi;
        if (r === 0) {
            emi = P / nMonths;
        } else {
            const pow = Math.pow(1 + r, nMonths);
            emi = (P * r * pow) / (pow - 1);
        }
        const totalPayment = emi * nMonths;
        const totalInterest = totalPayment - P;

        return { emi, totalPayment, totalInterest };
    }

    function monthsFromYearsMonths() {
        const y = parseInt(yearsEl.value || 0, 10);
        const m = parseInt(monthsEl.value || 0, 10);
        
        const mm = Math.max(0, Math.min(11, isFinite(m) ? m : 0));
        
        const total = Math.max(1, (isFinite(y) ? y : 0) * 12 + mm);
        return total;
    }

    function updateTenureInputsFromRange() {
        const months = parseInt(tenureRange.value, 10);
        const y = Math.floor(months / 12);
        const m = months % 12;
        yearsEl.value = y;
        monthsEl.value = m;
        tenureLabel.textContent = `${y} yr ${m} mo (${months} months)`;
    }

    function updateRangeFromYearsMonths() {
        const total = monthsFromYearsMonths();
        tenureRange.value = Math.max(parseInt(tenureRange.min), Math.min(parseInt(tenureRange.max), total));
        
        const y = Math.floor(total / 12);
        const m = total % 12;
        tenureLabel.textContent = `${y} yr ${m} mo (${total} months)`;
    }
    
    function toggleSummary() {
        const isHidden = resultContent.hidden;
        resultContent.hidden = !isHidden;
    }
    
    function renderAll() {
        const P = parseFloat(principalEl.value) || 0;
        const rate = parseFloat(annualRateRange.value) || 0;
        const months = parseInt(tenureRange.value, 10) || 1;

        rateLabel.textContent = `${Number(rate).toFixed(2)}%`;
        updateTenureInputsFromRange(); 

        const { emi, totalPayment, totalInterest } = calculateEMI(P, rate, months);

        if (emi > 0) {
            emiValueEl.textContent = fmt(emi);
            totalPaymentEl.textContent = fmt(totalPayment);
            totalInterestEl.textContent = fmt(totalInterest);
            resultBox.hidden = false;
        } else {
            emiValueEl.textContent = '—';
            totalPaymentEl.textContent = '—';
            totalInterestEl.textContent = '—';
            resultBox.hidden = true;
            resultContent.hidden = true;
        }
    }

    annualRateRange.addEventListener('input', renderAll);
    
    tenureRange.addEventListener('input', () => {
        updateTenureInputsFromRange();
        renderAll();
    });

    [yearsEl, monthsEl].forEach(el => {
        el.addEventListener('input', () => {
            if (el === monthsEl) {
                let v = parseInt(el.value || 0, 10);
                if (!isFinite(v)) v = 0;
                if (v < 0) v = 0;
                if (v > 11) v = 11;
                el.value = v;
            }
            updateRangeFromYearsMonths();
            renderAll();
        });
    });

    principalEl.addEventListener('input', renderAll);
    
    summaryToggleBtn.addEventListener('click', toggleSummary);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        renderAll(); 
        resultContent.hidden = false;
    });

    resetBtn.addEventListener('click', () => {
        principalEl.value = 500000;
        annualRateRange.value = 7.5;
        tenureRange.value = 60;
        yearsEl.value = 5;
        monthsEl.value = 0;
        
        resultContent.hidden = true; 
        renderAll();
    });

    function applyTheme(isDark) {
        document.body.classList.toggle('dark', isDark);
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', String(isDark));
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark');
        applyTheme(isDark);
        try { localStorage.setItem('emi_theme_dark', isDark ? '1' : '0'); } catch (e) { }
    });

    function init() {
        if (!principalEl.value) principalEl.value = 500000;
        if (!yearsEl.value) yearsEl.value = 5;
        if (!monthsEl.value) monthsEl.value = 0;
        if (!annualRateRange.value) annualRateRate.value = 7.5;

        tenureRange.value = monthsFromYearsMonths();
        
        try {
            const pref = localStorage.getItem('emi_theme_dark');
            if (pref !== null) applyTheme(pref === '1');
        } catch (e) { }
        
        renderAll();
    }

    init();

})();