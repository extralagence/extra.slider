<?php global $page, $root; ?>
<nav id="main-nav">
    <ul>
        <li<?php echo ($page == 'about') ? ' class="current"' : ''; ?>><a href="<?php echo $root; ?>">About</a></li>
        <li<?php echo ($page == 'documentation') ? ' class="current"' : ''; ?>><a href="<?php echo $root; ?>documentation/">Documentation</a></li>
        <li<?php echo ($page == 'demos') ? ' class="current"' : ''; ?>><a href="<?php echo $root; ?>demos/">Demos</a></li>
        <li><a href="https://github.com/extralagence/extra.slider" target="_blank">GitHub</a></li>
        <li><a class="download" href="https://github.com/extralagence/extra.slider/archive/master.zip" target="_blank">Download</a></li>
    </ul>
</nav>
<div id="social">
    <iframe src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fextralagence&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=true&amp;share=false&amp;height=21&amp;appId=220611784722096" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:21px;" allowTransparency="true"></iframe></li>
    <a href="https://twitter.com/share" class="twitter-share-button" data-via="extralagence">Tweet</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
</div>
