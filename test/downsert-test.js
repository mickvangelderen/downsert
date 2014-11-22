var expect = require('chai').expect;

var downsert = require('../lib/downsert');

describe('lib/downsert.js', function() {

	describe('downsert(subject, query, otherwise)', function() {

		var map, list, simple, entry1, entry2, entry3;

		beforeEach(function() {
			entry1 = { id: 1, name: 'Ernst' };
			entry2 = { id: 2, name: 'Bobby' };
			entry3 = { id: 3, name: 'Rest' };
			list = [ entry1, entry2, entry3 ];
			map = {};
			list.forEach(function(entry) { map[entry.id] = entry; });
			simple = [ 'one', 'two', 'three' ];
		});

		it('should throw an error when the subject is not an object', function() {
			expect(function() {
				downsert();
			}).to.throw('downsert expects subject to be a truthy object but got undefined of type "undefined"');
			expect(function() {
				downsert(null);
			}).to.throw('downsert expects subject to be a truthy object but got null of type "object"');
			expect(function() {
				downsert(true);
			}).to.throw('downsert expects subject to be a truthy object but got true of type "boolean"');
		});

		// downsert(object, property, ...)

		it('should create a property on the subject if it is not already present', function() {
			var otherwise = { id: 4 };
			var entry = downsert(map, 4, otherwise);
			expect(entry).to.equal(otherwise);
			expect(map).to.have.property(4).that.equals(otherwise);
		});

		it('should return the existing property on the subject if it is present', function() {
			var otherwise = { id: 2 };
			var entry = downsert(map, 2, otherwise);
			expect(entry).to.equal(entry2);
		});

		// downsert(array, query function, ...)

		it('should return the entry that was matched using a query function', function() {
			var otherwise = { id: 2 };
			var entry = downsert(list, function(object) { return object.id === 2; }, otherwise);
			expect(entry).to.equal(entry2);
			expect(list).to.have.length(3);
		});

		it('should create a new entry when no match is found using a query function', function() {
			var otherwise = { id: 4 };
			var entry = downsert(list, function(object) { return object.id === 4; }, otherwise);
			expect(entry).to.equal(otherwise);
			expect(list).to.have.length(4);
			expect(list[3]).to.equal(otherwise);
		});

		// downsert(array, query object, ...)

		it('should return the entry that was matched using a query object', function() {
			var otherwise = { id: 2 };
			var entry = downsert(list, { id: 2 }, otherwise);
			expect(entry).to.equal(entry2);
			expect(list).to.have.length(3);
		});

		it('should create a new entry when no match is found using a query object', function() {
			var otherwise = { id: 4 };
			var entry = downsert(list, { id: 4 }, otherwise);
			expect(entry).to.equal(otherwise);
			expect(list).to.have.length(4);
			expect(list[3]).to.equal(otherwise);
		});

		it('should create a new entry using the selector when no match is found but no otherwise is passed using a query object', function() {
			var otherwise = { id: 4 };
			var entry = downsert(list, otherwise);
			expect(entry).to.equal(otherwise);
			expect(list).to.have.length(4);
			expect(list[3]).to.equal(otherwise);
		});

		// downsert(array, query value, ...)

		it('should return the entry that was matched using a query value', function() {
			var entry = downsert(simple, 'two', 'two');
			expect(entry).to.equal('two');
			expect(simple).to.have.length(3);
		});

		it('should create a new entry when no match is found using a query value', function() {
			var entry = downsert(simple, 'four', 'four');
			expect(entry).to.equal('four');
			expect(simple).to.have.length(4);
			expect(simple[3]).to.equal('four');
		});

		it('should create a new entry using the selector when no match is found but no otherwise is passed using a query value', function() {
			var entry = downsert(simple, 'four');
			expect(entry).to.equal('four');
			expect(simple).to.have.length(4);
			expect(simple[3]).to.equal('four');
		});
	});

});