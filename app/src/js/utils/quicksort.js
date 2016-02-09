/**
 * quicksort code from https://github.com/escherba/algorithms-in-javascript
 */

var partition = function ( array, left, right, satellite_array, satellite_width ) {
	var pivot = array[(left + right) >>> 1]
	while (left <= right) {
		while (array[left] > pivot) { left++; }
		while (array[right] < pivot) { right--; }
		if (left <= right) {

			/* sort reference array */
			var temp = array[left]
			array[left] = array[right]
			array[right] = temp

			/* sort satellite array */
			for( var i = 0; i < satellite_width; i++) {
				temp = satellite_array[ left * satellite_width + i ]
				satellite_array[ left * satellite_width + i ] = satellite_array[right * satellite_width + i ]
				satellite_array[ right * satellite_width + i ] = temp
			}

			left++
			right--

		}
	}
	return left
}

var quicksort = function ( array, satellite_array, satellite_width ) {
	var stack = [ array.length - 1, 0 ]
	while (stack.length > 0) {
		var left = stack.pop(),
		right = stack.pop(),
		mid = partition(array, left, right, satellite_array, satellite_width)
		if (left < mid - 1) {
			stack.push(mid - 1) // push right
			stack.push(left)    // push left
		}
		if (right > mid) {
			stack.push(right) // push right
			stack.push(mid)   // push left
		}
	}
	return satellite_array
}

module.exports = quicksort
