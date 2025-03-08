let gameGroups = {
    "GTA": "Grand Theft Auto V",
    "GTA5P5": "Grand Theft Auto V (PS5)",
    "GRB": "Tom Clancy's Ghost Recon Breakpoint",
    "ACU": "Assassin's Creed Unity",
    "RDR": "Red Dead Redemption 2"
};

async function loadCharacters() {
    try {
        const response = await fetch('../data.json'); 
        const data = await response.json();

        if (!data.characters) throw new Error("Missing 'characters' data field.");

        const characterSelect = document.getElementById('characterSelect');
        characterSelect.innerHTML = '<option value="">Select a character</option>';

        const optGroups = {};
        Object.keys(gameGroups).forEach(gameKey => {
            const optGroup = document.createElement("optgroup");
            optGroup.label = gameGroups[gameKey];
            optGroup.id = `${gameKey}-group`;
            optGroups[gameKey] = optGroup;
        });

        data.characters.forEach((character, index) => {
            if (optGroups[character.game]) {
                const option = new Option(character.fullname, index);
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

async function loadCharacters2() {
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
        console.error('Error loading character data: ' + error.message);
    }
}

function populateForm(character) {
    const fields = [
        'fullname', 'birthday', 'employment', 'gender', 'game',
        'playedby', 'weight', 'height', 'eye', 'hair', 'dateofdeath', 'alias',
        'hometown'
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

        document.getElementById('years-served').value = character.yearsserved || "";
    } else {
        document.getElementById('mil').style.display = 'none';
        document.getElementById('other').style.display = 'block';
        document.getElementById('employment').value = character.employment || "";
    }

    document.getElementById("relstatus").value = character.relationshipstatus;
    if (character.playerrelation === true) {
        document.getElementById("relatedplayer").checked = character.playerrelation;
        document.getElementById("selectcharacter").style.display = "block";
        document.getElementById("selectcharacter").value = character.playerrelated;
    } else {
        document.getElementById("selectcharacter").style.display = "none";
    }
}

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
        loadCharacters2();
    } else {
        document.getElementById("relp2").style.display = "none";
        document.getElementById("selectcharacter").style.display = "none";
    }
});


async function submitForm(event, selectedIndex) {
    event.preventDefault();

    const updatedCharacter = {
        fullname: document.getElementById('fullname').value,
        birthday: document.getElementById('birthday').value,
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
        const response = await fetch('/edit-character', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: selectedIndex, updatedCharacter })
        });

        if (!response.ok) throw new Error("Failed to update character");

        location.reload();
    } catch (error) {
        console.error("Error updating character: " + error.message);
    }
}

document.getElementById('characterSelect').addEventListener('change', function() {
    loadCharacterDetails(this.value);
});

loadCharacters();