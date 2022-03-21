/*Import Express, SQLite3, GraphQL, and Express GraphQL middleware */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql');


const request = require('request');
/*Create an express app */
const app = express();

/**Enable CORS in the server */
const cors = require('cors');
app.use(cors());

//create db
const db = new sqlite3.Database("./my.db");

// const  createContactTable  = () => {
//     const  query  =  `
//         CREATE TABLE IF NOT EXISTS stateDB (
//         statename text PRIMARY KEY,
//         geo text)`;

//     return  db.run(query);
// }

// createContactTable();

// const  insertContactTable  = (state,geo) => {
//     const  query  =  `INSERT INTO stateDB (statename, geo) VALUES (?,?);`;

//     return  db.run(query,[state,geo]);
// }


//setup db
// let url = "https://storage.googleapis.com/mapsdevsite/json/states.js";
// let options = { json: true };
// request(url, options, (error, res, body) => {
//     if (error) {
//         return  console.log(error)
//     };

//     if (!error && res.statusCode == 200) {
//         body.features.forEach(ele =>{
//             let state = ele.properties.NAME ;
//             let geo = JSON.stringify(ele.geometry);
          
//             insertContactTable(state,geo);
             
//         })
        
//     };
// });

//print db
// db.serialize(function () {
  
//     db.each("SELECT statename FROM stateDB", function (err, row) {
//           console.log(row);
         
//     });
    
// });

/* Define the attribute GraphQL types */
const stateType = new graphql.GraphQLObjectType({
    name: "State",
    fields: {
        statename: { type: graphql.GraphQLString },
        geo:{ type: graphql.GraphQLString }
    }
});


/* Define the GraphQL Query Type */
var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        Hello:{
            type:graphql.GraphQLString,
            resolve: ()=> {return "hello"}
        },
        States: {
            type: graphql.GraphQLList(stateType),
            args:{
                key:{
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, {key}, context, info) => {
                return new Promise((resolve, reject) => {
                    let queryStr = "SELECT statename FROM stateDB WHERE statename LIKE '%" + key + "%';";
                    db.all(queryStr,function (err, rows) {
                        if (err) {
                          
                            reject([]);
                           
                        }
                        
                        resolve(rows);
                    });
                });
                

            }
        },
        Geo: {
            type: stateType,
            args:{
                key:{
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, {key}, context, info) => {
                return new Promise((resolve, reject) => {
                    
                    db.all("SELECT * FROM stateDB WHERE statename = (?);",[key], function(err, rows) { 
                        if (err) {
                          
                            reject("nofound");
                           
                        }
                        
                        resolve(rows[0]);
                    });
                });
                

            }
        },

    }
});

// var root = {
//     hello: () => {
//       return 'Hello world!';
//     },
//     states: () => {
//         return new Promise((resolve, reject) => {

//             db.all("SELECT state FROM stateDB;", function (err, rows) {
//                 if (err) {
//                     reject([]);
                   
//                 }
//                 resolve(rows);
//             });
//         });
//       },
//   };

//   var schema = buildSchema(`
 
//   type Query {
//     hello: String,
//     states: [String],
//   }
// `);

/**Create a GraphQL Schema */
const schema = new graphql.GraphQLSchema({
    query: queryType
});


/**Mount the /graphql endpoint and run it on port 4000 */


app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
 
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');