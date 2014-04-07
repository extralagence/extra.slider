<?php global $page, $root; ?>
<nav id="main-nav">
    <ul>
        <li<?php echo ($page == 'about') ? ' class="current"' : ''; ?>><a href="<?php echo $root; ?>">About</a></li>
        <li<?php echo ($page == 'documentation') ? ' class="current"' : ''; ?>><a href="<?php echo $root; ?>documentation/">Documentation</a></li>
        <li<?php echo ($page == 'demos') ? ' class="current"' : ''; ?>><a href="<?php echo $root; ?>demos/">Demos</a></li>
        <li><a href="https://github.com/extralagence/extra.slider" target="_blank">GitHub</a></li>
        <li><a href="https://github.com/extralagence/extra.slider/archive/master.zip" target="_blank">Download</a></li>
    </ul>
</nav>