require 'sinatra'
#require 'rss'

class Application < Sinatra::Application
	PAGE_SIZE = 5
	PAGES = %w{about apps projects bouncyb sosmorse iwordjuggle}

	#get('/assets/*.scss') do
	#	scss :styles
	#end

	#get '/feed' do
	#	posts = Dir['posts/*.md']
	#	rss = RSS::Maker.make('2.0') do |rss|
	#		rss.channel.about = 'Roland Leth'
	#		rss.channel.title = 'Roland Leth'
	#		rss.channel.description = 'Roland Leth'
	#		rss.channel.link = "http://rolandleth.com"
	#		rss.channel.language = 'en'
	#
	#		rss.items.do_sort = true
	#		rss.items.max_size = 100
	#
	#		#posts.each do |post|
	#		#	matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-([\w\s]+)\.markdown$/)
	#		#	content = markdown(File.readlines(post)[2..-1].join())
	#		#	i = rss.items.new_item
	#		#	i.title = matches[4]
	#		#	i.link = post
	#		#	i.description = content
	#		#	i.date = Date.new(matches[1].to_i, matches[2].to_i, matches[3].to_i).to_time.utc
	#		#end
	#	end
	#	content_type = 'text/xml; charset=utf-8'
	#	rss.to_s
	#end

	get '/1' do
		erb :index
	end

	# Main pages
	get %r{/$|/(\d+)$} do |page|
		#puts 'page'
		## Pagination
		# Retrieve all posts in dir and store them in an array. sort the array, reverse it to be newest->oldest
		all_posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		page = (page || 1).to_i
		# Start index is the first index for each page. if page = 2, start_index is 5
		start_index = (page - 1) * PAGE_SIZE
		# End index is last index for each page
		end_index = [start_index + PAGE_SIZE - 1, all_posts.count - 1].min
		total_pages = (all_posts.count.to_f / PAGE_SIZE.to_f).ceil.to_i
		# Posts to be displayed on current page
		posts = all_posts[start_index..end_index]
		# window is used for gaps in navigation. How many pages between first and current before '..' is shown
		# Example: current page 5, pagination will look like 1 .. 5
		erb :index, locals: { posts: posts, page: page, total_pages: total_pages, window: 2 }
	end

	get '/files/:filename' do |filename|
		#puts 'filename'
		#return send_file "./assets/files/#{filename}", filename:  filename
		if filename == 'Roland Leth.pdf'
			return send_file File.open("./assets/files/#{filename}")
		end
		return erb :not_found
	end

	# Individual posts and pages
	get %r{/([\w\s\.\}\{\]\[:"';!=\?\+\*\-\)\(]+)$} do |key|
		#puts 'posts'
		#puts key
		if key == '[World-hello]'
			key = key + ';'
		end
		if PAGES.include? key
			if key == 'projects'
				return erb :projects
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
			if key == 'about'
				return erb :about
			end
		end
		all_posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		i = 0
		all_posts.each do |post|
			matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-([\w\s\.\}\{\[\]:"';!=\?\+\*\-\)\(]+)\.md$/)
			# I write post-filenames as 'YYYY-MM-DD-Name without dashes.md'. If you write them as 'YYYY-MM-DD-Name-with-dashes.md',
			# all this swapping isn't necessary anymore, of course.

			# The Dir creates an array with all file names, but because the posts' Titles are set from the file names,
			# I convert spaces to '-' inside post.erb for the href link, to avoid the ugly HTML's %20s.
			# Meaning I have to swap '-' to spaces back when the user actually clicks the link, so the files are properly read
			return erb :index, locals: {posts: all_posts, page: i, total_pages: -1, window: 2} if matches[4] == key.gsub("-", "\s")
			# Total pages is set to -1 so I don't create another variable just for when a post is clicked to be viewed
			# individually. If total_pages == -1, hide the pagination and display only the clicked post
			# I'm also using page variable as 'current array index' to retrieve the current post, instead of a new variable
			i += 1
		end
		return erb :not_found
	end

	not_found do
		#puts 'not_found'
		return erb :not_found
	end

	error do
		#puts 'error'
		return erb :not_found
	end
end
