/**
 * Find upload files on disk that are not referenced in the database.
 *
 * Usage:
 *   npm run uploads:orphans              # report only (safe)
 *   npm run uploads:orphans -- --delete  # delete orphan files
 */
import 'dotenv/config';
import { existsSync, readdirSync, statSync, unlinkSync } from 'fs';
import { basename, join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
/** Matches /uploads/... in relative URLs, HTML src, or absolute API URLs. */
const UPLOAD_REF_RE = /\/uploads\/([^\s"'<>?)]+)/gi;

function extractUploadFilenames(text: string | null | undefined): string[] {
  if (!text?.trim()) return [];
  const names: string[] = [];
  for (const match of text.matchAll(UPLOAD_REF_RE)) {
    const raw = match[1]?.trim();
    if (!raw) continue;
    const name = basename(raw.split('?')[0] ?? '');
    if (name && IMAGE_EXT.test(name)) names.push(name);
  }
  return names;
}

function addFromText(used: Set<string>, text: string | null | undefined) {
  for (const name of extractUploadFilenames(text)) used.add(name);
}

async function collectReferencedFilenames(): Promise<Set<string>> {
  const used = new Set<string>();

  const categories = await prisma.category.findMany({
    select: { thumbnail: true, description: true },
  });
  for (const row of categories) {
    addFromText(used, row.thumbnail);
    addFromText(used, row.description);
  }

  const products = await prisma.product.findMany({
    select: {
      thumbnail: true,
      description: true,
      short_description: true,
    },
  });
  for (const row of products) {
    addFromText(used, row.thumbnail);
    addFromText(used, row.description);
    addFromText(used, row.short_description);
  }

  const productImages = await prisma.productImage.findMany({
    select: { image_url: true },
  });
  for (const row of productImages) {
    addFromText(used, row.image_url);
  }

  const collections = await prisma.collection.findMany({
    select: { thumbnail: true, description: true },
  });
  for (const row of collections) {
    addFromText(used, row.thumbnail);
    addFromText(used, row.description);
  }

  const cmsPages = await prisma.cmsPage.findMany({
    select: { thumbnail: true, content: true },
  });
  for (const row of cmsPages) {
    addFromText(used, row.thumbnail);
    addFromText(used, row.content);
  }

  const blogPosts = await prisma.blogPost.findMany({
    select: { thumbnail: true, content: true, excerpt: true },
  });
  for (const row of blogPosts) {
    addFromText(used, row.thumbnail);
    addFromText(used, row.content);
    addFromText(used, row.excerpt);
  }

  return used;
}

function resolveUploadDir(): string {
  const raw = process.env.UPLOAD_DIR?.trim() || './uploads';
  return join(process.cwd(), raw.replace(/^\.\//, ''));
}

function listDiskFiles(uploadDir: string): string[] {
  if (!existsSync(uploadDir)) return [];
  return readdirSync(uploadDir).filter((name) => IMAGE_EXT.test(name));
}

function formatBytes(total: number): string {
  if (total < 1024) return `${total} B`;
  if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
  return `${(total / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  const shouldDelete = process.argv.includes('--delete');
  const uploadDir = resolveUploadDir();

  console.log(`Upload directory: ${uploadDir}\n`);

  const referenced = await collectReferencedFilenames();
  const onDisk = listDiskFiles(uploadDir);

  const diskSet = new Set(onDisk);
  const orphans = onDisk.filter((name) => !referenced.has(name)).sort();
  const missingOnDisk = [...referenced].filter((name) => !diskSet.has(name)).sort();

  console.log('--- Summary ---');
  console.log(`Referenced in DB:     ${referenced.size}`);
  console.log(`Files on disk:        ${onDisk.length}`);
  console.log(`Orphans (safe delete): ${orphans.length}`);
  console.log(`Missing on disk:      ${missingOnDisk.length}`);
  console.log('');

  if (referenced.size > 0) {
    console.log('--- Referenced files ---');
    for (const name of [...referenced].sort()) {
      const flag = diskSet.has(name) ? '' : '  [MISSING ON DISK]';
      console.log(`  ${name}${flag}`);
    }
    console.log('');
  }

  if (orphans.length > 0) {
    console.log('--- Orphan files (not in DB) ---');
    let orphanBytes = 0;
    for (const name of orphans) {
      const path = join(uploadDir, name);
      try {
        orphanBytes += statSync(path).size;
      } catch {
        // ignore
      }
      console.log(`  ${name}`);
    }
    console.log(`\nReclaimable (approx): ${formatBytes(orphanBytes)}`);
    console.log('');

    if (shouldDelete) {
      let deleted = 0;
      for (const name of orphans) {
        const path = join(uploadDir, name);
        try {
          unlinkSync(path);
          deleted++;
          console.log(`Deleted: ${name}`);
        } catch (err) {
          console.error(`Failed to delete ${name}:`, err);
        }
      }
      console.log(`\nDeleted ${deleted}/${orphans.length} orphan file(s).`);
    } else {
      console.log('Dry run — no files deleted.');
      console.log('To delete orphans: npm run uploads:orphans -- --delete');
    }
  } else {
    console.log('No orphan files found.');
  }

  if (missingOnDisk.length > 0) {
    console.log('\n--- Referenced in DB but missing on disk ---');
    for (const name of missingOnDisk) {
      console.log(`  ${name}`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
