'use strict';
const { Dex } = require('../build/Dex');
const assert = require('assert');

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
/*async function main() {
    await db.collection("test").insert({ field1: "value1" });
    await db.collection("test").index("field1");
    await db.collection("test").index("field2");
    await db.collection("test").index("field3");
    await db.collection("test").index("field10");
    
    await db.collection("test")
        .update({ field1: "value1" }, {
            field1: Dex.delete(),
            field2: 1
        });
    
    await db.collection("test")
        .replace({ field2: 1 }, {
            field2: "value2",
            field3: "value3"
        });
    
    await db.collection("test").insert({ field2: "value2", field3: "value3", field10: ["value4", "value5", "value8"] });

    db.close();
    db.connect();

    db.collection("test").bench().find({ field2: "value2", field3: "value3", field10: "value4" }).and({ field10: "value5" }).fetch().then(function(items) {
        console.log("str1: ", items);
    });

    db.collection("test").bench().find({ field10: "value4" }).fetch().then(function(items, time) {
        console.log("str2: ", items, time);
    });
}
*/

/*
class Person {
    constructor(name, age, position) {
        this.name = name;
        this.age = age;
        this.position = position;
    }
}

async function main() {
    const coll = db.collection("employees").bench();
    await coll.drop();
    await coll.index("name");
    await coll.index("age");
    await coll.index("position");
    const alex = new Person("Alex", 23, "developer");
    const dillon = new Person("Dillon", 24, "developer");
    const tom = new Person("Tom", 23, "marketing");
    const todd = new Person("Todd", 30, "sales");
    const employees = [alex, dillon, tom, todd];
    await coll.insert(employees);
    coll.find({ name: Dex.in("Alex", "Dillon", "Tom", "Todd")}).fetch(Dex.exclude("age")).then(async (cursor, explain) => {
        console.log("Employee(s): ", await cursor.collect());
        console.log("Time taken: ", explain);
        db.close();
    });
}

main();

*/

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

async function main() {
    const coll = db.collection("items");
    coll.drop();
    let items = [];
    for (let i = 0; i < 100000; i += 1) {
        items.push({ id: i });
    }
    await coll.insert(items);
    await coll.index("id");
    /*
    coll.find({ }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 0; i < 100000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
        db.close();
    });
    */
    coll.find({ id: Dex.lt(70000) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 0; i < 70000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    /*
    coll.find({ id: Dex.lt(15) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 0; i <= 15; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gt(10000) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 10001; i < 100000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gt(99950) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 99951; i < 100000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.lte(80000) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 0; i <= 80000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.lte(35) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 0; i <= 35; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gte(10) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 10; i < 100000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gte(99972) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 99972; i < 100000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gt_lt(1, 60000) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 2; i < 60000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gt_lt(56789, 56800) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 56790; i < 56800; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gte_lt(10000, 67546) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 10000; i < 67546; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gte_lt(56289, 56305) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 56289; i < 56305; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gt_lte(2, 40000) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 3; i <= 40000; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gt_lte(44789, 44800) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 44790; i <= 44800; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gte_lte(38, 77657) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 38; i <= 77657; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    coll.find({ id: Dex.gte_lte(88789, 88800) }).fetchAll().then((items) => {
        console.log(items);
        let correctItems = [];
        for (let i = 88789; i <= 88800; i += 1) {
            correctItems.push({ id: i });
        }
        assert.deepEqual(items, correctItems);
    });
    */
}

main();