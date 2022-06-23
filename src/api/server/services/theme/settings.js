'use strict';

const fs = require('fs')
const path = require('path')
const cache = require('lru-cache')({
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24 // 24h
});
const THEME_SETTINGS_CACHE_KEY = 'themesettings';

const SETTINGS_FILE = 'themes/current/config/settings.json';
const SETTINGS_SCHEMA_FILE = 'themes/current/config/settings_schema.json';

class ThemeSettingsService {
  constructor() {}

  readFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if(err){
          reject(err)
        } else {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        }
      });
    });
  }

  writeFile(file, jsonData) {
    return new Promise((resolve, reject) => {
      const stringData = JSON.stringify(jsonData);
      fs.writeFile(file, stringData, (err) => {
        if (err){
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  getSettingsSchema() {
    const file = path.resolve(SETTINGS_SCHEMA_FILE);
    return this.readFile(file);
  }

  getSettings() {
    const settingsFromCache = cache.get(THEME_SETTINGS_CACHE_KEY);

    if (settingsFromCache) {
      return Promise.resolve(settingsFromCache);
    } else {
      const file = path.resolve(SETTINGS_FILE);
      return this.readFile(file).then(settings => {
        cache.set(THEME_SETTINGS_CACHE_KEY, settings);
        return settings;
      })
    }
  }

  updateSettings(settings) {
    cache.set(THEME_SETTINGS_CACHE_KEY, settings);
    const file = path.resolve(SETTINGS_FILE);
    return this.writeFile(file, settings);
  }
}

module.exports = new ThemeSettingsService();
