require 'redcarpet'
require 'rouge'
require 'rouge/plugins/redcarpet'

class HTML < Redcarpet::Render::HTML
	include Rouge::Plugins::Redcarpet # yep, that's it.

	def block_code(text, language)
		if language
			Rouge.highlight(text, language, 'html')
		else
			Rouge.highlight(text, 'ruby', 'html')
		end
	end
end

class Feed < Redcarpet::Render::HTML
end

def _markdown(text, for_feed = false)
	return '' unless text && text.length > 0

	render_options = {
		filter_html: true,
		hard_wrap: false,
		css_class: false,
		link_attributes: { rel: 'nofollow' }
	}

	extensions = {
			no_intra_emphasis: true,
			lax_spacing: true,
			tables: true,
			fenced_code_blocks: true,
			autolink: true,
			strikethrough: true,
			space_after_headers: true,
			superscript: true,
			underline: true,
			highlight: true
	}

	if for_feed
		renderer = Feed.new(render_options)
	else
		renderer = HTML.new(render_options)
	end

	Redcarpet::Markdown.new(renderer, extensions).render(text)
end