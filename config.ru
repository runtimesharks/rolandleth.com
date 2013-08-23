require 'rubygems'
require 'bundler'

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
  run sprockets
end

array = [1, 2]
sum = 0
while array.last <= 4_000_000
	array << array[-1] + array[-2]
	sum = sum + array.last if array.last.even?
end
puts sum

run Application