require 'dm-core'
require 'dm-postgres-adapter'
require 'dm-migrations'

require 'page' # For page handling
require 'post' # For update_posts
require 'generators' # RSS and XML
require 'helpers'

class Application < Sinatra::Application
	helpers Generators # RSS and XML
	helpers Post # For update_posts
	helpers Page
	helpers Helpers

	configure :production do
		require 'newrelic_rpm'
		DataMapper::setup(:default, ENV['DATABASE_URL'])
		DataMapper.auto_upgrade!
	end

	configure :development do
		# Small hack to dynamically create the postgres URL based on the currently logged in user
		current_user = ENV['USER']
		postgres = ENV['DATABASE_URL'] || "postgres://localhost/#{current_user}"
		DataMapper::setup(:default, postgres)
		DataMapper.auto_upgrade!
	end

	# before '/example' do
	#	 # Run code before running the example roindexute
	# end
	#
	# after '/example' do
	#	 # Run code after running the example route
	# end

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

	# Individual posts and static pages
	get %r{^/([\w\d\-]+)$} do |key|
		@meta_canonical = key

		if PAGES.include? key.downcase
			open_static_page(key)
		else
			open_individual_page(key)
		end
	end

	def search_not_found
		@title = 'No results found.'
		@meta_description = 'No results found.'
		# There's a check in layout.erb for the meta canonical link to
		# not be displayed if the value is '404 error raised'.
		@meta_canonical = '404 error raised'

		status 200
		erb :search_not_found
	end
end
