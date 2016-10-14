# rolandleth.com

Pretty simple [Node.js](http://www.nodejs.org/) app for my [site](https://rolandleth.com). I write my posts with Markdown, save them to a Dropbox folder and access a custom URL which fetches new/modified posts and saves them in a PostgreSQL database.

## Running Locally

```bash
# Install homebrew if needed - http://brew.sh
brew install node # Or https://nodejs.org, version 6+
git clone https://github.com/rolandleth/rolandleth.com.git
cd rolandleth
npm install
# Optional
brew install heroku (or from https://devcenter.heroku.com/articles/heroku-command-line)
```

#### PostgreSQL

The easiest way to get started with PostgreSQL is by downloading [Postgres.app](http://postgresapp.com) for running the server, and [PSequel](http://www.psequel.com) for browsing and running queries.

Fire Postgres.app, which will start the server automatically, then PSequel. On the first screen, if the `Database` field isn't your username, you'll need to open the project at `routes/db.js` and change line `13` to `"postgres://localhost/" + databaseName`.

Connect with PSequel, go to the Query tab, and create a `posts` table:

```sql
-- Optionally create a new schema too, to not interfere with any of your other tables.
CREATE SCHEMA rolandleth_nodeapp_schema
-- Or pick another table name.
CREATE TABLE posts(
  id serial PRIMARY KEY,
  title text,
  body text,
  -- This is for the truncated posts on the main page.
  -- I personally use 700-900 chars, so pick something that fits your needs.
  truncatedbody varchar(1000),
  datetime char(15), -- This should always be yyyy-MM-dd-HHmm
  modified varchar(50),
  link varchar(100),
  readingtime varchar(15) -- "999 min read" = 12 chars
)
```

If you do create a new schema, open `routes/db.js` again, and change line `8` to `const postsTable = "rolandleth_nodeapp_schema.posts"`, or if you just picked another table name, replace it with `const postsTable = "the_name_you_picked"`.

#### Env variables:

```text
DB_ACCESS_TOKEN=your_db_access_token_here
MY_SYNC_KEY=your_key_here (for syncing, and creating posts from web)
```

These can be either in an `.env` file at the project's root level (create one by running `touch .env`), either in your *IDE of choice*'s environment variables, either directly in code, where needed.

If you don't have Dropbox, or don't want to use it, you can modify `lib/dropbox.js` to read from a local folder, and you won't be needing `DB_ACCESS_TOKEN`.

If you'd like a Dropbox access token, you can go to `https://developers.dropbox.com`, create an account if needed, create an app with *Dropbox API* and *App Folder* access, and generate a token under *Generated access token*, in the *OAuth2* section.

#### Running

Inside `package.json`, under `scripts -> start` you will find `heroku local web --port 3000`: this will run the app on port `3000`, by looking for, and loading a `.env` file.

From the terminal run `npm start`, and go to [http://localhost:3000](http://localhost:3000).

#### Only if you're not using Dropbox, nor local files

Go to `routes/sync.js` and remove lines `24-28`, init a `Post` object out of the request's `body`, and save it to PostgreSQL:

```js
const body = req.body
const post = new Post(body.title, body.body, body.datetime)
Db.createPost(post)
```

Head to `/cmd.sync/create/MY_SYNC_KEY`, write a few posts, and you're ready to go. Remember to never run `/cmd.sync/MY_SYNC_KEY/delete`, because it will delete your posts from PostgreSQL, since no files will be found, and it will update your database accordingly.

## License
Licensed under MIT.
