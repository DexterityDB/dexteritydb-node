<br>
The DexterityDB node driver was built to support monolithic operators that are popular in other database driver languages, but we wanted to try something new. The result was a system of chainable and consuming operators that are easier to write and more clear to read.

## Example
The easiest way to explain the chaining system is to lead by example; below we have an example of a moderately complex query that shows off the chaining system and some of the many operators that can be used to create powerful queries that are easy to build. If you haven't read the [Getting Started](./index.html), please do so now before moving forward:
```javascript
async function main() {
    const ourCollection = db.collection("example");
    await ourCollection.index("name");
    await ourCollection.bench()
        .insert(
            { name: "Dillon", age: 24, position: "developer" },
            { name: "Alex", age: 23, position: "developer" },
            { name: "Tom", position: "marketing" },
            { name: "Todd", position: "sales" }
        );
    example.find({ position: "developer" })
        .and({ name: Dex.loadIn("Dillon", "Alex" })
        .or({ name: "Todd" })
        .or({ position: "marketing" })
        .fetch()
        .then((result) => {
            console.log(result);
        });
}

main();
```

## Starters
First, a query begins with a function that starts a query. This is where the chain begins. The most commonly returned starter is a [```ReadQuery```](./ReadQuery.html) from a [```find```](./Collection.html#find) and many other chainable methods. The ```collection``` function returns a ```Collection``` object. In the example code:
```javascript
const ourCollection = db.collection("example");
```
We have stored the "example" collection in the ourCollection variable. This collection object can now be used for chaining and transforming methods.

It will become apparent that the line between starter and chaining methods is blurred and the idea is to use methods interchangeably to easily create query chains that can be executed by the database. The ```find``` method shows an example of a starter that is also chaining off of another:
```javascript
example.find({ position: "developer" })
```
This method is called on the ```Collection``` object and returns a ```ReadQuery``` that is trying to match items with the position of "developer." If we ran this query as is, it would return the Dillon and Alex entries that were inserted above. We will get to the rest of the chained operators in the next section.

## Chainable Operators
The query can be modified by certain chainable operators. These methods transform the query to add additional search parameters or modify the behavior of the function and the return results. In the example code:
```javascript
example
```

## Shorthand Operators
Sometimes, however, not every query can be created using only chained operators. For these cases, we have created shorthand operators. The ```Dex``` class contains many static methods that act as shorthand operators. These operators can be substituted for values in a query in order to modify the value in a way that would be impossible to do otherwise. Some of these operators include ranges and multiple possible values. Take a look at the [```Dex```](./Dex.html) documentation for more of these static shorthand methods.

## Consuming Methods
After one or more chainable operators are used, the query should be consumed. Usually a consuming operator takes the query that has been formed and sends it to the database, returning a result, usually (but not always) in the form of a Promise.