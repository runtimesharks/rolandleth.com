import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import NotFoundPage from "./pages/NotFound"
import About from "./pages/About"
import Intro from "./pages/Intro"
import LifeAbout from "./pages/life/LifeAbout"
import Blog from "./pages/blog/Blog"

const Routes = () => {
	return (
		<Switch>
			<Route exact path="/" component={Intro} />
			<Route exact path="/about" component={About} />
			<Route exact path="/life/about" component={LifeAbout} />
			<Route exact path="/life/blog/:postLink?">
				<Blog section="life" key="life" />
			</Route>
			<Route
				exact
				path="/tech/blog/:postLink?"
				onUpdate={() => {
					console.log("A")
				}}
			>
				<Blog section="tech" key="tech" />
			</Route>

			<Route path="/:oldPost" component={OldPostHandler} />
			<Route path="*" component={NotFoundPage} />
		</Switch>
	)
}

const OldPostHandler = ({ match }) => {
	const url = match.url.substr(1) || ""

	if (existingPosts.includes(url)) {
		return <Redirect to={`/tech/blog/${url}`} />
	} else {
		return <NotFoundPage />
	}
}

const existingPosts = [
	"world-hello",
	"restructuring-the-site",
	"slowly-but-surely",
	"drop-the-layout-magic",
	"uialertview-customization",
	"cggeometry-and-you",
	"markdown-to-rtf-in-mail",
	"timepiece-symbol-font",
	"uieffectdesignerview",
	"search-kit",
	"iphone-app-showcase",
	"carminder",
	"thriving-in-an-app-store-world",
	"stop-thinking-its-too-hard",
	"ikonica",
	"late-spring-cleaning",
	"carminder-1-0-4-is-live",
	"live-design-feedback-with-redpen",
	"carminder-1-0-5",
	"new-site-structure--again-",
	"optimized-for-idevices",
	"new-ios-hig",
	"final-version--for-now-",
	"new-relic",
	"no-room-for-errors",
	"expenses-planner-for-ios",
	"tweaking-file-handling",
	"ruby-script-to-search-your-xcode-project-for-unused-assets",
	"recurring-events-for-expenses-planner",
	"incomes-for-expenses-planner",
	"fetching-posts-from-dropbox",
	"dropbox-sync-for-the-blog",
	"implementing-the-search-field",
	"improving-the-search-highlighted-terms",
	"sneak-peeks-for-upcoming-updates",
	"ios-7-style-passcode",
	"ios-7-versions-released",
	"going-from-paid-to-free",
	"adding-recurring-events",
	"solved-by-flexbox",
	"debuggex-com",
	"expenses-planner-updates",
	"app-store-reviews",
	"lthpasscodeviewcontroller-3-0-0",
	"unsubscribe",
	"facebooks-paper",
	"sennheiser-ie-80",
	"mm--yyyy-uipickerview",
	"swiss-airlines-webpage",
	"free-and-pro-versions",
	"deindeal",
	"puppet-anthems",
	"swift-first-impressions",
	"long-time",
	"default-uibarbuttonitems-with-protocols",
	"improved-dropbox-sync",
	"securing-the-dropbox-sync-command",
	"fastlane",
	"swift-inferred-types",
	"formatters-",
	"improving-the-dropbox-sync",
	"improving-the-dropbox-sync-2",
	"finally-fixed-the-timezone",
	"autoresizing-mask-and-frames",
	"print-calling-function",
	"fixing-the-search",
	"terminal-improvements-for-git",
	"gitup",
	"fixing-the-search-2",
	"pattern-matching-in-swift",
	"improving-the-images",
	"broken-feed",
	"improving-the-syntax-coloring",
	"broken-site",
	"reading-time",
	"easyanimation",
	"wwdc-keynote-impressions",
	"xcode-ui-testing",
	"27-open-source-libraries-for-ios",
	"shadow-system-for-unity",
	"rewriting-expenses-planner",
	"ep-migrating-old-data",
	"oop-is-pop-pop-is-oop",
	"speaking-of-protocols",
	"diving-into-auto-layout",
	"ep-icloud-sync",
	"gitsh",
	"ep-improving-the-icloud-sync",
	"snippetslab",
	"wrapping-up-the-pull-request-from-terminal",
	"highlighting-todos-fixmes-errors",
	"fastlane-fastfile",
	"fastlane-fastfile--2",
	"improving-fastlane",
	"fastlane-fastfile-3",
	"fastlane-deliverfile",
	"textfields-with-inputview",
	"fastlane-and-alfred",
	"improving-the-search",
	"sass-mixins",
	"swift-and-enums-1",
	"ios-good-practices",
	"search-vulnerability",
	"swift-and-enums-2",
	"breaking-cocoa",
	"subscriber-share-for-streaming-music",
	"content-hugging-and-compression-resistance",
	"auto-layout-and-transitionwithview",
	"changing-just-the-font-size-of-a-button",
	"dhl-express",
	"content-blockers-and-assets",
	"uiscrollviews-and-auto-layout",
	"tips-for-consuming-apis",
	"searchable-wwdc-videos",
	"xcode-7-crash-analysis-tools",
	"safaris-new-pinned-tab-feature",
	"opening-pull-requests-from-terminal",
	"improving-the-pull-request-from-terminal",
	"swift-and-enums-3",
	"code-coverage-issues-for-swift-projects",
	"reusing-blocks-of-code",
	"updating-xcode-plug-ins",
	"swift-going-open-source",
	"different-fonts-for-the-same-label",
	"running-a-script-with-nstask-and-nspipe",
	"manipulating-files-outside-of-sandbox",
	"plugrocket",
	"lightpaper",
	"easier-hugging--compression-handling",
	"creating-a-theme-helper",
	"working-easier-with-tags",
	"improving-git-log",
	"frame-debugging-on-a-device",
	"tableviews-collectionviews-and-swift-enums",
	"the-mas-updates-and-the-cli",
	"better-interaction-between-viewwilltransitiontosize-and-cgsize",
	"setting-variables-with-tuples-switches-and-closures",
	"improving-uifont-workflow",
	"detecting-retain-cycles-and-improved-logging",
	"nsdate-operators",
	"writing-is-hard",
	"uicollectionview-snap-scrolling-and-pagination",
	"cashapelayer-fill-rules",
	"easier-interaction-between-uiimage-and-assets",
	"node-js",
	"njs-server-templates-and-the-pipeline",
	"njs-routing",
	"njs-layouts",
	"njs-project-structure-and-layout-tips",
	"njs-database-handling-1",
	"njs-database-handling-2",
	"njs-database-handling-3",
	"njs-dropbox-syncing",
	"njs-creating-a-new-post",
	"queueing-up-async-jobs",
	"combining-protocols",
	"adding-string-attributes-slightly-easier",
	"lthradiobutton",
	"slightly-easier-core-data-manipulation",
	"swift-mirroring",
	"thinking-outside-of-the-box",
	"vertical-scrolling-parallax",
	"assign-if-not-nil-if-nil-then-assign",
	"breaking-labeled-scopes",
	"server-side-swift-with-vapor",
	"sss-setting-the-project-up",
	"sss-postgresql-models",
	"sss-displaying-posts-and-extending-queries",
	"sss-creating-an-rss-feed",
	"sss-creating-a-sitemap",
	"naming-init-parameters",
	"non-selectable-uitextviews-and-url-interactions",
	"tips-for-writing-apis",
	"the-app-store-and-the-state-of-pay-to-play",
	"caret-a-great-markdown-editor",
	"iconjar",
	"updated-to-swift-4-and-vapor-2",
	"runtime-sharks",
	"easier-nslayoutconstraint-interactions",
	"creating-an-interactive-label",
	"easier-nslayoutconstraint-interactions-2",
	"challengebeat",
	"observing-and-broadcasting",
	"tower",
	"card-virtual",
	"uitextview-and-uitextfield-knobs-a-story",
	"extracting-and-parsing-tweets-from-your-twitter-archive",
	"extracting-the-location-from-a-photo",
	"increasing-the-tap-area-of-a-uibutton",
	"goalee",
	"optionals-flatmap-and-you",
	"avoiding-the-keyboard-on-uitextfield-focus",
	"my-travel-stories",
	"easier-uifont-usage",
	"handling-the-next-button-automatically",
	"caanimations-and-groups",
	"a-fi-programator-dupa-40-de-ani"
]

export default Routes
