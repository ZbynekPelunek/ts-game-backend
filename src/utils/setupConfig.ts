import fs from 'fs';

interface Config {
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  server: {
    protocol: 'http' | 'https';
    baseUrl: string;
    port: number;
  };
  frontend: {
    protocol: 'http' | 'https';
    baseUrl: string;
    port: number;
  };
  gameplay: {
    xpRate: number;
    dropRate: number;
    currencyRate: number;
    maxLevel: number;
    maxItemLevel: number;
  };
}

export function readConfigFile(): Promise<Config> {
  return new Promise((resolve, reject) => {
    fs.readFile('./src/config.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const config: Config = JSON.parse(data);
        resolve(config);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}
