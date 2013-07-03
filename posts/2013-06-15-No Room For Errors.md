blog
6:18 PM

When I moved to a git-based blog, I knew I had no way to edit published posts that easily, like I had in WordPress. And, boy, did I use to edit and re-edit a post after I published it. Sure, I can commit over and over to edit stuff, but that's not great practice at all. 

But then it struck me: ==this is actually a good thing==. I will have to focus better and pay more attention, resulting in small, but steady improvement over time. Last night, for example, I did **a lot** of commits just to edit some silly mistakes and silly typos; this is something I will force myself not to repeat.

Something else that struck me? ==**Writing is hard!**== It's not my goal, but I'd like to get better at it, because better organized thoughts mean a better organized mind, benefiting other domains too.

<br />
On a side note: I added `underline: true` to the markdown renderer, I changed the css for underlines to 

``` css
u {
  font-style: italic;
  text-decoration: none;
}
```
and now `_text_` is displayed as *italic*. Why? Well, because sometimes I'd like to emphasis *something*, but not ==this bad==: a quote, without using a quote block, for example.  

*Update Jun 26, 2013: The above hack was replaced by using a newer version of Redcarpet that can parse `==text==` as `<mark>text</mark>`. Nonetheless, it's still a decent hack when needed.*