xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
	xml.channel do
		posts.each do |post|
      matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-([\w\s]+)\.md$/)
      date_string = Date.new(matches[1].to_i, matches[2].to_i, matches[3].to_i).to_time.utc.to_s
		  #time = Time.parse(date_string).rfc822
      title = matches[4]
      content = markdown(File.readlines(post)[2..-1].join())
      xml.title title
			#xml.link request.url.chomp request.path_info
			#xml.pubDate = time
      xml.description title
		end
	end
end