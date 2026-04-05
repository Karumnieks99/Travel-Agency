import { spawn } from "node:child_process";
import { rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const projectRoot = process.cwd();

const imageEntries = [
  { input: "public/photos/dest-bali-penida.jpg" },
  { input: "public/photos/dest-besakih-bali.jpg" },
  { input: "public/photos/dest-flores-komodo.jpg" },
  { input: "public/photos/dest-kalimantan.jpg" },
  { input: "public/photos/dest-kelimutu.jpg" },
  { input: "public/photos/dest-lombok-gili.jpg" },
  { input: "public/photos/dest-maluku.jpg" },
  { input: "public/photos/dest-papua.jpg" },
  { input: "public/photos/dest-raja-ampat.jpg" },
  { input: "public/photos/dest-sulawesi.jpg" },
  { input: "public/photos/dest-sumatra-java.jpg" },
  { input: "public/photos/gallery-flores-ridge.jpg" },
  { input: "public/photos/gallery-rice-terrace.jpg" },
  { input: "public/photos/logo.png", resizeWidth: 256 },
];

const videoEntries = [
  {
    input: "public/videos/bali-video.mp4",
    maxWidth: 1280,
    mp4Crf: 30,
    webmCrf: 38,
  },
  {
    input: "public/videos/monkey.mp4",
    maxWidth: 1280,
    mp4Crf: 31,
    webmCrf: 40,
  },
];

function resolvePath(relativePath) {
  return path.join(projectRoot, relativePath);
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || `ffmpeg exited with code ${code}`));
    });
  });
}

function buildScaleFilter(maxWidth) {
  return `scale='min(${maxWidth},iw)':-2:flags=lanczos`;
}

async function optimizeImages() {
  for (const entry of imageEntries) {
    const inputPath = resolvePath(entry.input);
    const outputPath = inputPath.replace(/\.(jpe?g|png)$/i, ".webp");
    const image = sharp(inputPath, { failOn: "none" });

    if (entry.resizeWidth) {
      image.resize({ width: entry.resizeWidth, withoutEnlargement: true });
    }

    await image.webp({ quality: 78, effort: 6 }).toFile(outputPath);
    console.log(`image -> ${path.relative(projectRoot, outputPath)}`);
  }
}

async function optimizeVideos() {
  for (const entry of videoEntries) {
    const inputPath = resolvePath(entry.input);
    const tmpMp4Path = inputPath.replace(/\.mp4$/i, ".tmp.mp4");
    const webmPath = inputPath.replace(/\.mp4$/i, ".webm");
    const scaleFilter = buildScaleFilter(entry.maxWidth);

    await runFfmpeg([
      "-y",
      "-i",
      inputPath,
      "-vf",
      scaleFilter,
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      String(entry.mp4Crf),
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p",
      tmpMp4Path,
    ]);

    await runFfmpeg([
      "-y",
      "-i",
      tmpMp4Path,
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      String(entry.webmCrf),
      "-deadline",
      "good",
      "-cpu-used",
      "4",
      "-row-mt",
      "1",
      webmPath,
    ]);

    await rm(inputPath, { force: true });
    await rename(tmpMp4Path, inputPath);

    console.log(`video -> ${path.relative(projectRoot, inputPath)}`);
    console.log(`video -> ${path.relative(projectRoot, webmPath)}`);
  }
}

async function removeUnusedPublicVideo() {
  const unusedPath = resolvePath("public/videos/island.mp4");
  if (!(await fileExists(unusedPath))) return;
  await rm(unusedPath, { force: true });
  console.log("removed -> public/videos/island.mp4");
}

await optimizeImages();
await optimizeVideos();
await removeUnusedPublicVideo();
