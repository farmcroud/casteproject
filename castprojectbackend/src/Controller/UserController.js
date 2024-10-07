const { error } = require("console");
const db = require("../Utils/db");

const GetAllVillage = async (req, res) => {
  const sql = `SELECT DISTINCT villagename FROM ExcelfileData`;

  try {
    // Directly use the promise-based query method from the pool
    const [results] = await db.query(sql);

    // Send the results as a response
    res.json(results);
  } catch (error) {
    console.error("Error -", error);
    res.status(500).json({ message: error.message }); // Send the error response
  }
};

const GetCastList = async (req, res) => {
  const { villageName } = req.body; // Extract villageName from the body
  try {
    const [result] = await db.query(
      "SELECT DISTINCT cast FROM ExcelfileData WHERE villagename = ?",
      [villageName] // Pass as an array to avoid SQL injection
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No casts found for this village." });
    }

    res.json(result);
  } catch (error) {
    console.error("Error -", error);
    res.status(500).json({ message: error.message });
  }
};

const GetSubCastList = async (req, res) => {
  const { cast, villageName } = req.body;

  // Input validation
  if (!villageName || !cast) {
    return res
      .status(400)
      .json({ message: "Village name and cast are required." });
  }

  try {
    const [result] = await db.query(
      "SELECT DISTINCT subcast FROM ExcelfileData WHERE cast = ? AND villagename = ?",
      [cast, villageName] // Pass parameters as an array to avoid SQL injection
    );

    // Check if the result is empty
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No subcasts found for this village and cast." });
    }

    res.json(result);
  } catch (error) {
    console.error("Error -", error);
    res.status(500).json({ message: error.message });
  }
};

const GetAllData = async (req, res) => {
  const filters = req.body;

  let query = "SELECT * FROM ExcelfileData WHERE 1=1";

  // Use an array to hold the parts of the query
  const conditions = [];

  // Check each filter and add it into the conditions
  if (filters.villagename) {
    conditions.push(`villagename = ${db.escape(filters.villagename)}`);
  }

  if (filters.cast) {
    conditions.push(`cast = ${db.escape(filters.cast)}`);
  }

  if (filters.subcast) {
    conditions.push(`subcast = ${db.escape(filters.subcast)}`);
  }

  // Join conditions to form the final query
  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  // Execute the query with a callback
  try {
    // Execute the query using await
    const [results] = await db.query(query);
    console.log("Query Results:", results); // Log the results

    const formattedResults = results.map((result, index) => ({
      id: index + 1,
      fullname: result.fullname.toUpperCase(),
      cast: result.cast,
      subcast: result.subcast,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error("Database Query Error -", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetAllVillage,
  GetCastList,
  GetSubCastList,
  GetAllData,
};
