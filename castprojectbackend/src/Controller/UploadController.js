// controllers/uploadController.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const db = require("../Utils/db"); // This should now correctly import the promise-enabled pool

// Ensure uploads directory exists
const dir = "../Uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return cb(new Error("Only .xlsx files are allowed"), false);
    }
    cb(null, true);
  },
});

// // Set up multer storage
// const storage = multer.memoryStorage({
//   destination: (req, file, cb) => {
//     cb(null, dir); // Specify the uploads directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); // Use original file name
//   },
// });

// const upload = multer({ storage });

//check file exists or not
const checkFileExists = async (fileName) => {
  const [rows] = await db.query("SELECT * FROM ExcelFiles WHERE filename = ?", [
    fileName,
  ]);
  return rows.length > 0; // Returns true if file exists
};

// Upload handler
const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileName = req.file.originalname;
  const fileExists = await checkFileExists(fileName);
  if (fileExists) {
    return res.status(400).send("File already exists in the database.");
  }

  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const filteredData = data.map(({ NO, ...rest }) => rest);

  const sql = `INSERT INTO ExcelfileData (fullname, mobileno, villageName, cast, subcast) VALUES ?`;
  const values = filteredData.map((item) => [
    item["Full Name"],
    item["MOBILE NO."],
    item["VILLAGE NAME"],
    item["CAST "],
    item.SUBCAST,
  ]);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(sql, [values]);
    await insertFile(fileName);
    await connection.commit();
    res.send("File uploaded and data processed successfully.");
  } catch (error) {
    await connection.rollback();
    console.error("Database insertion error:", error);
    return res.status(500).send("Database insertion failed.");
  } finally {
    connection.release();
  }
};

//insert file name into database that we inserted
const insertFile = async (fileName) => {
  try {
    // Insert file name into the database
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    const [result] = await db.query(
      "INSERT INTO ExcelFiles (filename) VALUES (?)",
      [fileName]
    );
    //res.send("File uploaded and name inserted into the database successfully.");
  } catch (error) {
    console.error("Database insertion error:", error);
    return error;
    //res.status(500).send("Database insertion failed.");
  }
};

// Export the upload middleware and controller
module.exports = {
  upload,
  uploadFile,
};
