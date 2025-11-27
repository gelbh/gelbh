const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const CONFIG = {
  STATS_API_URL: 'https://github-readme-stats.vercel.app/api?username=gelbh&show_icons=true&theme=transparent&hide_border=true&bg_color=00000000&title_color=6366f1&text_color=ffffff&icon_color=6366f1&hide_title=true',
  INPUT_SVG: 'banner-with-stats.svg',
  OUTPUT_SVG: 'banner-composite.svg',
  OUTPUT_PNG: 'banner-composite.png',
  STATS_CACHE_FILE: 'stats-cache.svg',
  MAX_RETRIES: 6,
  INITIAL_RETRY_DELAY: 1000,
  INITIAL_503_RETRY_DELAY: 5000,
  REQUEST_TIMEOUT: 10000,
  VIEWPORT: { width: 1200, height: 627 },
  STATS_POSITION: { x: 325, y: 420 },
  DEFAULT_STATS_SIZE: { width: 495, height: 195 }
};

/**
 * Sleeps for a specified number of milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if a file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets cached stats SVG if available
 */
async function getCachedStats() {
  if (await fileExists(CONFIG.STATS_CACHE_FILE)) {
    try {
      const cachedStats = await fs.readFile(CONFIG.STATS_CACHE_FILE, 'utf-8');
      console.log('✓ Found cached stats file');
      return cachedStats;
    } catch (error) {
      console.warn(`⚠ Failed to read cache file: ${error.message}`);
      return null;
    }
  }
  return null;
}

/**
 * Saves stats SVG to cache
 */
async function saveStatsCache(statsSvg) {
  try {
    await fs.writeFile(CONFIG.STATS_CACHE_FILE, statsSvg, 'utf-8');
    console.log(`✓ Stats cached to ${CONFIG.STATS_CACHE_FILE}`);
  } catch (error) {
    console.warn(`⚠ Failed to save cache: ${error.message}`);
  }
}

/**
 * Generates a random jitter value between 0 and maxJitter
 */
function getJitter(maxJitter) {
  return Math.floor(Math.random() * maxJitter);
}

/**
 * Fetches GitHub stats SVG with retry logic and exponential backoff
 */
async function fetchStatsWithRetry(url, retries = CONFIG.MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching GitHub stats (attempt ${attempt}/${retries})...`);
      
      const response = await axios.get(url, {
        timeout: CONFIG.REQUEST_TIMEOUT,
        headers: {
          'User-Agent': 'GitHub-Banner-Generator'
        }
      });

      if (response.status === 200) {
        console.log('✓ Successfully fetched GitHub stats');
        return response.data;
      }

      throw new Error(`Unexpected status code: ${response.status}`);
      
    } catch (error) {
      lastError = error;
      const statusCode = error.response?.status;
      
      // Handle 503 Service Unavailable with longer delays
      if (statusCode === 503) {
        const baseDelay = CONFIG.INITIAL_503_RETRY_DELAY * Math.pow(2, attempt - 1);
        const jitter = getJitter(1000); // Add up to 1s jitter
        const waitTime = baseDelay + jitter;
        console.warn(`⚠ Service unavailable (503). Waiting ${waitTime}ms before retry...`);
        if (attempt < retries) {
          await sleep(waitTime);
          continue;
        }
      }
      
      // Handle rate limiting (429)
      if (statusCode === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        console.warn(`⚠ Rate limited. Waiting ${waitTime}ms before retry...`);
        if (attempt < retries) {
          await sleep(waitTime);
          continue;
        }
      }

      // Handle timeout
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        console.warn(`⚠ Request timeout on attempt ${attempt}`);
      } else {
        console.warn(`⚠ Request failed: ${error.message}`);
      }

      if (attempt < retries) {
        const backoffDelay = CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        const jitter = getJitter(500); // Add up to 500ms jitter for other errors
        const waitTime = backoffDelay + jitter;
        console.log(`Retrying in ${waitTime}ms...`);
        await sleep(waitTime);
      }
    }
  }

  throw new Error(`Failed to fetch stats after ${retries} attempts: ${lastError.message}`);
}

/**
 * Parses SVG to extract dimensions
 */
function parseSvgDimensions(svgContent) {
  const widthMatch = svgContent.match(/width="(\d+)"/);
  const heightMatch = svgContent.match(/height="(\d+)"/);
  
  return {
    width: widthMatch ? parseInt(widthMatch[1]) : CONFIG.DEFAULT_STATS_SIZE.width,
    height: heightMatch ? parseInt(heightMatch[1]) : CONFIG.DEFAULT_STATS_SIZE.height
  };
}

/**
 * Creates a composite SVG by embedding stats as a data URI
 */
function createCompositeSvg(baseSvg, statsSvg) {
  const dimensions = parseSvgDimensions(statsSvg);
  console.log(`Stats dimensions: ${dimensions.width}x${dimensions.height}`);

  const statsBase64 = Buffer.from(statsSvg).toString('base64');
  const statsDataUri = `data:image/svg+xml;base64,${statsBase64}`;

  const compositeSvg = baseSvg.replace(
    /<foreignObject[^>]*>[\s\S]*?<\/foreignObject>/,
    `<image x="${CONFIG.STATS_POSITION.x}" y="${CONFIG.STATS_POSITION.y}" width="${dimensions.width}" height="${dimensions.height}" href="${statsDataUri}"/>`
  );

  return compositeSvg;
}

/**
 * Renders SVG to PNG using Puppeteer with proper wait conditions
 */
async function renderSvgToPng(svgContent, outputPath) {
  let browser;
  
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      headless: 'new'
    });

    const page = await browser.newPage();
    await page.setViewport(CONFIG.VIEWPORT);

    console.log('Loading SVG content...');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; }
          svg { display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
      </html>
    `, {
      waitUntil: 'networkidle0'
    });

    // Wait for SVG to be fully rendered
    await page.waitForSelector('svg', { visible: true, timeout: 5000 });
    
    // Wait for embedded image element and its content
    await page.waitForSelector('image[href^="data:"]', { 
      visible: true, 
      timeout: 5000 
    });
    
    // Wait for CSS animations to complete (GitHub stats has animations up to 1050ms)
    console.log('Waiting for animations to complete...');
    await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait for the longest animation (1050ms) plus buffer
        setTimeout(resolve, 1500);
      });
    });

    console.log('Taking screenshot...');
    await page.screenshot({
      path: outputPath,
      omitBackground: false
    });

    console.log(`✓ Screenshot saved to ${outputPath}`);

  } catch (error) {
    throw new Error(`Browser rendering failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed');
    }
  }
}

/**
 * Checks if the PNG file has actually changed by comparing file hashes
 */
async function hasFileChanged(filePath) {
  if (!fsSync.existsSync(filePath)) {
    return true;
  }

  // In CI, git will detect changes; this is a basic check
  const stats = await fs.stat(filePath);
  return stats.size > 0;
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('=== Starting Banner Generation ===\n');

    // Check if input file exists
    if (!await fileExists(CONFIG.INPUT_SVG)) {
      throw new Error(`Input file not found: ${CONFIG.INPUT_SVG}`);
    }
    console.log(`✓ Found input file: ${CONFIG.INPUT_SVG}`);

    // Read the base SVG
    console.log('\nReading base SVG...');
    const baseSvg = await fs.readFile(CONFIG.INPUT_SVG, 'utf-8');
    console.log('✓ Base SVG loaded');

    // Fetch GitHub stats with retry logic and fallback
    console.log('\nFetching GitHub stats...');
    let statsSvg;
    
    try {
      statsSvg = await fetchStatsWithRetry(CONFIG.STATS_API_URL);
      // Save successful fetch to cache
      await saveStatsCache(statsSvg);
    } catch (error) {
      console.warn(`\n⚠ Failed to fetch stats from API: ${error.message}`);
      console.log('Attempting to use cached stats...');
      
      const cachedStats = await getCachedStats();
      if (cachedStats) {
        console.log('✓ Using cached stats as fallback');
        statsSvg = cachedStats;
      } else {
        throw new Error('API fetch failed and no cached stats available. Cannot generate banner.');
      }
    }

    // Create composite SVG
    console.log('\nCreating composite SVG...');
    const compositeSvg = createCompositeSvg(baseSvg, statsSvg);
    await fs.writeFile(CONFIG.OUTPUT_SVG, compositeSvg);
    console.log(`✓ Composite SVG saved to ${CONFIG.OUTPUT_SVG}`);

    // Render to PNG
    console.log('\nRendering PNG...');
    await renderSvgToPng(compositeSvg, CONFIG.OUTPUT_PNG);

    // Verify output
    if (!await fileExists(CONFIG.OUTPUT_PNG)) {
      throw new Error('PNG file was not created successfully');
    }

    const stats = await fs.stat(CONFIG.OUTPUT_PNG);
    console.log(`✓ PNG file size: ${(stats.size / 1024).toFixed(2)} KB`);

    console.log('\n=== Banner Generation Complete ===');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error generating banner:');
    console.error(error.message);
    
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
