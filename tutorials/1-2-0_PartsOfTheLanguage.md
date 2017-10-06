<br>
The DexterityDB node driver was built to support monolithic operators that are popular in other database driver languages, but we wanted to try something new. The result was a system of chainable and consuming operators that are easier to write and more clear to read.

## Example
The easiest way to explain the chaining system is to lead by example; below we have an example of a moderately complex query that shows off the chaining system and some of the many operators that can be used to create powerful queries that are easy to build. If you haven't read the [Getting Started](./index.html), please do so now before moving forward:
```javascript
async function main() {
    const ourCollection = db.collection("example");
    await ourCollection.index("name");
    let explainedCollection = ourCollection.explain();
    await explainedCollection.insert(
            { name: "Dillon", age: 24, position: "developer" },
            { name: "Alex", age: 23, position: "developer" },
            { name: "Tom", position: "marketing" },
            { name: "Todd", position: "sales" }
        );
    ourCollection.find({ position: "developer" })
        .and({ name: Dex.loadIn("Dillon", "Alex" })
        .or({ name: "Todd" })
        .or({ position: "marketing" })
        .fetchAll()
        .then((results) => {
            console.log(results);
        });
}

main();
```

## Starters
First, a query begins with a function that starts a query. This is where the chain begins. The most commonly returned starter is a [```ReadQuery```](./ReadQuery.html) from a [```find```](./Collection.html#find) and many other chainable methods. The ```collection``` function returns a [```Collection```](./Collection.html) object. In the example code:
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
let explainedCollection = ourCollection.explain();
explainedCollection.insert(
            { name: "Dillon", age: 24, position: "developer" },
            { name: "Alex", age: 23, position: "developer" },
            { name: "Tom", position: "marketing" },
            { name: "Todd", position: "sales" }
        );
ourCollection.find({ position: "developer" })
        .and({ name: Dex.loadIn("Dillon", "Alex" })
        .or({ name: "Todd" })
        .or({ position: "marketing" })
        .fetchAll()
        .then((results) => {
            console.log(results);
        });
```
The ```explain``` method can be considered a chainable operator because it takes the ```Collection``` it is called on and returns a new ```Collection``` that has the ```explain``` parameter set. This parameter tells the database to provide information about the queries that are performed, whether that be an insert, remove, or find. This information contains statistics on things such as how long the database took to perform an operation or how much data it searched through, etc. The ```explain``` parameter can also be called off of other objects and it will act the same way, returning a new object that has the ```explain``` parameter set on its ```Collection```.

The ```and``` and ```or``` methods are chainable operators. They can be called on methods that return ```ReadQuery``` objects, such as the ```find``` method. In this example, the ```find``` begins with a search for all items with "developer" as the person's "position". An easy way to add more parameters to this search is to add the ```and``` method. The ```add``` method makes it so that the items being returned should also have the "name", "Dillon" or "Alex". We'll get to what the ```Dex.loadIn``` is in the next section! The next ```or``` method adds the ability to also look for items whose "name" is "Todd".

Chainable operators are designed to allow storage of modified elements without overwriting previous instances. So in the example, we have assigned the ```ourCollection.explain();``` to a new variable called ```explainedCollection```. The ```ourCollection``` object remains unchanged when calling ```explain```. The ```explain``` method simply returns a new ```Collection``` object that becomes ```explainedCollection```. The benefit of this layout is that now we can use ```explainedCollection``` with the ```insert``` method to insert items into the collection and measure how long this action takes, but then we can still use ```ourCollection``` with the ```find``` method to search for items without explaining this action. This format provides the most amount of dexterity and makes it harder to accidentally modify ```Collection```s or ```Query```s without knowing it.

By chaining operators, you can create queries that are easy to read and write. But what if you don't like chainable operators, or the query is too complex to use them? This is where shorthand operators come in...

## Shorthand Operators
Sometimes not every query can be created using only chained operators and it can also be personal preference to avoid chainable operators. For these cases, we have created shorthand operators. The ```Dex``` class contains many static methods that act as shorthand operators. These operators can be substituted for values in a query in order to modify the value in a way that would be impossible to do otherwise. Some of these operators include ranges and multiple possible values. Let's look at the example:
```javascript
ourCollection.find({ position: "developer" })
        .and({ name: Dex.loadIn("Dillon", "Alex" })
        .or({ name: "Todd" })
        .or({ position: "marketing" })
        .fetchAll()
        .then((results) => {
            console.log(results);
        });
```
In the ```and``` method, we have used a ```Dex.loadIn``` shorthand operator. The ```Dex.loadIn``` operator essentially creates an "OR" between the values that are inputted into it. So in this example, we have a query that is looking for items with "position" as "developer". In the chained ```and``` method, we use a field, "name", and we give a value that should be searched for. We substitute ```Dex.loadIn``` here since it returns a [```ReadOpPartial```](./ReadOpPartial.html). The ```loadIn``` is a method that allows the user to input two or more values that the item might have on the specified field. So in this case, the item could have the name, "Dillon" or "Alex". There are many types of shorthand operators and they can be very handy in many situations, whether you like chaining methods or not.

Take a look at the [```Dex```](./Dex.html) documentation for more of these static shorthand methods.

## Put it Together
Below, we have an example of assigning a partial queries to a variables in a way that provides a lot of control and dexterity:
```javascript
const developerOrSales = Dex.loadIn("developer", "sales");
const readOperation = Dex.and({ name: "Alex" }, { position: developerOrSales });
ourCollection.find(readOperation).fetchAll().then((results) => {
    console.log(results);
});
```
The first line returns a ```ReadOpPartial``` to "developerOrSales". The ```loadIn``` shorthand operator is essentially an "Or" for the passed values. So in this example, we are looking for people with the name, "Alex", whose position is either "developer" or "sales". It's easy to store possible [```Value```s](./global.html#Value) or ranges using this method of shorthand operator assignment.
Moreover, the second line takes advantage of the "developerOrSales" variable that we made and returns a [```ReadOp```](./ReadQuery.html) to "readOperation". This unfinished query can then be passed directly to the ```find``` method, making it really easy to save unfinished queries and adjust them as necessary throughout your code.

## Consuming Methods
After one or more chainable operators are used, the query should be consumed. Usually a consuming operator takes the query that has been formed and sends it to the database, returning a result, usually (but not always) in the form of a Promise. We'll break down the example once more to see applications of consuming methods:
```javascript
async function main() {
    const ourCollection = db.collection("example");
    await ourCollection.index("name");
    let explainedCollection = ourCollection.explain();
    await explainedCollection.insert(
            { name: "Dillon", age: 24, position: "developer" },
            { name: "Alex", age: 23, position: "developer" },
            { name: "Tom", position: "marketing" },
            { name: "Todd", position: "sales" }
        );
    ourCollection.find({ position: "developer" })
        .and({ name: Dex.loadIn("Dillon", "Alex" })
        .or({ name: "Todd" })
        .or({ position: "marketing" })
        .fetchAll()
        .then((results) => {
            console.log(results);
        });
}

main();
```
Consuming methods are any methods that break a chain and do not allow any further chains from being formed after it. In this example, ```index```, ```insert```, and ```fetchAll``` can all be considered examples of consuming methods. They finish the chain (minus any promise handling) and send the query to the database. Before a consuming method, all of the previous methods formulate the query that is sent. The consuming method causes the formed query to be serialized and sent to the database. Consuming methods may or may not have passed parameters, but many of the ```ReadQuery``` consumers do not because they use the ```ReadQuery``` that has been formed up until that point.

## Conclusion
So that's it! You should have all of the tools you need to start using the DexterityDB Node.js driver. For more help with specific methods or results see any of the examples that are littered throughout the Classes' documention.

Dex on!