const Table = require("../model/table").model
const fs = require("fs")

let tableData = fs.readFileSync(__dirname + "/allTables.json")
tableData = JSON.parse(tableData).tables

let allTables = []

tableData.forEach(table => {
    allTables.push(new Table(table))
});

module.exports = allTables