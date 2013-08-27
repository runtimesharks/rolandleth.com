require 'rss'
require 'markdown_renderer'
require 'dropbox_sdk'
require 'dropbox_keys'
require 'dm-core'
require 'dm-timestamps'
require 'dm-postgres-adapter'
require 'dm-migrations'

class Application < Sinatra::Application
	include DropboxKeys
	PAGE_SIZE = 5
	PAGES = %W{ about contact apps projects work bouncyb sosmorse iwordjuggle privacy-policy expenses-planner carminder }

	class Posts
		include DataMapper::Resource
		DataMapper::Property::String.length(255)
		DataMapper::Property::Text.length(999999)
		property :id, Serial
		property :title, Text
		property :body, Text
		property :datetime, String
		property :modified, String
		property :link, String
	end

	class DropboxSyncs
		include DataMapper::Resource
		property :id, Serial
		property :count, Integer
	end

	configure :production do
		require 'newrelic_rpm'
		DataMapper::setup(:default, ENV['DATABASE_URL'])
		DataMapper.auto_upgrade!
	end

	configure :development do
		DataMapper::setup(:default, "postgres://roland@localhost/roland")
		DataMapper.auto_upgrade!
	end

	# RSS
	get '/feed' do
		posts = repository(:default).adapter.select('SELECT * FROM application_posts')
		posts.map! { |struc| struc.to_h }
		posts.sort! { |a, b| a[:datetime] <=> b[:datetime] }.reverse!
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
				i = maker.items.new_item
				i.title = post[:title]
				date_matches = post[:datetime].match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
				time = Date._strptime("#{date_matches[4]} EEST","%H%M %Z")
				# titles are written 'Like this', links need to be 'Like-this'
				i.link = "http://rolandleth.com/#{post[:link]}"
				i.content.content = _markdown_for_feed(post[:body].lines[2..-1].join())
				i.content.type = 'html'
				i.updated = DateTime.new(date_matches[1].to_i, date_matches[2].to_i, date_matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
				i.published = DateTime.new(date_matches[1].to_i, date_matches[2].to_i, date_matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
				# The RSS was last updated when the last post was posted (which is first in the array)
				maker.channel.updated ||= DateTime.new(date_matches[1].to_i, date_matches[2].to_i, date_matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
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

	# Custom sync with Dropbox URL
	get '/cmd.Dropbox.Sync' do
		session = DropboxSession.new(APP_KEY, APP_SECRET)
		session.set_access_token(AUTH_KEY, AUTH_SECRET)
		client = DropboxClient.new(session, ACCESS_TYPE)
		client_metadata = client.metadata('/Apps/Editorial/posts')['contents']
		client_metadata.each do |file|
			matches = file['path'].match(/\/(apps)\/(editorial)\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\/\}\{\[\]_#&@$:"';!=\?\+\*\-\)\(]+)\.md$/)
			datetime = matches[4].to_s + '-' + matches[5].to_s + '-' + matches[6].to_s + '-' + matches[7].to_s
			link = matches[8].to_s
			link.gsub!(/([\,\;\!\.\:\?\"\'\[\]\{\}\(\#\$\/)]+)/, '')
			link.gsub!('&', 'and')
			link.gsub!("\s", "-")
			link.downcase!
			file_mtime = file['client_mtime'].to_s

			post = Posts.first(:link => link)
			# If the posts exists
			if post
				# Check to see if it was modified
				if post.modified != file_mtime
					body = client.get_file(file['path'])
					title = body.lines.first
					post.update(title: title, body: body, datetime: datetime, modified: file_mtime, link: link)
				end
			# Otherwise, create a new record
			else
				body = client.get_file(file['path'])
				title = body.lines.first
				Posts.create(title: title, body: body, datetime: datetime, modified: file_mtime, link: link)
			end
		end
		all_posts = Posts.all
		# Check if any post was deleted (highly unlikely)
		all_posts.each do |post|
			delete = true
			client_metadata.each do |file|
				link = file['path'].match(/\/(apps)\/(editorial)\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\}\{\[\]_#\$&@$:"';!=\?\+\*\-\)\(]+)\.md$/)[8].to_s
				link.gsub!(/([\,\;\!\.\:\?\"\'\[\]\{\}\(\#\$)]+)/, '')
				link.gsub!('&', 'and')
				link.gsub!("\s", "-")
				link.downcase!
				delete = false if link == post.link
			end
			post.destroy if delete
		end
		# Keep a count of all my syncs. Just because.
		syncs = DropboxSyncs.first(:id => 1)
		syncs.update(:count => (syncs[:count] + 1))
		redirect '/', 302
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
		all_posts = repository(:default).adapter.select('SELECT * FROM application_posts')
		all_posts.map! { |struc| struc.to_h}
		all_posts.sort! { |a, b| a[:datetime] <=> b[:datetime]}.reverse!

		total_pages = (all_posts.count.to_f / PAGE_SIZE.to_f).ceil.to_i
		posts = all_posts[0..4]
		@meta_description = 'iOS and Ruby development thoughts by Roland Leth.'
		erb :index, locals: { posts: posts, page: 1, total_pages: total_pages, gap: 2 }
	end

	# Search
	get %r{^/search$} do
		query = request.env['rack.request.query_hash']['query']
		query_array = []
		if query[0,1] == '"' and query[-1,1] == '"'
			query_array << query.gsub('"', '').downcase
		else
			query_array = query.downcase.split(' ')
		end

		all_posts = repository(:default).adapter.select('SELECT * FROM application_posts')
		all_posts.map! { |struc| struc.to_h}
		all_posts.sort! { |a, b| a[:datetime] <=> b[:datetime]}.reverse!

		all_posts.select!	do |p|
			query_array.any? { |w| p[:body].downcase.include?(w) or p[:title].downcase.include?(w) }
		end

		@meta_description = 'iOS and Ruby development thoughts by Roland Leth.'
		if all_posts.count > 0
			erb :index, locals: { posts: all_posts, page: 1, total_pages: 1, gap: 2 }
		else
			search_not_found
		end
	end

	# Pages
	get %r{^/(\d+)$} do |current_page|
		@meta_canonical = current_page

		all_posts = repository(:default).adapter.select('SELECT * FROM application_posts')
		all_posts.map! { |struc| struc.to_h}
		all_posts.sort! { |a, b| a[:datetime] <=> b[:datetime]}.reverse!

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
			not_found
		else
			erb :index, locals: { posts: posts, page: page, total_pages: total_pages, gap: 2 }
		end
	end

	get "/ExpensesPlannerPressKit.zip" do
		send_file File.open('./assets/files/Expenses Planner Press Kit.zip'), filename: 'Expenses Planner Press Kit.zip'
	end
	get "/CarminderPressKit.zip" do
		send_file File.open('./assets/files/Carminder Press Kit.zip'), filename: 'Carminder Press Kit.zip'
	end
	get "/Roland Leth - Résumé.pdf" do
		send_file File.open('./assets/files/Roland Leth.pdf') #, filename: 'Roland Leth - Résumé.pdf'
	end
	get "/Roland Leth - Privacy Policy.md" do
		send_file File.open('./assets/files/Privacy Policy.md'), filename: 'Roland Leth - Privacy Policy.md'
	end

	# Individual posts and views
	get %r{^/([\w\s\.\}\{\]\[_&@$:"';!@=\?\+\*\-\)\(\/]+)$} do |key|
		@meta_canonical = key

		if PAGES.include? key.downcase
			if key.downcase == 'projects'
				@title = 'iPhone, iPad, Ruby and Web Apps'
				@meta_description = 'iOS, Ruby, Rails and Web projects by Roland Leth.'
				redirect "#{key.downcase}", 301 if key != 'projects'
				return erb :projects
			end
			if key.downcase == 'work'
				redirect '/projects', 302
			end
			if key.downcase == 'bouncyb'
				# Layout: false means it loads the page with it's own layout, disregarding the HTML/CSS in layout.erb
				redirect "#{key.downcase}", 301 if key != 'bouncyb'
				return erb :bouncyb, layout: false
			end
			if key.downcase == 'iwordjuggle'
				redirect "#{key.downcase}", 301 if key != 'iwordjuggle'
				return erb :iwordjuggle, layout: false
			end
			if key.downcase == 'sosmorse'
				redirect "#{key.downcase}", 301 if key != 'sosmorse'
				return erb :sosmorse, layout: false
			end
			if key.downcase == 'expenses-planner'
				redirect "#{key.downcase}", 301 if key != 'expenses-planner'
				return erb :'expenses-planner', layout: false
			end
			if key.downcase == 'carminder'
				redirect "#{key.downcase}", 301 if key != 'carminder'
				return erb :carminder, layout: false
			end
			if key.downcase == 'about'
				@title = 'About'
				@meta_description = 'Some information about the blog. Details, résumé and contact information about Roland Leth.'
				redirect "#{key.downcase}", 301 if key != 'about'
				return erb :about
			end
			if key == 'contact'
				return redirect '/about', 302
			end
			if key.downcase == 'privacy-policy'
				@title = 'Privacy Policy'
				@meta_description = "Roland Leth's Privacy Policy"
				redirect "#{key.downcase}", 301 if key != 'privacy-policy'
				return erb :'privacy-policy'
			end
		end

		# The select returns an array that has a structure as its only object
		post = repository(:default).adapter.select('SELECT * FROM application_posts WHERE link= ?', key.downcase)[0].to_h
		@title = post[:title]
		@meta_description = post[:title]

		if post.count > 0
			# This means the URL was not written with lowercase letters only
			if post[:link] != key
				redirect "#{key.downcase}", 301
			else
				erb :index, locals: { post: post, total_pages: -1 }
			end
		else
			not_found
		end
	end

	def search_not_found
		@title = 'No results found.'
		@meta_description = "No results found."
		# There's a check in layout.erb for the meta canonical link to not be displayed if the value is '404 error raised'.
		@meta_canonical = '404 error raised'
		status 200
		erb :search_not_found
	end

	not_found do
		@title = '404'
		@meta_description = "This isn't the page your are looking for."
		@meta_canonical = '404 error raised'
		status 404
		erb :not_found
	end

	error do
		@title = 'Error'
		status 500
		erb :not_found
	end
end
