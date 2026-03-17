document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('damageCalculatorForm');
    const resultDiv = document.getElementById('result');

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

    form.addEventListener('submit', (event) => {
        event.preventDefault();

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
    });
});
