document.getElementById('characterForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const networthValue = document.getElementById('networth').value;
    const selectedOption = document.getElementById('networthSelect').value;

    const netWorthWithSelect = `${networthValue} ${selectedOption}`;

    const characterData = {
        fullname: document.getElementById('fullname').value,
        birthday: document.getElementById('birthday').value,
        gender: document.getElementById('gender').value,
        networth: netWorthWithSelect,
        game: document.getElementById('game').value,
        playedby: document.getElementById('playedby').value,
        weight: document.getElementById('weight').value,
        height: standardizeHeight(document.getElementById('height').value),
        eye: document.getElementById('eye').value,
        hair: document.getElementById('hair').value,
        dead: document.getElementById('dead').checked,
        dateofdeath: document.getElementById('dateofdeath').value,
        alias: document.getElementById('alias').value,
        retired: document.getElementById('retired').checked,
        employment: document.getElementById('employment').value,
        branch: document.getElementById('branch').value,
        unit: document.getElementById('unit').value,
        unitnumber: document.getElementById('unit-number').value
    };

    try {
        const response = await fetch('/save-character', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(characterData)
        });

        location.reload();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});