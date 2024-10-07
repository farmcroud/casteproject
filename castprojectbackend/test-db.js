// test-db.js
const db = require("../castprojectbackend/src/Utils/db"); // Adjust the path as necessary

async function testQuery() {
  try {
    const [rows] = await db.query("SELECT 1 AS test");
    console.log("Test query result:", rows);
  } catch (error) {
    console.error("Error running test query:", error);
  }
}

// Run the test query immediately
testQuery();
