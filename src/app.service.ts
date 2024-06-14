import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class AppService {
  private readonly filePath = path.join(__dirname, '../../about.txt');

  constructor() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '', 'utf8');
    }
  }

  readFile(): string {
    try {
      return fs.readFileSync(this.filePath, 'utf8');
    } catch (error) {
      console.error('Error reading file:', error);
      return '';
    }
  }

  writeFile(content: string): void {
    try {
      fs.writeFileSync(this.filePath, content, 'utf8');
    } catch (error) {
      console.error('Error writing file:', error);
    }
  }
}
