development

Today I found [this](https://github.com/warrenm/AHAlertView) great block-based UIAlertView, by [Warren Moore](https://github.com/warrenm). You can customize pretty much everything, except textAttributes for each button type separately. I forked it, modified it and also added a customizable, random angle for the (included) fall animation when dismissed.  
  
Among other things, it supports landscape *and* rotation from one orientation to another (some classes I stumbled upon 'till now supported both orientations as well, but not the rotation from one to another; silly, I know). 
  
I issued a pull request, so until it gets approved (if it ever does) you can find the tweaked version on [my GitHub](https://github.com/rolandleth/AHAlertView).
  
This will be my go-to UIAlertView from now on.