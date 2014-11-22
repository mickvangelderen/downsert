var util = require('util');
var errors = require('./errors');
var InvalidParameterError = errors.InvalidParameterError;

module.exports = downsert;

function downsert(subject, query, otherwise) {
	if (!(subject && typeof subject === 'object')) {
		throw new InvalidParameterError('downsert expects subject to be a truthy object but got :subject of type :type', {
			subject: subject,
			type: typeof subject
		});
	}

	// objects are easy
	if (!util.isArray(subject)) {
		return query in subject ? subject[query] : subject[query] = otherwise;
	}

	// arrays are more complex because of the query
	if (typeof query === 'function') {
		// downsert([{ id: 5, fresh: false }], function(o) { return o.id === 5 }, { id: 5, fresh: true }) -> returns { id: 5, fresh: false }
		// downsert([], function(o) { return o.id === 5 }, { id: 5, fresh: true }) -> pushes { id: 5, fresh: true } and returns it
		for (var i = 0, li = subject.length; i < li; i++) {
			var object = subject[i];
			if (query(object)) { return object; }
		}
	} else if (typeof query === 'object') {
		// downsert([{ id: 5, fresh: false }], { id: 5 }, { id: 5, fresh: true }) -> returns { id: 5, fresh: false }
		// downsert([], { id: 5 }, { id: 5, fresh: true }) -> pushes { id: 5, fresh: true } and returns it
		for (var i = 0, li = subject.length; i < li; i++) {
			var object = subject[i];
			var match = true;
			for (var key in query) {
				if (object.hasOwnProperty(key) && (object[key] !== query[key])) { match = false; break; }
			}
			if (match) { return object; }
		}
		// downsert([], { id: 5 }) -> pushes { id: 5 } and returns it
		if (otherwise === undefined) { otherwise = query; }
	} else {
		// downsert([5], 5, 6) -> returns 5
		// downsert([], 5, 6) -> pushes 6 and returns it
		for (var i = 0, li = subject.length; i < li; i++) {
			var object = subject[i];
			if (object === query) { return object; }
		}
		// downsert([], 5) -> pushes 5 and returns it
		if (otherwise === undefined) { otherwise = query; }
	}

	subject.push(otherwise);
	return otherwise;
}
