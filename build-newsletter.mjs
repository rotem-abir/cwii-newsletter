import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROPERTIES_DIR = path.join(__dirname, 'properties');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const OUTPUT_PATH = path.join(__dirname, 'dist', 'index.build.html');

const PLACEHOLDER_PROPERTIES = '{{PROPERTIES}}';

const CARD_INDIGO_TEMPLATE = `          <!-- indigo band -->
          <tr>
            <td style="background-color:#1D1740; padding:0;" bgcolor="#1D1740">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <!-- property card start -->
                <!-- inner rail -->
                <tr>
                  <td style="padding:38px 0 8px 0;">
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:38px; font-weight:bold; color:#0093AD; padding:0 30px;">{{TITLE_1}}</td>
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
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:20px; font-weight:bold; color:#FFFFFF; padding:0 30px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-size:20px; color:#FFFFFF; line-height:35px; padding:8px 30px 0 30px;">{{DESC}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- cta row -->
                <tr>
                  <td style="padding:12px 0 40px 0;">
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding:30px 30px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right">
                            <tr>
                              <td style="padding-left:12px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="background-color:#0093AD;" bgcolor="#0093AD">
                                      <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:12px 24px; font-size:20px; font-weight:bold; color:#FFFFFF; text-decoration:none;">לפרטים נוספים</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="border:1px solid #0093AD; background-color:#1D1740;" bgcolor="#1D1740">
                                      <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:10px 22px; font-size:20px; font-weight:bold; color:#FFFFFF; text-decoration:none;">{{AGENT_TEXT}}</a>
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
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:38px; font-weight:bold; color:#0093AD; line-height:1.5; padding:0 30px;">{{TITLE_1}}</td>
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
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:20px; font-weight:bold; color:#1D1740; padding:0 30px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-size:20px; color:#1D1740; line-height:35px; padding:8px 30px 0 30px;">{{DESC}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- cta row -->
                <tr>
                  <td style="padding:12px 0 40px 0;">
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding:30px 30px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right">
                            <tr>
                              <td style="padding-left:12px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="background-color:#0093AD;" bgcolor="#0093AD">
                                      <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:12px 24px; font-size:20px; font-weight:bold; color:#FFFFFF; text-decoration:none;">לפרטים נוספים</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="border:1px solid #0093AD; background-color:#FFFFFF;" bgcolor="#FFFFFF">
                                      <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:10px 22px; font-size:20px; font-weight:bold; color:#0093AD; text-decoration:none;">{{AGENT_TEXT}}</a>
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
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:38px; font-weight:bold; color:#E4002B; line-height:1.5; padding:0 30px;">{{TITLE_1}}</td>
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
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="font-size:20px; font-weight:bold; color:#545859; padding:0 30px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-size:20px; color:#545859; line-height:35px; padding:8px 30px 0 30px;">{{DESC}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- cta row -->
                <tr>
                  <td style="padding:12px 0 40px 0;">
                    <table role="presentation" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding:30px 30px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right">
                            <tr>
                              <td style="padding-left:12px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="background-color:#E4002B;" bgcolor="#E4002B">
                                      <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:12px 24px; font-size:20px; font-weight:bold; color:#FFFFFF; text-decoration:none;">לפרטים נוספים</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tr>
                                    <td align="center" style="border:1px solid #E4002B; background-color:#FFFFFF;" bgcolor="#FFFFFF">
                                      <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; display:inline-block; padding:10px 22px; font-size:20px; font-weight:bold; color:#E4002B; text-decoration:none;">{{AGENT_TEXT}}</a>
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

function naturalSort(filenames) {
  return filenames.sort((a, b) => {
    const numA = parseInt(path.basename(a, '.txt'), 10);
    const numB = parseInt(path.basename(b, '.txt'), 10);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
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
        ? `<tr><td align="right" dir="rtl" style="font-size:38px; font-weight:bold; text-align:right; color:#0093AD; text-decoration:none; line-height:1.5; padding:4px 30px 0 30px; unicode-bidi:isolate; mso-line-height-rule:exactly;"><a href="#" style="color:#0093AD; text-decoration:none; font-weight:bold;"><span style="color:#0093AD !important; text-decoration:none !important; font-weight:bold; display:inline;">${safeTitle2}</span></a></td></tr>`
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
  const outputHtml = templateHtml.replace(PLACEHOLDER_PROPERTIES, propertiesHtml);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, outputHtml, 'utf8');

  console.log(`Built ${cards.length} cards → dist/index.build.html`);
}

main();
