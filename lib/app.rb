require 'rss'
require 'dropbox_sdk'
require 'dm-core'
require 'dm-postgres-adapter'
require 'dm-migrations'
require 'markdown_renderer'
require 'dropbox_keys'

class Application < Sinatra::Application
	include DropboxKeys
	PAGE_SIZE = 5
	PAGES = %W{ about contact apps projects work bouncyb sosmorse iwordjuggle privacy-policy expenses-planner carminder }

	# Posts
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

	# Just to keep an on-server count of the syncs performed
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
    # Small hack to dynamically create the postgres URL based on the currently logged in user
    current_user = ENV['USER']
    postgres = ENV['DATABASE_URL'] || "postgres://localhost/#{current_user}"
		DataMapper::setup(:default, postgres)
		DataMapper.auto_upgrade!
	end

  # before '/example' do
  #   # Run code before running the example route
  # end
  #
  # after '/example' do
  #   # Run code after running the example route
  # end

	# RSS
  get '/feed' do
	  content_type 'application/atom+xml'

    posts = repository(:default).adapter.select('SELECT * FROM application_posts')
    posts.map! { |struc| struc.to_h }
    posts.sort! { |a, b| a[:datetime] <=> b[:datetime] }.reverse!
    rss ||= RSS::Maker.make('atom') do |maker|
      maker.channel.icon = 'http://rolandleth.com/public/favicon.ico'
      maker.channel.logo = 'http://rolandleth.com/public/favicon.ico'
      maker.channel.link = 'http://rolandleth.com'
      maker.channel.about = 'http://rolandleth.com'
      maker.channel.title = 'Roland Leth'
      maker.channel.description = 'Roland Leth'
      maker.channel.author = 'Roland Leth'
      maker.channel.contributor = 'Roland Leth'
      maker.channel.language = 'en'
      maker.channel.rights = "© #{Time.now.year} Roland Leth"
      maker.channel.subtitle = 'iOS and Ruby development thoughts by Roland Leth.'
      maker.items.do_sort = false

      posts.each do |post|
	      next if time_from_string(post[:datetime]) == nil || DateTime.now.to_time < time_from_string(post[:datetime])

        maker.items.new_item do |item|
	        last_updated = time_from_string(post[:datetime])
	        item.title = post[:title]
	        item.link = "http://rolandleth.com/#{post[:link]}"
	        item.content.content = _markdown_for_feed(post[:body].lines[2..-1].join)
	        item.content.type = 'html'
	        item.updated = last_updated
	        item.published = last_updated
	        # The RSS was last updated when the last post was posted (which is first in the array)
	        maker.channel.updated ||= last_updated
        end
      end
    end

    rss.link.rel = 'http://rolandleth.com'
    rss.entries.each do |entry|
      entry.content.lang = 'en'
    end

    rss.to_s
  end

	def time_from_string(string)
		date_matches = string.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
		# # Time zone support sucks. Leave it like this.
		# time_zone = 'EET'
		# # A little hack to account for daylight savings
		# time_zone = 'EEST' if date_matches[2].to_i >= 4 && date_matches[2].to_i <= 9
		time = Date._strptime("#{date_matches[4]}", '%H%M')

		DateTime.new(date_matches[1].to_i, date_matches[2].to_i, date_matches[3].to_i, time[:hour], time[:min], 0).to_time
	end

  # Sitemap
  get '/sitemap.xml' do
    map = XmlSitemap::Map.new('rolandleth.com') do |m|
      # Adds a simple page
      m.add 'projects', priority: 1.0
      m.add 'about', priority: 1.0
      m.add 'bouncyb'
      m.add 'sosmorse'
      m.add 'iwordjuggle'
      m.add 'carminder'
      m.add 'expenses-planner', priority: 0.99
      m.add 'privacy-policy'
      m.add 'feed'
      posts = repository(:default).adapter.select('SELECT * FROM application_posts')
      posts.map! { |struc| struc.to_h }
      posts.each do |post|
        m.add post[:link]
      end
    end
    map.render
  end

	# Custom sync with Dropbox URL
	get '/cmd.sync/:key/?:with_delete?' do
    not_found unless params[:key] == MY_SYNC_KEY
    with_delete = params[:with_delete]

		session = DropboxSession.new(APP_KEY, APP_SECRET)
		session.set_access_token(AUTH_KEY, AUTH_SECRET)

		client = DropboxClient.new(session, ACCESS_TYPE)
		client_metadata = client.metadata('/Apps/Editorial/posts')['contents']
		client_metadata.each do |file|
			matches = file['path'].match(/\/(apps)\/(editorial)\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\/\}\{\[\]_#&@$:"';!=\?\+\*\-\)\(]+)\.md$/)
			datetime = matches[4].to_s + '-' + matches[5].to_s + '-' + matches[6].to_s + '-' + matches[7].to_s
			link = matches[8].to_s
      link.gsub!(/([#,;!:"'\.\?\[\]\{\}\(\$\/)]+)/, '')
			link.gsub!('&', 'and')
			link.gsub!("\s", '-')
			link.downcase!
			file_mtime = file['client_mtime'].to_s

      post = Posts.first(link: link)
      # pp = Posts.first(title: 'Fastlane')
      # pp.destroy
      # pp.destroy

      # If the datetime isn't the same, it's just another post with the same name
      while post && post.link == link && post.datetime != datetime
        if post.link[-3, 2] == '--'
          i = post.link[-1, 1].to_i
          link.sub!("--#{i}", "--#{i + 1}")
        # I know, I know, but I will never have so many duplicates
        elsif post.link[-4, 2] == '--'
          i = post.link[-2, 2].to_i
          link.sub!("--#{i}", "--#{i + 1}")
        else
          link = "#{link}--#{1}"
        end

        # If it's nil, we will create a new one, which will have a --i suffix in the link
        post = Posts.first(:link => link)
      end

			# If the post exists.
			if post
				# Check to see if it was modified
				if post.modified != file_mtime
          body = client.get_file(file['path']) # Memory and time consuming
          title = body.lines.first.gsub("\n", '')
					post.update(title: title, body: body, datetime: datetime, modified: file_mtime, link: link)
				end
			# Otherwise, create a new record
      else
        body = client.get_file(file['path']) # Memory and time consuming
        title = body.lines.first.gsub("\n", '')
				Posts.create(title: title, body: body, datetime: datetime, modified: file_mtime, link: link)
			end
    end

    # Instead of putting the delete code inside a big if block
    # just leave the array empty if the command was done without a parameter
    all_posts = []
    all_posts = Posts.all if with_delete
		# Check if any post was deleted (highly unlikely)
		all_posts.each do |post|
			delete = true

			client_metadata.each do |file|
        matches = file['path'].match(/\/(apps)\/(editorial)\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\/\}\{\[\]_#&@$:"';!=\?\+\*\-\)\(]+)\.md$/)
        datetime = matches[4].to_s + '-' + matches[5].to_s + '-' + matches[6].to_s + '-' + matches[7].to_s
        link = matches[8].to_s
        link.gsub!(/([#,;!:"'\.\?\[\]\{\}\(\$\/)]+)/, '')
        link.gsub!('&', 'and')
        link.gsub!("\s", '-')
        link.downcase!

        _post = Posts.first(link: link)
        # If the datetime isn't the same, it's just another post with the same name
        while _post && _post.link == link && _post.datetime != datetime
          if _post.link[-3, 2] == '--'
            i = _post.link[-1, 1].to_i
            link.sub!("--#{i}", "--#{i + 1}")
          elsif _post.link[-4, 2] == '--'
            i = _post.link[-2, 2].to_i
            link.sub!("--#{i}", "--#{i + 1}")
          else
            link = "#{link}--#{1}"
          end

          _post = Posts.first(link: link)
        end

				delete = false if link == post.link
      end

			post.destroy if delete
    end

		# Keep a count of all my syncs. Just because.
		syncs = DropboxSyncs.first(:id => 1)
    if syncs
		  syncs.update(:count => (syncs[:count] + 1))
    end

    redirect '/', 302
	end

	# Links to /1 are redirected to root. No reason to display http://root/1
	get '/1' do
		redirect '/', 301
	end

	# Apply a permanent redirect from http://root/key/ to http://root/key (I always want links to show without '/' at end)
	# If the $ condition is removed, it will try to redirect anything like http://root/key/anything/can/be/here to http://root/key
	# And it would screw file downloading
	get %r{^/([\w\d\-]+)/$} do |key|
		redirect "/#{key}", 301
	end

	# Apply a non-permanent redirect from http://root/key/anything/can/be/here to http://root/key
	# Might change my mind about this, thus not a permanent redirect
	get %r{^/([\w\d\-]+)/} do |key|
		redirect "/#{key}", 302
	end

	# Apply a permanent redirect from http://root/page#/anything/can/be/here to http://root/page# (I always want links to show without '/' at end)
	get %r{^/(\d+)/} do |current_page|
		redirect "/#{current_page}", 301
	end

	# Main page
	get '/' do
    # Posts.all.destroy!
    # return
		all_posts = repository(:default).adapter.select('SELECT * FROM application_posts')
		all_posts.map! { |struc| struc.to_h }
		all_posts.sort! { |a, b| a[:datetime] <=> b[:datetime] }.reverse!
    all_posts.reject! do |post|
      time_from_string(post[:datetime]) == nil || DateTime.now.to_time < time_from_string(post[:datetime])
    end

    # all_posts.each do |pp|
    #   puts pp[:title]
    #   p ' -- '
    #   p pp[:datetime]
    # end

		total_pages = (all_posts.count.to_f / PAGE_SIZE.to_f).ceil.to_i
		posts = all_posts[0..4]
		@meta_description = 'iOS and Ruby development thoughts by Roland Leth.'
		erb :index, locals: { posts: posts, page: 1, total_pages: total_pages, gap: 2 }
	end

	# Search
	get %r{^/search$} do
		query = request.env['rack.request.query_hash']['query']
		query_array = []
		if query[0,1] == '"' && query[-1,1] == '"'
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
			erb :index, locals: { posts: all_posts, page: 1, total_pages: 'search', gap: 2, search_terms: query_array }
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

	get '/ExpensesPlannerPressKit.zip' do
		send_file File.open('./assets/files/Expenses Planner Press Kit.zip'), filename: 'Expenses Planner Press Kit.zip'
	end
	get '/CarminderPressKit.zip' do
		send_file File.open('./assets/files/Carminder Press Kit.zip'), filename: 'Carminder Press Kit.zip'
	end
	get '/Roland-Leth-Resume.pdf' do
		send_file File.open('./assets/files/Roland Leth.pdf') #, filename: 'Roland Leth - Résumé.pdf'
	end
	get '/Roland-Leth-Privacy Policy.md' do
		send_file File.open('./assets/files/Privacy Policy.md'), filename: 'Roland Leth - Privacy Policy.md'
	end

	# Individual posts and static pages
	get %r{^/([\w\d\-]+)$} do |key|
		@meta_canonical = key

		if PAGES.include? key.downcase
      redirect '/projects', 302 if key.downcase == 'work'
      redirect '/about', 302 if key.downcase == 'contact'
      if key.downcase == 'projects'
				@title = 'Projects'
				@meta_description = 'iOS, Ruby, Rails and Web projects by Roland Leth.'
				redirect "#{key.downcase}", 301 if key != 'projects'
				return erb :projects
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
		@meta_description = 'No results found.'
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
