require 'rss'
require 'markdown_renderer'

module Generators
	def sitemap
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

		map
	end

	def rss
		content_type 'application/atom+xml'

		posts = all_posts
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
				last_updated = time_from_string(post[:datetime])

				maker.items.new_item do |item|
					item.title = post[:title]
					item.link = "http://rolandleth.com/#{post[:link]}"
					item.content.content = _markdown(post[:body].lines.join, true)
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

		rss
	end
end