# dexteritydb-node
[![npm](https://img.shields.io/npm/v/dexteritydb.svg)](https://www.npmjs.com/package/dexteritydb)
<img src="https://david-dm.org/Savizar/dexteritydb-node.svg" />

The official Node.js driver for DexterityDB. Provides a high-level API for use in node based applications.

# Getting Started
The easiest way to start using the DexterityDB Node.js driver is to use the node package manager:
```bash
npm install dexteritydb
```
Then add the following to your Node.js script:
```javascript
const { Dex } = require("dexteritydb");
```
That's it! That's all you need to start using the DexterityDB Node.js driver.

# Basic Usage

## Dex Class
The DexterityDB Node.js driver was designed to be easy to use. It was built to be as dextrous and as flexible as possible, while still providing all of the feature capabilities that you might need to write powerful applications and scripts.

All programs written with the DexterityDB node driver begin with an instance of the ```Dex``` class. The ```Dex``` class is a database object that contains all of the methods that you might need to start using DexterityDB. It is recommended to use a single instance of ```Dex``` in any single piece of code.
```javascript
let db = new Dex('http://localhost:3000');
```
The ```Dex``` constructor accepts two optional parameters. The first parameter, as shown above, is the endpoint of the DexterityDB instance that you want to connect up to. If an address is given, the driver will attempt to connect immediately upon generation of the ```Dex``` object. The second optional parameter, not shown in the example above, is a flag that indicates whether or not you want the driver to try to reconnect to the database after a disconnection. By default, this parameter is ```true```.

_Due to how the DexterityDB Node.js driver queues messages, the line of code shown above does not need to complete before queries are run in sequential lines. For this reason, we do not handle, nor do we even create, a promise in the constructor of ```Dex``` instances or in its ```connect``` method. The driver will do the hard work of making sure the database is connected before sending requests._

## Example Walkthrough
The following lines of code can be run in the node driver. We will walk through this example and what it does below. It is important to note that the node driver is asynchronous so the example below uses promises to execute syncronously:
```javascript
async function main() {
    const example = db.collection("example");
    await example.insert({ name: "John", age: 35 }, { name: "Jane", age 28 });
    await example.index("name");
    example.find({ name: "John" }).fetchAll().then((result) => {
        console.log(results);
    });
}

main();
```

### Collection Class
The ```Collection``` class is the second most used class in the DexterityDB node driver. The ```Collection``` class is instantiated with a simple ```collection``` function call from a ```Dex``` instance. This can be seen in the first line of the ```main``` function:
```javascript
const example = db.collection("example");
```
We pass the ```example``` string to the ```collection``` call to indicate that we are working on the ```example collection```.

### Insert
The second line of the ```main``` function shows a simple ```insert``` call:
```javascript
await example.insert({ name: "John", age: 35 }, { name: "Jane", age 28 });
```
Any number of JSON objects can be passed into the ```insert``` function. Simply treat each object as a separate parameter in the function call or pass an array of objects.

### Indexing
One of the things that makes DexterityDB special is the requirement of indexing any fields that you may want to search on. Once indexed, a field becomes immediately searchable. Any previously inserted items, as well as any future inserted items will automatically be indexed by the designated field. This is best practice in the database world. It is a bit different than some other databases' approaches, but we feel that encouraging best practices is how we can make everyone's experience with DexterityDB more simple and enjoyable. Usually, we would encourage indexing at the beginning of the script, but for ease of comprehension, we have done it after the insert. The third line of the example reads:
```javascript
await example.index("name");
```
Indexing is easy. The above example proves that. Simply pass in the field that you want to index and it will become instantly searchable. DexterityDB does the rest.

### Find and Fetch
The DexterityDB driver utilizes chained commands to provide the user with a language that is very easy to use and easy to understand. ```Find``` is a key method that can be chained on a ```collection``` call. It can be used to retrieve (or fetch) results, as well as updating and removing items in the database. The fourth line in the ```main``` function shows off this capability:
```javascript
example.find({ name: "John" }).fetchAll().then((result) => {
    console.log(results);
});
```
Just to reiterate, the field that we search on MUST be indexed. If you missed the indexing step, please go up a few mouse scrolls and reread the indexing section. 

To search for something in the database, first we use ```.find``` and pass the object pattern that we are looking for. The pattern in the example indicates that we are looking for all items that have the name, "John", as the value under the indexed field, "name."

Since there are many things that we can do with a query result on the database side, there are many methods that can be chained onto the ```find``` method. For this example, we use ```fetchAll```, an intuitive function. ```FetchAll``` returns all of the objects that fit the ```find``` query. No parameters required (some allowed!). See the [fetch](./ReadQuery.html#fetch) or [fetchAll](./ReadQuery.html#fetchAll) documentation for more information on optional parameters.

Alternatively, the above example can be written as such:
```javascript
example.find({ name: "John" }).fetch().then((cursor) => {
    cursor.collect().then((results) => {
        console.log(results);
    })
});
```
This setup shows off the ```Cursor``` object, which allows for streaming ```fetch``` results. The ```Cursor``` makes retrieving results more efficient, because one or more items can be retrieved and used at a time, when they are needed. In this example we simply ```collect``` all of them to show that this is equivalent to the ```fetchAll``` shown in the last example.

As stated earlier, DexterityDB is asynchronous, so we use a ```.then``` to consume the ```promise```s and print the results.

That's it! You now have all of the information you need to get started with the DexterityDB Node.js driver. But don't stop there...check out the full [DexterityDB Node.js API Tutorial](https://savizar.github.io/dexteritydb-node/tutorial-1-0-0_TheApproach.html) for all of the options and chainable methods that exist on the driver.

Happy Dexing!

## Helpful Links
[DexterityDB](http://dexteritydb.com)<br>
[Node.JS API Documentation Tutorial](https://savizar.github.io/dexteritydb-node/tutorial-1-0-0_TheApproach.html)<br>
[Node.JS Driver GitHub](https://github.com/Savizar/dexteritydb-node)


# For Contributors
The DexterityDB Node.js driver is written mostly in [TypeScript](https://www.typescriptlang.org/). It is compiled into Javascript using the Typescript compiler.

Documentation is generated using [JSDoc](http://usejsdoc.org/) with the [Docdash](https://github.com/clenemt/docdash) template, customized with [Hotdoc](https://github.com/kmck/hotdoc).

**_Note: To install necessary npm packages, you will need [Python 2.7.13](https://www.python.org/downloads/release/python-2713/)._**

To make changes to driver, download the repository and execute ```npm install``` to get all relevant packages.

After making changes to the TypeScript files or adding/modifying JSDoc documentation, simply execute ```npm run build```.
This will build all javascript files and all documentation and you'll be good to go!