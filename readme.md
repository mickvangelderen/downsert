# Downsert

I found myself using this style quite often when extending objects so now it's a package. 

example:

```
var data = dataByCustomerId[customer.id];
if (!data) {
    data = dataByCustomerId[customer.id] = [];
}
data.newField = 42;
return data;
```

becomes:

```
var data = downsert(dataByCustomerId, customer.id, []);
data.newField = 42;
return data;
```

So you pass three arguments, the object, the key and a default value for when the key is not there. 

Once you know what it does it makes the code easier to read. 