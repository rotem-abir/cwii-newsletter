import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROPERTIES_DIR = path.join(__dirname, 'properties');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
function buildYmStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const YM_STAMP = buildYmStamp();
const OUTPUT_PATH = path.join(__dirname, 'dist', `index-${YM_STAMP}.build.html`);
const WEB_OUTPUT_PATH = path.join(__dirname, 'dist', `index-${YM_STAMP}.web.html`);
const WEB_FILENAME = `index-${YM_STAMP}.web.html`;

const PLACEHOLDER_PROPERTIES = '{{PROPERTIES}}';

const CARD_INDIGO_TEMPLATE = `          <!-- indigo band -->
          <tr>
            <td style="background-color:#1D1740; padding:0;" bgcolor="#1D1740">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <!-- property card start -->
                <!-- inner rail -->
                <tr>
                  <td style="padding:38px 0 8px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:40px; font-weight:bold; color:#0093AD; padding:0 26px;">{{TITLE_1}}</td>
                      </tr>
                      {{TITLE_2_ROW}}
                    </table>
                  </td>
                </tr>
                <!-- image crop box -->
                <tr>
                  <td align="right" style="padding:20px 0 20px 0; vertical-align:top;">
                    <table role="presentation" width="450" cellspacing="0" cellpadding="0" border="0" align="right">
                      <tr>
                        <td width="450" height="280" align="right" style="width:450px; height:280px; overflow:hidden; vertical-align:top;">
                          <!-- If Outlook cropping fails for a specific image, manually pre-crop that one -->
                          <img src="{{IMG}}" alt="" width="450" height="280" style="display:block; height:280px; max-width:450px; min-width:450px;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- meta + description -->
                <tr>
                  <td style="padding:12px 0 8px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:22px; font-weight:bold; color:#FFFFFF; padding:0 26px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-size:22px; color:#FFFFFF; line-height:35px; padding:8px 26px 0 26px;">{{DESC}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- cta row -->
                <tr>
                  <td style="padding:12px 0 40px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding:26px 26px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right">
                            <tr>
                              <td style="padding-left:12px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="background-color:#0093AD;" bgcolor="#0093AD">
                                      <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:16px 24px; font-size:22px; font-weight:bold; color:#FFFFFF; text-decoration:none;">לפרטים נוספים</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="border:1px solid #0093AD; background-color:#1D1740;" bgcolor="#1D1740">
                                      <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:16px 22px; font-size:22px; font-weight:bold; color:#FFFFFF; text-decoration:none;">{{AGENT_TEXT}}</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- property card end -->
              </table>
            </td>
          </tr>`;

const CARD_WHITE_TEMPLATE = `          <!-- property card (light) -->
          <tr>
            <td style="background-color:#FFFFFF; padding:0;" bgcolor="#FFFFFF">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <!-- property card start -->
                <!-- inner rail -->
                <tr>
                  <td style="padding:38px 0 8px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:40px; font-weight:bold; color:#0093AD; line-height:1.5; padding:0 26px;">{{TITLE_1}}</td>
                      </tr>
                      {{TITLE_2_ROW}}
                    </table>
                  </td>
                </tr>
                <!-- image crop box -->
                <tr>
                  <td align="right" style="padding:20px 0 20px 0; vertical-align:top;">
                    <table role="presentation" width="450" cellspacing="0" cellpadding="0" border="0" align="right">
                      <tr>
                        <td width="450" height="280" align="right" style="width:450px; height:280px; overflow:hidden; vertical-align:top;">
                          <!-- If Outlook cropping fails for a specific image, manually pre-crop that one -->
                          <img src="{{IMG}}" alt="" width="450" height="280" style="display:block; height:280px; max-width:450px; min-width:450px;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- meta + description -->
                <tr>
                  <td style="padding:12px 0 8px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:22px; font-weight:bold; color:#545859; padding:0 26px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-size:22px; color:#545859; line-height:35px; padding:8px 26px 0 26px;">{{DESC}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- cta row -->
                <tr>
                  <td style="padding:12px 0 40px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding:26px 26px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right">
                            <tr>
                              <td style="padding-left:12px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="background-color:#0093AD;" bgcolor="#0093AD">
                                      <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:16px 24px; font-size:21px; font-weight:bold; color:#FFFFFF; text-decoration:none;">לפרטים נוספים</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="border:1px solid #0093AD; background-color:#FFFFFF;" bgcolor="#FFFFFF">
                                      <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:16px 22px; font-size:21px; font-weight:bold; color:#0093AD; text-decoration:none;">{{AGENT_TEXT}}</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- property card end -->
              </table>
            </td>
          </tr>`;

const CARD_WHITE_RED_TEMPLATE = `          <!-- property card (light, red accent) -->
          <tr>
            <td style="background-color:#FFFFFF; padding:0;" bgcolor="#FFFFFF">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <!-- property card start -->
                <!-- inner rail -->
                <tr>
                  <td style="padding:38px 0 8px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:40px; font-weight:bold; color:#E4002B; line-height:1.5; padding:0 26px;">{{TITLE_1}}</td>
                      </tr>
                      {{TITLE_2_ROW}}
                    </table>
                  </td>
                </tr>
                <!-- image crop box -->
                <tr>
                  <td align="right" style="padding:20px 0 20px 0; vertical-align:top;">
                    <table role="presentation" width="450" cellspacing="0" cellpadding="0" border="0" align="right">
                      <tr>
                        <td width="450" height="280" align="right" style="width:450px; height:280px; overflow:hidden; vertical-align:top;">
                          <!-- If Outlook cropping fails for a specific image, manually pre-crop that one -->
                          <img src="{{IMG}}" alt="" width="450" height="280" style="display:block; height:280px; max-width:450px; min-width:450px;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- meta + description -->
                <tr>
                  <td style="padding:12px 0 8px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:22px; font-weight:bold; color:#545859; padding:0 26px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-size:22px; color:#545859; line-height:35px; padding:8px 26px 0 26px;">{{DESC}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- cta row -->
                <tr>
                  <td style="padding:12px 0 40px 0;">
                    <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding:26px 26px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right">
                            <tr>
                              <td style="padding-left:12px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="background-color:#E4002B;" bgcolor="#E4002B">
                                      <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:16px 24px; font-size:21px; font-weight:bold; color:#FFFFFF; text-decoration:none;">לפרטים נוספים</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="border:1px solid #E4002B; background-color:#FFFFFF;" bgcolor="#FFFFFF">
                                      <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:16px 22px; font-size:21px; font-weight:bold; color:#E4002B; text-decoration:none;">{{AGENT_TEXT}}</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- property card end -->
              </table>
            </td>
          </tr>`;

const DEFAULT_COUNTRY_CODE = '972';
const WORD_JOINER = '&#x2060;';

function defangGmailAutolink(text) {
  if (typeof text !== 'string') return '';
  let s = text.replace(/(\d)/g, '$1' + WORD_JOINER);
  s = s.replace(/([,\-])/g, '$1' + WORD_JOINER);
  s = s.replace(/ /g, '&nbsp;');
  return s;
}

function buildWhatsAppUrl(agentText) {
  let digits = String(agentText).replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = DEFAULT_COUNTRY_CODE + digits.slice(1);
  }
  return `https://wa.me/${digits}`;
}

function parsePropertyFile(filePath, content) {
  const basename = path.basename(filePath);
  const lines = content.split(/\r?\n/).map((line) => line.trimEnd());

  const blankIndex = lines.findIndex((line) => line === '');
  if (blankIndex === -1) {
    throw new Error(
      `Invalid property file: ${basename} — missing blank line between title block and fields`
    );
  }

  const titleLines = lines.slice(0, blankIndex);
  if (titleLines.length !== 1 && titleLines.length !== 2) {
    throw new Error(
      `Invalid property file: ${basename} — title block must have 1 or 2 lines, got ${titleLines.length}`
    );
  }
  const firstTitleLine = titleLines[0];
  const variant = firstTitleLine.trimStart().startsWith('<') ? 'WHITE_RED' : undefined;
  const title_1 = variant ? firstTitleLine.replace(/^</, '').trimStart() : firstTitleLine;
  const title_2 = titleLines.length === 2 ? titleLines[1] : undefined;

  const afterBlank = lines.slice(blankIndex + 1);
  const fields = afterBlank.filter((line) => line.length > 0);
  if (fields.length !== 5) {
    throw new Error(
      `Invalid property file: ${basename} — expected exactly 5 fields after title block (IMG_URL, META, DESC, DETAILS_URL, AGENT_TEXT), got ${fields.length}`
    );
  }

  const [imgUrl, meta, desc, detailsUrl, agentText] = fields;

  if (!imgUrl.startsWith('https://')) {
    throw new Error(
      `Invalid property file: ${basename} — IMG_URL must start with https://: ${imgUrl}`
    );
  }
  if (!detailsUrl.startsWith('https://')) {
    throw new Error(
      `Invalid property file: ${basename} — DETAILS_URL must start with https://: ${detailsUrl}`
    );
  }

  return { title_1, title_2, variant, imgUrl, meta, desc, detailsUrl, agentText };
}

function leadingNumericPrefix(basenameNoExt) {
  const m = basenameNoExt.match(/^(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isNaN(n) ? null : n;
}

function naturalSort(filenames) {
  return filenames.sort((a, b) => {
    const baseA = path.basename(a, '.txt');
    const baseB = path.basename(b, '.txt');
    const numA = leadingNumericPrefix(baseA);
    const numB = leadingNumericPrefix(baseB);
    if (numA !== null && numB !== null) return numA - numB;
    return String(a).localeCompare(b);
  });
}

function main() {
  let templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  if (!templateHtml.includes(PLACEHOLDER_PROPERTIES)) {
    console.error(`[ERROR] Template does not contain ${PLACEHOLDER_PROPERTIES}. Cannot build.`);
    process.exit(1);
  }

  const propertyFiles = fs
    .readdirSync(PROPERTIES_DIR)
    .filter((f) => f.endsWith('.txt'))
    .map((f) => path.join(PROPERTIES_DIR, f));

  const sortedFiles = naturalSort(propertyFiles);
  const cards = [];

  for (let i = 0; i < sortedFiles.length; i++) {
    const filePath = sortedFiles[i];
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error(`[ERROR] Cannot read file: ${filePath}`, err.message);
      process.exit(1);
    }
    let prop;
    try {
      prop = parsePropertyFile(filePath, content);
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
      process.exit(1);
    }

    const accent = prop.variant === 'WHITE_RED' ? '#E4002B' : '#0093AD';
    const safeTitle2 = prop.title_2 ? defangGmailAutolink(prop.title_2) : '';
    const title_2_row =
      prop.title_2 && prop.title_2.trim() !== ''
        ? `<tr><td align="right" dir="rtl" style="font-size:40px; font-weight:bold; text-align:right; color:#0093AD; text-decoration:none; line-height:1.5; padding:4px 26px 0 26px; unicode-bidi:isolate; mso-line-height-rule:exactly;"><a href="#" style="color:#0093AD; text-decoration:none; font-weight:bold;"><span style="color:#0093AD !important; text-decoration:none !important; font-weight:bold; display:inline;">${safeTitle2}</span></a></td></tr>`
        : '';
    const whatsappUrl = buildWhatsAppUrl(prop.agentText);
    const template =
      prop.variant === 'WHITE_RED'
        ? CARD_WHITE_RED_TEMPLATE
        : i % 2 === 0
          ? CARD_INDIGO_TEMPLATE
          : CARD_WHITE_TEMPLATE;
    const cardHtml = template
      .replace(/\{\{TITLE_1\}\}/g, prop.title_1)
      .replace(/\{\{TITLE_2_ROW\}\}/g, title_2_row)
      .replace(/\{\{IMG\}\}/g, prop.imgUrl)
      .replace(/\{\{META\}\}/g, prop.meta)
      .replace(/\{\{DESC\}\}/g, prop.desc)
      .replace(/\{\{DETAILS_URL\}\}/g, prop.detailsUrl)
      .replace(/\{\{AGENT_TEXT\}\}/g, prop.agentText)
      .replace(/\{\{WHATSAPP_URL\}\}/g, whatsappUrl);
    cards.push(cardHtml);
  }

  const propertiesHtml = cards.join('\n');
  let outputHtml = templateHtml.replace(PLACEHOLDER_PROPERTIES, propertiesHtml);
  outputHtml = outputHtml.replace(/href="index\.web\.html"/g, `href="${WEB_FILENAME}"`);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, outputHtml, 'utf8');

  // Web-optimized version for "view in browser" (responsive, fits viewport)
  let webHtml = outputHtml;
  webHtml = webHtml.replace(
    '<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" dir="rtl" style="background-color:#FFFFFF; font-family:\'Open Sans Hebrew\', Arial, sans-serif;"',
    '<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" dir="rtl" class="web-container" style="max-width:600px; background-color:#FFFFFF; font-family:\'Open Sans Hebrew\', Arial, sans-serif;"'
  );
  const responsiveCSS = `<style>
/* Base: fit viewport on small screens, max 600px like original */
html { -webkit-text-size-adjust: 100%; }
.web-container { max-width: 600px !important; width: 100% !important; box-sizing: border-box !important; }
.web-container table { max-width: 100% !important; box-sizing: border-box !important; }
.web-container td { box-sizing: border-box !important; }
.web-container td[width="450"] { max-width: 100% !important; width: 100% !important; height: auto !important; }
.web-container img { max-width: 100% !important; height: auto !important; min-width: unset !important; width: 100% !important; display: block !important; }
.web-container img[src*="logo_color"] { width: 230px !important; max-width: 230px !important; height: auto !important; }

@media (max-width: 650px) {
  .web-container table[width="550"] { max-width: 100% !important; width: 100% !important; }
  .web-container td[style*="padding:26px 26px"] table[align="right"] tr { display: block !important; }
  .web-container td[style*="padding:26px 26px"] table[align="right"] td { display: block !important; width: 100% !important; padding: 8px 0 !important; }
}

@media (max-width: 480px) {
  .web-container td[style*="padding:26px 26px"] { padding: 16px 16px !important; }
  .web-container td[style*="padding:0 26px"] { padding-left: 16px !important; padding-right: 16px !important; }
  .web-container td[style*="padding:20px 0"] { padding: 12px 0 !important; }
}
</style>
`;
  webHtml = webHtml.replace('</head>', responsiveCSS + '\n</head>');
  fs.writeFileSync(WEB_OUTPUT_PATH, webHtml, 'utf8');

  console.log(
    `Built ${cards.length} cards → dist/index-${YM_STAMP}.build.html, dist/index-${YM_STAMP}.web.html`
  );
}

main();
