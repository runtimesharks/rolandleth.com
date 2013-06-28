require 'redcarpet'
require 'pygments.rb'

class MarkdownRenderer < Redcarpet::Render::HTML
  def block_code(code, language)
		if language
      Pygments.highlight(code, lexer: language.to_sym)
		else
			Pygments.highlight(code, lexer: 'ruby')
		end
  end
end

class MarkdownRendererForFeed < Redcarpet::Render::HTML
end

def _markdown(text)
	return '' unless text and text.length > 0

	options = {
			no_intra_emphasis: true,
			tables: true,
			fenced_code_blocks: true,
			autolink: true,
			strikethrough: true,
			space_after_headers: true,
			superscript: true,
	    underline: true,
	    highlight: true
	}
	markdown = Redcarpet::Markdown.new(MarkdownRenderer, options)
	markdown.render(text)
end

def _markdown_for_feed(text)
	return '' unless text and text.length > 0

	options = {
			no_intra_emphasis: true,
			tables: true,
			fenced_code_blocks: true,
			autolink: true,
			strikethrough: true,
			space_after_headers: true,
			superscript: true,
			underline: true,
			highlight: true
	}
	markdown = Redcarpet::Markdown.new(MarkdownRendererForFeed, options)
	markdown.render(text)
end