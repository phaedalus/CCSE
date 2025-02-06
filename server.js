const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const port = 3000;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save-character', (req, res) => {
    const characterData = req.body;
    const dataFilePath = path.join(__dirname, 'public', 'data.json');

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        let characters = [];
    
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('data.json not found, creating new file.');
            } else {
                console.error('Error reading data.json:', err);
                return res.status(500).json({ error: 'Failed to read character data' });
            }
        } else {
            try {
                const jsonData = JSON.parse(data); // Parse the JSON
                if (jsonData && Array.isArray(jsonData.characters)) {
                    characters = jsonData.characters; // Extract the array
                } else {
                    console.warn('Invalid data structure, resetting characters to an empty array.');
                    characters = [];
                }
            } catch (e) {
                console.error('Error parsing JSON data:', e);
                characters = [];
            }
        }
    
        if (!characterData || !characterData.fullname || !characterData.game) {
            return res.status(400).json({ error: 'Invalid character data' });
        }
    
        characters.push(characterData);
    
        const newData = { characters }; // Wrap the array back in an object
    
        fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), (err) => {
            if (err) {
                console.error('Error saving character data:', err);
                return res.status(500).json({ error: 'Failed to save character data' });
            }
            res.status(200).json({ message: 'Character saved successfully' });
        });
    });        
});

app.post('/edit-character', (req, res) => {
    const { index, updatedCharacter } = req.body;
    const dataFilePath = path.join(__dirname, 'public', 'data.json');

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            res.status(500).json({ error: 'Failed to read character data' });
            return;
        }

        let characters = [];

        try {
            characters = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing JSON data:', e);
        }

        if (index < 0 || index >= characters.length) {
            return res.status(400).json({ error: 'Invalid character index' });
        }

        characters[index] = updatedCharacter;
        
        fs.writeFile(dataFilePath, JSON.stringify(characters, null, 2), (err) => {
            if (err) {
                console.error('Error saving character data:', err);
                res.status(500).json({ error: 'Failed to save updated character data' });
                return;
            }

            res.status(200).json({ message: 'Character updated successfully' });
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/data', (req, res) => {
    const dataFilePath = path.join(__dirname, 'public', 'data.json');

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            return res.status(500).json({ error: 'Failed to read character data.' });
        }

        try {
            const characters = JSON.parse(data);
            res.json(characters);
        } catch (e) {
            console.error('Error parsing JSON data:', e);
            res.status(500).json({ error: 'Failed to parse character data' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});