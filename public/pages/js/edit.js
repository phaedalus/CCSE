async function loadCharacters() {
    try {
        const response = await fetch('../data.json'); 
        const data = await response.json();

        if (!data.characters) throw new Error("Missing 'characters' data field.");

        const characterSelect = document.getElementById('characterSelect');
        data.characters.forEach((character, index) => {
            const option = new Option(character.fullname, index);
            characterSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading data: ' + error.message);
    }
}

async function loadCharacterDetails(selectedIndex) {
    try {
        if (selectedIndex === "") {
            document.getElementById('editCharacterForm').style.display = 'none';
            return;
        }

        const response = await fetch('/data');
        const data = await response.json();
        const character = data.characters[selectedIndex];

        if (!character) throw new Error("Character not found");

        populateForm(character);
        document.getElementById('editCharacterForm').style.display = "block";

        document.getElementById('editCharacterForm').onsubmit = (e) => submitForm(e, selectedIndex);
    } catch (error) {
        alert('Error loading character data: ' + error.message);
    }
}

function populateForm(character) {
    const fields = [
        'fullname', 'birthday', 'employment', 'gender', 'game',
        'playedby', 'weight', 'height', 'eye', 'hair', 'dateofdeath', 'alias'
    ];

    fields.forEach(field => {
        document.getElementById(field).value = character[field] || "";
    });

    document.getElementById('dead').checked = character.dead || false;
    document.getElementById('retired').checked = character.retired || false;

    const netWorthRegex = /^(\d+)\s*([kmb])$/i;
    const match = character.networth?.match(netWorthRegex);
    document.getElementById('networth').value = match ? match[1] : "";
    document.getElementById('networthSelect').value = match ? match[2].toLowerCase() : "k";

    if (character.employment === "U.S. Military") {
        document.getElementById('mil').style.display = 'block';
        document.getElementById('other').style.display = 'none';

        document.getElementById('employment').value = character.employment || "";

        document.getElementById('branch').value = character.branch || "";
        updateUnits();

        document.getElementById('unit').value = character.unit || "unit";
        document.getElementById('unit-number').value = character.unitnumber || "";
    } else {
        document.getElementById('mil').style.display = 'none';
        document.getElementById('other').style.display = 'block';
        document.getElementById('employment').value = character.employment || "";
    }
}

async function submitForm(event, selectedIndex) {
    event.preventDefault();

    const updatedCharacter = {
        fullname: document.getElementById('fullname').value,
        birthday: document.getElementById('birthday').value,
        employment: document.getElementById('employment').value,
        gender: document.getElementById('gender').value,
        networth: document.getElementById('networth').value + " " + document.getElementById('networthSelect').value,
        game: document.getElementById('game').value,
        playedby: document.getElementById('playedby').value,
        weight: document.getElementById('weight').value,
        height: standardizeHeight(document.getElementById('height').value),
        eye: document.getElementById('eye').value,
        hair: document.getElementById('hair').value,
        dead: document.getElementById('dead').checked,
        dateofdeath: document.getElementById('dateofdeath').value,
        alias: document.getElementById('alias').value,
        retired: document.getElementById('retired').checked
    };

    try {
        const response = await fetch('/edit-character', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: selectedIndex, updatedCharacter })
        });

        if (!response.ok) throw new Error("Failed to update character");

        location.reload();
    } catch (error) {
        alert('Error updating character: ' + error.message);
    }
}

document.getElementById('characterSelect').addEventListener('change', function() {
    loadCharacterDetails(this.value);
});

loadCharacters();