let gameGroups = {
    "GTA": "Grand Theft Auto V",
    "GTA5P5": "Grand Theft Auto V (PS5)",
    "GRB": "Tom Clancy's Ghost Recon Breakpoint",
    "ACU": "Assassin's Creed Unity",
    "RDR": "Red Dead Redemption 2"
};

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
        unitnumber: document.getElementById('unit-number').value,
        hometown: document.getElementById('hometown').value,
        yearsserved: document.getElementById('years-served').value,
        relationshipstatus: document.getElementById("relstatus").value,
        playerrelation: document.getElementById("relatedplayer").checked,
        playerrelated: document.getElementById("selectCharacter").value
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

document.getElementById("relstatus").addEventListener("change", function() {
    if (this.value === "Single") {
        document.getElementById("relp1").style.display = "none";
        document.getElementById("relatedplayer").style.display = "none";
    } else if (this.value === "In a relationship") {
        document.getElementById("relp1").style.display = "block";
        document.getElementById("relatedplayer").style.display = "block";
    } else if (this.value === "Engaged") {
        document.getElementById("relp1").style.display = "block";
        document.getElementById("relatedplayer").style.display = "block";
    } else if (this.value === "Married") {
        document.getElementById("relp1").style.display = "block";
        document.getElementById("relatedplayer").style.display = "block";
    } else {
        document.getElementById("relp1").style.display = "none";
        document.getElementById("relatedplayer").style.display = "none";
    }
});

document.getElementById("relatedplayer").addEventListener("change", function() {
    if (this.checked) {
        document.getElementById("relp2").style.display = "block";
        document.getElementById("selectcharacter").style.display = "block";
        loadCharacters();
    } else {
        document.getElementById("relp2").style.display = "none";
        document.getElementById("selectcharacter").style.display = "none";
    }
});

async function loadCharacters() {
    try {
        const response = await fetch('../data.json'); 
        const data = await response.json();

        if (!data.characters) throw new Error("Missing 'characters' data field.");

        const characterSelect = document.getElementById('selectcharacter');
        characterSelect.innerHTML = '<option value="">Select a character</option>';

        const optGroups = {};
        Object.keys(gameGroups).forEach(gameKey => {
            const optGroup = document.createElement("optgroup");
            optGroup.label = gameGroups[gameKey];
            optGroup.id = `${gameKey}-group`;
            optGroups[gameKey] = optGroup;
        });

        data.characters.forEach((character) => {
            if (optGroups[character.game]) {
                const option = new Option(character.fullname, character.fullname);
                optGroups[character.game].appendChild(option);
            }
        });

        Object.values(optGroups).forEach(group => {
            if (group.children.length > 0) {
                characterSelect.appendChild(group);
            }
        });
    } catch (error) {
        console.error('Error loading data: ' + error.message);
    }
}