# rolandleth.com

Really simple [Node.js](http://www.nodejs.org/) app for my [site](https://rolandleth.com). I write my posts with [Markdown](http://daringfireball.net/projects/markdown/), save them to a Dropbox folder and access a custom URL which fetches new/modified posts and saves them in a Postgres database. Nothing fancy.

## Running Locally

```bash
brew install node
git clone https://github.com/rolandleth/rolandleth.com.git
cd rolandleth

# This will run heroku local web, which loads an .env file if present, on port 5000
npm install
# This will run directly, without an .env file, on port 3000
node app.js

# Either add your Dropbox key as DB_ACCESS_TOKEN to an .env file,
# either add it directly in the Dropbox manager,
# either change the manager to process files from a local folder.

# start postgresql

npm start
```

Open [http://localhost:3000](http://localhost:3000)

## License
Licensed under MIT.
