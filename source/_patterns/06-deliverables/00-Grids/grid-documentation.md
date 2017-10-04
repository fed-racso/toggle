<div class="page-wrap"> 

# Introduction 

Phoenix is a frontend framework for Mediacorp. This is a documentation of the grid that is created for the project. Before we begin the implementation, let's first discuss some common terminologies that all parties have agreed to use.

## Structure Blocks

Structure blocks determine the structure of the a section. Multiple structure blocks would make up a page. 

Examples of structure blocks are the full width (`.l-12`) block and the content-sidebar (.`l-2up--8-4`) block, or even the 4-column block (`.l-4up`). 

<div class="demo l-12">
  <div class="l-gi demo__item">Full Width</div>
</div>
<div class="demo l-2up--8-4">
  <div class="l-gi demo__item"> Content </div>
  <div class="l-gi demo__item"> Sidebar </div>
</div>
<div class="demo l-4up">
  <div class="l-gi demo__item"> 4 up </div>
  <div class="l-gi demo__item"> 4 up </div>
  <div class="l-gi demo__item"> 4 up </div>
  <div class="l-gi demo__item"> 4 up </div>
</div>

We will talk about the code for the structure blocks at a later section. 

## Grid Blocks

Grid blocks are generic components that can be fit into different areas. An example of a grid block is a vertical listing block, which is able to show a list of either articles, episodes, videos or any other list that has a similar structure. 

These grid blocks will be inserted into the structure blocks and they will automatically fill up 100% of the parent element. 

In addition to filling the parent container, each grid block will be specially crafted so that the contents within are responsive to the best way that it can be. 

Just to illustrate this, here's how the Vertical listing grid block would look like on a mobile and a desktop. 

![](../../images/docs/image1.png)

We will talk about the code for the grid blocks at a later section. 

<!-- # Understanding how to use Structure Blocks and Grid Blocks (Theory) -->

# Getting Started 

## HTML

Phoenix makes use of certain HTML elements and CSS properties that require the use of the HTML5 doctype. Include it at the beginning of all your projects. 

```
<!DOCTYPE html>
<html>
... 
</html>
```

## Body 

A class in the `<body>` also controls the color themes of the page. Be sure to include the class as well. 

The list of theme classes used are:

- `channel-5` 
- `channel-8`
- `channel-u` 
- `okto`
- `suria` 
- `vasantham`

~~~html
<!DOCTYPE html>
<html>
<body class="themeClass"></body>    
</html>
~~~

## Page Structure 

Phoenix requires you to use a containing element, `.page-wrap`, to wrap the site contents and its grid system. This page-wrap ensures that ad-skins can be used within the website. 

Ad skins are already premade into templates that can be included into the html. 

Please view the grid-ads documentation on how to turn on and off the skin. Also, please view the molecules-ad-skin file for actual code of the skin. 

Note: templates will be commented out and written in the format ` in this docs:

~~~html
<!DOCTYPE html>
<html>
<body class="themeClass">
  <div class="page-wrap">
    <!-- [[> molecules-ad-skin]] -->
  </div>
</body>    
</html>
~~~

## Navigation

The navigation is a complex component that doesn't fall nicely within any of the fixed structures that we will be presenting. As such, we will be implementing the navigation separately first. 

The source code for the navigation are split into 

~~~html
<!DOCTYPE html>
<html>
<body class="themeClass">
  <div class="page-wrap">
    <!-- [[> molecules-ad-skin]] -->

    <!-- start primary nav -->
    <!-- [[> organisms-header ]]-->
    <!-- [[> organisms-primary-mega-menu ]]-->
    <!-- [[> organisms-login-modal ]]-->
    <!-- end primary nav -->

    <!-- start secondary nav -->
    <!-- [[> molecules-secondary-nav]] -->
    <!-- end secondary nav -->
  </div>
</body>    
</html>
~~~

## Structure for each grid block

Each grid block will begin with either a `<section>` element and it would not be given any class name. This `<section>` element will contain a `.wrap` element which then contains the grid structures. 

Here's an example

~~~html
<body>
  <!-- ... -->
  <section>
    <div class="wrap">
      <div class="l-2up--8-4">
        <div class="l-gi"> </div>
        <div class="l-gi"> </div>
      </div>
    </div>
  </section>
</body>
~~~

# How to code Structure Blocks and Grid Blocks 

## Structure Blocks 

All structure blocks have the following format: 

1. A `.l-` class that signifies that this is a structure block 
2. Several `.l-gi` classes that are supposed to contain grid blocks. 

~~~html
<div class="l-structure-block-name">
  <div class="l-gi">
    <!-- [[> grid-block-name ]]-->
  </div>
</div>
~~~

Some structure blocks deviate a little from this format, and will be covered in the Grid structure block page.

</div>