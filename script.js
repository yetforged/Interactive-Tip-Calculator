document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const billAmountInput = document.getElementById('billAmount');
    const tipPercentageInput = document.getElementById('tipPercentage');
    const numberOfPeopleInput = document.getElementById('numberOfPeople');
    const tipPercentageValue = document.getElementById('tipPercentageValue');
    const tipAmountOutput = document.getElementById('tipAmount');
    const totalBillOutput = document.getElementById('totalBill');
    const perPersonAmountOutput = document.getElementById('perPersonAmount');
    const tipEmojiOutput = document.getElementById('tipEmoji');
    const tipFeedbackOutput = document.getElementById('tipFeedback');
    const receiptOutput = document.getElementById('receipt');
    const resetButton = document.getElementById('resetButton');
    const printButton = document.getElementById('printButton');
    const themeToggle = document.getElementById('themeToggle');

    // --- Default Values ---
    const DEFAULT_TIP = 15;
    const DEFAULT_PEOPLE = 1;

    // --- Event Listeners ---
    [billAmountInput, tipPercentageInput, numberOfPeopleInput].forEach(input => {
        input.addEventListener('input', handleCalculation);
    });
    resetButton.addEventListener('click', resetCalculator);
    printButton.addEventListener('click', () => window.print());
    themeToggle.addEventListener('change', toggleTheme);

    // --- Functions ---

    /**
     * Main function to handle input changes and trigger calculations.
     */
    function handleCalculation() {
        const billAmount = parseFloat(billAmountInput.value) || 0;
        const tipPercentage = parseInt(tipPercentageInput.value, 10);
        const numberOfPeople = parseInt(numberOfPeopleInput.value) || DEFAULT_PEOPLE;

        // Update tip percentage display
        tipPercentageValue.textContent = `${tipPercentage}%`;

        // Guard against invalid inputs
        if (billAmount < 0 || numberOfPeople < 1) {
            resetOutputs();
            return;
        }

        // Calculations
        const tip = billAmount * (tipPercentage / 100);
        const total = billAmount + tip;
        const perPerson = total / numberOfPeople;

        // Update UI
        updateOutputs(tip, total, perPerson);
        updateEmoji(tipPercentage);
        updateReceipt(billAmount, tipPercentage, tip, total, numberOfPeople, perPerson);
    }

    /**
     * Updates the main output displays.
     * @param {number} tip - Calculated tip amount.
     * @param {number} total - Calculated total bill.
     * @param {number} perPerson - Calculated amount per person.
     */
    function updateOutputs(tip, total, perPerson) {
        tipAmountOutput.textContent = `₹${tip.toFixed(2)}`;
        totalBillOutput.textContent = `₹${total.toFixed(2)}`;
        perPersonAmountOutput.textContent = `₹${perPerson.toFixed(2)}`;
    }

    /**
     * Updates the emoji and feedback text based on the tip percentage.
     * @param {number} tipPercentage - The current tip percentage.
     */
    function updateEmoji(tipPercentage) {
        let emoji = '😐';
        let feedback = 'Low tip';

        if (tipPercentage > 20) {
            emoji = '🤩';
            feedback = 'Generous!';
        } else if (tipPercentage > 15) {
            emoji = '😄';
            feedback = 'Nice tip!';
        } else if (tipPercentage > 10) {
            emoji = '😊';
            feedback = 'Decent!';
        } else if (tipPercentage >= 5) {
            emoji = '🙂';
            feedback = 'Fair';
        }
        
        tipEmojiOutput.textContent = emoji;
        tipFeedbackOutput.textContent = feedback;
    }

    /**
     * Formats and updates the receipt-style summary.
     */
    function updateReceipt(bill, tipPercent, tip, total, people, perPerson) {
        const fBill = `₹${bill.toFixed(2)}`.padStart(8);
        const fTip = `₹${tip.toFixed(2)}`.padStart(8);
        const fTotal = `₹${total.toFixed(2)}`.padStart(8);
        const fPerPerson = `₹${perPerson.toFixed(2)}`.padStart(8);
        const tipLine = `Tip (${tipPercent}%)`.padEnd(16);
        const splitLine = `Split (x${people})`.padEnd(16);

        const receiptText = `
┌────────────────────────┐
│     Smart Tip Calc     │
├────────────────────────┤
│ Bill Amount     ${fBill} │
│ ${tipLine}${fTip} │
│ Total           ${fTotal} │
│ ${splitLine}${fPerPerson} │
└────────────────────────┘
        `.trim();
        receiptOutput.textContent = receiptText;
    }

    /**
     * Resets all inputs and outputs to their default state.
     */
    function resetCalculator() {
        billAmountInput.value = '';
        tipPercentageInput.value = DEFAULT_TIP;
        numberOfPeopleInput.value = '';
        handleCalculation();
    }

    /**
     * Resets only the output fields.
     */
    function resetOutputs() {
        updateOutputs(0, 0, 0);
        updateEmoji(0);
        updateReceipt(0, 0, 0, 0, 1, 0);
    }
    
    /**
     * Toggles the color theme and stores the preference.
     */
    function toggleTheme() {
        const isDark = themeToggle.checked;
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    /**
     * Loads the saved theme from localStorage on initial load.
     */
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            themeToggle.checked = true;
            document.body.setAttribute('data-theme', 'dark');
        } else {
            themeToggle.checked = false;
            document.body.setAttribute('data-theme', 'light');
        }
    }

    // --- Initializations ---
    loadTheme();
    handleCalculation(); // Initial calculation on load
}); 