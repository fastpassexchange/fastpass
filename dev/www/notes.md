notes.md

watch this video: https://www.youtube.com/watch?v=dqJRoh8MnBo

one thing that you can consider doing is using Require: "authController" in the views in your state routing. 

AuthCtrl would look for some isAuth value to be true, and enable navigation to the next state if true, else force to go to the "you're not logged in bitch" page. 

look here for details about nested vs. named states. https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views


you're trying to use Nested states, but your states aren't nested. Don't try to use a view for your navigation. just use ionic's built-in navigation. look to ion-nav-bar and ion-nav-view 



it could be like: 

ion-tabs
	ion-tab ui-ref="home"
	ion-tab ui-sref="about"
	ion-tab ui-sref="signin"
	ion-tab ui-sref="signout"


and this should be just beneath the closing </> of ion-nav-view in index. 

make home abstract state, make the others children of that 

each of the 4 tabs needs a relative root that isn't a child state of tabs