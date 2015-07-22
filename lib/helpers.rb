module Helpers
	def all_posts
		posts = all_posts_from_repository
		posts.sort! { |a, b| a[:datetime] <=> b[:datetime] }.reverse!
		posts.reject! do |post|
			time_from_string(post[:datetime]) == nil || DateTime.now.to_time < time_from_string(post[:datetime])
		end

		posts
	end

	def all_posts_from_repository
		posts = repository(:default).adapter.select('SELECT * FROM post_posts')
		posts.map! { |struc| struc.to_h }

		posts
	end

	def file_info(file)
		matches = file['path'].match(/\/(apps)\/(editorial)\/(posts)\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\/\}\{\[\]_#&@$:"';,!=\?\+\*\-\)\(]+)\.md$/)
		datetime = matches[4].to_s + '-' + matches[5].to_s + '-' + matches[6].to_s + '-' + matches[7].to_s
		link = matches[8].to_s
		link.gsub!(/([#,;!:"'\.\?\[\]\{\}\(\$\/)]+)/, '')
		link.gsub!('&', 'and')
		link.gsub!("\s", '-')
		link.downcase!

		file_mtime = file['client_mtime'].to_s

		return datetime, link, file_mtime
	end

	def time_from_string(string)
		date_matches = string.match(/(\d{4})-(\d{2})-(\d{2})-(\d{4})/)
		# Time zone support sucks. Leave it like this.
		Time.zone = 'Bucharest'
		time_zone = Time.zone.formatted_offset
		# A little hack to account for daylight savings of when the post was created
		time_zone = '+03:00' if Time.strptime("#{date_matches}", '%Y-%m-%d-%H%M').dst?
		time = Date._strptime("#{date_matches[4]} #{time_zone}", '%H%M %:z')

		DateTime.new(date_matches[1].to_i, date_matches[2].to_i, date_matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).in_time_zone.to_time
	end
end