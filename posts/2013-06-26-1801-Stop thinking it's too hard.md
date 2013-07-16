blog  

I finally got around and implemented the RSS feed. Wasn't as hard as I expected; piss easy, actually:

```ruby
get '/feed' do
  posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
  rss = RSS::Maker.make('2.0') do |maker|
    maker.channel.icon = "/public/favicon.ico"
    maker.channel.logo = "/public/favicon.ico"
    maker.channel.title = 'Roland Leth'
    maker.channel.description = 'Roland Leth'
    maker.channel.link = "/"
    maker.channel.language = 'en'
    hours = [0, 1, 2, 3, 20, 21, 22, 23]
	
	maker.items.do_sort = false
	posts.each do |post|
	  matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-([\w\s\.\}\{\[\]:"';!=\?\+\*\-\)\(]+)\.md$/)
	  i = maker.items.new_item
	  i.title = matches[4]
	  time_string = File.readlines(post)[1]
	  # in case I forget to fill the time, just create a random hour between 8 PM and 3 AM, that's when I work most of the time
	  if time_string.length == 8 or time_string.length == 9
	    time = Date._strptime("#{time_string} EEST","%H:%M %p %Z")
		time[:leftover] = nil
	  else
		min = rand(0..59)
		time = Date._strptime("#{hours.sample}:#{min} EEST","%H:%M %Z")
	  end

	  # titles are written 'Like this', links need to be 'Like-this'
	  i.link = "http://rolandleth.com/#{matches[4].gsub("\s", "-")}".gsub(";", "")
	  content = _markdown(File.readlines(post)[3..-1].join())
	  i.description = content
	  i.date = DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
	end
  end
  rss.to_s
end
```

But now I had another problem to fix: RSS Readers do not interpret my custom CSS, meaning the hack I did with the underline to show up as italic doesn't work with maker.  
Well, I reached GitHub while searching for a solution and it turned out that [Sam](http://soff.es) posted [this](http://sam.roon.io/tearing-up-the-carpet) 4 days ago. TL;DR: He hacked Redcarpet to parse `==text==` as `<mark>text</mark>` and the guys merged his changes. How fortunate :)

<br />
Conclusion? I wish I would stop this *This looks hard, I'll try later* nonsense once and for all. Most of the time I work on something until it's perfect, but sometimes I find myself trying a few times and if it doesn't work, I'll just leave it for later; then it turns out I was actually ==this [ ] close== of finishing.

<br />
2013-06-27 4:42 AM Update: I replaced the RSS 2.0 feed with Atom:

```ruby
get '/feed' do
  posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
  	rss = RSS::Maker.make('atom') do |maker|
  	maker.channel.icon = '/public/favicon.ico'
  	maker.channel.id = 'http://rolandleth.com'
  	maker.channel.link = 'http://rolandleth.com'
  	maker.channel.title = 'Roland Leth'
  	maker.channel.description = 'Roland Leth'
  	maker.channel.author = 'Roland Leth'
  	maker.channel.updated = Time.now
  	maker.channel.language = 'en'
  	maker.channel.rights = "© #{Time.now.year} Roland Leth"
  	maker.channel.subtitle = 'iOS and Ruby development thoughts by Roland Leth'
	hours = [0, 1, 2, 3, 20, 21, 22, 23]
	
  	maker.items.do_sort = false
  	posts.each do |post|
   	  matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-([\w\s\.\}\{\[\]:"';!=\?\+\*\-\)\(]+)\.md$/)
   	  i = maker.items.new_item
   	  i.title = matches[4]
   	  time_string = File.readlines(post)[1]
   	  # in case I forget to fill the time, just create a random hour between 8 PM and 3 AM, that's when I work most of the time
   	  if time_string.length == 8 or time_string.length == 9
   	  	time = Date._strptime("#{time_string} EEST","%H:%M %p %Z")
   	  	time[:leftover] = nil
	  else
	    min = rand(0..59)
	    time = Date._strptime("#{hours.sample}:#{min} EEST","%H:%M %Z")
	  end

	  # titles are written 'Like this', links need to be 'Like-this'
	  i.link = "http://rolandleth.com/#{matches[4].gsub("\s", "-")}".gsub(";", "")
	  i.content.content = _markdown(File.readlines(post)[3..-1].join())
	  i.content.type = 'html'
	  i.updated = DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
	  i.published = DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time[:hour], time[:min], 0, time[:zone]).to_time
	end
  end
  rss.link.rel = 'self'
  rss.link.type = 'application/atom+xml'
  rss.entries.each do |entry|
    entry.title.type = 'html'
  end
  rss.to_s
end
```