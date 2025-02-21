function standardizeHeight(input) {
    input = input.trim().toLowerCase();

    let cmMatch = input.match(/^(\d+)\s*cm$/);
    if (cmMatch) {
        let cm = parseInt(cmMatch[1]);
        let inchesTotal = Math.round(cm / 2.54);
        let feet = Math.floor(inchesTotal / 12);
        let inches = inchesTotal % 12;
        return `${feet}'${inches}`;
    }

    let ftInMatch = input.match(/^(\d+)\s*(?:'|ft)?\s*(\d+)?\s*(?:''|in)?$/);
    if (ftInMatch) {
        let feet = parseInt(ftInMatch[1]);
        let inches = ftInMatch[2] ? parseInt(ftInMatch[2]) : 0;
        return `${feet}'${inches}`;
    }

    return input;
}