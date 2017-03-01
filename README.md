# rolandleth.com

You can read about the Ruby -> Node.js migration [here](https://rolandleth.com/search?query=%5Bnjs%5D), and the Node.js -> Swift migration [here](https://rolandleth.com/search?query=%5Bsss%5D). You can check the Node.js branch [here](https://github.com/rolandleth/rolandleth.com/tree/node), and the Sinatra one [here](https://github.com/rolandleth/rolandleth.com/tree/sinatra).

Pretty simple Swift (backed by [Vapor](https://github.com/vapor/vapor)) app for my [site](https://rolandleth.com). I write my posts with Markdown, save them to a Dropbox folder and access a custom URL which fetches new/modified posts and saves them in a PostgreSQL database.

## Running Locally

```bash
# Install homebrew if needed - http://brew.sh
brew install vapor/tap/toolbox
git clone https://github.com/rolandleth/rolandleth.com.git
cd rolandleth
swift build
vapor xcode -y
```

#### PostgreSQL

The easiest way to get started with PostgreSQL is by downloading [Postgres.app](http://postgresapp.com) for running the server, and [PSequel](http://www.psequel.com) for browsing and running queries. Fire Postgres.app, which will start the server automatically.

You need to create a `postgresql.json` file inside `Config/secrets` that looks like:

```json
{
  "host": "127.0.0.1",
  "user": "your-username", // Usually the computer's user.
  "password": "your-password", // Usually empty.
  "database": "your-database", // Usually the computer's user.
  "port": 5432
}
```

#### Env variables:

If you're using an IDE that can set environment variables, you can set them like this:

```text
DB_ACCESS_TOKEN=your_db_access_token_here
MY_SYNC_KEY=your_key_here (for syncing, and creating posts from web)
```

You can also create a `servers.json` file inside `Config/secrets` that looks like:

```json
{
  "default": {
    "dropboxKey": "your-key-here",
    "syncKey": "your-sync-key-here"
  }
}
```

Finally, you can also simply modify `Droplet.swit` to return your keys directly.

If you don't have Dropbox, or don't want to use it, you can modify `Dropbox.swift` to read from / create to a local folder, and you won't be needing `dropboxKey`.

If you'd like a Dropbox access token, you can go to `https://developers.dropbox.com`, create an account if needed, create an app with *Dropbox API* and *App Folder* access, and generate a token under *Generated access token*, in the *OAuth2* section.

#### Creating data

Head to `/cmd.sync/MY_SYNC_KEY/create`, write a few posts, and you're ready to go. Remember to never run `/cmd.sync/MY_SYNC_KEY/delete`, because it will delete your posts from PostgreSQL - since no files will be found, it will update your database accordingly.

## License
Licensed under MIT.
