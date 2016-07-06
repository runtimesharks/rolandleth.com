require 'post'

module Helpers
	include Post

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
end