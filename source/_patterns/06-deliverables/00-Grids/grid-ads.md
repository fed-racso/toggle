# Advertisements 

## Skin Ads 

Skin ads must be configured on a page by page basis and requires some coding setup by Ufinity. 

Pages do not have ad skins by default, and the grid structures will stretch to 100% of the browser width (up to a maximum of 1920px). 

If a skin has to be added, the `<body>` must be given a class of `has-skin` and the skin grid block is added before the navigation. 

~~~html
<body class="has-skin">
  <div class="page-wrap">
    <!-- skin here -->
    <!-- primary nav here -->
  </div>
</body>
~~~