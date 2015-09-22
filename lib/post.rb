require 'dropbox_keys'
require 'dropbox_sdk'

module Post
	include DropboxKeys
	POSTS_TABLE = 'post_posts'

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

	def update_posts(with_delete)
		session = DropboxSession.new(APP_KEY, APP_SECRET)
		session.set_access_token(AUTH_KEY, AUTH_SECRET)

		client = DropboxClient.new(session, ACCESS_TYPE)
		client_metadata = client.metadata('/Apps/Editorial/posts')['contents']
		client_metadata.each do |file|
			datetime, link, file_mtime = file_info(file)

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
				post = Posts.first(link: link)
			end

			# If the post exists and was modified, or the post doesn't exist
			# we need to create the required strings
			if !post || (post && post.modified != file_mtime)
				body = client.get_file(file['path']) # Memory and time consuming
				title = body.lines.first.gsub("\n", '') # Remove the new line character from the title line
				body = body.lines[2..-1].join # Remove the title and the empty line after it from the body

				# If the post exists, it means it was modified, update it
				if post
					post.update(title: title, body: body, datetime: datetime, modified: file_mtime, link: link)
					# Create a new record
				else
					Posts.create(title: title, body: body, datetime: datetime, modified: file_mtime, link: link)
				end
			end
		end

		# Instead of putting the delete code inside a big if block
		# just leave the array empty if the command was done without a parameter
		posts = with_delete ? Posts.all : []
		# Check if any post was deleted (highly unlikely)
		posts.each do |post|
			delete = true

			client_metadata.each do |file|
				datetime, link = file_info(file)

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
		syncs = DropboxSyncs.first || DropboxSyncs.create(count: 0)
		syncs.update(count: (syncs[:count] + 1))

		redirect '/', 302
	end

	def worded_month(month)
		case month.to_i
			when 1; return 'January'
			when 2; return 'February'
			when 3; return 'March'
			when 4; return 'April'
			when 5; return 'May'
			when 6; return 'June'
			when 7; return 'July'
			when 8; return 'August'
			when 9; return 'September'
			when 10; return 'October'
			when 11; return 'November'
			else; return 'December'
		end
	end

	def year_month_posts
		grouped_posts = {}

		all_posts.each do |post|
			matches = post[:datetime].match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
			year = matches[1].to_s
			month = worded_month(matches[2].to_s)
			day = matches[3].to_s

			title = post[:title]
			link = post[:link]

			grouped_posts[year] ||= {}
			grouped_posts[year][month] ||= []

			grouped_posts[year][month] << {
				title: title,
			  link: link
			}
		end

		grouped_posts
	end
end
