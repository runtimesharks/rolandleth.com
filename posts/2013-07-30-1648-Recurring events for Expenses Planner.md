blog

There are two problems about this and I'll try to explain them the best I can.

==First==: Apple provides a way to implement recurring reminders, but I use it for the weekly/daily/hourly setting. Manually creating a separate system for recurring events is easy; the problem is that this method is not reliable.

If a reminder is set to repeat, lets say hourly, a notification/alert will be presented every hour, without the need to open the app. In a custom-built system, the app would have to be opened after every notification/alert, for the reminder to be rescheduled. 

There is a semi-automatic solution: implement a "repeat every: `value`" field and a button that would reschedule the event.

==And the second, bigger problem==: how should the total be calculated? By adding  the values of visible events only? Or by adding all the values, including the ones of repeating events for the upcoming year? Should it be the end of the current year, or a year starting from now? But then, why a year and not only 6 months? The questions can go on and on, and this is actually why I chose not to implement recurring events.

If you have any suggestions, please [contact me](mailto:roland@rolandleth.com), I'd be more than happy to add recurring events, but first I want to make sure the solution is reliable, easy to use and intuitive; I don't want to implement a feature just for the sake of having it.