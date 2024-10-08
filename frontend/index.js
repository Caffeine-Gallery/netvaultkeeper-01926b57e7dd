import { backend } from 'declarations/backend';

let isAuthenticated = false;

document.getElementById('auth-button').addEventListener('click', authenticate);
document.getElementById('add-config-button').addEventListener('click', addConfig);
document.getElementById('diff-button').addEventListener('click', getDiff);

async function authenticate() {
    const token = document.getElementById('auth-token').value;
    // In a real application, you would validate the token with the backend
    if (token) {
        isAuthenticated = true;
        document.getElementById('main-content').style.display = 'block';
        await loadConfigs();
    } else {
        alert('Invalid token');
    }
}

async function loadConfigs() {
    try {
        const configNames = await backend.getAllConfigNames();
        const configList = document.getElementById('config-list');
        const diffConfigName = document.getElementById('diff-config-name');
        configList.innerHTML = '';
        diffConfigName.innerHTML = '';
        configNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            configList.appendChild(li);
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            diffConfigName.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading configs:', error);
    }
}

async function addConfig() {
    if (!isAuthenticated) {
        alert('Please authenticate first');
        return;
    }
    const name = document.getElementById('config-name').value;
    const content = document.getElementById('config-content').value;
    if (!name || !content) {
        alert('Please enter both name and content');
        return;
    }
    try {
        const result = await backend.addConfig(name, content);
        if ('ok' in result) {
            alert('Configuration added/updated successfully');
            await loadConfigs();
        } else {
            alert('Error: ' + result.err);
        }
    } catch (error) {
        console.error('Error adding config:', error);
        alert('Error adding configuration');
    }
}

async function getDiff() {
    if (!isAuthenticated) {
        alert('Please authenticate first');
        return;
    }
    const name = document.getElementById('diff-config-name').value;
    const version1 = parseInt(document.getElementById('diff-version1').value);
    const version2 = parseInt(document.getElementById('diff-version2').value);
    if (!name || isNaN(version1) || isNaN(version2)) {
        alert('Please enter valid configuration name and version numbers');
        return;
    }
    try {
        const result = await backend.getDiff(name, version1, version2);
        if ('ok' in result) {
            document.getElementById('diff-result').textContent = result.ok;
        } else {
            alert('Error: ' + result.err);
        }
    } catch (error) {
        console.error('Error getting diff:', error);
        alert('Error getting diff');
    }
}
