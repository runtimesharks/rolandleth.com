# rolandleth.com

Really simple [Sinatra](http://www.sinatrarb.com/) app for my [site](http://rolandleth.com). I write my posts with [Markdown](http://daringfireball.net/projects/markdown/), save them to a Dropbox folder and access a custom URL which fetches new/modified posts and saves them in a Postgres database. Nothing fancy.

Also included: the landing pages from [RLLandingPage](http://github.com/rolandleth/RLLandingPage).

## Running Locally

```bash
git clone https://github.com/rolandleth/rolandleth.com.git
cd rolandleth
bundle install
# start postgresql
rackup
```

Open [http://localhost:9292](http://localhost:9292)

## License
Licensed under MIT.
