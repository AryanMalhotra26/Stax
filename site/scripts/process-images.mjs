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

/**
 * Hero parallax layers (§8.1, Route B).
 *
 * The hero environment needs plates at different depths. Route A cuts alpha
 * silhouettes out of the renders in Photoshop, which reads richer but needs a
 * human with a pen tool; Route B builds the same illusion from three layers —
 * a CSS sky gradient, the render itself, and a blurred crop of the render's
 * own foreground — and it is what ships here.
 *
 * Only the third needs generating. It is the bottom slice of the street view,
 * heavily blurred and dropped in exposure, so it reads as out-of-focus kerb
 * and planting a metre in front of the camera. Blurring first means there is
 * no detail left to preserve, so it stays tiny at 1600px — the whole layer is
 * a few tens of KB against a 900KB budget for the environment.
 */
const HERO_LAYERS = [
  {
    // The garden view, not the street view: its bottom edge is lawn and
    // flowering planting beds, which is what a foreground plate wants. The
    // street view's is asphalt, and blurred asphalt is a grey gradient.
    file: "EXT 3 2.jpg",
    slug: "hero-near",
    /** Fraction of the source height to keep, measured from the bottom. */
    crop: 0.26,
    blur: 11,
    widths: [1024, 1600],
  },
];

/**
 * The oak-floor substrate (§5.4, §8.2).
 *
 * The amenities walkthrough is the moment the page goes *inside*, and the
 * reference sells its equivalent moment by standing its cards on a real
 * photographic surface — grass, a picnic blanket, a compass — rather than on
 * a flat colour. Flat colour is what made this section read as dead.
 *
 * This is a warm dark floor generated rather than sourced. A CC0 wood
 * photograph would be 300–800KB for something that renders at 18% size behind
 * a scrim at low contrast; this is a perfectly seamless 512px tile in under
 * 10KB. Every frequency below is an integer number of cycles across the tile,
 * which is what makes the wrap invisible — a photograph tiled at this size
 * shows its repeat immediately and there is no way to fix that after the fact.
 */
const TEXTURE_OUT = path.resolve(__dirname, "../public/textures");

async function buildTextures() {
  const S = 512;
  const data = Buffer.alloc(S * S * 3);
  const TAU = Math.PI * 2;

  // Grain: stretched along x, tight in y, so it reads as boards running
  // across rather than as noise.
  const bands = [
    { fx: 1, fy: 7, a: 0.5, p: 0.0 },
    { fx: 2, fy: 13, a: 0.3, p: 1.7 },
    { fx: 1, fy: 23, a: 0.22, p: 3.1 },
    { fx: 3, fy: 41, a: 0.14, p: 5.2 },
    { fx: 2, fy: 67, a: 0.09, p: 2.4 },
  ];

  for (let y = 0; y < S; y += 1) {
    for (let x = 0; x < S; x += 1) {
      let n = 0;
      for (const b of bands) {
        n += b.a * Math.sin(TAU * ((b.fx * x) / S + (b.fy * y) / S) + b.p);
      }

      // Board seams every 128px, with the joint one shade darker than grain.
      const seam = y % 128 < 2 ? -0.4 : 0;
      // Plank-to-plank variation, so adjacent boards are not identical.
      const plank = 0.05 * Math.sin(TAU * (Math.floor(y / 128) / 4) + 0.9);

      const k = 1 + 0.1 * n + seam + plank;
      const i = (y * S + x) * 3;
      // Dark enough that a `bark` card still separates from the floor it is
      // standing on. A substrate has to lose to the content on top of it.
      data[i] = Math.max(0, Math.min(255, Math.round(52 * k)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(36 * k)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(28 * k)));
    }
  }

  await mkdir(TEXTURE_OUT, { recursive: true });
  const img = sharp(data, { raw: { width: S, height: S, channels: 3 } });
  await img.clone().avif({ quality: 46, effort: 6 }).toFile(path.join(TEXTURE_OUT, "oak-floor.avif"));
  await img.clone().webp({ quality: 70 }).toFile(path.join(TEXTURE_OUT, "oak-floor.webp"));
  console.log("  \u2713 textures/oak-floor      512\u00d7512 seamless");
}

async function buildHeroLayers() {
  const available = new Set(await readdir(SRC));

  for (const layer of HERO_LAYERS) {
    if (!available.has(layer.file)) {
      console.warn(`  ! missing source, skipping: ${layer.file}`);
      continue;
    }
    const src = path.join(SRC, layer.file);
    const meta = await sharp(src, { limitInputPixels: false }).metadata();
    const height = Math.round(meta.height * layer.crop);

    for (const w of layer.widths) {
      const base = sharp(src, { limitInputPixels: false })
        .extract({ left: 0, top: meta.height - height, width: meta.width, height })
        .resize(w)
        .blur(layer.blur)
        // Golden hour is warm and the foreground is in shadow: darken and
        // pull saturation so the plate sits *under* the lit facades rather
        // than competing with them.
        .modulate({ brightness: 0.72, saturation: 0.85 });

      await base.clone().avif({ quality: 48, effort: 6 }).toFile(path.join(OUT, `${layer.slug}-${w}.avif`));
      await base.clone().webp({ quality: 66 }).toFile(path.join(OUT, `${layer.slug}-${w}.webp`));
    }

    console.log(`  \u2713 ${layer.slug.padEnd(24)} bottom ${layer.crop * 100}% \u2192 blur ${layer.blur}`);
  }
}

async function lqip(input) {
  // 20px wide WebP, base64 inlined. Renders behind the real image to kill CLS
  // without a network round trip.
  const buf = await sharp(input)
    .resize(20, null, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

/**
 * `ONLY=hero npm run images` rebuilds just the parallax plates. Re-encoding
 * every render to change one derived layer costs minutes and churns a hundred
 * committed binaries for nothing.
 */
const ONLY = process.env.ONLY;

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  if (ONLY === "hero") {
    await buildHeroLayers();
    await buildTextures();
    return;
  }

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

  await buildHeroLayers();
  await buildTextures();

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
