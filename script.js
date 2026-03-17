
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.calculator-form'); // Use class to target the div
    const totalDamageDisplay = document.getElementById('totalDamage'); // For displaying result
    const squadNameInput = document.getElementById('squadName');
    
    // Initialize sessionSquadData from sessionStorage, or an empty object if not present
    // This will now persist across page refreshes within the same browser tab.
    let sessionSquadData = JSON.parse(sessionStorage.getItem('squadCalculatorData')) || {};

    const saveFormData = () => {
        const squadName = squadNameInput.value.trim();
        if (squadName) {
            const currentData = {
                numModels: document.getElementById('numModels').value,
                damage: document.getElementById('damage').value,
                numAttacks: document.getElementById('numAttacks').value,
                accuracy: document.getElementById('accuracy').value,
                optimalDistance: document.getElementById('optimalDistance').value,
                accuracyFalloff: document.getElementById('accuracyFalloff').value,
                distanceToEnemy: document.getElementById('distanceToEnemy').value,
                armorPiercing: document.getElementById('armorPiercing').value,
                enemyArmor: document.getElementById('enemyArmor').value,
            };
            sessionSquadData[squadName] = currentData;
            sessionStorage.setItem('squadCalculatorData', JSON.stringify(sessionSquadData)); // Save to sessionStorage
        }
    };

    const loadFormData = (squadName) => {
        // Retrieve directly from the in-memory object which was initialized from sessionStorage
        // This ensures the latest state from sessionStorage is reflected.
        if (sessionSquadData[squadName]) {
            const data = sessionSquadData[squadName];
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
            // Clear number inputs if no saved data for the squad, set to default if needed or just empty
            const inputIds = ['numModels', 'damage', 'numAttacks', 'accuracy', 'optimalDistance', 'accuracyFalloff', 'distanceToEnemy', 'armorPiercing', 'enemyArmor'];
            inputIds.forEach(id => {
                document.getElementById(id).value = ''; // Clear or set to default
            });
        }
    };

    function calculateSquadDamage(
        numModels,
        damagePerModel,
        numAttacks,
        accuracy,
        optimalDistance,
        accuracyFalloff,
        distanceToEnemy,
        armorPiercing,
        enemyArmor
    ) {
        let totalDamage = 0;

        // Adjust accuracy based on distance
        const distanceDifference = Math.abs(distanceToEnemy - optimalDistance);
        accuracy -= distanceDifference * accuracyFalloff;
        if (accuracy < 0) accuracy = 0; // Accuracy cannot be negative
        if (accuracy > 100) accuracy = 100; // Accuracy cannot exceed 100

        // Calculate damage reduction due to enemy armor
        let effectiveDamagePerHit = damagePerModel;
        if (enemyArmor > armorPiercing) {
            const armorDifference = enemyArmor - armorPiercing;
            effectiveDamagePerHit *= (1 - (armorDifference * 0.1)); // 10% reduction per point
        }
        
        // Ensure effectiveDamagePerHit is not negative
        if (effectiveDamagePerHit < 0) effectiveDamagePerHit = 0;

        for (let i = 0; i < numModels; i++) {
            for (let j = 0; j < numAttacks; j++) {
                // Check if shot hits
                const hitRoll = Math.floor(Math.random() * 100) + 1; // 1 to 100
                if (hitRoll <= accuracy) {
                    totalDamage += Math.floor(effectiveDamagePerHit); // Damage rounded down to natural numbers
                }
            }
        }

        return totalDamage;
    }

    const NUM_SIMULATIONS = 10000; // Number of simulations for calculating average damage

    function calculateAverageSquadDamage(
        numModels,
        damagePerModel,
        numAttacks,
        accuracy,
        optimalDistance,
        accuracyFalloff,
        distanceToEnemy,
        armorPiercing,
        enemyArmor
    ) {
        let sumOfDamages = 0;
        for (let i = 0; i < NUM_SIMULATIONS; i++) {
            sumOfDamages += calculateSquadDamage(
                numModels,
                damagePerModel,
                numAttacks,
                accuracy,
                optimalDistance,
                accuracyFalloff,
                distanceToEnemy,
                armorPiercing,
                enemyArmor
            );
        }
        return Math.floor(sumOfDamages / NUM_SIMULATIONS);
    }

    // Event listener for squad name input changes
    squadNameInput.addEventListener('input', (event) => {
        const squadName = event.target.value.trim();
        loadFormData(squadName);
    });

    // Event listener for the calculate button click (since form doesn't have a submit type button)
    document.querySelector('.calculator-form button').addEventListener('click', () => {
        saveFormData(); // Save current state before calculation

        const numModels = parseInt(document.getElementById('numModels').value);
        const damagePerModel = parseInt(document.getElementById('damage').value);
        const numAttacks = parseInt(document.getElementById('numAttacks').value);
        const accuracy = parseInt(document.getElementById('accuracy').value);
        const optimalDistance = parseInt(document.getElementById('optimalDistance').value);
        const accuracyFalloff = parseInt(document.getElementById('accuracyFalloff').value);
        const distanceToEnemy = parseInt(document.getElementById('distanceToEnemy').value);
        const armorPiercing = parseInt(document.getElementById('armorPiercing').value);
        const enemyArmor = parseInt(document.getElementById('enemyArmor').value);

        const averageCalculatedDamage = calculateAverageSquadDamage(
            numModels,
            damagePerModel,
            numAttacks,
            accuracy,
            optimalDistance,
            accuracyFalloff,
            distanceToEnemy,
            armorPiercing,
            enemyArmor
        );

        totalDamageDisplay.textContent = averageCalculatedDamage;

        console.log('Average Damage calculated and data saved for:', squadNameInput.value);
    });

    // Initial load in case user navigates back and squad name is pre-filled by browser
    if (squadNameInput.value.trim()) {
        loadFormData(squadNameInput.value.trim());
    }
});
