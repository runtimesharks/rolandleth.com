require 'rss'
require 'markdown_renderer'
require 'dropbox_sdk'
require 'dropbox_keys'

class Application < Sinatra::Application
	include DropboxKeys
	PAGE_SIZE = 5
	PAGES = %W{ about contact apps projects work bouncyb sosmorse iwordjuggle privacy-policy expenses-planner carminder }

	configure :production do
		require 'newrelic_rpm'
	end

	# Custom wp-admin and wp-login handling, since I keep getting dictionary attacked
	get '/wp-login.php' do
		return not_found
	end

	get '/wp-admin' do
		return not_found
	end

	# RSS
	get '/feed' do
		posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		rss ||= RSS::Maker.make('atom') do |maker|
			maker.channel.icon = '/public/favicon.ico'
			maker.channel.logo = '/public/favicon.ico'
			maker.channel.id = 'http://rolandleth.com'
			maker.channel.link = 'http://rolandleth.com/feed'
			maker.channel.title = 'Roland Leth'
			maker.channel.description = 'Roland Leth'
			maker.channel.author = 'Roland Leth'
			maker.channel.language = 'en'
			maker.channel.rights = "© #{Time.now.year} Roland Leth"
			maker.channel.subtitle = 'iOS and Ruby development thoughts by Roland Leth.'
			maker.items.do_sort = false

			posts.each do |post|
				matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\}\{\[\]_&@$:"';!=\?\+\*\-\)\(]+)\.md$/)
				i = maker.items.new_item
				i.title = matches[5]
				time = Date._strptime("#{matches[4]} EEST","%H%M %Z")
				# titles are written 'Like this', links need to be 'Like-this'
				i.link = "http://rolandleth.com/#{matches[5].gsub("\s", "-")}".gsub(";", "")
				i.content.content = _markdown_for_feed(File.readlines(post)[2..-1].join())
				i.content.type = 'html'
				i.updated = DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
				i.published = DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
				# The RSS was last updated when the last post was posted (which is first in the array)
				maker.channel.updated ||= DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
			end
		end
		rss.link.rel = 'self'
		rss.link.type = 'application/atom+xml'
		rss.entries.each do |entry|
			entry.content.lang = 'en'
			entry.title.type = 'html'
		end
		rss.to_s
	end

	# Links to /1 are redirected to root. No reason to display http://root/1
	get '/1' do
		redirect '/', 301
	end

	# Apply a permanent redirect from http://root/key/ to http://root/key (I always want links to show without '/' at end)
	# If the $ condition is removed, it will try to redirect anything like http://root/key/anything/can/be/here to http://root/key
	# And it would screw file downloading
	get %r{^/([\w\s\.\}\{\]\[_&@$:"';!@=\?\+\*\-\)\(\/]+)/$} do |key|
		redirect "/#{key}", 301
	end

	# Apply a non-permanent redirect from http://root/key/anything/can/be/here to http://root/key
	# Might change my mind about this, since it's a bit more drastic, thus not a permanent redirect
	get %r{^/([\w\s\.\}\{\]\[_&@$:"';!@=\?\+\*\-\)\(\/]+)/} do |key|
		redirect "/#{key}", 302
	end

	# Apply a permanent redirect from http://root/page#/anything/can/be/here to http://root/page# (I always want links to show without '/' at end)
	get %r{^/(\d+)/} do |current_page|
		redirect "/#{current_page}", 301
	end

	# Main page
	get '/' do
		all_posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		total_pages = (all_posts.count.to_f / PAGE_SIZE.to_f).ceil.to_i
		posts = all_posts[0..4]
		@meta_description = 'iOS and Ruby development thoughts by Roland Leth.'
		erb :index, locals: { posts: posts, page: 1, total_pages: total_pages, gap: 2 }
	end

	# Pages
	get %r{^/(\d+)$} do |current_page|
		@meta_canonical = current_page
		#session = DropboxSession.new(APP_KEY, APP_SECRET)
		#session.set_access_token(AUTH_KEY, AUTH_SECRET)
		#client = DropboxClient.new(session, ACCESS_TYPE)
		#puts client.metadata('/Work/Sites/rolandleth/posts')['contents'][0]

		# Retrieve all posts in dir and store them in an array. sort the array, reverse it to be newest->oldest
		all_posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		all_posts.each do |post|
			matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\}\{\[\]_&@$:"';!=\?\+\*\-\)\(]+)\.md$/)
		end
		page = (current_page || 1).to_i
		# Start index is the first index on each page. if page == 2 and PAGE_SIZE == 5, start_index is 5
		start_index = (page - 1) * PAGE_SIZE
		# End index is last index on each page
		end_index = [start_index + PAGE_SIZE - 1, all_posts.count - 1].min
		total_pages = (all_posts.count.to_f / PAGE_SIZE.to_f).ceil.to_i
		# Posts to be displayed on current page
		posts = all_posts[start_index..end_index]
		# gap: How many pages between first/last and current before '..' is shown
		# Example: gap of 2, current page 5, pagination will be 1 .. 4 5 6 .. 9. Tweaked for use with a gap of 2.
		if page > total_pages
			return not_found
		end
		erb :index, locals: { posts: posts, page: page, total_pages: total_pages, gap: 2 }
	end

	# Small hack to display this page name full of escapes I didn't take care of
	get "/%5BWorld-hello%5D" do
		all_posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		return erb :index, locals: {posts: all_posts, page: all_posts.count - 1, total_pages: -1, window: 2}
	end

	get "/ExpensesPlannerPressKit.zip" do
		return send_file File.open('./assets/files/Expenses Planner Press Kit.zip'), filename: 'Expenses Planner Press Kit.zip'
	end
	get "/CarminderPressKit.zip" do
		return send_file File.open('./assets/files/Carminder Press Kit.zip'), filename: 'Carminder Press Kit.zip'
	end
	get "/Roland Leth - Résumé.pdf" do
		return send_file File.open('./assets/files/Roland Leth.pdf') #, filename: 'Roland Leth - Résumé.pdf'
	end
	get "/Roland Leth - Privacy Policy.md" do
		return send_file File.open('./assets/files/Privacy Policy.md'), filename: 'Roland Leth - Privacy Policy.md'
	end

	# Individual posts and views
	get %r{^/([\w\s\.\}\{\]\[_&@$:"';!@=\?\+\*\-\)\(\/]+)$} do |key|
		@meta_canonical = key
		if PAGES.include? key
			if key == 'projects'
				@title = 'iPhone, iPad, Ruby and Web Apps'
				@meta_description = 'iOS, Ruby, Rails and Web projects by Roland Leth.'
				return erb :projects
			end
			if key == 'work'
				return redirect '/projects', 302
			end
			if key == 'bouncyb'
				# Layout: false means it loads the page with it's own layout, disregarding the HTML/CSS in layout.erb
				return erb :bouncyb, layout: false
			end
			if key == 'iwordjuggle'
				return erb :iwordjuggle, layout: false
			end
			if key == 'sosmorse'
				return erb :sosmorse, layout: false
			end
			if key == 'expenses-planner'
				return erb :'expenses-planner', layout: false
			end
			if key == 'carminder'
				return erb :carminder, layout: false
			end
			if key == 'about'
				@title = 'About'
				@meta_description = 'Some information about the blog. Details, résumé and contact information about Roland Leth.'
				return erb :about
			end
			if key == 'contact'
				return redirect '/about', 302
			end
			if key == 'privacy-policy'
				@title = 'Privacy Policy'
				@meta_description = "Roland Leth's Privacy Policy"
				return erb :'privacy-policy'
			end
		end
		if key == '[World-hello]'
			key = key + ';'
		end
		all_posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		i = 0
		all_posts.each do |post|
			matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\}\{\[\]_&@$:"';!=\?\+\*\-\)\(]+)\.md$/)
			# I write post-filenames as 'YYYY-MM-DD-Name without dashes.md'. If you write them as 'YYYY-MM-DD-Name-with-dashes.md',
			# all this swapping isn't necessary anymore, of course.

			# The Dir creates an array with all file names, but because the posts' Titles are set from the file names,
			# I convert spaces to '-' inside post.erb for the href link, to avoid the ugly HTML's %20s.
			# Meaning I have to swap '-' to spaces back when the user actually clicks the link, so the files are properly read
			@title = matches[5]
			@meta_description = matches[5]
			return erb :index, locals: {posts: all_posts, page: i, total_pages: -1, window: 2} if matches[5].downcase == key.gsub("-", "\s")
			redirect "#{key.downcase}", 301 if matches[5].downcase == key.gsub("-", "\s").downcase
			# Total pages is set to -1 so I don't create another variable just for when a post is clicked to be viewed
			# individually. If total_pages == -1, hide the pagination and display only the clicked post
			# I'm also using the page variable as 'current array index' to retrieve the clicked post, instead of a new variable.
			i += 1
		end
		return not_found
	end

	not_found do
		@title = '404'
		@meta_description = "This isn't the page your are looking for."
		@meta_canonical = '404 error raised'
		status 404
		return erb :not_found
	end

	error do
		@title = 'Error'
		status 500
		return erb :not_found
	end
end
