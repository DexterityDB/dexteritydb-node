'use strict';
const { Dex } = require('../build/Dex');

let db = new Dex("ws://localhost:8080/");
/*db.collection("stuff").find({field1: "value1"})
    .and(Dex.and({field2: "value3"}, {field5: "value5"}), {field6: Dex.lt("value6")})
    .or(Dex.or({field3: ["value2", "valuelots"]}, {field4: Dex.gt_lte(1, 5)}), {field7: "value7"})
    .or({num: 0})
    .count();

db.collection("stuff").bench().find({field1: "value1"}).fetch();

db.collection("stuff").drop();
db.dropCollection("stuff");

db.collection("stuff").insert({this: "that"}, {that: 1});

db.collection("stuff").remove({this: "that"});
db.collection("stuff").find({field1: "value1"}).remove();

db.collection("stuff").index("field1");

db.collection("stuff").removeIndex("field1");

db.collection("stuff").bench().drop();
db.collection("stuff").options({bench: true}).drop();

setTimeout(function() {
    db.collection("test").insert({field1: "value1a", field2: "value2"}, {field1: "value1b"});
    db.collection("test").index("field1");
    db.collection("test").find({field1: "value1b"}).fetch().then(function(items) {
        console.log(items);
    });
}, 2000);
*/

setTimeout(function() {

    db.collection("test").insert({ field1: "value1" });
    db.collection("test").index("field1");
    db.collection("test").index("field2");
    db.collection("test").index("field3");

    db.collection("test")
        .update({ field1: "value1" }, {
            field1: Dex.delete(),
            field2: 1
        })

    db.collection("test")
        .replace({ field2: 1 }, {
            field2: "value2",
            field3: "value3"
        });

    db.collection("test").find({ field2: "value2", field3: "value3" }).fetch().then(function(items) {
        console.log(items);
    });

}, 2000);

/*
setTimeout(function() {
    let project = Dex.include("field2");
    db.collection("test").index("field1");
    db.collection("test").insert({ field1: "value1", field2: "value2" });
    db.collection("test").find({ field1: "value1" }).fetch(project).then(function(items) {
        console.log(items);
    });
}, 2000);
*/