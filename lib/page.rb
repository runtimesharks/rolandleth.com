require 'post'

module Page
	include Post

	PAGE_SIZE = ENV['PAGE_SIZE'].to_i > 0 ? ENV['PAGE_SIZE'].to_i : 10
	PAGES = %W{ archive about contact apps projects work bouncyb sosmorse iwordjuggle privacy-policy expenses-planner carminder }

	def open_search_page(query)
		query_array = []
		if query[0,1] == '"' && query[-1,1] == '"'
			query_array << query.gsub('"', '').downcase
		else
			query_array = query.downcase.split(' ')
		end

		redirect '/', 302 if query.empty?

		posts = all_posts.select	do |p|
			query_array.any? { |w| p[:body].downcase.include?(w) or p[:_title].downcase.include?(w) }
		end

		if posts.count > 0
			erb :index, locals: { posts: posts, page: 1, total_pages: 1, gap: 2, search_terms: query_array }
		else
			search_not_found
		end
	end
end
