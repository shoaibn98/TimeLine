# Timeline

## Project Overview

About
TimelineTS is a TypeScript library designed to simplify the creation and management of interactive timelines in web applications. It provides a flexible and customizable timeline component, allowing developers to seamlessly integrate timelines into their projects.

## Table of Contents
- [Usage](#usage)
- [Styles of Timelines](#styles-of-timelines)
  - [Timeline - classic](#timeline-classic) 
  - [Timeline - inline](#timeline-inline)
  - [Timeline - inline_circle](#timeline-inline-circle)
  - [Timeline - inline_classic](#timeline-inline-classic)
  - [Timeline - arrow](#timeline-arrow)
  - [Timeline - arrow_reverse](#timeline-arrow-reverse)

## Usage

To integrate this timeline library into your project, follow these simple steps:

1. **Include the Library Files:**

   Add the library's JavaScript and CSS files to your project. You can either download them from the [releases page](link-to-releases) or include them via a package manager.

   ```html
   <!-- Add this to the <head> of your HTML file -->
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/shoaibn98/Timeline/Timeline.min.css">
   <script src="https://cdn.jsdelivr.net/gh/shoaibn98/Timeline/Timeline.min.js"></script>
   ```
2. **Initialize the Timeline:** 

    In your JavaScript file, create an instance of the timeline and customize it according to your needs.
    ```JavaScript
    const option={
        targetId: "myTimeline",
            width: 400, // *required : to set Total width of timeline
            offset: 150, // *required : to set distance between each Event 
            timeline: "arrow_reverse", // *required : style of Timeline
            data: [  //*required : data to show on timeline
                ["2021", "Old Event", "Description"],
                ["2024", "current Event", "Description"],
                ["2026", "Future Event", "Description"], 

            ],
            background: "#fff" // optional : to set background color
    }
    const myTimeline = new Timeline(option);
    ```

## Styles of Timelines



### timeline classic
```JavaScript
const option={
    //...
    timeline="classic";
    //...
}
```
![](https://my-app.alwaysdata.net/timeline/img/classic.png)

### timeline inline
```JavaScript
const option={
    //...
    timeline="inline";
    //...
}
```
![](https://my-app.alwaysdata.net/timeline/img/inline.png)

### timeline inline circle
```JavaScript
const option={
    //...
    timeline="inline_circle";
    //...
}
```
![](https://my-app.alwaysdata.net/timeline/img/inline_circle.png)

### timeline inline classic
```JavaScript
const option={
    //...
    timeline="inline_classic";
    //...
}
```
![](https://my-app.alwaysdata.net/timeline/img/inline_classic.png)

### timeline arrow
```JavaScript
const option={
    //...
    timeline="arrow";
    //...
}
```
![](https://my-app.alwaysdata.net/timeline/img/arrow.png)

### timeline arrow reverse
```JavaScript
const option={
    //...
    timeline="arrow_reverse";
    //...
}
```
![](https://my-app.alwaysdata.net/timeline/img/arrow_reverse.png)


- ## New Preloader coming soon

made with ♥  by  [Shoaib Norouzi](https://shoaibnorouzi.alwaysdata.net)
