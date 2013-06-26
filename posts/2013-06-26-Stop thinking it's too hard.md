blog

I finally got around and implemented the RSS feed. Wasn't as hard as I expected; piss easy, actually:

```
get '/feed' do
  posts = Dir['posts/*.md'].sort_by!{ |m| m.downcase }.reverse
  rss = RSS::Maker.make('2.0') do |rss|
    rss.channel.title = 'Roland Leth'
    rss.channel.description = 'Roland Leth'
    rss.channel.link = "/"
    rss.channel.language = 'en'
    
    rss.items.do_sort = false
    rss.items.max_size = 100
    
    posts.each do |post|
      matches = post.match(/\/(\d{4})-(\d{2})-(\d{2})-([\w\s\.\}\{\[\]:"';!=\?\+\*\-\)\(]+)\.md$/)
      time = File.mtime(post).gmtime
      i = rss.items.new_item
      i.title = matches[4]
      # titles are written 'Like this', links need to be 'Like-this'
      i.link = "/#{matches[4].gsub("\s", "-")}"
      content = _markdown(File.readlines(post)[2..-1].join())
      i.description = content
      i.date = DateTime.new(matches[1].to_i, matches[2].to_i, matches[3].to_i, time.hour, time.min, 0).to_time.gmtime
    end
  end
  rss.to_s
end
```

But now I had another problem to fix: RSS Readers do not interpret my custom CSS, meaning the hack I did with the underline to show up as italic doesn't work with RSS.  
Well, I reached GitHub while searching for a solution and it turned out that [Sam](http://soff.es) posted [this](http://sam.roon.io/tearing-up-the-carpet) 4 days ago. TL;DR: He hacked Redcarpet to parse `==text==` as `<mark>text<mark>` and the guys merged his changes. How fortunate :)

<br />
Conclusion? I wish I would stop this *This looks hard, I'll try later* nonsense once and for all. Most of the time I work on something until it's perfect, but sometimes I find myself trying a few times and if it doesn't work, I'll just leave it for later; then it turns out I was actually ==this [ ] close== of finishing.