<?php


    global $root, $rootPath;
    $rootPath = realpath('./') . '/'; 
    $base = isset($_SERVER['REDIRECT_BASE']) ? $_SERVER['REDIRECT_BASE'] : $_SERVER['BASE'];
    if(substr($base, -1) != '/') {
        $base .= '/';
    }
    $root = "http://".$_SERVER['HTTP_HOST'].$base;

    global $page;
    if(array_key_exists('page', $_REQUEST) && !empty($_REQUEST['page'])) {
        $page = $_REQUEST['page'];
    } else {
        $page = 'about';
    }

?><!DOCTYPE html>
<!--[if lt IE 7 ]><html lang="fr-FR" class="no-js ie ie6 lte7 lte8 lte9"><![endif]-->
<!--[if IE 7 ]><html lang="fr-FR" class="no-js ie ie7 lte7 lte8 lte9"><![endif]-->
<!--[if IE 8 ]><html lang="fr-FR" class="no-js ie ie8 lte8 lte9"><![endif]-->
<!--[if IE 9 ]><html lang="fr-FR" class="no-js ie ie9 lte9 recent"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html lang="fr-FR" class="recent noie no-js"><!--<![endif]-->
	<!--<![endif]-->
	<head>
		<meta charset="utf-8">

		<title>Extra Slider</title>
		
		<!-- MOBILE FRIENDLY -->      
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		
        <meta property="og:image" content="http://slider.extralagence.com/demo/img/facebook.jpg" />

		<link rel="stylesheet" href="<?php echo $root; ?>css/extra.slider.css">
		<link rel="stylesheet" href="<?php echo $root; ?>demo/css/main.css">
        <link rel="stylesheet" href="<?php echo $root; ?>demo/css/sliders.css">
        <link rel="stylesheet" href="<?php echo $root; ?>demo/css/extra.signature.css">
		
		<?php
            $css_path_name = $rootPath . 'demo/css/' . $page . '.css';
            $css_file_name = $root . 'demo/css/' . $page . '.css';
            if (file_exists($css_path_name)) {
                echo '<link rel="stylesheet" href="' . $css_file_name . '">';
            }
        ?>

		<!-- IE9.js -->
		<!--[if (gte IE 6)&(lte IE 8)]>
		<script src="<?php echo $root; ?>demo/js/html5shiv.js"></script>
		<script src="<?php echo $root; ?>demo/js/selectivizr-min.js"></script>
		<![endif]-->
		
		<script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        
          ga('create', 'UA-31777856-37', 'extralagence.com');
          ga('send', 'pageview');
        
        </script>

	</head>

	<body class="home">
	    
	    <div id="wrapper">

    		<header class="header">
                <?php include_once 'demo/tpl/main-navigation.php'; ?>
    			<h1 id="main-title">Extra Slider</h1>
    		</header>
    		
    		<?php include_once('demo/tpl/' . $page . '.php'); ?>
    		
    		<footer id="footer">
    		    <a class="totop" href="#">Back to top</a>
    		    <div class="extra-signature">Made by <a class="extra-signature-logo" href="http://www.extralagence.com" target="_blank"><span class="alt">Extra</span><svg class="image" version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 346.4 346.3" enable-background="new 0 0 346.4 346.3" xml:space="preserve">
    <polygon points="235,121.8 235,84.2 111.9,84.2 111.9,84.3 111.4,84.3 111.4,262.1 154.7,262.1 154.7,262.1 234.5,262.1 
        234.5,224.6 154.7,224.6 154.7,191.2 225.7,191.2 225.7,153.7 154.7,153.7 154.7,121.8     "/>
    <path d="M173.2,346.3C77.7,346.3,0,268.7,0,173.2C0,77.7,77.7,0,173.2,0c95.5,0,173.2,77.7,173.2,173.2
        C346.4,268.7,268.7,346.3,173.2,346.3z M173.2,42.6c-72,0-130.6,58.6-130.6,130.6c0,72,58.6,130.6,130.6,130.6
        c72,0,130.6-58.6,130.6-130.6C303.8,101.2,245.2,42.6,173.2,42.6z"/>
</svg>
</a> with <ul class="extra-signature-list">
                    <li>love</li>
                    <li>passion</li>
                    <li>donuts</li>
                    <li>hands</li>
                    <li>cats</li>
                    <li>cookies</li>
                    <li><s>Dreamweaver</s></li>
    		    </ul></div>
            </footer>
		</div>

		<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.6/TweenMax.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.6/plugins/ScrollToPlugin.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.6/utils/Draggable.min.js"></script>
		<script src="<?php echo $root; ?>demo/js/flexie.min.js"></script>
		<script src="<?php echo $root; ?>js/extra.slider.js"></script>
        <script src="<?php echo $root; ?>demo/js/extra.signature.js"></script>
        <script src="<?php echo $root; ?>demo/js/main.js"></script>
        
        <?php
            $js_path_name = $rootPath . 'demo/js/' . $page . '.js';
            $js_file_name = $root . 'demo/js/' . $page . '.js';
            if (file_exists($js_path_name)) {
                echo '<script src="' . $js_file_name . '"></script>';
            }
        ?>

	</body>
</html>