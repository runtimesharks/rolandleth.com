require 'post'

module Page
	include Post

	PAGE_SIZE = 7
	PAGES = %W{ about contact apps projects work bouncyb sosmorse iwordjuggle privacy-policy expenses-planner carminder }

	def open_main_page
		posts = all_posts

		total_pages = (posts.count.to_f / PAGE_SIZE.to_f).ceil.to_i
		posts_to_display = posts[0...PAGE_SIZE]
		erb :index, locals: { posts: posts_to_display, page: 1, total_pages: total_pages, gap: 2 }
	end

	def open_search_page(query)
		query_array = []
		if query[0,1] == '"' && query[-1,1] == '"'
			query_array << query.gsub('"', '').downcase
		else
			query_array = query.downcase.split(' ')
		end

		redirect '/', 302 if query.empty?

		posts = all_posts.select	do |p|
			query_array.any? { |w| p[:body].downcase.include?(w) or p[:title].downcase.include?(w) }
		end

		if posts.count > 0
			erb :index, locals: { posts: posts, page: 1, total_pages: 1, gap: 2, search_terms: query_array }
		else
			search_not_found
		end
	end

	def open_page(current_page)
		posts = all_posts
		page = (current_page || 1).to_i
		# Start index is the first index on each page. if page == 2 and PAGE_SIZE == 5, start_index is 5
		start_index = (page - 1) * PAGE_SIZE
		# End index is last index on each page
		end_index = [start_index + PAGE_SIZE - 1, posts.count - 1].min
		total_pages = (posts.count.to_f / PAGE_SIZE.to_f).ceil.to_i
		# gap: How many pages between first/last and current before '..' is shown
		# Example: gap of 2, current page 5, pagination will be 1 .. 4 5 6 .. 9. Tweaked for use with a gap of 2.
		if page > total_pages
			not_found
		else
			# Posts to be displayed on current page
			erb :index, locals: { posts: posts[start_index..end_index], page: page, total_pages: total_pages, gap: 2 }
		end
	end

	def open_static_page(key)
		redirect '/projects', 302 if key.downcase == 'work'
		redirect '/about', 302 if key.downcase == 'contact'

		case key.downcase
			when 'projects'
				@title = 'Projects'
				@meta_description = 'iOS, Ruby, Rails and Web projects by Roland Leth.'
				# This just permanently redirects PrOjEcts to projects
				redirect key.downcase, 301 if key != 'projects'
				erb :projects
			when 'bouncyb'
				# Layout: false means it loads the page with it's own layout, disregarding the HTML/CSS in layout.erb
				redirect key.downcase, 301 if key != 'bouncyb'
				erb :bouncyb, layout: false
			when 'iwordjuggle'
				redirect key.downcase, 301 if key != 'iwordjuggle'
				erb :iwordjuggle, layout: false
			when'sosmorse'
				redirect key.downcase, 301 if key != 'sosmorse'
				erb :sosmorse, layout: false
			when'expenses-planner'
				redirect key.downcase, 301 if key != 'expenses-planner'
				erb :'expenses-planner', layout: false
			when 'carminder'
				redirect key.downcase, 301 if key != 'carminder'
				erb :carminder, layout: false
			when 'about'
				@title = 'About'
				@meta_description = 'Some information about the blog. Details, résumé and contact information about Roland Leth.'
				redirect key.downcase, 301 if key != 'about'
				erb :about
			when 'privacy-policy'
				@title = 'Privacy Policy'
				@meta_description = "Roland Leth's Privacy Policy"
				redirect key.downcase, 301 if key != 'privacy-policy'
				erb :'privacy-policy'
			else
				not_found
		end
	end

	def open_individual_page(key)
		# The select returns an array that has a structure as its only object
		post = repository(:default).adapter.select("SELECT * FROM #{POSTS_TABLE} WHERE link= ?", key.downcase)[0].to_h
		@title = post[:title]
		@meta_description = post[:title]

		if post.count > 0
			# This means the URL was not written with lowercase letters only
			if post[:link] != key
				redirect key.downcase, 301
			else
				erb :index, locals: { post: post, total_pages: -1 }
			end
		else
			not_found
		end
	end
end