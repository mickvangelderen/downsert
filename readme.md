# Downsert

The name downsert comes from its 'create-or-retrieve' mechanic that kind of resembles the upsert 'update-or-insert' mechanic. 

I found myself using the following code quite often:
```js
// get customer data from the dataByCustomerId map
var data = dataByCustomerId[customer.id];
// check if it actually exists
if (!data) {
    // insert a new customer data object
    data = dataByCustomerId[customer.id] = { customerId: customer.id };
}
// modify the customer data
data.newField = 42;
```

becomes:
```js
var data = downsert(dataByCustomerId, customer.id, { customerId: customer.id });
data.newField = 42;
```

The arguments to downsert are subject, query and otherwise:
```js
downsert(subject, query, otherwise)
```

The implementation for just objects is something like this:
```js
function downsert(subject, query, otherwise) {
    return query in subject ? subject[query] : subject[query] = otherwise;
}
```

Once you know what it does it makes the code easier to read. 

## Downserting array entries

From version 0.2.1 and onwards it is possible to ensure entries in an array. Downsert determines the existance of the entry by using the query you define. 

The query argument can be a function, an object or an other value. 

In the case that the query is a function, the function is called with each existing entry. If the query function returns true, that object is returned. If the object wasn't found, the otherwise argument is pushed to the end of the array and returned. 

Using the following setup:
```js
var entry1 = { id: 1, name: 'Lee' };
var entry2 = { id: 2, name: 'Sin' };
var list = [ entry1, entry2 ];
```

We query from the list an entry with id 2:
```js
var otherwise = { id: 2 };
var entry = downsert(list, function(e) { return e.id === 2; }, otherwise);
// now entry === entry2, list consists of [ entry1, entry2 ]
```

We query from the list an entry with id 100:
```js
var otherwise = { id: 100 };
var entry = downsert(list, function(e) { return e.id === 100; }, otherwise);
// now entry === otherwise, list consists of [ entry1, entry2, otherwise ]
```

The function is useful if you are comparing dates for example:
```js
var entry = downsert(statistics, function(e) {
    // convert date object to string for comparison
    return e.date.toISOString() === '2014-11-22T15:10:00.705Z'
}, { date: '2014-11-22T15:10:00.705Z' });
```

Critique and other thoughts are always welcome. 

## Tests and examples
Check the [tests](test/downsert-test.js) for more examples. 