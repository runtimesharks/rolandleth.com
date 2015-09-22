require 'bundler'
Bundler.require(:default)

$LOAD_PATH.unshift 'lib'
require 'app'

map '/assets' do
	sprockets = Sprockets::Environment.new
	sprockets.append_path 'assets/javascripts'
	sprockets.append_path 'assets/stylesheets'
	sprockets.append_path 'assets/images'
	sprockets.append_path 'assets/files'
	run sprockets
end

map '/' do
	run Application
end
