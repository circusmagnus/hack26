document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('damageCalculatorForm');
    const resultDiv = document.getElementById('result'); // From remote
    const squadNameInput = document.getElementById('squadName'); // From my changes
    const inputFields = form.querySelectorAll('input[type="number"]'); // From my changes

    let savedSquadsData = JSON.parse(sessionStorage.getItem('battlesectorSquads')) || {}; // From my changes

    // Function to save current form data (from my changes)
    const saveFormData = () => {
        const squadName = squadNameInput.value.trim();
        if (squadName) {
            const currentData = {};
            currentData.numModels = document.getElementById('numModels').value;
            currentData.damage = document.getElementById('damage').value;
            currentData.numAttacks = document.getElementById('numAttacks').value;
            currentData.accuracy = document.getElementById('accuracy').value;
            currentData.optimalDistance = document.getElementById('optimalDistance').value;
            currentData.accuracyFalloff = document.getElementById('accuracyFalloff').value;
            currentData.distanceToEnemy = document.getElementById('distanceToEnemy').value;
            currentData.armorPiercing = document.getElementById('armorPiercing').value;
            currentData.enemyArmor = document.getElementById('enemyArmor').value;

            savedSquadsData[squadName] = currentData;
            sessionStorage.setItem('battlesectorSquads', JSON.stringify(savedSquadsData));
        }
    };

    // Function to load form data based on squad name (from my changes)
    const loadFormData = (squadName) => {
        if (savedSquadsData[squadName]) {
            const data = savedSquadsData[squadName];
            document.getElementById('numModels').value = data.numModels;
            document.getElementById('damage').value = data.damage;
            document.getElementById('numAttacks').value = data.numAttacks;
            document.getElementById('accuracy').value = data.accuracy;
            document.getElementById('optimalDistance').value = data.optimalDistance;
            document.getElementById('accuracyFalloff').value = data.accuracyFalloff;
            document.getElementById('distanceToEnemy').value = data.distanceToEnemy;
            document.getElementById('armorPiercing').value = data.armorPiercing;
            document.getElementById('enemyArmor').value = data.enemyArmor;
        } else {
            // Clear number inputs if no saved data for the squad
            inputFields.forEach(input => {
                if (input.id !== 'squadName') { // Don't clear squad name itself
                    input.value = '';
                }
            });
        }
    };

    // Function to calculate squad damage (from remote changes)
    function calculateSquadDamage(
        numModels,
        damagePerHit,
        numAttacksPerModel,
        accuracy,
        optimalDistance,
        accuracyFalloff,
        distanceToEnemy,
        armorPiercing,
        enemyArmor
    ) {
        let totalDamage = 0;

        // Calculate adjusted accuracy
        let distanceDifference = Math.abs(optimalDistance - distanceToEnemy);
        let adjustedAccuracy = accuracy - (distanceDifference * accuracyFalloff);

        // Ensure accuracy doesn't go below 0 or above 100
        adjustedAccuracy = Math.max(0, Math.min(100, adjustedAccuracy));

        for (let i = 0; i < numModels; i++) {
            for (let j = 0; j < numAttacksPerModel; j++) {
                // Check for hit
                if (Math.random() * 100 < adjustedAccuracy) {
                    let effectiveDamage = damagePerHit;

                    // Calculate armor reduction
                    let armorDifference = enemyArmor - armorPiercing;
                    if (armorDifference > 0) {
                        effectiveDamage *= (1 - (armorDifference * 0.1));
                    }

                    // Damage is always rounded down
                    totalDamage += Math.floor(Math.max(0, effectiveDamage));
                }
            }
        }

        return totalDamage;
    }

    // Event listener for squad name input changes (from my changes)
    squadNameInput.addEventListener('input', (event) => {
        const squadName = event.target.value.trim();
        loadFormData(squadName);
    });

    // Event listener for form submission to save data and calculate (combined)
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        saveFormData(); // My changes

        // Remote changes for calculation
        const numModels = parseInt(document.getElementById('numModels').value);
        const damagePerHit = parseInt(document.getElementById('damage').value);
        const numAttacksPerModel = parseInt(document.getElementById('numAttacks').value);
        const accuracy = parseInt(document.getElementById('accuracy').value);
        const optimalDistance = parseInt(document.getElementById('optimalDistance').value);
        const accuracyFalloff = parseInt(document.getElementById('accuracyFalloff').value);
        const distanceToEnemy = parseInt(document.getElementById('distanceToEnemy').value);
        const armorPiercing = parseInt(document.getElementById('armorPiercing').value);
        const enemyArmor = parseInt(document.getElementById('enemyArmor').value);

        const calculatedDamage = calculateSquadDamage(
            numModels,
            damagePerHit,
            numAttacksPerModel,
            accuracy,
            optimalDistance,
            accuracyFalloff,
            distanceToEnemy,
            armorPiercing,
            enemyArmor
        );

        resultDiv.innerHTML = `Total Squad Damage: ${calculatedDamage}`;

        console.log('Form Submitted and data saved for:', squadNameInput.value); // My changes
    });

    // Also save data when any numerical input changes or loses focus (from my changes)
    inputFields.forEach(input => {
        input.addEventListener('change', saveFormData);
        input.addEventListener('blur', saveFormData);
    });

    // Initial load in case user navigates back and squad name is pre-filled by browser (from my changes)
    if (squadNameInput.value.trim()) {
        loadFormData(squadNameInput.value.trim());
    }
});
