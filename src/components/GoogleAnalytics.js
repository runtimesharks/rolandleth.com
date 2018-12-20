export default function() {
	;(function(i, s, o, g, r, a, m) {
		i["GoogleAnalyticsObject"] = r
		i[r] =
			i[r] ||
			function() {
				;(i[r].q = i[r].q || []).push(arguments)
			}
		i[r].l = 1 * new Date()
		a = s.createElement(o)
		m = s.getElementsByTagName(o)[0]
		a.async = 1
		a.src = g
		m.parentNode.insertBefore(a, m)
	})(
		window,
		document,
		"script",
		"https://www.google-analytics.com/analytics.js",
		"ga"
	)

	const ga = window.ga

	ga(
		"create",
		window.location.href.startsWith("http://localhost:3000")
			? "UA-40255117-5"
			: "UA-40255117-4",
		{ storeGac: false, cookieName: "Google Analytics Cookie" }
	)
	ga("set", "anonymizeIp", true)
	ga("set", "adSenseId", 0)
	ga("set", "allowAdFeatures", false)
	ga("send", "pageview")
}
