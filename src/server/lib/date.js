// http://stackoverflow.com/a/11888430/793916
/**
 * Check if daylight savings is in effect.
 * @returns {boolean}
 */
Date.prototype.dst = function() {
	const jan = new Date(this.getFullYear(), 0, 1)
	const jul = new Date(this.getFullYear(), 6, 1)
	
	return (
		this.getTimezoneOffset() <
		Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
	)
}
