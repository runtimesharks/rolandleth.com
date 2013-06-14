blog

Finally took the time to recreate the blog, the WordPress theme i was using was highly customized, but wasn't really fitting my needs anymore. And, again, since I'm learning web development, why not redesign it completely? The layout is basically the same, but I stole [Sam's](http://soff.es) pagination and [Matt's](http://mattgemmel.com) header and tweaked them to fit my preference.
  
The site was created with [Sinatra](http://www.sinatrarb.com), and it's hosted on [Heroku](https://www.heroku.com). I'm still using [Markdown](http://daringfireball.net/projects/markdown/) and [Mou](http://mouapp.com) to write, but instead of using a database for the posts, I'm using `.md` files. This way I have them on the server git, on my Mac (and on Time Machine, implicitly) **and** synced with Dropbox, since I will be using [Byword](http://bywordapp.com/) for mobile editing.  

I also created a simple Alfred Workflow to commit and push after I'm done creating a new post:
<pre>
cd /path/to/my/git
git add .
git commit -am "New post"
git push heroku master
</pre>

The only thing that I'll be missing is publishing from mobile, since I don't have a way to git push when I'm not at my Mac, nor do I know how to read straight from Dropbox; but I'll get to that too, eventually.
  
I'll post the source code on [GitHub](http://github.com/rolandleth) tomorrow, I just need to  
properly comment it.
  
<br />
I'm *really* happy with the result!