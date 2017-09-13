'use strict';
const { Dex } = require('../build/Dex');

let db = new Dex("ws://localhost:8080/");
db.collection("stuff").find({field1: "value1"})
    .and(Dex.and({field2: "value3"}, {field5: "value5"}), {field6: Dex.lt("value6")})
    .or(Dex.or({field3: ["value2", "valuelots"]}, {field4: Dex.gt_lte(1, 5)}), {field7: "value7"})
    .or({num: 0})
    .count();

db.collection("stuff").find({field1: "value1"}).fetch();

db.collection("stuff").removeCollection();
db.removeCollection("stuff");

db.collection("stuff").insert({this: "that"}, {that: 1});

db.collection("stuff").remove({this: "that"});
db.collection("stuff").find({field1: "value1"}).remove();

db.collection("stuff").index("field1");

db.collection("stuff").removeIndex("field1");