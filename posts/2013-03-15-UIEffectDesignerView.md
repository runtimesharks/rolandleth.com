development
3:21 PM

Damn, this is pretty nice. Add particle effects to UIKit, just like in Cocos2D: create them with [UIEffectDesigner](http://www.touch-code-magazine.com/uieffectdesigner/), then add them to your project with [UIEffectDesignerView](http://www.touch-code-magazine.com/uieffectdesigner/). Works for both iOS and Mac. Still in beta, but I haven't found any glitches so far.
  
It's as easy as:

```
#import "UIEffectDesignerView.h"
...
UIEffectDesignerView* effectView = [UIEffectDesignerView effectWithFile:@"name_of_your_choice.ped"];
[self.view addSubview:effectView];
```