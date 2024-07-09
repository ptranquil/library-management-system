"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../load-env-vars.js");
var database_js_1 = require("../database.js");
var DATABASE_URI = process.env.DATABASE_URI;
console.log('Connecting to MongoDB Atlas...');
await (0, database_js_1.connectToDatabase)(DATABASE_URI);
var db = database_js_1.databases.library;
console.log('Connected!\n');
var results = [];
var userSchema = {
    bsonType: 'object',
    required: ['name', 'isAdmin'],
    properties: {
        name: {
            bsonType: 'string',
            minLength: 5,
            description: 'must be a string and is required'
        },
        isAdmin: {
            bsonType: 'bool',
            description: 'must be a boolean and is required'
        }
    }
};
console.log('Applying schema validation for users...');
var resultUsers = await db.command({
    collMod: 'users',
    validator: {
        $jsonSchema: userSchema
    },
    validationLevel: 'strict',
    validationAction: 'error'
});
results.push(resultUsers);
// const authorSchema = {
//     bsonType: 'object',
//     required: ['name'],
//     properties: {
//         name: {
//             bsonType: 'string',
//             minLength: 5,
//             description: 'must be a string and is required'
//         },
//         // TODO: Add the missing validation rules for the authorSchema
//         // Hint: Look at the 'library.authors' collection in
//         // the MongoDB Atlas UI
//     }
// };
// console.log('Applying schema validation for authors...');
// const resultAuthors = await db.command({
//     // TODO: Modify the authors collection to apply the authorSchema
//     // Hint: Look at line 30 in this file.
// });
// results.push(resultAuthors);
var isStatusInvalid = function (r) { return r.ok !== 1; };
if (results.some(isStatusInvalid)) {
    console.log(results);
    console.error('Failed to enable schema validation!');
    process.exit(1);
}
else {
    console.log('Schema validation enabled!');
    process.exit(0);
}
