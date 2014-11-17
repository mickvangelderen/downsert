module.exports = downsert;

function downsert(object, key, initial) {
	return key in object ? object[key] : object[key] = initial;
};
