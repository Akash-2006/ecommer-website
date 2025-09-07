import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const readJSONFile = (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

export const writeJSONFile = (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

export const appendToJSONFile = (filename, newItem) => {
  try {
    const currentData = readJSONFile(filename);
    currentData.push(newItem);
    return writeJSONFile(filename, currentData);
  } catch (error) {
    console.error(`Error appending to ${filename}:`, error);
    return false;
  }
};

export const updateJSONFile = (filename, id, updatedItem) => {
  try {
    const currentData = readJSONFile(filename);
    const index = currentData.findIndex(item => item.id === id);
    if (index !== -1) {
      currentData[index] = { ...currentData[index], ...updatedItem };
      return writeJSONFile(filename, currentData);
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${filename}:`, error);
    return false;
  }
};

export const deleteFromJSONFile = (filename, id) => {
  try {
    const currentData = readJSONFile(filename);
    const filteredData = currentData.filter(item => item.id !== id);
    return writeJSONFile(filename, filteredData);
  } catch (error) {
    console.error(`Error deleting from ${filename}:`, error);
    return false;
  }
};
