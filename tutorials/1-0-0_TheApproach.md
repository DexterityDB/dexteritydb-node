<br>
DexterityDB was designed to be fast and easy to use. These principles were carried over to the DexterityDB Node.js driver. Simplicity and dexterity were priorities in building the language that would be used to interact with DexterityDB.

By following the tutorials in this documentation, you will become familiar with the mantras used by the DexterityDB team. By the end, the DexterityDB node language should seem fluid and easy to understand and implement.

## Vocabulary
First, it is important that we go over some vocab. Some of these terms will probably be common knowledge to anyone very familiar with databases, as well as SQL and noSQL data structures. But some of the terms may have new meaning in the DexterityDB context so the vocab section should serve as a refresher. Feel free to skip this section if you think you're up to date with your database lingo!

### Collection
A group of items in a database, usually related in some way and pertaining to a similar use-case. Can be compared to a Table in structured datasets.

### Driver
You're using one! Databases have a core low-level API that they use to accept messages from applications. These messages can be in any format (DexterityDB currently uses JSON messages). Language drivers allow a developer to code using function calls in coding languages that they are more familiar with. By mapping the functions in the driver to the low-level API, code can be more easily written and understood in languages that are used more frequently in application building.

### Field
Fields in a collection correspond to labels that values will be categorized under. For instance, in a collection of people, there may be a field called "name". Under this field, the "value" may be "John." Fields can be compared to column labels in structured datasets.

### Item
An entry in a collection. The item can have field-value pairs that corespond to its characteristics. This is a common schema in noSQL datasets. Each item is basically a row in SQL datasets; each row has columns that contain values.

### Projection
The ability to filter the results that are returned from a search on the database. This filter is done on the database side so that the results returned to the user include or exclude certain fields.

### Value
Any piece of information that is inserted into a collection under a field label. DexterityDB currently supports ```number``` and ```string``` values.

---

Now that's out of the way, check out the next section on Indexing:

[Indexing](./tutorial-1-1-0_Indexing.html)