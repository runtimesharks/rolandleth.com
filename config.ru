require 'rubygems'
require 'bundler'
require 'yui/compressor'

Bundler.require

$LOAD_PATH.unshift 'lib'
require 'app'

map '/assets' do
  sprockets = Sprockets::Environment.new
  sprockets.append_path 'assets/javascripts'
  sprockets.append_path 'assets/stylesheets'
  sprockets.append_path 'assets/images'
  sprockets.append_path 'assets/files'
  sprockets.append_path 'vendor/assets/javascripts'
  sprockets.js_compressor  = YUI::JavaScriptCompressor.new
  sprockets.css_compressor = YUI::CssCompressor.new
  run sprockets
end

run Application