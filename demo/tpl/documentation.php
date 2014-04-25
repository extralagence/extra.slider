<section class="main-content">
    <article class="single-content" id="documentation">

        <h2 class="title">So simple</h2>
        <h3 class="subtitle">your grandma' would get bored setting it</h3>

        <h3>Minimum html needed</h3>
        <p>You can have any markup you want in the &lt;li&gt; tags, not necessary images.</p>
        <pre><code>&lt;div class=&quot;extra-slider&quot;&gt;
    &lt;div class=&quot;wrapper&quot;&gt;
        &lt;ul&gt;
            &lt;li&gt;
                &lt;img src=&quot;http://bit.ly/1gnYuBa&quot; alt=&quot;&quot; width=&quot;900&quot; height=&quot;500&quot;&gt;
            &lt;/li&gt;
            &lt;li&gt;
                &lt;img src=&quot;http://bit.ly/NQX3zB&quot; alt=&quot;&quot; width=&quot;900&quot; height=&quot;500&quot;&gt;
            &lt;/li&gt;
            &lt;li&gt;
                &lt;img src=&quot;http://bit.ly/1gnZxBh&quot; alt=&quot;&quot; width=&quot;900&quot; height=&quot;500&quot;&gt;
            &lt;/li&gt;
            &lt;li&gt;
                &lt;img src=&quot;http://bit.ly/1gnYtxa&quot; alt=&quot;&quot; width=&quot;900&quot; height=&quot;500&quot;&gt;
            &lt;/li&gt;
        &lt;/ul&gt;
    &lt;/div&gt;
    &lt;div class=&quot;navigation&quot;&gt;
        &lt;a href=&quot;#&quot; class=&quot;prev&quot;&gt;Previous&lt;/a&gt;
        &lt;a href=&quot;#&quot; class=&quot;next&quot;&gt;Next&lt;/a&gt;
    &lt;/div&gt;
    &lt;div class=&quot;pagination&quot;&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre>
        <h3>Embed the necessary javascript</h3>
        <p>First, you need to load jQuery and TweenMax. If you need your slider to be draggable, don't forget to include Greensock's Draggable too.</p>
        <pre><code>&lt;!-- Load jQuery --&gt;
&lt;script src=&quot;http://code.jquery.com/jquery-1.11.0.min.js&quot;&gt;&lt;/script&gt;

&lt;!-- Load Greensock's TweenMax --&gt;
&lt;script src=&quot;http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.6/TweenMax.min.js&quot;&gt;&lt;/script&gt;

&lt;!-- Load Greensock's Draggable plugin --&gt;
&lt;script src=&quot;http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.6/utils/Draggable.min.js&quot;&gt;&lt;/script&gt;

&lt;!-- Load the slider javascript file --&gt;
&lt;script src=&quot;js/extra.slider.min.js&quot;&gt;</code></pre>
        <h3>Add the minimum css</h3>
        <p>This is the minimum code required to display a slider. You will probably need to specify dimensions in order to make it fit your needs. Please note that there is no default styling for navigation and pagination links.
        </p>
        <pre><code>&lt;link rel=&quot;stylesheet&quot; href=&quot;css/extra.slider.css&quot;&gt;</code></pre>
        <h3>Initialize the slider</h3>
        <pre><code>&lt;script&gt;
jQuery(document).ready(function($) {
    $(&quot;.extra-slider&quot;).extraSlider();
});
&lt;/script&gt;</code></pre>
        <h3>Options</h3>
        <dl class="doc-list">
            <dt>auto</dt>
            <dd><strong>default:</strong> false</dd>
            <dd>add an integer, corresponding to the delay in second</dd>
            <dt>draggable</dt>
            <dd><strong>default:</strong> false</dd>
            <dd>set it to true to make the slider draggable</dd>
            <dt>keyboard</dt>
            <dd><strong>default:</strong> false</dd>
            <dd>set it to true to make it keyboard controllable</dd>
            <dt>margin</dt>
            <dd><strong>default:</strong> 0</dd>
            <dd>pass an integer to show more images on the sides</dd>
            <dt>navigate</dt>
            <dd><strong>default:</strong> true</dd>
            <dd>pass it to false to stop binding the navigation links</dd>
            <dt>paginate</dt>
            <dd><strong>default:</strong> true</dd>
            <dd>pass it to false to stop binding and setting the pagination links</dd>
            <dt>paginateContent</dt>
            <dd><strong>default:</strong> an empty string</dd>
            <dd>add a custom string to fill the pagination links. The string %d will be replaced by the index.</dd>
            <dt>resizable</dt>
            <dd><strong>default:</strong> true</dd>
            <dd>pass it to false to stop updating the slider when the viewport resizes</dd>
            <dt>speed</dt>
            <dd><strong>default:</strong> 0.5</dd>
            <dd>pass a number in second to set the animation speed</dd>
            <dt>type</dt>
            <dd><strong>default:</strong> 'slide'</dd>
            <dd>it can be 'fade' or 'slide'</dd>
            <dt>onInit</dt>
            <dd><strong>default:</strong> null</dd>
            <dd><strong>params:</strong> currentItem (jQuery object), numItems (int), slider (jQuery object)</dd>
            <dd>pass a function that will be called when the slider is set up</dd>
            <dt>onMoveStart</dt>
            <dd><strong>default:</strong> null</dd>
            <dd><strong>params:</strong> currentItem (jQuery object), numItems (int), slider (jQuery object)</dd>
            <dd>pass a function that will be called when the slider starts animating</dd>
            <dt>onMoveEnd</dt>
            <dd><strong>default:</strong> null</dd>
            <dd><strong>params:</strong> currentItem (jQuery object), numItems (int), slider (jQuery object)</dd>
            <dd>pass a function that will be called when the slider stops animating</dd>
            <dt>onUpdate</dt>
            <dd><strong>default:</strong> null</dd>
            <dd><strong>params:</strong> currentItem (jQuery object), numItems (int), slider (jQuery object)</dd>
            <dd>pass a function that will be called when the slider updates itself (after a resize for example)</dd>
            <dt>onUpdateClones</dt>
            <dd><strong>default:</strong> null</dd>
            <dd><strong>params:</strong> currentItem (jQuery object), numItems (int), slider (jQuery object)</dd>
            <dd>pass a function that will be called when the slider updates the clones (when type is set to slide)</dd>
            <dt>onPause</dt>
            <dd><strong>default:</strong> null</dd>
            <dd><strong>params:</strong> slider (jQuery object)</dd>
            <dd>if auto is defined, this function is called when the slider pauses the automatic slider</dd>
            <dt>onResume</dt>
            <dd><strong>default:</strong> null</dd>
            <dd><strong>params:</strong> slider (jQuery object)</dd>
            <dd>if auto is defined, this function is called when the slider resumes the automatic timer</dd>
        </dl>
        <h3>Methods</h3>
        <p>Note: $('.extra-slider') can be replace with an ID you used to set the slider.</p>
        <dl class="doc-list">
            <dt>update</dt>
            <dd>$('.extra-slider').trigger('update');</dd>
            <dd>Force an update on the slider</dd>
            <dt>next</dt>
            <dd>$('.extra-slider').trigger('next');</dd>
            <dd>Go to the next slide</dd>
            <dt>prev</dt>
            <dd>$('.extra-slider').trigger('prev');</dd>
            <dd>Go to the previous slide</dd>
            <dt>goto</dt>
            <dd>$('.extra-slider').trigger('goto', [slideNumber]);</dd>
            <dd>Go to the slide you specify with slideNumber (must be an integer)</dd>
        </dl>
        <h3>Events</h3>
        <p>Note: $('.extra-slider') can be replace with an ID you used to set the slider.</p>
        <dl class="doc-list">
            <dt>init.extra.slider</dt>
            <dd>$('.extra-slider').on('init.extra.slider', function(event, currentItem, numItems, slider) {});</dd>
            <dd>Triggered when the slider inits the first time</dd>
            <dt>moveStart.extra.slider</dt>
            <dd>$('.extra-slider').on('moveStart.extra.slider', function(event, currentItem, numItems, slider) {});</dd>
            <dd>Triggered when the slider starts its animation process</dd>
            <dt>moveEnd.extra.slider</dt>
            <dd>$('.extra-slider').on('moveEnd.extra.slider', function(event, currentItem, numItems, slider) {});</dd>
            <dd>Triggered when the slider has finished moving</dd>
            <dt>update.extra.slider</dt>
            <dd>$('.extra-slider').on('update.extra.slider', function(event, currentItem, numItems, slider) {});</dd>
            <dd>Triggered  when the slider updates itself</dd>
            <dt>updateClones.extra.slider</dt>
            <dd>$('.extra-slider').on('update.extra.slider', function(event, currentItem, numItems, slider) {});</dd>
            <dd>Triggered when the slider updates the clones on slide type</dd>
            <dt>pause.extra.slider</dt>
            <dd>$('.extra-slider').on('pause.extra.slider', function(event, currentItem, numItems, slider) {});</dd>
            <dd>Triggers an update when the slider is paused in auto mode</dd>
            <dt>resume.extra.slider</dt>
            <dd>$('.extra-slider').on('resume.extra.slider', function(event, currentItem, numItems, slider) {});</dd>
            <dd>Triggers an update when the slider is resumed in auto mode</dd>
        </dl>
    </article>
</section>