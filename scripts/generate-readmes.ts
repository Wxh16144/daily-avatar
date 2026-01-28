
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MOOD_TEMPLATES } from '../src/constants/moodTemplates.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEEK_DAYS = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const WEEK_LABELS = [
  '周一', '周二', '周三', '周四', '周五', '周六', '周日'
];

const PUBLIC_DIR = path.resolve(__dirname, '../public');

async function generateReadmes() {
  console.log('Generating README.md for templates...');

  for (const template of MOOD_TEMPLATES) {
    // 构造目标目录路径
    // template.path 例如 "/mood-avatars/templates/cat-style"
    // 需要去掉开头的 "/" 并拼接到 public 目录下
    const relativePath = template.path.replace(/^\//, '');
    const targetDir = path.join(PUBLIC_DIR, relativePath);

    if (!fs.existsSync(targetDir)) {
      console.warn(`Warning: Directory not found for template ${template.id}: ${targetDir}`);
      continue;
    }

    const fileExt = template.id === 'default' ? 'svg' : 'jpg';
    
    // 生成图片预览行
    const imgCells = WEEK_DAYS.map(day => 
      `<img src="./${day}.${fileExt}" width="256" />`
    ).join(' | ');

    const readmeContent = `---
name: ${template.name}
description: ${template.description}
copyright: ${template.copyright}
url: ${template.url || ''}
---

# ${template.name}

${template.description}

### 预览

| ${WEEK_LABELS.join(' | ')} |
| ${WEEK_LABELS.map(() => ':---:').join(' | ')} |
| ${imgCells} |
`;

    const readmePath = path.join(targetDir, 'README.md');
    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
    console.log(`Generated README.md for ${template.name} at ${path.relative(process.cwd(), readmePath)}`);
  }

  console.log('Done!');
}

generateReadmes().catch(console.error);
