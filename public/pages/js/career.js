document.getElementById("employmentType").addEventListener("change", function() {
    let selectedValue = this.value;
    if (selectedValue == "U.S. Military") {
        document.getElementById('mil').style.display = 'block';
        document.getElementById('other').style.display = 'none';
        updateUnits();
    } else if (selectedValue == "other") {
        document.getElementById('other').style.display = 'block';
        document.getElementById('mil').style.display = 'none';
    }
});

document.getElementById("branch").addEventListener("change", function() {
    updateUnits();
});

function updateUnits() {
    const branch = document.getElementById("branch").value;
    const unitSelect = document.getElementById("unit");
    const unitNumberInput = document.getElementById("unit-number");

    unitSelect.innerHTML = "";
    unitNumberInput.value = "";

    const units = {
        army: ["Infantry", "Armor", "Artillery", "Engineers", "Delta Force", "Rangers", "Green Berets"],
        navy: ["Seabees", "Surface Warfare", "Submarine Service", "Aviation"],
        marinecorps: ["Infantry", "Artillery", "Recon", "Aviation"],
        spaceforce: ["Space Operations", "Space Systems", "Cyber Operations"],
        intelligence: ["CIA"]
    };

    const selectedUnits = units[branch] || [];

    selectedUnits.forEach(unit => {
        const option = document.createElement("option");
        option.value = unit.toLowerCase().replace(" ", "-");
        option.textContent = unit;
        unitSelect.appendChild(option);
    });
}