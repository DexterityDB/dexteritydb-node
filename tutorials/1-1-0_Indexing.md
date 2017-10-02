<br>
In the database world, it is good practice to index items by the fields that you will want to search on. Indexing ensures the fastest performance possible, on all databases, not just DexterityDB. Therefore, DexterityDB REQUIRES the use of indexes to search on any field in the collection. Sometimes, it is inconvenient or otherwise time consuming to index every field that will be searched on. Therefore, we made it really simple to index a field on your DexterityDB collections.

Simply call the [```index```](../docs/Collection.html#index) function and pass the field name as a string. Do this at any point before searching on that field. The indexes will be kept up-to-date even after inserting new items in the collection. The DexterityDB team recommends prioritizing indexing and getting it out of the way early. Since DexterityDB automatically indexes new items, indexing fields early makes code cleaner and makes the intent to search on those fields more obvious.

Now that we have gone over the principles of DexterityDB, let's jump into the way the node driver helps to simplify interactions with the database:

[Parts of the Language](./tutorial-1-2-0_PartsOfTheLanguage.html)