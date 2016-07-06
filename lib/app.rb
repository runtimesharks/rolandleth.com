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
end
