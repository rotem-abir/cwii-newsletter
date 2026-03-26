import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PROPERTIES_DIR = path.join(root, 'properties');
const TEMPLATE_PATH = path.join(root, 'template.html');
function buildYmStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const YM_STAMP = buildYmStamp();
const OUTPUT_FILENAME = `index-${YM_STAMP}.html`;
const OUTPUT_PATH = path.join(root, 'dist', OUTPUT_FILENAME);

const PLACEHOLDER_PROPERTIES = '{{PROPERTIES}}';
/** Email-safe: no @font-face; Outlook ignores unknown family and uses Arial. */
const FONT_STACK_CSS = "'Open Sans Hebrew', Arial, Helvetica, sans-serif";

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
                        <td style="padding:0 26px;">{{TITLE_1}}</td>
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
                        <td style="font-family:${FONT_STACK_CSS}; font-size:22px; font-weight:bold; line-height:34px; mso-line-height-rule:exactly; color:#FFFFFF; padding:0 26px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-family:${FONT_STACK_CSS}; font-size:22px; line-height:37px; mso-line-height-rule:exactly; color:#FFFFFF; padding:8px 26px 0 26px;">{{DESC}}</td>
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
                              <td align="center" valign="middle" style="padding:0; font-family:${FONT_STACK_CSS};">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{DETAILS_URL}}" style="height:56px; v-text-anchor:middle; width:228px;" arcsize="0%" stroke="f" fillcolor="#0093AD">
                                  <w:anchorlock/>
                                  <center style="color:#ffffff; font-family:${FONT_STACK_CSS}; font-size:22px; font-weight:bold; line-height:56px; mso-line-height-rule:exactly;">לפרטים נוספים</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; font-family:${FONT_STACK_CSS}; font-size:22px; font-weight:bold; line-height:22px; mso-line-height-rule:exactly; color:#FFFFFF; text-decoration:none; background-color:#0093AD; border:1px solid #0093AD; display:inline-block; padding:16px 24px;">לפרטים נוספים</a>
                                <!--<![endif]-->
                              </td>
                              <td width="16" style="width:16px; font-size:0; line-height:0; mso-line-height-rule:exactly;">&nbsp;</td>
                              <td align="center" valign="middle" style="padding:0; font-family:${FONT_STACK_CSS};">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{WHATSAPP_URL}}" style="height:56px; v-text-anchor:middle; width:332px;" arcsize="0%" strokecolor="#0093AD" stroked="t" strokeweight="1px" fillcolor="#1D1740">
                                  <w:anchorlock/>
                                  <center style="color:#ffffff; font-family:${FONT_STACK_CSS}; font-size:22px; font-weight:bold; line-height:56px; mso-line-height-rule:exactly;">{{AGENT_TEXT}}</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; font-family:${FONT_STACK_CSS}; font-size:22px; font-weight:bold; line-height:22px; mso-line-height-rule:exactly; color:#FFFFFF; text-decoration:none; background-color:#1D1740; border:1px solid #0093AD; display:inline-block; padding:16px 22px;">{{AGENT_TEXT}}</a>
                                <!--<![endif]-->
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
                        <td style="padding:0 26px;">{{TITLE_1}}</td>
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
                        <td style="font-family:${FONT_STACK_CSS}; font-size:22px; font-weight:bold; line-height:34px; mso-line-height-rule:exactly; color:#545859; padding:0 26px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-family:${FONT_STACK_CSS}; font-size:22px; line-height:37px; mso-line-height-rule:exactly; color:#545859; padding:8px 26px 0 26px;">{{DESC}}</td>
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
                              <td align="center" valign="middle" style="padding:0; font-family:${FONT_STACK_CSS};">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{DETAILS_URL}}" style="height:54px; v-text-anchor:middle; width:218px;" arcsize="0%" stroke="f" fillcolor="#0093AD">
                                  <w:anchorlock/>
                                  <center style="color:#ffffff; font-family:${FONT_STACK_CSS}; font-size:21px; font-weight:bold; line-height:54px; mso-line-height-rule:exactly;">לפרטים נוספים</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; font-family:${FONT_STACK_CSS}; font-size:21px; font-weight:bold; line-height:21px; mso-line-height-rule:exactly; color:#FFFFFF; text-decoration:none; background-color:#0093AD; border:1px solid #0093AD; display:inline-block; padding:16px 24px;">לפרטים נוספים</a>
                                <!--<![endif]-->
                              </td>
                              <td width="16" style="width:16px; font-size:0; line-height:0; mso-line-height-rule:exactly;">&nbsp;</td>
                              <td align="center" valign="middle" style="padding:0; font-family:${FONT_STACK_CSS};">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{WHATSAPP_URL}}" style="height:54px; v-text-anchor:middle; width:332px;" arcsize="0%" strokecolor="#0093AD" stroked="t" strokeweight="1px" fillcolor="#ffffff">
                                  <w:anchorlock/>
                                  <center style="color:#0093ad; font-family:${FONT_STACK_CSS}; font-size:21px; font-weight:bold; line-height:54px; mso-line-height-rule:exactly;">{{AGENT_TEXT}}</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; font-family:${FONT_STACK_CSS}; font-size:21px; font-weight:bold; line-height:21px; mso-line-height-rule:exactly; color:#0093AD; text-decoration:none; background-color:#FFFFFF; border:1px solid #0093AD; display:inline-block; padding:16px 22px;">{{AGENT_TEXT}}</a>
                                <!--<![endif]-->
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
                        <td style="padding:0 26px;">{{TITLE_1}}</td>
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
                        <td style="font-family:${FONT_STACK_CSS}; font-size:22px; font-weight:bold; line-height:34px; mso-line-height-rule:exactly; color:#545859; padding:0 26px;">{{META}}</td>
                      </tr>
                      <tr>
                        <td style="font-family:${FONT_STACK_CSS}; font-size:22px; line-height:37px; mso-line-height-rule:exactly; color:#545859; padding:8px 26px 0 26px;">{{DESC}}</td>
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
                              <td align="center" valign="middle" style="padding:0; font-family:${FONT_STACK_CSS};">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{DETAILS_URL}}" style="height:54px; v-text-anchor:middle; width:218px;" arcsize="0%" stroke="f" fillcolor="#E4002B">
                                  <w:anchorlock/>
                                  <center style="color:#ffffff; font-family:${FONT_STACK_CSS}; font-size:21px; font-weight:bold; line-height:54px; mso-line-height-rule:exactly;">לפרטים נוספים</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="{{DETAILS_URL}}" target="_blank" style="letter-spacing:0.02em; font-family:${FONT_STACK_CSS}; font-size:21px; font-weight:bold; line-height:21px; mso-line-height-rule:exactly; color:#FFFFFF; text-decoration:none; background-color:#E4002B; border:1px solid #E4002B; display:inline-block; padding:16px 24px;">לפרטים נוספים</a>
                                <!--<![endif]-->
                              </td>
                              <td width="16" style="width:16px; font-size:0; line-height:0; mso-line-height-rule:exactly;">&nbsp;</td>
                              <td align="center" valign="middle" style="padding:0; font-family:${FONT_STACK_CSS};">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{WHATSAPP_URL}}" style="height:54px; v-text-anchor:middle; width:332px;" arcsize="0%" strokecolor="#E4002B" stroked="t" strokeweight="1px" fillcolor="#ffffff">
                                  <w:anchorlock/>
                                  <center style="color:#e4002b; font-family:${FONT_STACK_CSS}; font-size:21px; font-weight:bold; line-height:54px; mso-line-height-rule:exactly;">{{AGENT_TEXT}}</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="{{WHATSAPP_URL}}" target="_blank" style="letter-spacing:0.02em; font-family:${FONT_STACK_CSS}; font-size:21px; font-weight:bold; line-height:21px; mso-line-height-rule:exactly; color:#E4002B; text-decoration:none; background-color:#FFFFFF; border:1px solid #E4002B; display:inline-block; padding:16px 22px;">{{AGENT_TEXT}}</a>
                                <!--<![endif]-->
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

const BANNER_IMAGE_URL =
  'https://pub-38aaae9d5641488e8a3b8c16b08e3c88.r2.dev/newsletter/src/cwinterisrael_properties.jpg';

const BANNER_CARD_HTML = `          <!-- odd-count banner -->
          <tr>
            <td style="padding:0; margin:0; background-color:#FFFFFF;" bgcolor="#FFFFFF">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td align="center" style="padding:0; margin:0;">
                    <a href="${BANNER_IMAGE_URL}" target="_blank" style="text-decoration:none;"><img src="${BANNER_IMAGE_URL}" alt="" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0; margin:0;" /></a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;

const DEFAULT_COUNTRY_CODE = '972';
const WORD_JOINER = '&#x2060;';

function htmlEscape(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function defangGmailAutolink(text) {
  if (typeof text !== 'string') return '';
  let s = text.replace(/(\d)/g, '$1' + WORD_JOINER);
  s = s.replace(/([,\-])/g, '$1' + WORD_JOINER);
  s = s.replace(/ /g, '&nbsp;');
  return s;
}

function buildPropertyTitleHtml(text, colorHex, lineHeightPx) {
  const inner = defangGmailAutolink(htmlEscape(text));
  return `<span class="x-gmail-data-detectors property-title-text" style="font-family:${FONT_STACK_CSS}; font-size:40px; font-weight:bold; line-height:${lineHeightPx}px; mso-line-height-rule:exactly; color:${colorHex} !important; text-decoration:none !important; border-bottom:0 !important; cursor:text !important;">${inner}</span>`;
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
    const title1LineHeight = prop.variant === 'WHITE_RED' ? 60 : i % 2 === 0 ? 52 : 60;
    const title1Html = buildPropertyTitleHtml(prop.title_1, accent, title1LineHeight);
    const safeTitle2 = prop.title_2 ? defangGmailAutolink(htmlEscape(prop.title_2)) : '';
    const title_2_row =
      prop.title_2 && prop.title_2.trim() !== ''
        ? `<tr><td align="right" dir="rtl" class="property-title-line" style="padding:4px 26px 0 26px; unicode-bidi:isolate;"><span class="x-gmail-data-detectors property-title-text" style="font-family:${FONT_STACK_CSS}; font-size:40px; font-weight:bold; text-align:right; line-height:60px; mso-line-height-rule:exactly; color:${accent} !important; text-decoration:none !important; border-bottom:0 !important; cursor:text !important; display:block;">${safeTitle2}</span></td></tr>`
        : '';
    const whatsappUrl = buildWhatsAppUrl(prop.agentText);
    const template =
      prop.variant === 'WHITE_RED'
        ? CARD_WHITE_RED_TEMPLATE
        : i % 2 === 0
          ? CARD_INDIGO_TEMPLATE
          : CARD_WHITE_TEMPLATE;
    const cardHtml = template
      .replace(/\{\{TITLE_1\}\}/g, title1Html)
      .replace(/\{\{TITLE_2_ROW\}\}/g, title_2_row)
      .replace(/\{\{IMG\}\}/g, prop.imgUrl)
      .replace(/\{\{META\}\}/g, prop.meta)
      .replace(/\{\{DESC\}\}/g, prop.desc)
      .replace(/\{\{DETAILS_URL\}\}/g, prop.detailsUrl)
      .replace(/\{\{AGENT_TEXT\}\}/g, prop.agentText)
      .replace(/\{\{WHATSAPP_URL\}\}/g, whatsappUrl);
    cards.push(cardHtml);
  }

  if (cards.length % 2 !== 0) {
    cards.splice(cards.length - 1, 0, BANNER_CARD_HTML);
  }

  const propertiesHtml = cards.join('\n');
  let outputHtml = templateHtml.replace(PLACEHOLDER_PROPERTIES, propertiesHtml);
  const viewBrowserRaw = process.env.NEWSLETTER_VIEW_IN_BROWSER_URL;
  const viewBrowserHref =
    typeof viewBrowserRaw === 'string' && viewBrowserRaw.trim() !== ''
      ? viewBrowserRaw.trim()
      : OUTPUT_FILENAME;
  const viewBrowserAttr = viewBrowserHref
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
  outputHtml = outputHtml.replace(/href="index\.web\.html"/g, `href="${viewBrowserAttr}"`);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, outputHtml, 'utf8');

  console.log(
    `Built ${sortedFiles.length} property cards${cards.length > sortedFiles.length ? ' + odd-count banner' : ''} → dist/${OUTPUT_FILENAME}`
  );
}

main();
