document.getElementById('employmentType').addEventListener('change', function() {
    var employmentType = this.value;
    var milSection = document.getElementById('mil');
    var otherSection = document.getElementById('other');
    var employmentField = document.getElementById('employment');

    if (employmentType === 'U.S. Military') {
        milSection.style.display = 'block';
        otherSection.style.display = 'none';
        employmentField.required = true; 
    } else if (employmentType === 'other') {
        otherSection.style.display = 'block';
        milSection.style.display = 'none';
        employmentField.required = true; 
    } else {
        milSection.style.display = 'none';
        otherSection.style.display = 'none';
        employmentField.required = false;
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