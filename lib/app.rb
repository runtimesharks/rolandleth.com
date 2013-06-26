require 'sinatra'
require 'rss'
require 'redcarpet'
require 'markdown_renderer'
require 'dropbox_sdk'

class Application < Sinatra::Application
	PAGE_SIZE = 5
	PAGES = %w{about apps projects bouncyb sosmorse iwordjuggle privacy-policy}

	configure :production do
		require 'newrelic_rpm'
	end

	get '/feed' do
		posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		rss = RSS::Maker.make('atom') do |rss|
			rss.channel.icon = '/public/favicon.ico'
			rss.channel.id = 'http://rolandleth.com'
			rss.channel.link = 'http://rolandleth.com'
			rss.channel.title = 'Roland Leth'
			rss.channel.description = 'Roland Leth'
			rss.channel.author = 'Roland Leth'
			rss.channel.language = 'en'
			rss.channel.rights = "© #{Time.now.year} Roland Leth"
			rss.channel.subtitle = 'iOS and Ruby development thoughts by Roland Leth'
			rss.items.do_sort = false
			posts.each do |post|
				matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-([\w\s\.\}\{\[\]:"';!=\?\+\*\-\)\(]+)\.md$/)
				i = rss.items.new_item
				i.title = matches[4]
				time_string = File.readlines(post)[1]
				# in case I forget to fill the time, just create a random hour between 8 PM and 3 AM, that's when I work most of the time
				if time_string.length == 8 or time_string.length == 9
					time = Date._strptime("#{time_string} EEST","%H:%M %p %Z")
					time[:leftover] = nil
				else
					hour = [0, 1, 2, 3, 20, 21, 22, 23].sample
					puts hour
					min = rand(0..59)
					time = Date._strptime("#{hour}:#{min} EEST","%H:%M %Z")
				end

				# titles are written 'Like this', links need to be 'Like-this'
				i.link = "/#{matches[4].gsub("\s", "-")}"
				content = _markdown(File.readlines(post)[3..-1].join())
				i.description = content
				i.updated = DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
				i.published = DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
				# The RSS was last updated when the last post was posted (which is first in the array)
				rss.channel.updated ||= DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
			end
		end
		rss.to_s
	end

	# Links to /1 are redirected to root. No reason to display http://root/1
	get '/1' do
		redirect '/'
	end

	# Main pages
	get %r{/$|/(\d+)$} do |page|
		# Retrieve all posts in dir and store them in an array. sort the array, reverse it to be newest->oldest
		all_posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
		page = (page || 1).to_i
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
			return erb :not_found
		end
		erb :index, locals: { posts: posts, page: page, total_pages: total_pages, gap: 2 }
	end

	get '/files/:filename' do |filename|
		if filename == 'Roland Leth.pdf'
			return send_file File.open("./assets/files/#{filename}")
		end
		if filename == 'Privacy Policy.md'
			return send_file File.open("./assets/files/#{filename}")
		end
		return erb :not_found
	end

	# Individual posts and pages
	get %r{/([\w\s\.\}\{\]\[:"';!=\?\+\*\-\)\(]+)$} do |key|
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
			if key == 'privacy-policy'
				return erb :'privacy-policy'
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
			# I'm also using the page variable as 'current array index' to retrieve the clicked post, instead of a new variable.
			i += 1
		end
		return erb :not_found
	end

	not_found do
		return erb :not_found
	end

	error do
		return erb :not_found
	end
end
