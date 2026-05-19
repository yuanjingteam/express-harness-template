import fs from 'fs';
import path from 'path';

function getTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getTsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const SRC_DIR = path.resolve(__dirname, '../../src');
const CONTROLLER_DIR = path.join(SRC_DIR, 'modules/user/controller');
const SERVICE_DIR = path.join(SRC_DIR, 'modules/user/service');

describe('Layering Architecture', () => {
  let controllerFiles: string[];
  let serviceFiles: string[];

  beforeAll(() => {
    controllerFiles = getTsFiles(CONTROLLER_DIR);
    serviceFiles = getTsFiles(SERVICE_DIR);
  });
  // 测试controller是否直接导入repository
  it('controller should not import repository directly', () => {
    controllerFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const hasRepoImport = content.includes('../repository') || content.includes('/repository');
      expect(hasRepoImport).toBe(false);
    });
  });
  // 测试controller是否直接导入 Prisma 客户端
  it('controller should not import prisma directly', () => {
    controllerFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const hasPrismaImport = content.includes('shared/prisma') || content.includes('@prisma/client');
      expect(hasPrismaImport).toBe(false);
    });
  });
  // 测试service是否直接导入controller
  it('service should not import controller', () => {
    serviceFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const hasControllerImport = content.includes('../controller') || content.includes('/controller');
      expect(hasControllerImport).toBe(false);
    });
  });
});
