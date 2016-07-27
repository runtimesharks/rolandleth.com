desc 'This task is called by the Heroku cron add-on'
task :call_page => :pipeline do
	uri = URI.parse('https://rolandleth.com/')
	Net::HTTP.get(uri)
end
