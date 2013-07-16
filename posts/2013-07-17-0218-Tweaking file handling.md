development

I recently realized that if I were to have two posts on the same day, they would be ordered alphabetically, not by time, because the filename has no time reference. I wouldn't be able to use file creation time either, because the creation time of all files on the server is the same: the git push time.

I did have a time references inside files, but to actually check what files are on the same date, then order just these by said time, while keeping to order the rest, independently, would have been a pain to implement, at least to the simple, albeit ugly, solution: add a time component to filenames.

The modifications were minimal: 

```
# The filenames were the hardest part, since I had 27 of them
# YYYY-MM-DD-HHMM-File name.md
# The regex
post.match(/\/(\d{4})-(\d{2})-(\d{2})-(\d{4})-([\w\s\.\}\{\[\]_&@$:"';!=\?\+\*\-\)\(]+)\.md$/) 
# The title to equal the 5th match instead of 4th
title = match[5]
# The content: start reading a line sooner, since the line with the time is gone
_markdown(File.readlines(post)[2..-1].join())
# The time variable for the feed to read from the filename
time = Date._strptime("#{matches[4]} EEST","%H%M %Z")
```

<br>
And that was about it.