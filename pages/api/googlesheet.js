import { GoogleSpreadsheet } from "google-spreadsheet";

async function initSpreadsheet(docId) {
  try {
    // Initialize the sheet - doc ID is the long id in the sheets URL
    const document = new GoogleSpreadsheet(docId);

    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await document.useServiceAccountAuth({
      client_email: process.env.NEXT_PUBLIC_GOOGLESHEETS_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GOOGLESHEET_API_KEY.replace(
        /\\n/gm,
        "\n"
      ),
    });

    await document.loadInfo(); // loads document properties and worksheets

    return document;
  } catch (error) {
    console.log("sheet initialization error: \n", error);
  }
}

export default async function handler(req, res) {
  const googleSheetID = req.query.sheetID;

  // Initialize spreadsheet
  const doc = await initSpreadsheet(googleSheetID);

  // Select a sheet
  const sheet = doc.sheetsByTitle["ezcreatives_content"];

  // Do action

  // 1. load rows and header
  const rows = await sheet.getRows();
  const headerRow = sheet.headerValues; // this needs to be called after getRows()

  // 2. construct the data (as we want it in the app)
  const templateConfigData = rows.map((row) => {
    return headerRow.reduce((object, value) => {
      return { ...object, [value]: row[value] };
    }, {});
  });

  res.status(200).json({ success: true, data: { templateConfigData } });
}
