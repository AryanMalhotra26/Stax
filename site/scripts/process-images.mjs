/**
 * Pre-generates responsive AVIF/WebP variants + LQIP placeholders from the
 * source renders. Runs at build time, never per-request — Workers gives you
 * 10ms CPU per invocation and a 12MB render blows through that instantly.
 *
 *   node scripts/process-images.mjs
 *
 * Source renders live outside the app (../Images) so the 100MB+ of originals
 * never enters the deploy bundle. Only the generated variants ship.
 */
import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../../Images");
const OUT = path.resolve(__dirname, "../public/renders");
const MANIFEST = path.resolve(__dirname, "../src/content/generated/media.ts");

const TEAM_SRC = path.resolve(__dirname, "../../Team");
const TEAM_OUT = path.resolve(__dirname, "../public/team");

const WIDTHS = [640, 1024, 1600, 2400];
/** Headshots render in a 4:5 card at ~380px wide; 1x and 2x is all that's needed. */
const TEAM_WIDTHS = [400, 800];

/**
 * Maps source filenames to stable slugs + the metadata the `media` table
 * carries (§5). Alt text is authored here rather than generated — it is the
 * one field that has to be written by a human.
 */
const CATALOG = [
  {
    file: "EXT 1 2.jpg",
    slug: "exterior-street",
    category: "exterior",
    alt: "Two Stax residential blocks facing the street at dusk, with ground-floor commercial units and young trees along the sidewalk.",
  },
  {
    file: "EXT 2 2.jpg",
    slug: "exterior-lawn",
    category: "exterior",
    alt: "A three-storey Stax block in white panel and cedar cladding, seen across an open lawn on a clear afternoon.",
  },
  {
    file: "EXT 3 2.jpg",
    slug: "exterior-garden",
    category: "exterior",
    alt: "Stax townhouse block with private entry stairs and landscaped planting beds in the foreground.",
  },
  {
    file: "EXT 4 2.jpg",
    slug: "exterior-evening",
    category: "exterior",
    alt: "Stax block at blue hour with warm light in the windows and cedar-clad bays running the full height of the facade.",
  },
  {
    file: "1 - STANDARD KITCHEN..jpg",
    slug: "kitchen-standard",
    category: "interior",
    alt: "Standard Stax kitchen with pale cabinetry, stainless appliances and a dining table beside a large window overlooking treetops.",
  },
  {
    file: "2 - UPGRADE LIVING.jpg",
    slug: "living-upgrade-island",
    category: "interior",
    alt: "Upgraded open-plan living space with a marble waterfall island, bar seating and a living area beyond.",
  },
  {
    file: "3 - UPGRADE LIVING.jpg",
    slug: "living-upgrade-dining",
    category: "interior",
    alt: "Upgraded living and dining area with a linear pendant light, sectional sofa and windows on three sides.",
  },
  {
    file: "4. BEDROOM.jpg",
    slug: "bedroom",
    category: "interior",
    alt: "Bedroom with an upholstered bed, floating nightstands and a tall window looking out over trees.",
  },
  {
    file: "5. BATHROOM.jpg",
    slug: "bathroom",
    category: "interior",
    alt: "Bathroom with stone-look tile, a walk-in glass shower, matte black fixtures and a wood-grain floating vanity.",
  },
  {
    file: "PÓS_SITE PLAN.jpg",
    slug: "site-plan",
    category: "neighbourhood",
    alt: "Aerial site plan showing the eight Stax residential blocks arranged around landscaped courtyards and surface parking.",
  },
];

async function lqip(input) {
  // 20px wide WebP, base64 inlined. Renders behind the real image to kill CLS
  // without a network round trip.
  const buf = await sharp(input)
    .resize(20, null, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const available = new Set(await readdir(SRC));
  const records = [];

  for (const item of CATALOG) {
    const src = path.join(SRC, item.file);
    if (!available.has(item.file)) {
      console.warn(`  ! missing source, skipping: ${item.file}`);
      continue;
    }

    const image = sharp(src, { limitInputPixels: false });
    const meta = await image.metadata();
    const variants = { avif: {}, webp: {} };

    for (const w of WIDTHS) {
      if (meta.width && w > meta.width) continue;

      const base = sharp(src, { limitInputPixels: false }).resize(w, null, {
        fit: "inside",
        withoutEnlargement: true,
      });

      const avifName = `${item.slug}-${w}.avif`;
      const webpName = `${item.slug}-${w}.webp`;

      // effort 6 is the sweet spot — effort 9 doubles build time for ~2% size
      await base.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(OUT, avifName));
      await base.clone().webp({ quality: 74 }).toFile(path.join(OUT, webpName));

      variants.avif[w] = `/renders/${avifName}`;
      variants.webp[w] = `/renders/${webpName}`;
    }

    const placeholder = await lqip(src);

    records.push({
      id: item.slug,
      slug: item.slug,
      category: item.category,
      alt: item.alt,
      width: meta.width,
      height: meta.height,
      variants,
      placeholder,
    });

    const largest = Math.max(...Object.keys(variants.avif).map(Number));
    console.log(`  ✓ ${item.slug.padEnd(24)} ${meta.width}×${meta.height} → ${Object.keys(variants.avif).length} widths (max ${largest})`);
  }

  // --- team headshots -----------------------------------------------------
  // Separate output and a separate manifest entry shape: these are 4:5 crops
  // at card size, not full-bleed renders, so they don't need the 2400 tier.
  const team = [];
  try {
    const files = (await readdir(TEAM_SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
    await mkdir(TEAM_OUT, { recursive: true });

    for (const file of files.sort()) {
      const slug = file.replace(/\.[^.]+$/, "");
      const src = path.join(TEAM_SRC, file);
      const variants = { avif: {}, webp: {} };

      for (const w of TEAM_WIDTHS) {
        const base = sharp(src)
          // Crop to the card ratio at source so the browser never has to
          // object-fit a portrait into a 4:5 box and cut off a chin.
          .resize(w, Math.round((w * 5) / 4), {
            fit: "cover",
            position: "top",
            withoutEnlargement: true,
          });

        await base.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(TEAM_OUT, `${slug}-${w}.avif`));
        await base.clone().webp({ quality: 80 }).toFile(path.join(TEAM_OUT, `${slug}-${w}.webp`));

        variants.avif[w] = `/team/${slug}-${w}.avif`;
        variants.webp[w] = `/team/${slug}-${w}.webp`;
      }

      team.push({ slug, variants, placeholder: await lqip(src) });
      console.log(`  ✓ team/${slug}`);
    }
  } catch {
    console.warn("  ! no ../Team directory — skipping headshots");
  }

  const banner = `// GENERATED by scripts/process-images.mjs — do not edit by hand.
// Run \`npm run images\` after adding or replacing a render.
// Shape mirrors the \`media\` table so this swaps to a Supabase query cleanly.
`;

  await writeFile(
    MANIFEST,
    `${banner}
export type MediaCategory =
  | "interior"
  | "exterior"
  | "amenity"
  | "view"
  | "floorplan"
  | "neighbourhood";

export type Media = {
  id: string;
  slug: string;
  category: MediaCategory;
  alt: string;
  width: number;
  height: number;
  variants: {
    avif: Record<string, string>;
    webp: Record<string, string>;
  };
  placeholder: string;
};

export const MEDIA = ${JSON.stringify(records, null, 2)} as const satisfies readonly Media[];

export const mediaBySlug = Object.fromEntries(
  MEDIA.map((m) => [m.slug, m]),
) as Record<string, Media>;

export function media(slug: string): Media {
  const found = mediaBySlug[slug];
  if (!found) throw new Error(\`Unknown media slug: \${slug}\`);
  return found;
}

/** Team headshots — 4:5 crops, 1x and 2x only. */
export type Headshot = {
  slug: string;
  variants: { avif: Record<string, string>; webp: Record<string, string> };
  placeholder: string;
};

export const HEADSHOTS = ${JSON.stringify(team, null, 2)} as const satisfies readonly Headshot[];

export const headshotBySlug = Object.fromEntries(
  HEADSHOTS.map((h) => [h.slug, h]),
) as Record<string, Headshot | undefined>;
`,
    "utf8",
  );

  console.log(`\nWrote ${records.length} records → src/content/generated/media.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
