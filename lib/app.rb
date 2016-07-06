require 'dm-core'
require 'dm-postgres-adapter'
require 'dm-migrations'

require 'page' # For page handling
require 'post' # For update_posts
require 'generators' # RSS and XML
require 'helpers'

class Application < Sinatra::Application

	# RSS
	get '/feed' do
		rss.to_s
	end

	# Sitemap
	get '/sitemap.xml' do
		sitemap.render
	end

	# Custom sync with Dropbox URL
	get '/cmd.sync/:key/?:delete?' do
		not_found unless params[:key] == MY_SYNC_KEY
		with_delete = !params[:delete].to_s.empty?

		update_posts(with_delete)
	end

	# Search
	get %r{^/search$} do
		query = request.env['rack.request.query_hash']['query']

		@meta_description = 'iOS and Ruby development thoughts by Roland Leth.'
		open_search_page(query)
	end

	def search_not_found
		@title = 'No results found.'
		@meta_description = 'No results found.'
		# There's a check in layout.erb for the meta canonical link to
		# not be displayed if the value is '404 error raised'.
		@meta_canonical = '404 error raised'

		status 200
		erb :'not-found-search.ejs'
	end
end
